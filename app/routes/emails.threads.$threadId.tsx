import { Form, Link, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { sendEmail, getGmailSignature, buildHtmlEmail } from "../lib/google-auth.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Send, Reply, Mail } from "lucide-react";
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

export default function ThreadDetail() {
  const { user, thread, gmailConnected } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/emails">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {thread.subject || "(No Subject)"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {thread.lead && (
                <Link
                  to={`/leads/${thread.lead.id}/emails`}
                  className="text-sm text-violet-400 hover:underline"
                >
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
              >
                {thread.status}
              </Badge>
            </div>
          </div>
          {gmailConnected && thread.lead?.email && (
            <Button onClick={() => setReplyOpen(!replyOpen)}>
              <Reply className="mr-2 h-4 w-4" />
              Reply
            </Button>
          )}
        </div>

        {/* Reply form */}
        {replyOpen && (
          <Card className="border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                Reply to {thread.lead?.contactName || thread.lead?.email || "lead"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-3">
                <input type="hidden" name="intent" value="reply" />
                <Textarea
                  name="body"
                  placeholder="Type your reply..."
                  rows={5}
                  required
                  autoFocus
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

        {/* Message timeline */}
        <div className="space-y-4">
          {thread.messages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <Mail className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-muted-foreground">No messages in this thread.</p>
              </CardContent>
            </Card>
          ) : (
            thread.messages.map((msg, i) => (
              <div
                key={msg.id}
                className={`rounded-lg border ${
                  msg.direction === "sent"
                    ? "border-blue-500/20 bg-blue-500/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                        msg.direction === "sent"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-violet-500/15 text-violet-400"
                      }`}
                    >
                      {msg.direction === "sent"
                        ? (msg.fromAddress || "You")[0].toUpperCase()
                        : (msg.fromAddress || "?")[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">
                      {msg.direction === "sent" ? "You" : msg.fromAddress}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {msg.sentAt
                      ? new Date(msg.sentAt).toLocaleString()
                      : new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm whitespace-pre-wrap text-foreground/90">
                    {msg.bodyPlain || msg.snippet || "(No content)"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
