import { Link, useLoaderData } from "react-router";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth.guard";
import { AppShell } from "../components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Inbox, Kanban, Mail, TrendingUp } from "lucide-react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const [
    inboxCount,
    activeCount,
    emailCount,
    wonCount,
  ] = await Promise.all([
    prisma.lead.count({ where: { status: "INBOX" } }),
    prisma.lead.count({ where: { status: "ACTIVE" } }),
    prisma.emailThread.count(),
    prisma.lead.count({ where: { stage: "CLOSED_WON" } }),
  ]);

  return { user, stats: { inboxCount, activeCount, emailCount, wonCount } };
}

export default function Dashboard() {
  const { user, stats } = useLoaderData<typeof loader>();

  const statCards = [
    {
      label: "Leads in Inbox",
      value: stats.inboxCount,
      icon: Inbox,
      iconColor: "text-blue-400",
      bgAccent: "bg-blue-500/10",
    },
    {
      label: "Active Pipeline",
      value: stats.activeCount,
      icon: Kanban,
      iconColor: "text-violet-400",
      bgAccent: "bg-violet-500/10",
    },
    {
      label: "Email Threads",
      value: stats.emailCount,
      icon: Mail,
      iconColor: "text-amber-400",
      bgAccent: "bg-amber-500/10",
    },
    {
      label: "Deals Won",
      value: stats.wonCount,
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      bgAccent: "bg-emerald-500/10",
    },
  ];

  return (
    <AppShell user={user!}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ""}. Here&apos;s your CRM overview.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full ${stat.bgAccent}`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link
                to="/inbox"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-blue-500/5 hover:border-blue-500/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Inbox className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Review Leads</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.inboxCount} leads waiting in inbox
                  </p>
                </div>
              </Link>
              <Link
                to="/pipeline"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-violet-500/5 hover:border-violet-500/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                  <Kanban className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="font-medium">Manage Pipeline</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.activeCount} active deals to track
                  </p>
                </div>
              </Link>
              <Link
                to="/emails"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-amber-500/5 hover:border-amber-500/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Mail className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium">Email Hub</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.emailCount} conversations tracked
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <PipelineBreakdown />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function PipelineBreakdown() {
  return (
    <div className="space-y-3 text-sm">
      {[
        { stage: "Sourced", color: "bg-slate-400", bar: "bg-slate-400/20" },
        { stage: "Qualified", color: "bg-blue-400", bar: "bg-blue-400/20" },
        { stage: "First Contact", color: "bg-violet-400", bar: "bg-violet-400/20" },
        { stage: "Meeting Booked", color: "bg-amber-400", bar: "bg-amber-400/20" },
        { stage: "Proposal Sent", color: "bg-orange-400", bar: "bg-orange-400/20" },
        { stage: "Closed Won", color: "bg-emerald-400", bar: "bg-emerald-400/20" },
        { stage: "Closed Lost", color: "bg-red-400", bar: "bg-red-400/20" },
      ].map((item) => (
        <div key={item.stage} className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full ${item.color}`} />
          <span className="flex-1">{item.stage}</span>
          <div className={`h-2 w-16 rounded-full ${item.bar}`}>
            <div className={`h-2 w-1/3 rounded-full ${item.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
