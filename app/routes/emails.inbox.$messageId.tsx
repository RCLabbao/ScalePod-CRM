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
import { ArrowLeft, Send, Reply, Mail, User, MessageCircle, Link2 } from "lucide-react";
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

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "iframe-resize" && iframeRef.current) {
        iframeRef.current.style.height = e.data.height + 32 + "px";
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (html) {
    const srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px; line-height: 1.6; color: #1a1a1a;
    margin: 0; padding: 16px; background: #fff;
    word-wrap: break-word;
  }
  a { color: #2563eb; }
  img { max-width: 100%; height: auto; }
  table { max-width: 100%; }
</style>
</head>
<body>${html}</body>
<script>
  function reportHeight() {
    parent.postMessage({ type: 'iframe-resize', height: document.body.scrollHeight }, '*');
  }
  reportHeight();
  new MutationObserver(reportHeight).observe(document.body, { childList: true, subtree: true });
</script>
</html>`;

    return (
      <iframe
        ref={iframeRef}
        srcDoc={srcdoc}
        sandbox="allow-scripts"
        title="Email content"
        className="w-full border-0 rounded-lg"
        style={{ minHeight: "200px" }}
      />
    );
  }

  return (
    <div className="text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed px-2">
      {plain || "(No content)"}
    </div>
  );
}

function MessageAvatar({ direction, from }: { direction: string; from?: string | null }) {
  const initial = (direction === "sent" ? "You" : from || "?")[0].toUpperCase();
  const isSent = direction === "sent";
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        isSent
          ? "bg-blue-500/15 text-blue-400"
          : "bg-violet-500/15 text-violet-400"
      }`}
    >
      {isSent ? <User className="h-3.5 w-3.5" /> : initial}
    </div>
  );
}

function formatMessageTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GmailMessageDetail() {
  const { user, msg, existingThread, matchedLead } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [replyOpen, setReplyOpen] = useState(false);

  const senderEmail = extractEmailAddress(msg.from);
  const replySubject = msg.subject.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`;

  return (
    <AppShell user={user!}>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link to="/emails?tab=inbox">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {msg.subject || "(No Subject)"}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-sm text-muted-foreground">From: {msg.from}</span>
              {matchedLead && (
                <>
                  <span className="text-muted-foreground hidden sm:inline">·</span>
                  <Link
                    to={`/leads/${matchedLead.id}/emails`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-sm font-medium text-violet-400 hover:bg-violet-500/15 transition-colors"
                  >
                    <Link2 className="h-3 w-3" />
                    {matchedLead.companyName}
                  </Link>
                </>
              )}
            </div>
          </div>
          <Button
            onClick={() => setReplyOpen(!replyOpen)}
            variant={replyOpen ? "secondary" : "default"}
            className="shadow-sm shrink-0"
          >
            <Reply className="mr-2 h-4 w-4" />
            {replyOpen ? "Close" : "Reply"}
          </Button>
        </div>

        {/* Lead match banner */}
        {matchedLead && !existingThread && (
          <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/15">
              <Mail className="h-4 w-4 text-violet-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              This email matches lead{" "}
              <Link
                to={`/leads/${matchedLead.id}/emails`}
                className="font-medium text-violet-400 hover:underline"
              >
                {matchedLead.companyName}
              </Link>
              . Replying will auto-associate this thread.
            </p>
          </div>
        )}

        {/* Reply form */}
        {replyOpen && (
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-border/40 bg-muted/20 px-5 py-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold">Compose Reply</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid gap-3">
                  <div className="grid grid-cols-[auto_1fr] gap-3 items-center text-sm">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-12">To</Label>
                    <span className="truncate text-foreground/80">{senderEmail}</span>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-3 items-center text-sm">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-12">Subject</Label>
                    <span className="truncate text-foreground/80">{replySubject}</span>
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
                    className="bg-background border-border/60 shadow-sm resize-none"
                  />
                  {actionData?.error && (
                    <p className="text-sm text-destructive">{actionData.error}</p>
                  )}
                  {actionData?.success && (
                    <p className="text-sm text-emerald-400 font-medium">Reply sent successfully!</p>
                  )}
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="shadow-sm">
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Original message */}
        <Card className="overflow-hidden border-border/60 shadow-sm">
          <div className="border-b border-border/40 bg-muted/20 px-5 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-sm font-bold">
                  {(msg.from[0] || "?").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{msg.from}</p>
                  <p className="text-xs text-muted-foreground truncate">To: {msg.to}</p>
                </div>
              </div>
              <span className="text-[11px] tabular-nums text-muted-foreground/60 font-medium shrink-0">
                {new Date(msg.date).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="p-4">
            <EmailBody html={msg.bodyHtml} plain={msg.bodyPlain || msg.snippet} />
          </div>
        </Card>

        {/* Existing thread messages from DB */}
        {existingThread && existingThread.messages.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Thread History
              </span>
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-[11px] font-semibold text-muted-foreground/40 tabular-nums">
                {existingThread.messages.length} messages
              </span>
            </div>

            <div className="relative">
              <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border/50" />
              <div className="space-y-6">
                {existingThread.messages.map((m) => (
                  <div key={m.id} className="relative pl-10">
                    <div
                      className={`absolute left-[10px] top-3 h-2.5 w-2.5 rounded-full ring-4 ${
                        m.direction === "sent"
                          ? "bg-blue-400 ring-background"
                          : "bg-violet-400 ring-background"
                      }`}
                    />
                    <div
                      className={`rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-sm ${
                        m.direction === "sent"
                          ? "border-blue-500/15 bg-gradient-to-br from-blue-500/[0.03] to-transparent"
                          : "border-border/60 bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                        <div className="flex items-center gap-2.5">
                          <MessageAvatar direction={m.direction} from={m.fromAddress} />
                          <div>
                            <span className="text-sm font-semibold">
                              {m.direction === "sent" ? "You" : m.fromAddress}
                            </span>
                            {m.direction === "sent" && (
                              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400/70 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                Sent
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] tabular-nums text-muted-foreground/60 font-medium">
                          {formatMessageTime(m.sentAt || m.createdAt)}
                        </span>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">
                          {m.bodyPlain || m.snippet || "(No content)"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
