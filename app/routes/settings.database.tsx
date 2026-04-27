import { useLoaderData, useFetcher, useNavigation } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import {
  getMigrationStatus,
  applyPendingMigrations,
  markBaselineApplied,
  createMigration,
  markMigrationApplied,
} from "../lib/migrations.server";
import { getSchemaDiff, applySchemaDiffSQL, type DiffSection } from "../lib/schema-diff.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Database, CheckCircle2, AlertCircle, Play, FilePlus, Search, Table2, Columns3, Check } from "lucide-react";
import { useState } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  // Auto-mark baseline on first visit
  await markBaselineApplied();

  const status = await getMigrationStatus();
  const schemaDiff = await getSchemaDiff();

  return { user, status, schemaDiff };
}

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "createMigration") {
    const name = (formData.get("migrationName") as string || "").trim();
    const sql = (formData.get("migrationSql") as string || "").trim();
    const autoApply = formData.get("autoApply") === "on";

    const result = await createMigration(name, sql, { autoApply });

    return { intent: "createMigration", ...result };
  }

  if (intent === "applyDiff") {
    const sql = (formData.get("sql") as string || "").trim();
    const tableName = (formData.get("tableName") as string || "").trim();

    const result = await applySchemaDiffSQL(sql);

    return { intent: "applyDiff", tableName, ...result };
  }

  if (intent === "applyAllDiff") {
    const diff = await getSchemaDiff();
    const results: Array<{ table: string; success: boolean; error?: string }> = [];

    for (const section of diff) {
      const result = await applySchemaDiffSQL(section.sql);
      results.push({ table: section.table, success: result.success, error: result.error });
    }

    return { intent: "applyAllDiff", results };
  }

  if (intent === "markApplied") {
    const filename = (formData.get("filename") as string || "").trim();
    const result = await markMigrationApplied(filename);
    return { intent: "markApplied", ...result };
  }

  const result = await applyPendingMigrations();
  return result;
}

export default function SettingsDatabase() {
  const { user, status, schemaDiff } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const navigation = useNavigation();
  const [showCreate, setShowCreate] = useState(false);

  const isApplying =
    navigation.state === "submitting" ||
    (fetcher.state === "submitting" &&
      fetcher.formData?.get("intent") === "applyMigrations");

  const isCreating =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "createMigration";

  // Merge fetcher results into the display
  const data = fetcher.data;
  const isCreateResult = data && "intent" in data && data.intent === "createMigration";

  type ApplyResult = { applied: string[]; errors: Array<{ migration: string; error: string }> };
  type CreateResult = { filename: string; applied: boolean; error?: string; intent: string };

  const applyData = (isCreateResult ? null : data) as ApplyResult | null;
  const appliedFromAction = applyData?.applied ?? [];
  const errorsFromAction = applyData?.errors ?? [];

  const createResult = (isCreateResult ? data : null) as CreateResult | null;

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Database Migrations
          </h1>
          <p className="text-muted-foreground">
            Manage schema changes without affecting existing data
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{status.total}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Migrations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-2xl font-bold">{status.appliedCount}</p>
                  <p className="text-sm text-muted-foreground">Applied</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {status.pendingCount > 0 ? (
                  <AlertCircle className="h-8 w-8 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                )}
                <div>
                  <p className="text-2xl font-bold">{status.pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apply Button */}
        {status.pendingCount > 0 && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {status.pendingCount} pending migration
                    {status.pendingCount !== 1 ? "s" : ""} ready to apply
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Review the changes below before applying. Migrations run in
                    order and stop on the first error.
                  </p>
                </div>
                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="applyMigrations" />
                  <Button type="submit" disabled={isApplying}>
                    <Play className="mr-2 h-4 w-4" />
                    {isApplying ? "Applying..." : "Apply Migrations"}
                  </Button>
                </fetcher.Form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Messages */}
        {appliedFromAction.length > 0 && (
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                <div>
                  <p className="font-medium text-emerald-400">
                    Successfully applied {appliedFromAction.length} migration
                    {appliedFromAction.length !== 1 ? "s" : ""}:
                  </p>
                  <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                    {appliedFromAction.map((m: string) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Messages */}
        {errorsFromAction.length > 0 && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-400">
                    Migration failed:
                  </p>
                  {errorsFromAction.map(
                    (e: { migration: string; error: string }) => (
                      <div key={e.migration} className="mt-1">
                        <p className="text-sm font-medium">{e.migration}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.error}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Migration List */}
        <Card>
          <CardHeader>
            <CardTitle>Migration History</CardTitle>
            <CardDescription>
              All migration files found in the <code>migrations/</code> folder.
              Files are applied in alphabetical order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status.migrations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No migration files found. Add SQL files to the{" "}
                <code>migrations/</code> directory.
              </p>
            ) : (
              <div className="space-y-2">
                {status.migrations.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <code className="text-sm">{m.name}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      {!m.applied && (
                        <fetcher.Form method="post" className="inline">
                          <input type="hidden" name="intent" value="markApplied" />
                          <input type="hidden" name="filename" value={m.name} />
                          <Button type="submit" variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-foreground">
                            Mark Applied
                          </Button>
                        </fetcher.Form>
                      )}
                      <Badge
                        variant={m.applied ? "success" : "secondary"}
                        className={
                          m.applied
                            ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                            : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
                        }
                      >
                        {m.applied ? "Applied" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schema Diff */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Schema Diff
                </CardTitle>
                <CardDescription>
                  Auto-detects missing tables and columns by comparing your Prisma schema against the live database
                </CardDescription>
              </div>
              {schemaDiff.length > 0 && (
                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="applyAllDiff" />
                  <Button type="submit" variant="default" size="sm" disabled={fetcher.state === "submitting"}>
                    <Play className="mr-2 h-3.5 w-3.5" />
                    {fetcher.state === "submitting" ? "Applying..." : "Apply All Missing"}
                  </Button>
                </fetcher.Form>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {schemaDiff.length === 0 ? (
              <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-medium text-emerald-400">Database is up to date</p>
                  <p className="text-sm text-muted-foreground">
                    All tables and columns from your Prisma schema exist in the database.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Found <strong>{schemaDiff.length}</strong> {schemaDiff.length === 1 ? "section" : "sections"} with differences. Review and apply individually or use "Apply All Missing" above.
                </p>
                {schemaDiff.map((section: DiffSection) => (
                  <div key={section.table} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {section.status === "missing_table" ? (
                          <Table2 className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Columns3 className="h-4 w-4 text-amber-400" />
                        )}
                        <span className="font-medium">{section.model}</span>
                        <code className="text-xs text-muted-foreground">({section.table})</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          section.status === "missing_table"
                            ? "bg-red-500/15 text-red-400 border-red-500/20"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/20"
                        }>
                          {section.status === "missing_table" ? "Missing Table" : "Missing Columns"}
                        </Badge>
                        <fetcher.Form method="post">
                          <input type="hidden" name="intent" value="applyDiff" />
                          <input type="hidden" name="tableName" value={section.table} />
                          <input type="hidden" name="sql" value={section.sql} />
                          <Button type="submit" variant="outline" size="sm" disabled={fetcher.state === "submitting"}>
                            Apply
                          </Button>
                        </fetcher.Form>
                      </div>
                    </div>
                    {section.status === "missing_columns" && (
                      <div className="flex flex-wrap gap-1.5">
                        {section.missingColumns.map((col: string) => (
                          <code key={col} className="rounded bg-muted px-1.5 py-0.5 text-xs">{col}</code>
                        ))}
                      </div>
                    )}
                    <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                      {section.sql}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create New Migration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FilePlus className="h-4 w-4" />
                  Create New Migration
                </CardTitle>
                <CardDescription>
                  Write SQL directly from the browser — no file uploads needed
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreate(!showCreate)}
              >
                {showCreate ? "Cancel" : "New Migration"}
              </Button>
            </div>
          </CardHeader>
          {showCreate && (
            <CardContent>
              {/* Success/error feedback for create */}
              {createResult && !isCreating && (
                <div className={`mb-4 rounded-md border p-3 text-sm ${
                  createResult.error
                    ? "border-red-500/30 bg-red-500/5 text-red-400"
                    : createResult.applied
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                    : "border-blue-500/30 bg-blue-500/5 text-blue-400"
                }`}>
                  {createResult.error ? (
                    <p>{createResult.error}</p>
                  ) : createResult.applied ? (
                    <p>Created and applied <code>{createResult.filename}</code> successfully.</p>
                  ) : (
                    <p>Created <code>{createResult.filename}</code> as a pending migration. Apply it using the button above.</p>
                  )}
                </div>
              )}
              <fetcher.Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="createMigration" />
                <div className="space-y-1.5">
                  <Label htmlFor="migrationName" className="text-xs text-muted-foreground">
                    Migration name
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {String(status.migrations.length > 0
                        ? Math.max(...status.migrations.map(m => {
                            const match = m.name.match(/^(\d+)/);
                            return match ? parseInt(match[1], 10) : 0;
                          })) + 1
                        : 1).padStart(3, "0")}_
                    </span>
                    <Input
                      id="migrationName"
                      name="migrationName"
                      placeholder="add_phone_column"
                      className="h-9"
                      required
                      pattern="[a-zA-Z0-9_-]+"
                      title="Only letters, numbers, dashes, and underscores"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The number prefix is auto-generated. Use snake_case for readability.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="migrationSql" className="text-xs text-muted-foreground">
                    SQL content
                  </Label>
                  <Textarea
                    id="migrationSql"
                    name="migrationSql"
                    rows={8}
                    required
                    placeholder={`CREATE TABLE IF NOT EXISTS \`MyTable\` (\n  \`id\` VARCHAR(191) NOT NULL,\n  \`name\` VARCHAR(191) NOT NULL,\n  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n  PRIMARY KEY (\`id\`)\n) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use <code>IF NOT EXISTS</code> / <code>IF EXISTS</code> to keep migrations idempotent. Dangerous operations (DROP DATABASE, TRUNCATE, DELETE without WHERE) are blocked.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="autoApply"
                      defaultChecked
                      className="rounded border-input"
                    />
                    Auto-apply after creating
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreate(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isCreating}>
                    <FilePlus className="mr-2 h-3.5 w-3.5" />
                    {isCreating ? "Creating..." : "Create Migration"}
                  </Button>
                </div>
              </fetcher.Form>
            </CardContent>
          )}
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>How Migrations Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Instead of re-uploading <code>database-setup.sql</code> (which
              wipes all data), create numbered SQL files in the{" "}
              <code>migrations/</code> folder with only the changes you need.
            </p>
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-2 font-medium text-foreground">
                Migration file naming:
              </p>
              <pre className="text-xs">
                {`migrations/
  000_baseline.sql    ← Already applied (your current schema)
  001_add_phone.sql   ← Next change to apply
  002_new_table.sql   ← And so on...`}
              </pre>
            </div>
            <p>
              Each migration runs inside a transaction — if it fails, all
              changes in that migration are rolled back and no record is
              inserted. The runner stops on the first error to prevent later
              migrations from running against a broken schema.
            </p>
            <p className="font-medium text-foreground">
              Always use <code>IF NOT EXISTS</code> for CREATE statements and{" "}
              <code>IF EXISTS</code> for DROP statements to keep migrations
              idempotent.
            </p>
            <p className="text-sm text-muted-foreground">
              If a migration&apos;s changes already exist in the database (e.g., you ran the SQL manually), use <strong>Mark Applied</strong> to record it without re-running the SQL.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
