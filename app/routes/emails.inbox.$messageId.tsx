import { Form, Link, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { getMessage, sendEmail, getGmailSignature, buildHtmlEmail } from "../lib/google-auth.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Send, Reply, Mail } from "lucide-react";
import { useRef, useState } from "react";

export async function loader({ request, params }: { request: Request; params: { messageId: string } }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, gmailTokens: true },
  });

  const gmailConnected = !!user?.gmailTokens;
  if (!gmailConnected) {
    throw new Response("Gmail not connected", { status: 403 });
  }

  // Fetch the message from Gmail API
  const msg = await getMessage(userId, params.messageId);

  // Try to find an existing thread in our DB for this Gmail thread
  const existingThread = await prisma.emailThread.findFirst({
    where: { gmailThreadId: msg.threadId },
    include: {
      lead: { select: { id: true, companyName: true, contactName: true, email: true } },
      messages: { orderBy: { sentAt: "asc" } },
    },
  });

  // Try to match the sender to a lead by email
  const senderEmail = extractEmailAddress(msg.from);
  const matchedLead = await prisma.lead.findFirst({
    where: { email: senderEmail },
    select: { id: true, companyName: true, contactName: true, email: true },
  });

  return {
    user,
    msg,
    existingThread,
    matchedLead,
  };
}

export async function action({ request, params }: { request: Request; params: { messageId: string } }) {
  const userId = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "reply") {
    const body = formData.get("body") as string;
    const toAddress = formData.get("toAddress") as string;
    const subject = formData.get("subject") as string;
    const gmailThreadId = formData.get("gmailThreadId") as string;

    if (!body?.trim()) {
      return { error: "Reply body cannot be empty." };
    }

    try {
      const signature = await getGmailSignature(userId);
      const htmlBody = buildHtmlEmail(body, signature);

      const result = await sendEmail(userId, {
        to: toAddress,
        subject,
        body,
        htmlBody,
        threadId: gmailThreadId,
      });

      const now = new Date();
      const gmailToken = await prisma.gmailToken.findUnique({ where: { userId } });

      // Find or create the thread in our DB
      let thread = await prisma.emailThread.findFirst({
        where: { gmailThreadId: result.gmailThreadId },
      });

      if (!thread) {
        // Try to associate with a matched lead
        const senderEmail = extractEmailAddress(toAddress);
        const lead = await prisma.lead.findFirst({ where: { email: senderEmail } });

        thread = await prisma.emailThread.create({
          data: {
            leadId: lead?.id || null,
            gmailThreadId: result.gmailThreadId,
            subject,
            snippet: body.substring(0, 200),
            status: "REPLIED",
            lastMessage: now,
          },
        });
      }

      await prisma.emailMessage.create({
        data: {
          threadId: thread.id,
          gmailMessageId: result.gmailMessageId,
          fromAddress: gmailToken?.gmailAddress || "me",
          toAddress,
          subject,
          bodyPlain: body,
          bodyHtml: htmlBody,
          snippet: body.substring(0, 200),
          direction: "sent",
          sentAt: now,
        },
      });

      await prisma.emailThread.update({
        where: { id: thread.id },
        data: {
          snippet: body.substring(0, 200),
          lastMessage: now,
          status: "REPLIED",
        },
      });

      return { success: true };
    } catch (err: any) {
      return { error: err?.message || "Failed to send reply." };
    }
  }

  return {};
}

function extractEmailAddress(from: string): string {
  const match = from.match(/<(.+?)>/);
  return match ? match[1] : from.trim();
}

function EmailBody({ html, plain }: { html: string; plain: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (html) {
    // Build a self-contained HTML document with a white background
    const srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 12px; background: #fff; word-wrap: break-word; }
  a { color: #2563eb; }
  img { max-width: 100%; height: auto; }
  table { max-width: 100%; }
</style>
</head>
<body>${html}</body>
</html>`;

    return (
      <iframe
        ref={iframeRef}
        srcDoc={srcdoc}
        sandbox="allow-same-origin"
        title="Email content"
        className="w-full border-0 rounded-md"
        style={{ minHeight: "200px" }}
        onLoad={() => {
          // Auto-resize iframe to fit content
          if (iframeRef.current) {
            try {
              const doc = iframeRef.current.contentDocument;
              if (doc?.body) {
                iframeRef.current.style.height = doc.body.scrollHeight + 24 + "px";
              }
            } catch {}
          }
        }}
      />
    );
  }

  return (
    <div className="text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">
      {plain || "(No content)"}
    </div>
  );
}

export default function GmailMessageDetail() {
  const { user, msg, existingThread, matchedLead } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [replyOpen, setReplyOpen] = useState(false);

  const senderEmail = extractEmailAddress(msg.from);
  const replySubject = msg.subject.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`;

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/emails?tab=inbox">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {msg.subject || "(No Subject)"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">From: {msg.from}</span>
              {matchedLead && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <Link
                    to={`/leads/${matchedLead.id}/emails`}
                    className="text-sm text-violet-400 hover:underline"
                  >
                    {matchedLead.companyName}
                  </Link>
                </>
              )}
            </div>
          </div>
          <Button onClick={() => setReplyOpen(!replyOpen)}>
            <Reply className="mr-2 h-4 w-4" />
            Reply
          </Button>
        </div>

        {/* Lead match banner */}
        {matchedLead && !existingThread && (
          <Card className="border-l-4 border-l-violet-500">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                <Mail className="h-4 w-4 text-violet-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                This email matches lead{" "}
                <Link to={`/leads/${matchedLead.id}/emails`} className="font-medium text-violet-400 hover:underline">
                  {matchedLead.companyName}
                </Link>
                . Replying will auto-associate this thread.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Reply form */}
        {replyOpen && (
          <Card className="border-blue-500/30">
            <CardContent className="pt-4 space-y-3">
              <div className="grid gap-2">
                <div className="grid grid-cols-[auto_1fr] gap-2 items-center text-sm">
                  <span className="text-muted-foreground text-xs font-medium">To</span>
                  <span>{senderEmail}</span>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-2 items-center text-sm">
                  <span className="text-muted-foreground text-xs font-medium">Subject</span>
                  <span>{replySubject}</span>
                </div>
              </div>
              <Form method="post" className="space-y-3">
                <input type="hidden" name="intent" value="reply" />
                <input type="hidden" name="toAddress" value={senderEmail} />
                <input type="hidden" name="subject" value={replySubject} />
                <input type="hidden" name="gmailThreadId" value={msg.threadId} />
                <Textarea
                  name="body"
                  placeholder="Type your reply..."
                  rows={6}
                  required
                  autoFocus
                  className="text-sm"
                />
                {actionData?.error && (
                  <p className="text-sm text-destructive">{actionData.error}</p>
                )}
                {actionData?.success && (
                  <p className="text-sm text-emerald-400">Reply sent!</p>
                )}
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    <Send className="mr-2 h-3 w-3" />
                    Send Reply
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Original message */}
        <Card>
          <div className="border-b border-border/30 px-4 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-sm font-semibold">
                  {(msg.from[0] || "?").toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{msg.from}</p>
                  <p className="text-xs text-muted-foreground">To: {msg.to}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.date).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="p-2">
            <EmailBody html={msg.bodyHtml} plain={msg.bodyPlain || msg.snippet} />
          </div>
        </Card>

        {/* Existing thread messages from DB */}
        {existingThread && existingThread.messages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Previous messages in this thread
            </h3>
            {existingThread.messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg border ${
                  m.direction === "sent"
                    ? "border-blue-500/20 bg-blue-500/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-2">
                  <span className="text-sm font-medium">
                    {m.direction === "sent" ? "You" : m.fromAddress}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {m.sentAt
                      ? new Date(m.sentAt).toLocaleString()
                      : new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm whitespace-pre-wrap text-foreground/90">
                    {m.bodyPlain || m.snippet || "(No content)"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
