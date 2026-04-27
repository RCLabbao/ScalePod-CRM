import { Form, Link, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { RichEditor, type RichEditorHandle } from "../components/rich-editor";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  LayoutTemplate,
  Clock,
  Eye,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const templates = await prisma.emailTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return { user, templates };
}

export async function action({ request }: { request: Request }) {
  await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    await prisma.emailTemplate.create({
      data: {
        name: formData.get("name") as string,
        subject: formData.get("subject") as string,
        body: formData.get("body") as string,
      },
    });
    return { success: true };
  }

  if (intent === "update") {
    await prisma.emailTemplate.update({
      where: { id: formData.get("templateId") as string },
      data: {
        name: formData.get("name") as string,
        subject: formData.get("subject") as string,
        body: formData.get("body") as string,
      },
    });
    return { success: true };
  }

  if (intent === "delete") {
    await prisma.emailTemplate.delete({
      where: { id: formData.get("templateId") as string },
    });
    return { success: true };
  }

  return {};
}

// Sample data for preview rendering
const SAMPLE_DATA: Record<string, string> = {
  company_name: "Acme Corp",
  contact_name: "Jane Smith",
  email: "jane@acme.com",
  industry: "SaaS",
  website: "https://acme.com",
};

function parseTemplate(text: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = SAMPLE_DATA[key];
    if (val) return val;
    return `{{${key}}}`;
  });
}

function highlightVariables(text: string): React.ReactNode {
  const parts = text.split(/(\{\{\w+\}\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{\{(\w+)\}\}$/);
    if (match) {
      return (
        <span
          key={i}
          className="inline-flex items-center rounded px-1 py-0 text-[11px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/20 mx-0.5"
        >
          {match[1]}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function TemplatePreview({ html }: { html: string }) {
  const srcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px; line-height: 1.6; color: #1a1a1a;
        background: #ffffff; margin: 0; padding: 16px;
        word-wrap: break-word;
      }
      a { color: #2563eb; }
      img { max-width: 100%; height: auto; }
      ul, ol { padding-left: 20px; }
    </style>
    </head>
    <body>${html}</body>
    </html>
  `;
  return (
    <iframe
      srcDoc={srcDoc}
      sandbox="allow-same-origin"
      title="Template preview"
      className="w-full border-0 bg-white rounded-lg"
      style={{ minHeight: "160px" }}
    />
  );
}

export default function EmailTemplates() {
  const { user, templates } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Create form state
  const [createName, setCreateName] = useState("");
  const [createSubject, setCreateSubject] = useState("");
  const [createBody, setCreateBody] = useState("");
  const createEditorRef = useRef<RichEditorHandle>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const editEditorRef = useRef<RichEditorHandle>(null);

  useEffect(() => {
    if (actionData?.success) {
      setShowForm(false);
      setEditingId(null);
      setCreateName("");
      setCreateSubject("");
      setCreateBody("");
      setEditName("");
      setEditSubject("");
      setEditBody("");
    }
  }, [actionData]);

  const startEditing = useCallback((template: typeof templates[0]) => {
    setEditingId(template.id);
    setEditName(template.name);
    setEditSubject(template.subject);
    // If body looks like plain text (no HTML tags), convert newlines to <br> for the editor
    const bodyHtml = template.body.includes("<")
      ? template.body
      : template.body.replace(/\n/g, "<br>");
    setEditBody(bodyHtml);
    // Need a small delay for the editor to mount
    setTimeout(() => {
      editEditorRef.current?.setHTML(bodyHtml);
    }, 50);
  }, []);

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const bodyInput = form.querySelector('[name="body"]') as HTMLInputElement;
    if (bodyInput && createEditorRef.current) {
      bodyInput.value = createEditorRef.current.getHTML();
    }
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const bodyInput = form.querySelector('[name="body"]') as HTMLInputElement;
    if (bodyInput && editEditorRef.current) {
      bodyInput.value = editEditorRef.current.getHTML();
    }
  };

  const isCreating = showForm;
  const editingTemplate = templates.find((t) => t.id === editingId);

  return (
    <AppShell user={user!}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/emails">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
              <p className="text-muted-foreground mt-1 max-w-xl">
                Create reusable templates with dynamic placeholders like{" "}
                <code className="text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/20 px-1.5 py-0.5 rounded-md font-bold">{"{{company_name}}"}</code>{" "}
                and{" "}
                <code className="text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/20 px-1.5 py-0.5 rounded-md font-bold">{"{{contact_name}}"}</code>.
                Preview updates live as you type.
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
            variant={showForm ? "secondary" : "default"}
            className="shrink-0 shadow-sm"
          >
            {showForm ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </>
            )}
          </Button>
        </div>

        {/* Create form */}
        {isCreating && (
          <Card className="overflow-hidden ring-1 ring-border/50 shadow-sm border-border/60">
            <CardContent className="p-0">
              <div className="border-b border-border/40 bg-muted/20 px-5 py-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-semibold">Create New Template</span>
              </div>
              <div className="p-5">
                <Form method="post" className="space-y-5" onSubmit={handleCreateSubmit}>
                  <input type="hidden" name="intent" value="create" />
                  <input type="hidden" name="body" value={createBody} />

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Template Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g. Cold Outreach"
                          value={createName}
                          onChange={(e) => setCreateName(e.target.value)}
                          required
                          className="bg-background border-border/60 shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject Line</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="e.g. Helping {{company_name}} grow"
                          value={createSubject}
                          onChange={(e) => setCreateSubject(e.target.value)}
                          required
                          className="bg-background border-border/60 shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create-body">Email Body</Label>
                        <RichEditor
                          ref={createEditorRef}
                          value={createBody}
                          onChange={setCreateBody}
                          placeholder="Write your template... Use {{variable}} for dynamic content."
                          minHeight={200}
                        />
                      </div>
                    </div>

                    {/* Live preview */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground/60" />
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                          Live Preview
                        </Label>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-background overflow-hidden">
                        <div className="border-b border-border/40 px-4 py-2 bg-muted/30">
                          <p className="text-xs text-muted-foreground truncate">
                            Subject: {parseTemplate(createSubject) || "(No subject)"}
                          </p>
                        </div>
                        <div className="p-1">
                          {createBody ? (
                            <TemplatePreview html={parseTemplate(createBody)} />
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/50">
                              <LayoutTemplate className="h-8 w-8 mb-2 opacity-40" />
                              <p className="text-sm">Start typing to see a preview</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Create Template
                    </Button>
                  </div>
                </Form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Template grid */}
        {templates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50">
                <LayoutTemplate className="h-7 w-7 text-muted-foreground/60" />
              </div>
              <p className="mt-5 font-semibold text-foreground/90">No templates yet</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs text-center leading-relaxed">
                Create your first template to speed up email outreach.
              </p>
              <div className="mt-5">
                <Button onClick={() => setShowForm(true)} variant="outline" size="sm" className="shadow-sm">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => {
              const isEditing = editingId === template.id;

              if (isEditing && editingTemplate) {
                return (
                  <div key={template.id} className="sm:col-span-2 xl:col-span-3">
                    <Card className="overflow-hidden ring-1 ring-border/50 shadow-sm border-border/60">
                      <CardContent className="p-0">
                        <div className="border-b border-border/40 bg-muted/20 px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Pencil className="h-4 w-4 text-violet-400" />
                            <span className="text-sm font-semibold">Edit Template</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingId(null)}
                            className="h-8 w-8 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-5">
                          <Form method="post" className="space-y-5" onSubmit={handleEditSubmit}>
                            <input type="hidden" name="intent" value="update" />
                            <input type="hidden" name="templateId" value={template.id} />
                            <input type="hidden" name="body" value={editBody} />

                            <div className="grid gap-5 lg:grid-cols-2">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-name-${template.id}`}>Template Name</Label>
                                  <Input
                                    id={`edit-name-${template.id}`}
                                    name="name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                    className="bg-background border-border/60 shadow-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-subject-${template.id}`}>Subject Line</Label>
                                  <Input
                                    id={`edit-subject-${template.id}`}
                                    name="subject"
                                    value={editSubject}
                                    onChange={(e) => setEditSubject(e.target.value)}
                                    required
                                    className="bg-background border-border/60 shadow-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-body-${template.id}`}>Email Body</Label>
                                  <RichEditor
                                    ref={editEditorRef}
                                    value={editBody}
                                    onChange={setEditBody}
                                    placeholder="Write your template..."
                                    minHeight={200}
                                  />
                                </div>
                              </div>

                              {/* Live preview */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Eye className="h-3.5 w-3.5 text-muted-foreground/60" />
                                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                                    Live Preview
                                  </Label>
                                </div>
                                <div className="rounded-lg border border-border/50 bg-background overflow-hidden">
                                  <div className="border-b border-border/40 px-4 py-2 bg-muted/30">
                                    <p className="text-xs text-muted-foreground truncate">
                                      Subject: {parseTemplate(editSubject) || "(No subject)"}
                                    </p>
                                  </div>
                                  <div className="p-1">
                                    {editBody ? (
                                      <TemplatePreview html={parseTemplate(editBody)} />
                                    ) : (
                                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/50">
                                        <LayoutTemplate className="h-8 w-8 mb-2 opacity-40" />
                                        <p className="text-sm">Start typing to see a preview</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </Button>
                            </div>
                          </Form>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              }

              return (
                <Card
                  key={template.id}
                  className="group transition-all duration-200 hover:shadow-md hover:border-border/80 hover:-translate-y-px flex flex-col"
                >
                  <CardContent className="flex flex-col flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground/90 truncate group-hover:text-foreground transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {template.subject}
                        </p>
                      </div>
                      <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-muted"
                          onClick={() => startEditing(template)}
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Form method="post">
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="templateId" value={template.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive/70 hover:text-destructive" />
                          </Button>
                        </Form>
                      </div>
                    </div>

                    <div className="mt-4 flex-1">
                      <div className="rounded-lg bg-muted/30 border border-border/40 px-3 py-2.5 min-h-[80px]">
                        <p className="text-sm text-muted-foreground/80 line-clamp-4 leading-relaxed">
                          {highlightVariables(template.body)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
                      <Clock className="h-3 w-3" />
                      Updated {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
