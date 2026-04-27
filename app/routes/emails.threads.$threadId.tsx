import { Form, Link, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { sendEmail, getGmailSignature, buildHtmlEmail } from "../lib/google-auth.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Send, Reply, Mail, User, MessageCircle } from "lucide-react";
import { useState } from "react";

export async function loader({ request, params }: { request: Request; params: { threadId: string } }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, gmailTokens: true },
  });

  const thread = await prisma.emailThread.findUnique({
    where: { id: params.threadId },
    include: {
      lead: { select: { id: true, companyName: true, contactName: true, email: true } },
      messages: { orderBy: { sentAt: "asc" } },
    },
  });

  if (!thread) {
    throw new Response("Thread not found", { status: 404 });
  }

  return {
    user,
    thread,
    gmailConnected: !!user?.gmailTokens,
  };
}

export async function action({ request, params }: { request: Request; params: { threadId: string } }) {
  const userId = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "reply") {
    const body = formData.get("body") as string;
    const threadId = params.threadId;

    if (!body?.trim()) {
      return { error: "Reply body cannot be empty." };
    }

    const thread = await prisma.emailThread.findUnique({
      where: { id: threadId },
      include: { lead: true },
    });

    if (!thread || !thread.lead?.email) {
      return { error: "Thread or lead email not found." };
    }

    try {
      const signature = await getGmailSignature(userId);
      const htmlBody = buildHtmlEmail(body, signature);

      const result = await sendEmail(userId, {
        to: thread.lead.email,
        subject: thread.subject || "(No Subject)",
        body,
        htmlBody,
        threadId: thread.gmailThreadId,
      });

      const now = new Date();
      const gmailToken = await prisma.gmailToken.findUnique({ where: { userId } });

      await prisma.emailMessage.create({
        data: {
          threadId: thread.id,
          gmailMessageId: result.gmailMessageId,
          fromAddress: gmailToken?.gmailAddress || "me",
          toAddress: thread.lead.email,
          subject: thread.subject,
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
      {isSent ? (
        <User className="h-3.5 w-3.5" />
      ) : (
        initial
      )}
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

export default function ThreadDetail() {
  const { user, thread, gmailConnected } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <AppShell user={user!}>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link to="/emails">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {thread.subject || "(No Subject)"}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {thread.lead && (
                <Link
                  to={`/leads/${thread.lead.id}/emails`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-sm font-medium text-violet-400 hover:bg-violet-500/15 transition-colors"
                >
                  <User className="h-3 w-3" />
                  {thread.lead.companyName}
                </Link>
              )}
              <Badge
                variant={
                  thread.status === "REPLIED"
                    ? "success"
                    : thread.status === "WAITING"
                    ? "warning"
                    : "secondary"
                }
                className="rounded-full text-[11px] uppercase tracking-wider"
              >
                {thread.status}
              </Badge>
            </div>
          </div>
          {gmailConnected && thread.lead?.email && (
            <Button
              onClick={() => setReplyOpen(!replyOpen)}
              variant={replyOpen ? "secondary" : "default"}
              className="shadow-sm shrink-0"
            >
              <Reply className="mr-2 h-4 w-4" />
              {replyOpen ? "Close" : "Reply"}
            </Button>
          )}
        </div>

        {/* Reply form */}
        {replyOpen && (
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-400" />
                Reply to {thread.lead?.contactName || thread.lead?.email || "lead"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Form method="post" className="space-y-3">
                <input type="hidden" name="intent" value="reply" />
                <Textarea
                  name="body"
                  placeholder="Type your reply..."
                  rows={5}
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
            </CardContent>
          </Card>
        )}

        {/* Message timeline */}
        <div className="space-y-6">
          {thread.messages.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-14">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50">
                  <Mail className="h-7 w-7 text-muted-foreground/60" />
                </div>
                <p className="mt-5 font-semibold text-foreground/90">No messages yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This thread is empty. Send a reply to start the conversation.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border/50" />

              <div className="space-y-6">
                {thread.messages.map((msg) => (
                  <div key={msg.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-[10px] top-3 h-2.5 w-2.5 rounded-full ring-4 ${
                        msg.direction === "sent"
                          ? "bg-blue-400 ring-background"
                          : "bg-violet-400 ring-background"
                      }`}
                    />

                    <div
                      className={`rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-sm ${
                        msg.direction === "sent"
                          ? "border-blue-500/15 bg-gradient-to-br from-blue-500/[0.03] to-transparent"
                          : "border-border/60 bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                        <div className="flex items-center gap-2.5">
                          <MessageAvatar direction={msg.direction} from={msg.fromAddress} />
                          <div>
                            <span className="text-sm font-semibold">
                              {msg.direction === "sent" ? "You" : msg.fromAddress}
                            </span>
                            {msg.direction === "sent" && (
                              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400/70 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                Sent
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] tabular-nums text-muted-foreground/60 font-medium">
                          {formatMessageTime(msg.sentAt || msg.createdAt)}
                        </span>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">
                          {msg.bodyPlain || msg.snippet || "(No content)"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
