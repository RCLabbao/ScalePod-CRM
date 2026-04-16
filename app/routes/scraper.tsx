import { Link, useLoaderData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Search, Globe, Zap } from "lucide-react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  let jobs: any[] = [];
  try {
    jobs = await prisma.scraperJob.findMany({
      orderBy: { createdAt: "desc" },
    });
    // Fetch user names separately to avoid relation include issues
    if (jobs.length > 0) {
      const userIds = [...new Set(jobs.map((j: any) => j.userId))];
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true },
      });
      const userMap = new Map(users.map((u: any) => [u.id, u]));
      jobs = jobs.map((j: any) => ({ ...j, user: userMap.get(j.userId) || { name: "Unknown", email: "" } }));
    }
  } catch (err) {
    console.error("[scraper] Failed to load jobs:", err);
  }

  return { user, jobs };
}

export default function ScraperList() {
  const { user, jobs } = useLoaderData<typeof loader>();

  return (
    <AppShell user={user!}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Shopify Scraper</h1>
            <p className="text-sm text-muted-foreground">
              Discover and enrich Australian Shopify store leads
            </p>
          </div>
          <Link to="/scraper/new">
            <Button className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25">
              <Search className="mr-2 h-4 w-4" />
              New Scrape
            </Button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Globe className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">No scraper jobs yet</p>
              <p className="text-sm text-muted-foreground">
                Discover Shopify stores or upload a list of URLs to scrape
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Link key={job.id} to={`/scraper/${job.id}`}>
                <Card className="hover:border-emerald-500/30 transition-colors">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 shrink-0">
                      <Zap className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{job.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.discoveryMode === "GOOGLE_DORK" ? "Google Discovery" : "URL Upload"}
                        {" by "}{job.user.name || job.user.email}
                        {" — "}{new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <ScraperStatusBadge status={job.status} />
                      <span className="text-sm text-muted-foreground">
                        {job.totalImported}/{job.totalDiscovered} leads
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
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
