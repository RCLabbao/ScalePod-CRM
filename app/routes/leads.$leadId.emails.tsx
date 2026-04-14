import { Form, Link, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { ArrowLeft, Send, RefreshCw } from "lucide-react";
import { useState } from "react";

export async function loader({ request, params }: { request: Request; params: { leadId: string } }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, gmailTokens: true },
  });

  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
    include: { emails: { orderBy: { lastMessage: "desc" } } },
  });

  if (!lead) {
    throw new Response("Lead not found", { status: 404 });
  }

  const templates = await prisma.emailTemplate.findMany({ orderBy: { name: "asc" } });

  return { user, lead, templates, gmailConnected: !!user?.gmailTokens };
}

export async function action({ request, params }: { request: Request; params: { leadId: string } }) {
  await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "sendEmail") {
    const lead = await prisma.lead.findUnique({ where: { id: params.leadId } });
    const template = await prisma.emailTemplate.findUnique({
      where: { id: formData.get("templateId") as string },
    });

    if (!lead || !template) {
      return { error: "Lead or template not found." };
    }

    // Parse template variables
    const replacements: Record<string, string> = {
      company_name: lead.companyName,
      contact_name: lead.contactName || "",
      email: lead.email,
      industry: lead.industry || "",
      website: lead.website || "",
    };

    const parseTemplate = (text: string) =>
      text.replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key] || `{{${key}}}`);

    const subject = parseTemplate(template.subject);
    const body = parseTemplate(template.body);

    // TODO: Integrate Gmail API to actually send
    // For now, log the thread in the database
    const gmailThreadId = `local-${Date.now()}`;

    await prisma.emailThread.create({
      data: {
        leadId: lead.id,
        gmailThreadId,
        subject,
        snippet: body.substring(0, 200),
        status: "SENT",
      },
    });

    return { success: true, sent: { subject, snippet: body.substring(0, 100) } };
  }

  return {};
}

export default function LeadEmails() {
  const { user, lead, templates, gmailConnected } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [selectedTemplate, setSelectedTemplate] = useState("");

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
                Connect your Gmail account in Settings to send emails. Thread tracking still works.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Send email panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Send Email</CardTitle>
              </CardHeader>
              <CardContent>
                <Form method="post" className="space-y-4">
                  <input type="hidden" name="intent" value="sendEmail" />
                  <div className="space-y-2">
                    <Label>Select Template</Label>
                    <Select
                      name="templateId"
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      required
                    >
                      <option value="">Choose a template...</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </Select>
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
                  <Button type="submit" className="w-full" disabled={!gmailConnected}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Email thread history */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-lg font-semibold">Email History</h3>
            {lead.emails.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Send className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No emails sent yet.</p>
                </CardContent>
              </Card>
            ) : (
              lead.emails.map((thread) => (
                <Card key={thread.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{thread.subject}</p>
                        {thread.snippet && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {thread.snippet}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
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
                        <span className="text-xs text-muted-foreground">
                          {new Date(thread.lastMessage).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
