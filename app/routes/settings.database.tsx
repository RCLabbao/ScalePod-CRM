import { useLoaderData, useFetcher, useNavigation } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import {
  getMigrationStatus,
  applyPendingMigrations,
  markBaselineApplied,
} from "../lib/migrations.server";
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
import { Database, CheckCircle2, AlertCircle, Play } from "lucide-react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  // Auto-mark baseline on first visit
  await markBaselineApplied();

  const status = await getMigrationStatus();

  return { user, status };
}

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);

  const result = await applyPendingMigrations();

  return result;
}

export default function SettingsDatabase() {
  const { user, status } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const navigation = useNavigation();

  const isApplying =
    navigation.state === "submitting" ||
    (fetcher.state === "submitting" &&
      fetcher.formData?.get("intent") === "applyMigrations");

  // Merge fetcher results into the display
  const appliedFromAction = fetcher.data?.applied || [];
  const errorsFromAction = fetcher.data?.errors || [];

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
                ))}
              </div>
            )}
          </CardContent>
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
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
