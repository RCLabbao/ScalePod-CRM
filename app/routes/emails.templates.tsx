import { Form, Link, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth.guard";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const templates = await prisma.emailTemplate.findMany({
    orderBy: { createdAt: "desc" },
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

  if (intent === "delete") {
    await prisma.emailTemplate.delete({
      where: { id: formData.get("templateId") as string },
    });
    return { success: true };
  }

  return {};
}

export default function EmailTemplates() {
  const { user, templates } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [showForm, setShowForm] = useState(false);

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/emails">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Email Templates</h1>
            <p className="text-muted-foreground">
              Use <code className="text-xs bg-muted px-1 py-0.5 rounded">{"{{variable}}"}</code> for
              dynamic placeholders like <code className="text-xs bg-muted px-1 py-0.5 rounded">{"{{company_name}}"}</code>,{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{"{{contact_name}}"}</code>,{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{"{{industry}}"}</code>
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create Template</CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="create" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Cold Outreach" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="e.g. Helping {{company_name}} grow"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Email Body</Label>
                  <Textarea
                    id="body"
                    name="body"
                    rows={8}
                    placeholder="Hi {{contact_name}}..."
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Template</Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">Subject: {template.subject}</p>
                    <pre className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground line-clamp-3">
                      {template.body}
                    </pre>
                  </div>
                  <Form method="post">
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="templateId" value={template.id} />
                    <Button type="submit" variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </Form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
