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
import {
  ArrowLeft,
  Send,
  PenLine,
  Mail,
  AlertCircle,
  User,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

export async function loader({ request, params }: { request: Request; params: { leadId: string } }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, gmailTokens: true },
  });

  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
  });

  if (!lead) {
    throw new Response("Lead not found", { status: 404 });
  }

  // Fetch email threads separately so a relation error doesn't crash the page
  let emailThreads: any[] = [];
  try {
    emailThreads = await prisma.emailThread.findMany({
      where: { leadId: lead.id },
      orderBy: { lastMessage: "desc" },
      include: { messages: { orderBy: { sentAt: "desc" } } },
    });
  } catch (err) {
    console.error("[leads/emails] Failed to load email threads:", err);
  }

  let templates: Awaited<ReturnType<typeof prisma.emailTemplate.findMany>> = [];
  try {
    templates = await prisma.emailTemplate.findMany({ orderBy: { name: "asc" } });
  } catch (err) {
    console.error("[leads/emails] Failed to load templates:", err);
  }

  let gmailSignature = "";
  const gmailConnected = !!user?.gmailTokens;
  if (gmailConnected) {
    try {
      gmailSignature = await getGmailSignature(userId);
    } catch (err) {
      console.error("[leads/emails] Failed to load Gmail signature:", err);
    }
  }

  return { user, lead, emails: emailThreads, templates, gmailConnected, gmailSignature };
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
  const { user, lead, emails, templates, gmailConnected, gmailSignature } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [expandedThread, setExpandedThread] = useState<string | null>(null);

  // Compose state
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const editorRef = useRef<RichEditorHandle>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "iframe-resize" && previewRef.current) {
        previewRef.current.style.height = e.data.height + 24 + "px";
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

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
      let htmlBody: string;
      if (tmpl.body.includes("<") && tmpl.body.includes(">")) {
        // Template is already HTML (created/edited in the modern editor)
        htmlBody = parsePreview(tmpl.body);
      } else {
        // Legacy plain-text template: convert newlines to <br> and escape HTML
        htmlBody = parsePreview(tmpl.body)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>");
      }
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

  const leadInitial = (lead.companyName?.[0] || lead.contactName?.[0] || "?").toUpperCase();

  return (
    <AppShell user={user!}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link to="/inbox">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 text-sm font-bold ring-1 ring-violet-500/20">
              {leadInitial}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{lead.companyName}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-sm text-muted-foreground">{lead.contactName}</span>
                {lead.email && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-sm text-muted-foreground/70">{lead.email}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gmail connection banner */}
        {!gmailConnected && (
          <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15">
                <AlertCircle className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-medium">Gmail not connected</span>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {" "}— Connect your account in{" "}
                  <Link to="/settings" className="underline hover:text-foreground transition-colors">Settings</Link>
                  {" "}to send emails.
                </span>
              </div>
            </div>
            <Link to="/settings" className="shrink-0">
              <Button size="sm" variant="outline" className="h-8 text-xs">
                Connect
              </Button>
            </Link>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Compose panel */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <CardHeader className="border-b border-border/40 bg-muted/20 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  Compose
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <Form
                  method="post"
                  className="space-y-4"
                  onSubmit={(e) => {
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
                  }}
                >
                  <input type="hidden" name="intent" value="sendEmail" />
                  <input type="hidden" name="bodyHtml" defaultValue={bodyHtml} />
                  <input type="hidden" name="bodyPlain" defaultValue="" />

                  {/* To */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">To</Label>
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground/40" />
                      <span className="text-sm truncate text-foreground/80">{lead.email || "No email address"}</span>
                    </div>
                  </div>

                  {/* Template selector */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">Load Template</Label>
                    <Select
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="bg-background border-border/60 shadow-sm"
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
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">Subject</Label>
                    <Input
                      name="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Email subject..."
                      required
                      className="bg-background border-border/60 shadow-sm"
                    />
                  </div>

                  {/* Rich Text Editor */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">Message</Label>
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
                      minHeight={200}
                    />
                  </div>

                  {actionData?.success && (
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Email sent successfully!
                    </div>
                  )}
                  {actionData?.error && (
                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                      {actionData.error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full shadow-sm"
                    disabled={!gmailConnected || !subject.trim() || !bodyHtml.replace(/<[^>]*>/g, "").trim()}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Preview + History */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">
                  Live Preview
                </h3>
                {gmailSignature && (
                  <span className="text-[11px] text-muted-foreground/50">
                    with signature
                  </span>
                )}
              </div>
              <Card className="overflow-hidden border-border/60 shadow-sm">
                {previewSrcDoc ? (
                  <iframe
                    ref={previewRef}
                    srcDoc={previewSrcDoc}
                    sandbox="allow-scripts"
                    title="Email preview"
                    className="w-full border-0 bg-white"
                    style={{ minHeight: "200px" }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border/50">
                      <Send className="h-5 w-5 text-muted-foreground/30" />
                    </div>
                    <p className="mt-3 text-muted-foreground text-sm">
                      Start typing to see a preview
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Email History */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">
                  Email History
                </h3>
                <div className="flex-1 h-px bg-border/40" />
                {emails.length > 0 && (
                  <span className="text-[11px] font-semibold text-muted-foreground/40 tabular-nums">
                    {emails.length}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {emails.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border/50">
                        <Mail className="h-5 w-5 text-muted-foreground/30" />
                      </div>
                      <p className="mt-3 text-muted-foreground text-sm">No emails sent yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  emails.map((thread) => {
                    const isExpanded = expandedThread === thread.id;
                    return (
                      <Card
                        key={thread.id}
                        className="overflow-hidden border-border/60 shadow-sm transition-all duration-200"
                      >
                        <button
                          type="button"
                          className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
                          onClick={() => setExpandedThread(isExpanded ? null : thread.id)}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold truncate text-foreground/90">
                                {thread.subject}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant={
                                    thread.status === "REPLIED"
                                      ? "success"
                                      : thread.status === "WAITING"
                                      ? "warning"
                                      : "secondary"
                                  }
                                  className="rounded-full text-[10px] uppercase tracking-wider"
                                >
                                  {thread.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="text-[11px] tabular-nums text-muted-foreground/50 font-medium">
                                {new Date(thread.lastMessage).toLocaleDateString()}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground/40" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground/40" />
                              )}
                            </div>
                          </div>
                        </button>
                        {isExpanded && thread.messages.length > 0 && (
                          <div className="border-t border-border/50 px-4 py-3 space-y-3">
                            {thread.messages.map((msg: any, i: number) => (
                              <div
                                key={msg.id}
                                className={`rounded-lg border px-3 py-2.5 ${
                                  msg.direction === "sent"
                                    ? "border-blue-500/15 bg-blue-500/[0.03]"
                                    : "border-border/40 bg-muted/20"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">
                                    {msg.direction === "sent" ? "You" : msg.fromAddress}
                                  </span>
                                  <span className="text-[11px] tabular-nums text-muted-foreground/50">
                                    {msg.sentAt
                                      ? new Date(msg.sentAt).toLocaleString()
                                      : new Date(msg.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">
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
    padding: 16px 20px;
    word-wrap: break-word;
  }
  a { color: #2563eb; }
  img { max-width: 100%; height: auto; }
  ul, ol { padding-left: 20px; }
</style>
</head>
<body>${bodyContent}</body>
<script>
  function reportHeight() {
    parent.postMessage({ type: 'iframe-resize', height: document.body.scrollHeight }, '*');
  }
  reportHeight();
  new MutationObserver(reportHeight).observe(document.body, { childList: true, subtree: true });
</script>
</html>`;
}
