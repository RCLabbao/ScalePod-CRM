import { google } from "googleapis";
import { prisma } from "./prisma.server";
import type { gmail_v1 } from "googleapis";
import { plainTextToHtml, buildHtmlEmail } from "./email-html";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.settings.basic",
];

/**
 * Get the base OAuth2 client configured with app credentials.
 */
export function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI must be set"
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Get the OAuth scopes required for Gmail integration.
 */
export function getScopes() {
  return SCOPES;
}

/**
 * Get an authenticated Gmail client for a specific user.
 * Refreshes the access token if expired.
 */
export async function getAuthenticatedClient(userId: string) {
  const token = await prisma.gmailToken.findUnique({
    where: { userId },
  });

  if (!token) {
    throw new Error("User has not connected Gmail");
  }

  const oauth2Client = getOAuthClient();

  oauth2Client.setCredentials({
    refresh_token: token.refreshToken,
    access_token: token.accessToken || undefined,
    expiry_date: token.expiryDate ? token.expiryDate.getTime() : undefined,
  });

  // Refresh if expired (or about to expire in the next 60 seconds)
  const isExpired =
    !token.expiryDate || token.expiryDate.getTime() < Date.now() + 60_000;

  if (isExpired) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await prisma.gmailToken.update({
        where: { userId },
        data: {
          accessToken: credentials.access_token || null,
          expiryDate: credentials.expiry_date
            ? new Date(credentials.expiry_date)
            : null,
        },
      });
    } catch (refreshErr: unknown) {
      const errMsg = refreshErr instanceof Error ? refreshErr.message : String(refreshErr);
      console.error("[Gmail] Token refresh failed:", errMsg);

      // Provide a clear, actionable error message
      if (errMsg.includes("invalid_grant")) {
        throw new Error(
          "Gmail token expired. Go to Settings → disconnect Gmail → reconnect it. " +
          "Also check: Google Cloud Console → OAuth Consent Screen → set to 'Production' or add your email as a Test User."
        );
      }
      throw new Error(`Gmail auth failed: ${errMsg}`);
    }
  }

  return google.gmail({ version: "v1", auth: oauth2Client });
}

// ── Gmail Message Helpers ────────────────────────────────────

export interface ParsedMessage {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  bodyPlain: string;
  bodyHtml: string;
  labelIds: string[];
  historyId: string;
}

/**
 * Parse Gmail message headers into structured data.
 */
function parseHeaders(
  headers: gmail_v1.Schema$MessagePartHeader[]
): { from: string; to: string; subject: string; date: string } {
  const get = (name: string) =>
    headers.find((h) => h.name?.toLowerCase() === name)?.value || "";
  return {
    from: get("from"),
    to: get("to"),
    subject: get("subject"),
    date: get("date"),
  };
}

/**
 * Extract body content from a Gmail message payload.
 */
function extractBody(
  payload: gmail_v1.Schema$MessagePart
): { plain: string; html: string } {
  let plain = "";
  let html = "";

  if (payload.body?.data) {
    const decoded = Buffer.from(payload.body.data, "base64url").toString("utf-8");
    if (payload.mimeType === "text/html") html = decoded;
    else plain = decoded;
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.body?.data) {
        const decoded = Buffer.from(part.body.data, "base64url").toString(
          "utf-8"
        );
        if (part.mimeType === "text/html") html = decoded;
        else if (part.mimeType === "text/plain") plain = decoded;
      }
      // Recurse into multipart
      if (part.parts) {
        const nested = extractBody(part);
        if (!plain) plain = nested.plain;
        if (!html) html = nested.html;
      }
    }
  }

  return { plain, html };
}

// ── Gmail API Functions ──────────────────────────────────────

/**
 * List messages in a user's mailbox.
 */
export async function listMessages(
  userId: string,
  opts: {
    labelIds?: string[];
    maxResults?: number;
    pageToken?: string;
    q?: string;
  } = {}
): Promise<{
  messages: { id: string; threadId: string }[];
  nextPageToken?: string;
  resultSizeEstimate?: number;
}> {
  const gmail = await getAuthenticatedClient(userId);
  const res = await gmail.users.messages.list({
    userId: "me",
    labelIds: opts.labelIds,
    maxResults: opts.maxResults || 20,
    pageToken: opts.pageToken,
    q: opts.q,
  });

  return {
    messages: res.data.messages || [],
    nextPageToken: res.data.nextPageToken || undefined,
    resultSizeEstimate: res.data.resultSizeEstimate || 0,
  };
}

/**
 * Get a single message with full details.
 */
export async function getMessage(
  userId: string,
  messageId: string
): Promise<ParsedMessage> {
  const gmail = await getAuthenticatedClient(userId);
  const res = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });

  const msg = res.data;
  const headers = msg.payload?.headers || [];
  const { from, to, subject, date } = parseHeaders(headers);
  const { plain, html } = extractBody(msg.payload || {});

  return {
    id: msg.id!,
    threadId: msg.threadId!,
    from,
    to,
    subject,
    date,
    snippet: msg.snippet || "",
    bodyPlain: plain,
    bodyHtml: html,
    labelIds: msg.labelIds || [],
    historyId: msg.historyId?.toString() || "",
  };
}

/**
 * Build a raw RFC 2822 email message, base64url encoded.
 * Supports both plain text and HTML bodies via multipart/alternative.
 */
function buildRawMessage(opts: {
  to: string;
  subject: string;
  body: string;
  htmlBody?: string;
  from: string;
  replyToMessageId?: string;
  cc?: string;
}): string {
  const headers: string[] = [
    `To: ${opts.to}`,
    `From: ${opts.from}`,
    `Subject: =?utf-8?B?${Buffer.from(opts.subject).toString("base64")}?=`,
  ];
  if (opts.cc) headers.push(`Cc: ${opts.cc}`);
  if (opts.replyToMessageId) {
    headers.push(`In-Reply-To: ${opts.replyToMessageId}`);
    headers.push(`References: ${opts.replyToMessageId}`);
  }
  headers.push("MIME-Version: 1.0");

  let raw: string;

  if (opts.htmlBody) {
    // multipart/alternative with plain text + HTML
    const boundary = `scalepod_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    const parts: string[] = [
      `--${boundary}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      opts.body,
      `--${boundary}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      opts.htmlBody,
      `--${boundary}--`,
    ];
    raw = [...headers, "", ...parts].join("\r\n");
  } else {
    headers.push("Content-Type: text/plain; charset=utf-8");
    raw = [...headers, "", opts.body].join("\r\n");
  }

  return Buffer.from(raw).toString("base64url");
}

/**
 * Send an email via Gmail.
 */
export async function sendEmail(
  userId: string,
  opts: {
    to: string;
    subject: string;
    body: string;
    htmlBody?: string;
    threadId?: string;
  }
): Promise<{ gmailMessageId: string; gmailThreadId: string }> {
  const gmail = await getAuthenticatedClient(userId);

  // Get the user's Gmail address for the From header
  const token = await prisma.gmailToken.findUnique({ where: { userId } });
  const fromAddress = token?.gmailAddress || "me";

  const raw = buildRawMessage({
    to: opts.to,
    subject: opts.subject,
    body: opts.body,
    htmlBody: opts.htmlBody,
    from: fromAddress,
  });

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw,
      threadId: opts.threadId,
    },
  });

  return {
    gmailMessageId: res.data.id!,
    gmailThreadId: res.data.threadId!,
  };
}

/**
 * Create a draft email.
 */
export async function createDraft(
  userId: string,
  opts: {
    to: string;
    subject: string;
    body: string;
  }
): Promise<{ draftId: string; gmailMessageId: string }> {
  const gmail = await getAuthenticatedClient(userId);
  const token = await prisma.gmailToken.findUnique({ where: { userId } });
  const fromAddress = token?.gmailAddress || "me";

  const raw = buildRawMessage({
    to: opts.to,
    subject: opts.subject,
    body: opts.body,
    from: fromAddress,
  });

  const res = await gmail.users.drafts.create({
    userId: "me",
    requestBody: {
      message: { raw },
    },
  });

  return {
    draftId: res.data.id!,
    gmailMessageId: res.data.message?.id!,
  };
}

/**
 * Delete a draft.
 */
export async function deleteDraft(userId: string, draftId: string) {
  const gmail = await getAuthenticatedClient(userId);
  await gmail.users.drafts.delete({ userId: "me", id: draftId });
}

/**
 * Send an existing draft.
 */
export async function sendDraft(
  userId: string,
  draftId: string
): Promise<{ gmailMessageId: string; gmailThreadId: string }> {
  const gmail = await getAuthenticatedClient(userId);
  const res = await gmail.users.drafts.send({
    userId: "me",
    requestBody: { id: draftId },
  });

  return {
    gmailMessageId: res.data.id!,
    gmailThreadId: res.data.threadId!,
  };
}

/**
 * Get the user's Gmail profile (email address).
 */
export async function getGmailProfile(
  userId: string
): Promise<{ emailAddress: string; historyId: string }> {
  const gmail = await getAuthenticatedClient(userId);
  const res = await gmail.users.getProfile({ userId: "me" });
  return {
    emailAddress: res.data.emailAddress || "",
    historyId: res.data.historyId?.toString() || "",
  };
}

/**
 * Get the user's Gmail signature (HTML).
 * Returns the default send-as alias signature, or empty string.
 */
export async function getGmailSignature(userId: string): Promise<string> {
  try {
    const gmail = await getAuthenticatedClient(userId);
    const token = await prisma.gmailToken.findUnique({ where: { userId } });
    const address = token?.gmailAddress;

    if (address) {
      const res = await gmail.users.settings.sendAs.get({
        userId: "me",
        sendAsEmail: address,
      });
      return res.data.signature || "";
    }

    // Fallback: list all send-as and find the default
    const res = await gmail.users.settings.sendAs.list({ userId: "me" });
    const defaultAlias = res.data.sendAs?.find((s) => s.isDefault);
    return defaultAlias?.signature || "";
  } catch {
    // Signature fetch is best-effort — don't block sending
    return "";
  }
}

// Re-export for server routes that need both
export { plainTextToHtml, buildHtmlEmail } from "./email-html";
