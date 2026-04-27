import { Link, useLoaderData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { formatStage } from "../lib/activity-log";
import { AppShell } from "../components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Users,
  Mail,
  TrendingUp,
  Phone,
  BarChart3,
  UserCheck,
  FileCheck,
  Trophy,
  XCircle,
  Target,
  ChevronDown,
  ArrowUpRight,
  Activity,
  PieChart,
  Layers,
  Calendar,
} from "lucide-react";
import { useState } from "react";

// ── Constants ──────────────────────────────────────────────────

const PIPELINE_STAGES = [
  "SOURCED",
  "QUALIFIED",
  "FIRST_CONTACT",
  "MEETING_BOOKED",
  "PROPOSAL_SENT",
  "CLOSED_WON",
] as const;

const STAGE_META: Record<string, { color: string; bg: string; bar: string; dot: string; text: string }> = {
  SOURCED:       { color: "border-t-slate-400",  bg: "bg-slate-400/10",  bar: "bg-slate-400/50",  dot: "bg-slate-400",  text: "text-slate-300" },
  QUALIFIED:     { color: "border-t-blue-400",   bg: "bg-blue-400/10",   bar: "bg-blue-400/60",   dot: "bg-blue-400",   text: "text-blue-400" },
  FIRST_CONTACT: { color: "border-t-violet-400", bg: "bg-violet-400/10", bar: "bg-violet-400/60", dot: "bg-violet-400", text: "text-violet-400" },
  MEETING_BOOKED:{ color: "border-t-amber-400",  bg: "bg-amber-400/10",  bar: "bg-amber-400/60",  dot: "bg-amber-400",  text: "text-amber-400" },
  PROPOSAL_SENT: { color: "border-t-orange-400", bg: "bg-orange-400/10", bar: "bg-orange-400/60", dot: "bg-orange-400", text: "text-orange-400" },
  CLOSED_WON:    { color: "border-t-emerald-400",bg: "bg-emerald-400/10",bar: "bg-emerald-400/60",dot: "bg-emerald-400",text: "text-emerald-400" },
  CLOSED_LOST:   { color: "border-t-red-400",    bg: "bg-red-400/10",    bar: "bg-red-400/60",    dot: "bg-red-400",    text: "text-red-400" },
};

type DateRange = "7d" | "30d" | "90d" | "1y" | "all" | "custom";

function rangeToStartDate(range: DateRange, from?: string): Date | undefined {
  if (range === "all") return undefined;
  if (range === "custom" && from) return new Date(from);
  const now = new Date();
  const d = new Date(now);
  switch (range) {
    case "7d": d.setDate(d.getDate() - 7); break;
    case "30d": d.setDate(d.getDate() - 30); break;
    case "90d": d.setDate(d.getDate() - 90); break;
    case "1y": d.setFullYear(d.getFullYear() - 1); break;
  }
  return d;
}

// ── Loader ─────────────────────────────────────────────────────

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const url = new URL(request.url);
  const range = (url.searchParams.get("range") || "all") as DateRange;
  const customFrom = url.searchParams.get("from") || undefined;
  const customTo = url.searchParams.get("to") || undefined;
  const startDate = rangeToStartDate(range, customFrom);
  const endDate = customTo ? new Date(customTo) : undefined;

  const dateFilter = startDate || endDate ? {
    changedAt: {
      ...(startDate ? { gte: startDate } : {}),
      ...(endDate ? { lte: endDate } : {}),
    },
  } : {};

  let rawHistory: any[] = [];
  let leadsMap = new Map<string, any>();
  let usersMap = new Map<string, { id: string; name: string }>();

  try {
    rawHistory = await prisma.stageHistory.findMany({
      orderBy: { changedAt: "asc" },
    });

    if (rawHistory.length > 0) {
      const leadIds = [...new Set(rawHistory.map((h: any) => h.leadId))];
      const changedByIds = [...new Set(rawHistory.map((h: any) => h.changedById).filter(Boolean))];

      const [leads, changedByUsers] = await Promise.all([
        prisma.lead.findMany({
          where: { id: { in: leadIds } },
          select: { id: true, companyName: true, contactName: true, email: true, stage: true, leadSource: true },
        }),
        prisma.user.findMany({
          where: { id: { in: changedByIds } },
          select: { id: true, name: true },
        }),
      ]);

      leadsMap = new Map(leads.map((l: any) => [l.id, l]));
      usersMap = new Map(changedByUsers.map((u: any) => [u.id, u]));
    }
  } catch (err) {
    console.error("[analytics] Failed to load stage history:", err);
  }

  const enrichedHistory = rawHistory.map((h: any) => ({
    ...h,
    lead: leadsMap.get(h.leadId) || null,
    changedBy: h.changedById ? usersMap.get(h.changedById) || null : null,
  }));

  const firstArrivalMap = new Map<string, (typeof enrichedHistory)[number]>();
  for (const h of enrichedHistory) {
    const key = `${h.leadId}::${h.toStage}`;
    if (!firstArrivalMap.has(key)) firstArrivalMap.set(key, h);
  }
  const dedupedHistory = Array.from(firstArrivalMap.values());

  const stageHistory = startDate || endDate
    ? dedupedHistory.filter((h) => {
        const t = new Date(h.changedAt).getTime();
        if (startDate && t < startDate.getTime()) return false;
        if (endDate && t > endDate.getTime()) return false;
        return true;
      })
    : dedupedHistory;

  const stageCounts: Record<string, number> = {};
  for (const stage of [...PIPELINE_STAGES, "CLOSED_LOST"]) {
    stageCounts[stage] = stageHistory.filter((h) => h.toStage === stage).length;
  }

  const won = stageCounts["CLOSED_WON"];
  const lost = stageCounts["CLOSED_LOST"];
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;

  const now = new Date();
  const monthsToShow = range === "7d" ? 1 : range === "30d" ? 2 : range === "90d" ? 4 : range === "1y" ? 12 : 6;
  const monthlyTrends: { month: string; contacted: number; won: number; lost: number }[] = [];
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const label = mStart.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const inRange = (d: Date) => d >= mStart && d < mEnd;
    monthlyTrends.push({
      month: label,
      contacted: stageHistory.filter((h) => h.toStage === "FIRST_CONTACT" && inRange(h.changedAt)).length,
      won: stageHistory.filter((h) => h.toStage === "CLOSED_WON" && inRange(h.changedAt)).length,
      lost: stageHistory.filter((h) => h.toStage === "CLOSED_LOST" && inRange(h.changedAt)).length,
    });
  }

  let leadSources: { source: string; count: number }[] = [];
  try {
    const sources = await prisma.lead.groupBy({
      by: ["leadSource"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      ...(startDate ? { where: { createdAt: { gte: startDate } } } : {}),
    });
    leadSources = sources.map((s) => ({ source: s.leadSource || "Unknown", count: s._count.id }));
  } catch (err) {
    console.error("[analytics] Failed to load lead sources:", err);
  }

  let allUsers: any[] = [];
  try {
    allUsers = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
  } catch (err) {
    console.error("[analytics] Failed to load users:", err);
  }
  const teamStats = allUsers
    .map((u) => {
      const contacted = stageHistory.filter((h) => h.changedById === u.id && h.toStage === "FIRST_CONTACT").length;
      const dealsWon = stageHistory.filter((h) => h.changedById === u.id && h.toStage === "CLOSED_WON").length;
      const dealsLost = stageHistory.filter((h) => h.changedById === u.id && h.toStage === "CLOSED_LOST").length;
      return { ...u, contacted, dealsWon, dealsLost, winRate: dealsWon + dealsLost > 0 ? Math.round((dealsWon / (dealsWon + dealsLost)) * 100) : 0 };
    })
    .filter((u) => u.contacted > 0 || u.dealsWon > 0 || u.dealsLost > 0)
    .sort((a, b) => b.dealsWon - a.dealsWon);

  const wonHistory = stageHistory.filter((h) => h.toStage === "CLOSED_WON");
  const lostHistory = stageHistory.filter((h) => h.toStage === "CLOSED_LOST");
  const proposalHistory = stageHistory.filter((h) => h.toStage === "PROPOSAL_SENT");
  const contactedHistory = stageHistory.filter((h) => h.toStage === "FIRST_CONTACT");

  let totalLeads = 0;
  try {
    totalLeads = await prisma.lead.count(startDate ? { where: { createdAt: { gte: startDate } } } : {});
  } catch (err) {
    console.error("[analytics] Failed to count leads:", err);
  }

  let totalEmailsSent = 0;
  try {
    totalEmailsSent = await prisma.emailMessage.count({
      where: { direction: "sent", ...(startDate ? { createdAt: { gte: startDate } } : {}) },
    });
  } catch (err) {
    console.error("[analytics] Failed to count emails:", err);
  }

  return {
    user,
    range,
    totalLeads,
    stageCounts,
    won,
    lost,
    winRate,
    monthlyTrends,
    leadSources,
    teamStats,
    wonHistory,
    lostHistory,
    proposalHistory,
    contactedHistory,
    totalEmailsSent,
  };
}

// ── Sub-components ─────────────────────────────────────────────

function RangePicker({ range }: { range: string }) {
  const isCustom = range === "custom";
  const ranges: { key: string; label: string }[] = [
    { key: "7d", label: "7D" },
    { key: "30d", label: "30D" },
    { key: "90d", label: "90D" },
    { key: "1y", label: "1Y" },
    { key: "all", label: "All Time" },
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 rounded-xl bg-muted/40 p-1 ring-1 ring-border/40">
        {ranges.map((r) => (
          <Link
            key={r.key}
            to={`/analytics?range=${r.key}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              range === r.key
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {r.label}
          </Link>
        ))}
        <Link
          to={`/analytics?range=custom`}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            isCustom
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          Custom
        </Link>
      </div>
      {isCustom && (
        <form method="get" action="/analytics" className="flex items-center gap-2">
          <input type="hidden" name="range" value="custom" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">From</span>
            <input
              type="date"
              name="from"
              className="h-8 rounded-lg border border-border/60 bg-background px-2 text-xs text-foreground shadow-sm"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">To</span>
            <input
              type="date"
              name="to"
              className="h-8 rounded-lg border border-border/60 bg-background px-2 text-xs text-foreground shadow-sm"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="h-8 text-xs rounded-lg">
            Apply
          </Button>
        </form>
      )}
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  const accents: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    violet:  { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/15", glow: "shadow-violet-500/10" },
    blue:    { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/15",   glow: "shadow-blue-500/10" },
    amber:   { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/15",  glow: "shadow-amber-500/10" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/15", glow: "shadow-emerald-500/10" },
    red:     { bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/15",    glow: "shadow-red-500/10" },
    orange:  { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/15", glow: "shadow-orange-500/10" },
    slate:   { bg: "bg-slate-400/10",  text: "text-slate-300",  border: "border-slate-400/15",  glow: "shadow-slate-400/10" },
  };
  const a = accents[accent] || accents.violet;
  return (
    <Card className={`border ${a.border} hover:shadow-md hover:-translate-y-px transition-all duration-200`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            {sub && <p className="text-[10px] text-muted-foreground/50 mt-0.5">{sub}</p>}
          </div>
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${a.bg} ring-1 ${a.border}`}>
            <Icon className={`h-4 w-4 ${a.text}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GroupedBarChart({ data }: { data: { month: string; contacted: number; won: number; lost: number }[] }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.contacted, d.won, d.lost]), 1);
  return (
    <div className="flex items-end gap-3" style={{ height: 180 }}>
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 group">
          {/* Tooltip-like hover label */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {d.contacted > 0 && <span className="text-violet-400 font-medium">{d.contacted}</span>}
            {d.won > 0 && <span className="text-emerald-400 font-medium">{d.won}</span>}
            {d.lost > 0 && <span className="text-red-400 font-medium">{d.lost}</span>}
          </div>
          <div className="flex items-end gap-[3px] w-full" style={{ height: 140 }}>
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-t-md bg-violet-500/40 min-h-[3px] transition-all duration-500 group-hover:bg-violet-500/55"
                style={{ height: `${(d.contacted / maxVal) * 100}%` }}
              />
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-t-md bg-emerald-500/50 min-h-[3px] transition-all duration-500 group-hover:bg-emerald-500/65"
                style={{ height: `${(d.won / maxVal) * 100}%` }}
              />
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-t-md bg-red-500/40 min-h-[3px] transition-all duration-500 group-hover:bg-red-500/55"
                style={{ height: `${(d.lost / maxVal) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap font-medium">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function FunnelBar({ stage, count, maxCount, convRate }: { stage: string; count: number; maxCount: number; convRate: number | null }) {
  const width = maxCount > 0 ? Math.max((count / maxCount) * 100, count > 0 ? 6 : 0) : 0;
  const meta = STAGE_META[stage] || STAGE_META.SOURCED;
  return (
    <div className="group">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 w-28 shrink-0 justify-end">
          <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
          <span className="text-xs text-muted-foreground truncate">{formatStage(stage)}</span>
        </div>
        <div className="flex-1 h-7 bg-muted/20 rounded-lg overflow-hidden relative ring-1 ring-border/20">
          {count > 0 && (
            <div
              className={`h-full rounded-lg flex items-center px-2.5 transition-all duration-500 ${meta.bar}`}
              style={{ width: `${Math.min(width, 100)}%`, minWidth: 40 }}
            >
              <span className="text-[11px] font-bold text-white/90 drop-shadow-sm">{count}</span>
            </div>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground/60 w-10 shrink-0 text-right tabular-nums font-medium">{count}</span>
      </div>
      {convRate !== null && (
        <div className="flex items-center gap-3 ml-[7.5rem] mt-0.5 mb-0.5">
          <div className="h-px flex-1 bg-border/20" />
          <span className="text-[10px] text-muted-foreground/40 font-medium">
            {convRate}% conversion
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground/20" />
        </div>
      )}
    </div>
  );
}

function DataTable({
  rows,
}: {
  rows: {
    id: string;
    leadId: string;
    company: string;
    contact: string;
    date: Date;
    changedBy: string;
    currentStage: string;
  }[];
}) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50">
          <BarChart3 className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground/80">No records found</p>
        <p className="text-xs text-muted-foreground mt-0.5">Try adjusting your date range.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left text-[10px] text-muted-foreground/60 uppercase tracking-wider font-semibold">
            <th className="pb-2.5 pr-4">Company</th>
            <th className="pb-2.5 pr-4">Contact</th>
            <th className="pb-2.5 pr-4">Date</th>
            <th className="pb-2.5 pr-4">By</th>
            <th className="pb-2.5">Stage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-muted/15 transition-colors">
              <td className="py-2.5 pr-4">
                <Link to={`/inbox/${r.leadId}`} className="font-medium text-foreground/90 hover:text-violet-400 hover:underline transition-colors">
                  {r.company}
                </Link>
              </td>
              <td className="py-2.5 pr-4 text-muted-foreground">{r.contact || "—"}</td>
              <td className="py-2.5 pr-4 text-muted-foreground whitespace-nowrap">
                {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </td>
              <td className="py-2.5 pr-4 text-muted-foreground">{r.changedBy || "—"}</td>
              <td className="py-2.5">
                <Badge className={`text-[10px] rounded-full ${STAGE_META[r.currentStage]?.bg || "bg-muted"} ${STAGE_META[r.currentStage]?.text || "text-muted-foreground"} border-0`}>
                  {formatStage(r.currentStage)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabButton({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
      }`}
    >
      {label}
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
        active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/60"
      }`}>
        {count}
      </span>
    </button>
  );
}

function EmptyState({ icon: Icon, title, subtitle }: { icon: typeof BarChart3; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50">
        <Icon className="h-5 w-5 text-muted-foreground/40" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground/80">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export default function Analytics() {
  const data = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<"won" | "lost" | "proposals" | "contacted">("won");

  const toRow = (h: typeof data.wonHistory[number]) => ({
    id: h.id,
    leadId: h.lead?.id || "",
    company: h.lead?.companyName || "—",
    contact: h.lead?.contactName || "",
    date: h.changedAt,
    changedBy: h.changedBy?.name || "",
    currentStage: h.lead?.stage || "UNKNOWN",
  });

  const tabData = {
    won: data.wonHistory.map(toRow),
    lost: data.lostHistory.map(toRow),
    proposals: data.proposalHistory.map(toRow),
    contacted: data.contactedHistory.map(toRow),
  };

  const maxSource = Math.max(...data.leadSources.map((s) => s.count), 1);
  const maxTeam = Math.max(...data.teamStats.map((t) => t.contacted + t.dealsWon), 1);
  const maxStageCount = data.stageCounts["SOURCED"] || Math.max(...Object.values(data.stageCounts), 1);

  return (
    <AppShell user={data.user!}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Pipeline performance, outreach metrics, and team activity
            </p>
          </div>
          <RangePicker range={data.range} />
        </div>

        {/* KPI Cards */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KPICard icon={Users} label="Total Leads" value={data.totalLeads} accent="slate" />
          <KPICard icon={Mail} label="Emails Sent" value={data.totalEmailsSent} accent="blue" />
          <KPICard icon={UserCheck} label="Contacted" value={data.stageCounts["FIRST_CONTACT"]} sub="Reached First Contact" accent="violet" />
          <KPICard icon={FileCheck} label="Proposals Sent" value={data.stageCounts["PROPOSAL_SENT"]} accent="orange" />
          <KPICard icon={Trophy} label="Deals Won" value={data.won} accent="emerald" />
          <KPICard icon={Target} label="Win Rate" value={`${data.winRate}%`} sub={`${data.won}W / ${data.lost}L`} accent="amber" />
        </div>

        {/* Row 2: Funnel + Won/Lost */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Conversion Funnel */}
          <Card className="lg:col-span-3 hover:shadow-md hover:-translate-y-px transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground/50" />
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Conversion Funnel
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {PIPELINE_STAGES.map((stage, i) => {
                const count = data.stageCounts[stage];
                const prevCount = i > 0 ? data.stageCounts[PIPELINE_STAGES[i - 1]] : 0;
                const convRate = i > 0 && prevCount > 0 && count > 0
                  ? Math.round((count / prevCount) * 100)
                  : null;
                return (
                  <FunnelBar
                    key={stage}
                    stage={stage}
                    count={count}
                    maxCount={maxStageCount}
                    convRate={convRate}
                  />
                );
              })}
            </CardContent>
          </Card>

          {/* Won vs Lost */}
          <Card className="lg:col-span-2 hover:shadow-md hover:-translate-y-px transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-muted-foreground/50" />
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Won vs Lost
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Big stats */}
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/15 p-4 text-center ring-1 ring-emerald-500/10">
                  <p className="text-3xl font-bold text-emerald-400">{data.won}</p>
                  <p className="text-xs text-emerald-400/60 mt-1 font-medium">Won</p>
                </div>
                <div className="flex-1 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/15 p-4 text-center ring-1 ring-red-500/10">
                  <p className="text-3xl font-bold text-red-400">{data.lost}</p>
                  <p className="text-xs text-red-400/60 mt-1 font-medium">Lost</p>
                </div>
              </div>

              {/* Ratio bar */}
              {data.won + data.lost > 0 && (
                <div className="space-y-1.5">
                  <div className="flex h-2.5 rounded-full overflow-hidden bg-muted/30 ring-1 ring-border/20">
                    <div
                      className="bg-emerald-500/70 transition-all duration-700"
                      style={{ width: `${(data.won / (data.won + data.lost)) * 100}%` }}
                    />
                    <div
                      className="bg-red-500/50 transition-all duration-700"
                      style={{ width: `${(data.lost / (data.won + data.lost)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                    <span>{data.winRate}% won</span>
                    <span>{100 - data.winRate}% lost</span>
                  </div>
                </div>
              )}

              {/* Recent outcomes */}
              <div className="space-y-1.5 pt-2 border-t border-border/30">
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold">Recent outcomes</p>
                {[...data.wonHistory.slice(0, 3).map((h) => ({ ...h, outcome: "won" as const })),
                  ...data.lostHistory.slice(0, 3).map((h) => ({ ...h, outcome: "lost" as const })),
                ]
                  .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
                  .slice(0, 5)
                  .map((h) => (
                    <div key={h.id} className="flex items-center gap-2.5 text-xs group">
                      <span className={`h-2 w-2 rounded-full shrink-0 ring-2 ring-background ${h.outcome === "won" ? "bg-emerald-400" : "bg-red-400"}`} />
                      <Link to={`/inbox/${h.lead?.id}`} className="truncate text-foreground/80 hover:text-violet-400 hover:underline transition-colors flex-1">
                        {h.lead?.companyName}
                      </Link>
                      <span className="text-muted-foreground/50 shrink-0 tabular-nums">
                        {new Date(h.changedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="hover:shadow-md hover:-translate-y-px transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground/50" />
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Monthly Trends
                </CardTitle>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                  <span className="h-2 w-2 rounded-sm bg-violet-400/60" /> Contacted
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                  <span className="h-2 w-2 rounded-sm bg-emerald-400/60" /> Won
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                  <span className="h-2 w-2 rounded-sm bg-red-400/60" /> Lost
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {data.monthlyTrends.every((m) => m.contacted === 0 && m.won === 0 && m.lost === 0) ? (
              <EmptyState icon={TrendingUp} title="No trend data" subtitle="Try selecting a different date range." />
            ) : (
              <GroupedBarChart data={data.monthlyTrends} />
            )}
          </CardContent>
        </Card>

        {/* Row 4: Lead Sources + Team Performance */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lead Sources */}
          <Card className="hover:shadow-md hover:-translate-y-px transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground/50" />
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Lead Sources
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {data.leadSources.length === 0 ? (
                <EmptyState icon={Activity} title="No lead source data" />
              ) : (
                <div className="space-y-2.5">
                  {data.leadSources.slice(0, 8).map((s) => (
                    <div key={s.source} className="flex items-center gap-3 group">
                      <span className="text-xs text-muted-foreground w-28 shrink-0 truncate text-right">{s.source}</span>
                      <div className="flex-1 h-6 bg-muted/20 rounded-lg overflow-hidden ring-1 ring-border/20">
                        <div
                          className="h-full rounded-lg bg-violet-400/40 flex items-center px-2 transition-all duration-500 group-hover:bg-violet-400/55"
                          style={{ width: `${Math.max((s.count / maxSource) * 100, 6)}%` }}
                        >
                          <span className="text-[10px] font-bold text-white/90 drop-shadow-sm">{s.count}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground/40 w-8 shrink-0 text-right tabular-nums font-medium">
                        {Math.round((s.count / maxSource) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card className="hover:shadow-md hover:-translate-y-px transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground/50" />
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Team Performance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {data.teamStats.length === 0 ? (
                <EmptyState icon={Users} title="No team activity yet" />
              ) : (
                <div className="space-y-1">
                  <div className="grid grid-cols-[1fr_60px_60px_60px] text-[10px] text-muted-foreground/50 uppercase tracking-wider pb-1.5 border-b border-border/40 font-bold">
                    <span>Member</span>
                    <span className="text-center">Contacted</span>
                    <span className="text-center">Won</span>
                    <span className="text-center">Rate</span>
                  </div>
                  {data.teamStats.map((t) => (
                    <div key={t.id} className="grid grid-cols-[1fr_60px_60px_60px] items-center text-xs py-1.5 hover:bg-muted/15 rounded-lg transition-colors px-1 -mx-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-bold ring-1 ring-violet-500/20">
                          {(t.name || t.email)[0].toUpperCase()}
                        </div>
                        <span className="truncate font-medium text-foreground/90">{t.name || t.email}</span>
                      </div>
                      <span className="text-center text-muted-foreground tabular-nums">{t.contacted}</span>
                      <span className="text-center text-emerald-400 font-bold tabular-nums">{t.dealsWon}</span>
                      <span className="text-center text-muted-foreground tabular-nums">{t.winRate}%</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Row 5: Detail Tables */}
        <Card className="hover:shadow-md hover:-translate-y-px transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground/50" />
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Activity Details
                </CardTitle>
              </div>
              <div className="flex gap-1 rounded-xl bg-muted/40 p-0.5 ring-1 ring-border/40">
                <TabButton label="Won" count={data.wonHistory.length} active={activeTab === "won"} onClick={() => setActiveTab("won")} />
                <TabButton label="Lost" count={data.lostHistory.length} active={activeTab === "lost"} onClick={() => setActiveTab("lost")} />
                <TabButton label="Proposals" count={data.proposalHistory.length} active={activeTab === "proposals"} onClick={() => setActiveTab("proposals")} />
                <TabButton label="Contacted" count={data.contactedHistory.length} active={activeTab === "contacted"} onClick={() => setActiveTab("contacted")} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable rows={tabData[activeTab]} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
