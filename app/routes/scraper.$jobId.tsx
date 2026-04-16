import { useLoaderData, useFetcher, useRevalidator } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Globe, Check, X, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export async function loader({ request, params }: { request: Request; params: { jobId: string } }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const job = await prisma.scraperJob.findUnique({
    where: { id: params.jobId },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!job) {
    throw new Response("Not found", { status: 404 });
  }

  const leads = await prisma.lead.findMany({
    where: { scraperJobId: job.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      industry: true,
      website: true,
      temperature: true,
      stage: true,
      status: true,
    },
  });

  return { user, job, leads };
}

export async function action({ request, params }: { request: Request; params: { jobId: string } }) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "cancel") {
    await prisma.scraperJob.update({
      where: { id: params.jobId },
      data: { status: "CANCELLED", completedAt: new Date() },
    });
    return { success: true };
  }

  return { success: false };
}

export default function ScraperJobDetail() {
  const { user, job, leads } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const isActive = !["COMPLETED", "FAILED", "CANCELLED"].includes(job.status);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-poll while job is active
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        revalidator.revalidate();
      }, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, revalidator]);

  const errors = (job.errors as Array<{ url: string; phase: string; error: string; timestamp: string }>) || [];

  return (
    <AppShell user={user!}>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/scraper")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{job.name}</h1>
              <p className="text-sm text-muted-foreground">
                {job.discoveryMode === "GOOGLE_DORK" ? "Google Discovery" : "URL Upload"}
                {" by "}{job.user.name || job.user.email}
                {" — "}{new Date(job.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ScraperStatusBadge status={job.status} />
            {isActive && (
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="cancel" />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="text-red-400 border-red-500/20 hover:bg-red-500/10"
                >
                  Cancel
                </Button>
              </fetcher.Form>
            )}
          </div>
        </div>

        {/* Progress */}
        {isActive && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {job.status === "DISCOVERING" && "Discovering store URLs..."}
                    {job.status === "VALIDATING" && "Validating Shopify stores..."}
                    {job.status === "ENRICHING" && "Scraping contact details..."}
                    {job.status === "IMPORTING" && "Importing leads..."}
                    {job.status === "PENDING" && "Starting pipeline..."}
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${job.totalDiscovered > 0
                          ? Math.round(
                              ((job.totalValid + job.totalSkipped + job.totalFailed) /
                                job.totalDiscovered) *
                                100
                            )
                          : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <StatCard
            label="Discovered"
            value={job.totalDiscovered}
            icon={<Globe className="h-4 w-4 text-blue-400" />}
            color="text-blue-400"
          />
          <StatCard
            label="Valid"
            value={job.totalValid}
            icon={<Check className="h-4 w-4 text-cyan-400" />}
            color="text-cyan-400"
          />
          <StatCard
            label="Enriched"
            value={job.totalEnriched}
            icon={<Globe className="h-4 w-4 text-amber-400" />}
            color="text-amber-400"
          />
          <StatCard
            label="Imported"
            value={job.totalImported}
            icon={<Check className="h-4 w-4 text-emerald-400" />}
            color="text-emerald-400"
          />
          <StatCard
            label="Skipped"
            value={job.totalSkipped}
            icon={<Clock className="h-4 w-4 text-slate-400" />}
            color="text-slate-400"
          />
          <StatCard
            label="Failed"
            value={job.totalFailed}
            icon={<AlertTriangle className="h-4 w-4 text-red-400" />}
            color="text-red-400"
          />
        </div>

        {/* Leads Table */}
        {leads.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Leads Created ({leads.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-4 text-left font-medium text-muted-foreground">Company</th>
                      <th className="py-2 pr-4 text-left font-medium text-muted-foreground">Contact</th>
                      <th className="py-2 pr-4 text-left font-medium text-muted-foreground">Email</th>
                      <th className="py-2 pr-4 text-left font-medium text-muted-foreground">Industry</th>
                      <th className="py-2 pr-4 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-2 pr-4">
                          <Link to={`/inbox/${lead.id}`} className="font-medium text-emerald-400 hover:underline">
                            {lead.companyName}
                          </Link>
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">{lead.contactName || "—"}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{lead.email}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{lead.industry || "—"}</td>
                        <td className="py-2 pr-4">
                          <Badge className="text-xs bg-blue-500/15 text-blue-400">{lead.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-400">Errors ({errors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {errors.map((err, i) => (
                  <div key={i} className="rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-sm">
                    <p className="font-medium text-red-400">{err.phase}</p>
                    <p className="text-muted-foreground break-all">{err.url}</p>
                    <p className="text-muted-foreground/70 text-xs">{err.error}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className={`text-xl font-bold ${color}`}>{value}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function ScraperStatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    PENDING: "bg-slate-500/15 text-slate-400",
    DISCOVERING: "bg-blue-500/15 text-blue-400",
    VALIDATING: "bg-cyan-500/15 text-cyan-400",
    ENRICHING: "bg-amber-500/15 text-amber-400",
    IMPORTING: "bg-violet-500/15 text-violet-400",
    COMPLETED: "bg-emerald-500/15 text-emerald-400",
    FAILED: "bg-red-500/15 text-red-400",
    CANCELLED: "bg-gray-500/15 text-gray-400",
  };
  return <Badge className={config[status] || config.PENDING}>{status}</Badge>;
}
