import { Form, Link, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { sendEmail, getGmailSignature } from "../lib/google-auth.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { RichEditor, type RichEditorHandle } from "../components/rich-editor";
import { ArrowLeft, Send, PenLine } from "lucide-react";
import { useState, useRef, useCallback } from "react";

export async function loader({ request, params }: { request: Request; params: { leadId: string } }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, gmailTokens: true },
  });

  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
    include: {
      emails: {
        orderBy: { lastMessage: "desc" },
        include: { messages: { orderBy: { sentAt: "desc" } } },
      },
    },
  });

  if (!lead) {
    throw new Response("Lead not found", { status: 404 });
  }

  const templates = await prisma.emailTemplate.findMany({ orderBy: { name: "asc" } });

  let gmailSignature = "";
  const gmailConnected = !!user?.gmailTokens;
  if (gmailConnected) {
    gmailSignature = await getGmailSignature(userId);
  }

  return { user, lead, templates, gmailConnected, gmailSignature };
}

export async function action({ request, params }: { request: Request; params: { leadId: string } }) {
  const userId = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "sendEmail") {
    const lead = await prisma.lead.findUnique({ where: { id: params.leadId } });
    const subject = formData.get("subject") as string;
    const bodyHtml = formData.get("bodyHtml") as string;
    const bodyPlain = formData.get("bodyPlain") as string;

    if (!lead?.email) {
      return { error: "This lead has no email address." };
    }
    if (!subject?.trim() || !bodyPlain?.trim()) {
      return { error: "Subject and body are required." };
    }

    try {
      // Append signature to HTML if not already present
      const signature = await getGmailSignature(userId);
      const finalHtml = signature && !bodyHtml.includes(signature)
        ? `${bodyHtml}<br><br>${signature}`
        : bodyHtml;

      const result = await sendEmail(userId, {
        to: lead.email,
        subject,
        body: bodyPlain,
        htmlBody: finalHtml,
      });

      const now = new Date();

      const thread = await prisma.emailThread.create({
        data: {
          leadId: lead.id,
          gmailThreadId: result.gmailThreadId,
          subject,
          snippet: bodyPlain.substring(0, 200),
          status: "SENT",
          lastMessage: now,
        },
      });

      const gmailToken = await prisma.gmailToken.findUnique({ where: { userId } });
      await prisma.emailMessage.create({
        data: {
          threadId: thread.id,
          gmailMessageId: result.gmailMessageId,
          fromAddress: gmailToken?.gmailAddress || "me",
          toAddress: lead.email,
          subject,
          bodyPlain,
          bodyHtml: finalHtml,
          snippet: bodyPlain.substring(0, 200),
          direction: "sent",
          sentAt: now,
        },
      });

      return { success: true, sent: { subject } };
    } catch (err: any) {
      const message = err?.message?.includes("has not connected Gmail")
        ? "Gmail is not connected. Go to Settings to connect your account."
        : err?.message || "Failed to send email. Please try again.";
      return { error: message };
    }
  }

  return {};
}

export default function LeadEmails() {
  const { user, lead, templates, gmailConnected, gmailSignature } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [expandedThread, setExpandedThread] = useState<string | null>(null);

  // Compose state
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const editorRef = useRef<RichEditorHandle>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  // Parse template variables
  const parsePreview = useCallback((text: string) => {
    const replacements: Record<string, string> = {
      company_name: lead.companyName,
      contact_name: lead.contactName || "",
      email: lead.email || "",
      industry: lead.industry || "",
      website: lead.website || "",
    };
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key] || `{{${key}}}`);
  }, [lead]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setSubject(parsePreview(tmpl.subject));
      // Convert template body newlines to <br> for RTE
      const htmlBody = parsePreview(tmpl.body)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
      setBodyHtml(htmlBody);
      editorRef.current?.setHTML(htmlBody);
    } else {
      setSubject("");
      setBodyHtml("");
      editorRef.current?.setHTML("");
    }
  };

  const handleInsertSignature = () => {
    if (gmailSignature && editorRef.current) {
      editorRef.current.appendHTML(`<br><br>${gmailSignature}`);
    }
  };

  // Build preview: editor content + signature (if not already inserted)
  const previewSrcDoc = bodyHtml
    ? buildPreviewHtml(
        gmailSignature && !bodyHtml.includes(gmailSignature)
          ? `${bodyHtml}<br><br>${gmailSignature}`
          : bodyHtml
      )
    : "";

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/inbox">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Email: {lead.companyName}
            </h1>
            <p className="text-muted-foreground">{lead.contactName || lead.email}</p>
          </div>
        </div>

        {!gmailConnected && (
          <Card className="border-amber-500/50">
            <CardContent className="flex items-center gap-3 p-4">
              <Badge variant="warning">Gmail Not Connected</Badge>
              <p className="text-sm text-muted-foreground">
                Connect your Gmail account in{" "}
                <Link to="/settings" className="underline hover:text-foreground">Settings</Link>{" "}
                to send emails.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Compose panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compose</CardTitle>
              </CardHeader>
              <CardContent>
                <Form method="post" className="space-y-4" onSubmit={(e) => {
                  // Sync plain text from editor before submit
                  const form = e.currentTarget;
                  const plain = form.querySelector('[name="bodyPlain"]') as HTMLInputElement;
                  if (plain && editorRef.current) {
                    plain.value = editorRef.current.getPlainText();
                  }
                  const html = form.querySelector('[name="bodyHtml"]') as HTMLInputElement;
                  if (html && editorRef.current) {
                    html.value = editorRef.current.getHTML();
                  }
                }}>
                  <input type="hidden" name="intent" value="sendEmail" />
                  <input type="hidden" name="bodyHtml" defaultValue={bodyHtml} />
                  <input type="hidden" name="bodyPlain" defaultValue="" />

                  {/* To */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">To</p>
                    <p className="text-sm rounded-md bg-muted/50 px-3 py-2 truncate">
                      {lead.email || "No email address"}
                    </p>
                  </div>

                  {/* Template selector */}
                  <div className="space-y-2">
                    <Label>Load Template</Label>
                    <Select
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                    >
                      <option value="">Choose a template...</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      name="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Email subject..."
                      required
                    />
                  </div>

                  {/* Rich Text Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Message</Label>
                      {gmailSignature && (
                        <button
                          type="button"
                          onClick={handleInsertSignature}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <PenLine className="h-3 w-3" />
                          Insert Signature
                        </button>
                      )}
                    </div>
                    <RichEditor
                      ref={editorRef}
                      value={bodyHtml}
                      onChange={setBodyHtml}
                      placeholder="Write your message..."
                    />
                  </div>

                  {actionData?.success && (
                    <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400">
                      Email sent successfully!
                    </div>
                  )}
                  {actionData?.error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {actionData.error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={!gmailConnected || !subject.trim() || !bodyHtml.replace(/<[^>]*>/g, "").trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Preview + History */}
          <div className="space-y-4">
            {/* Live Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Preview</h3>
                {gmailSignature && (
                  <span className="text-xs text-muted-foreground">
                    with signature
                  </span>
                )}
              </div>
              <Card className="overflow-hidden">
                {previewSrcDoc ? (
                  <iframe
                    ref={previewRef}
                    srcDoc={previewSrcDoc}
                    sandbox="allow-same-origin"
                    title="Email preview"
                    className="w-full border-0 bg-white"
                    style={{ minHeight: "200px" }}
                    onLoad={() => {
                      if (previewRef.current) {
                        try {
                          const doc = previewRef.current.contentDocument;
                          if (doc?.body) {
                            previewRef.current.style.height = doc.body.scrollHeight + 24 + "px";
                          }
                        } catch {}
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Send className="h-10 w-10 text-muted-foreground/20" />
                    <p className="mt-3 text-muted-foreground text-sm">
                      Start typing to see a preview
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Email History */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Email History
                {lead.emails.length > 0 && (
                  <span className="ml-2 font-normal">({lead.emails.length})</span>
                )}
              </h3>
              <div className="space-y-2">
                {lead.emails.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground text-sm">No emails sent yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  lead.emails.map((thread) => {
                    const isExpanded = expandedThread === thread.id;
                    return (
                      <Card key={thread.id} className="overflow-hidden">
                        <button
                          type="button"
                          className="w-full text-left p-3 hover:bg-muted/30 transition-colors"
                          onClick={() => setExpandedThread(isExpanded ? null : thread.id)}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{thread.subject}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge
                                  variant={
                                    thread.status === "REPLIED" ? "success"
                                    : thread.status === "WAITING" ? "warning"
                                    : "secondary"
                                  }
                                >
                                  {thread.status}
                                </Badge>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {new Date(thread.lastMessage).toLocaleDateString()}
                            </span>
                          </div>
                        </button>
                        {isExpanded && thread.messages.length > 0 && (
                          <div className="border-t border-border/50">
                            {thread.messages.map((msg, i) => (
                              <div
                                key={msg.id}
                                className={`px-3 py-2 text-sm ${
                                  i > 0 ? "border-t border-border/30" : ""
                                } ${msg.direction === "sent" ? "bg-blue-500/5" : "bg-muted/20"}`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-muted-foreground">
                                    {msg.direction === "sent" ? "You" : msg.fromAddress}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {msg.sentAt
                                      ? new Date(msg.sentAt).toLocaleString()
                                      : new Date(msg.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="whitespace-pre-wrap text-foreground/90">
                                  {msg.bodyPlain || msg.snippet}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/** Build a preview HTML document that renders cleanly in an iframe */
function buildPreviewHtml(bodyContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #1a1a1a;
    background: #ffffff;
    margin: 0;
    padding: 12px 16px;
    word-wrap: break-word;
  }
  a { color: #2563eb; }
  img { max-width: 100%; height: auto; }
  ul, ol { padding-left: 20px; }
</style>
</head>
<body>${bodyContent}</body>
</html>`;
}
