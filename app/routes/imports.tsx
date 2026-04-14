import { Link, useLoaderData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Upload, FileSpreadsheet } from "lucide-react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const imports = await prisma.leadImport.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return { user, imports };
}

export default function ImportList() {
  const { user, imports } = useLoaderData<typeof loader>();

  return (
    <AppShell user={user!}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lead Imports</h1>
            <p className="text-sm text-muted-foreground">
              Import leads from CSV files
            </p>
          </div>
          <Link to="/imports/new">
            <Button className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25">
              <Upload className="mr-2 h-4 w-4" />
              New Import
            </Button>
          </Link>
        </div>

        {imports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">No imports yet</p>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file to bulk import leads
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {imports.map((imp) => (
              <Card key={imp.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <FileSpreadsheet className="h-8 w-8 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{imp.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      by {imp.user.name || imp.user.email} — {new Date(imp.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={imp.status} />
                    <span className="text-sm text-muted-foreground">
                      {imp.importedRows}/{imp.totalRows} imported
                    </span>
                    {imp.skippedRows > 0 && (
                      <Badge variant="outline" className="text-amber-400">{imp.skippedRows} skipped</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    PENDING: "bg-slate-500/15 text-slate-400",
    MAPPING: "bg-blue-500/15 text-blue-400",
    IMPORTING: "bg-amber-500/15 text-amber-400",
    COMPLETED: "bg-emerald-500/15 text-emerald-400",
    FAILED: "bg-red-500/15 text-red-400",
  };
  return <Badge className={config[status] || config.PENDING}>{status}</Badge>;
}
