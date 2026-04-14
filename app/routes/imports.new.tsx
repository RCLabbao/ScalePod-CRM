import { Form, Link, useLoaderData, useActionData, useNavigate } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react";
import { LEAD_FIELDS, parseCSV, type LeadFieldName } from "../lib/csv-parser";
import { processImport } from "../lib/lead-import.server";
import { useState } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });
  return { user };
}

export async function action({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "upload") {
    const file = formData.get("file") as File | null;
    if (!file) return { error: "Please select a CSV file." };

    const text = await file.text();
    const { headers, rows } = parseCSV(text);

    if (headers.length === 0) return { error: "CSV file appears to be empty." };
    if (rows.length === 0) return { error: "CSV has headers but no data rows." };

    const importJob = await prisma.leadImport.create({
      data: {
        fileName: file.name,
        totalRows: rows.length,
        status: "MAPPING",
        csvData: text,
        userId,
      },
    });

    return { uploaded: true, importId: importJob.id, headers, previewRows: rows.slice(0, 5), totalRows: rows.length };
  }

  if (intent === "import") {
    const importId = formData.get("importId") as string;
    const mappingStr = formData.get("mapping") as string;

    if (!importId || !mappingStr) return { error: "Missing import data." };

    const mapping = JSON.parse(mappingStr) as Record<string, LeadFieldName>;

    await prisma.leadImport.update({
      where: { id: importId },
      data: { columnMapping: mapping },
    });

    const result = await processImport(importId);
    return { done: true, ...result };
  }

  return {};
}

export default function NewImport() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  const [mapping, setMapping] = useState<Record<string, LeadFieldName>>({});

  const isUploaded = actionData?.uploaded;
  const isDone = actionData?.done;

  return (
    <AppShell user={user!}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/imports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Import Leads</h1>
            <p className="text-sm text-muted-foreground">Upload a CSV file to bulk import leads</p>
          </div>
        </div>

        {actionData?.error && (
          <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {actionData.error}
          </div>
        )}

        {/* Success */}
        {isDone && (
          <Card className="border-2 border-emerald-500/40 bg-emerald-500/5">
            <CardContent className="flex items-center gap-4 p-5">
              <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-400" />
              <div className="flex-1">
                <p className="font-semibold">Import complete!</p>
                <p className="text-sm text-muted-foreground">
                  {actionData.imported} imported, {actionData.skipped} skipped
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/inbox">
                  <Button variant="outline" size="sm">View Inbox</Button>
                </Link>
                <Button size="sm" onClick={() => navigate("/imports/new", { replace: true })}>
                  Import More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Upload */}
        {!isUploaded && !isDone && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Step 1: Upload CSV</CardTitle>
              <CardDescription>
                CSV must have a header row. Required fields: Company Name and Email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" encType="multipart/form-data" className="space-y-4">
                <input type="hidden" name="intent" value="upload" />
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer border-border hover:bg-muted/30 transition-colors">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to select a CSV file</p>
                    <input type="file" name="file" accept=".csv" className="hidden" required />
                  </label>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Upload & Preview</Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Map Columns */}
        {isUploaded && !isDone && actionData.headers && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 2: Map Columns</CardTitle>
                <CardDescription>
                  Match your CSV columns to lead fields. {actionData.totalRows} rows found.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {actionData.headers.map((header: string) => (
                    <div key={header} className="flex items-center gap-4">
                      <div className="w-48 shrink-0">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{header}</code>
                      </div>
                      <Select
                        className="flex-1"
                        defaultValue={autoMap(header)}
                        onChange={(e) => {
                          setMapping((prev) => ({
                            ...prev,
                            [header]: e.target.value as LeadFieldName,
                          }));
                        }}
                      >
                        <option value="">— Skip this column —</option>
                        {LEAD_FIELDS.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label} {f.required ? "*" : ""}
                          </option>
                        ))}
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Preview */}
            {actionData.previewRows && actionData.previewRows.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Step 3: Preview (first 5 rows)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          {actionData.headers.map((h: string) => (
                            <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {actionData.previewRows.map((row: Record<string, string>, i: number) => (
                          <tr key={i} className="border-b">
                            {actionData.headers.map((h: string) => (
                              <td key={h} className="px-2 py-1.5 whitespace-nowrap max-w-[200px] truncate">{row[h]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            <Form method="post" className="flex items-center justify-between">
              <input type="hidden" name="intent" value="import" />
              <input type="hidden" name="importId" value={actionData.importId} />
              <input type="hidden" name="mapping" value={JSON.stringify(mapping)} />
              <Link to="/imports">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25">
                <Upload className="mr-2 h-4 w-4" />
                Import {actionData.totalRows} Leads
              </Button>
            </Form>
          </>
        )}
      </div>
    </AppShell>
  );
}

function autoMap(header: string): string {
  const lower = header.toLowerCase().replace(/[^a-z]/g, "");
  const map: Record<string, string> = {
    companyname: "companyName",
    company: "companyName",
    contactname: "contactName",
    name: "contactName",
    fullname: "contactName",
    email: "email",
    industry: "industry",
    website: "website",
    url: "website",
    traffic: "estimatedTraffic",
    estimatedtraffic: "estimatedTraffic",
    techstack: "techStack",
    technology: "techStack",
    leadsource: "leadSource",
    source: "leadSource",
    linkedin: "linkedin",
    facebook: "facebook",
    instagram: "instagram",
    twitter: "twitter",
    notes: "notes",
  };
  return map[lower] || "";
}
