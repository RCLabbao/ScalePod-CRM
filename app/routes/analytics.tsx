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

const STAGE_COLORS: Record<string, string> = {
  SOURCED: "bg-slate-400/20 text-slate-300",
  QUALIFIED: "bg-blue-500/20 text-blue-400",
  FIRST_CONTACT: "bg-violet-500/20 text-violet-400",
  MEETING_BOOKED: "bg-amber-500/20 text-amber-400",
  PROPOSAL_SENT: "bg-orange-500/20 text-orange-400",
  CLOSED_WON: "bg-emerald-500/20 text-emerald-400",
  CLOSED_LOST: "bg-red-500/20 text-red-400",
};

const STAGE_BAR_COLORS: Record<string, string> = {
  SOURCED: "bg-slate-400/50",
  QUALIFIED: "bg-blue-500/60",
  FIRST_CONTACT: "bg-violet-500/60",
  MEETING_BOOKED: "bg-amber-500/60",
  PROPOSAL_SENT: "bg-orange-500/60",
  CLOSED_WON: "bg-emerald-500/60",
  CLOSED_LOST: "bg-red-500/60",
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

  // Build the date filter for StageHistory
  const dateFilter = startDate || endDate ? {
    changedAt: {
      ...(startDate ? { gte: startDate } : {}),
      ...(endDate ? { lte: endDate } : {}),
    },
  } : {};

  // ── Stage History ──
  // Fetch ALL stage history (no date filter) so we can find each lead's
  // FIRST arrival at every stage — then apply date filter to those first arrivals.
  let rawHistory: any[] = [];
  let leadsMap = new Map<string, any>();
  let usersMap = new Map<string, { id: string; name: string }>();

  try {
    rawHistory = await prisma.stageHistory.findMany({
      orderBy: { changedAt: "asc" },
    });

    // Fetch related data separately to avoid relation include issues on live
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

  // Enrich raw history with related data
  const enrichedHistory = rawHistory.map((h: any) => ({
    ...h,
    lead: leadsMap.get(h.leadId) || null,
    changedBy: h.changedById ? usersMap.get(h.changedById) || null : null,
  }));

  // Deduplicate: keep only the FIRST time each lead reached each stage.
  // Map key = `${leadId}::${toStage}` → keep earliest record.
  const firstArrivalMap = new Map<string, (typeof enrichedHistory)[number]>();
  for (const h of enrichedHistory) {
    const key = `${h.leadId}::${h.toStage}`;
    if (!firstArrivalMap.has(key)) {
      firstArrivalMap.set(key, h);
    }
  }
  const dedupedHistory = Array.from(firstArrivalMap.values());

  // Apply date filter to the deduplicated set
  const stageHistory = startDate || endDate
    ? dedupedHistory.filter((h) => {
        const t = new Date(h.changedAt).getTime();
        if (startDate && t < startDate.getTime()) return false;
        if (endDate && t > endDate.getTime()) return false;
        return true;
      })
    : dedupedHistory;

  // Count per stage (deduplicated — each lead counted once per stage max)
  const stageCounts: Record<string, number> = {};
  for (const stage of [...PIPELINE_STAGES, "CLOSED_LOST"]) {
    stageCounts[stage] = stageHistory.filter(
      (h) => h.toStage === stage
    ).length;
  }

  const won = stageCounts["CLOSED_WON"];
  const lost = stageCounts["CLOSED_LOST"];
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;

  // ── Monthly buckets for trends ──
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

  // ── Lead source breakdown ──
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

  // ── Team performance (also deduplicated — count unique leads per user per stage) ──
  let allUsers: any[] = [];
  try {
    allUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
  } catch (err) {
    console.error("[analytics] Failed to load users:", err);
  }
  const teamStats = allUsers
    .map((u) => {
      const contacted = stageHistory.filter(
        (h) => h.changedById === u.id && h.toStage === "FIRST_CONTACT"
      ).length;
      const dealsWon = stageHistory.filter(
        (h) => h.changedById === u.id && h.toStage === "CLOSED_WON"
      ).length;
      const dealsLost = stageHistory.filter(
        (h) => h.changedById === u.id && h.toStage === "CLOSED_LOST"
      ).length;
      return { ...u, contacted, dealsWon, dealsLost, winRate: dealsWon + dealsLost > 0 ? Math.round((dealsWon / (dealsWon + dealsLost)) * 100) : 0 };
    })
    .filter((u) => u.contacted > 0 || u.dealsWon > 0 || u.dealsLost > 0)
    .sort((a, b) => b.dealsWon - a.dealsWon);

  // ── Detail lists (deduplicated) ──
  const wonHistory = stageHistory.filter((h) => h.toStage === "CLOSED_WON");
  const lostHistory = stageHistory.filter((h) => h.toStage === "CLOSED_LOST");
  const proposalHistory = stageHistory.filter((h) => h.toStage === "PROPOSAL_SENT");
  const contactedHistory = stageHistory.filter((h) => h.toStage === "FIRST_CONTACT");

  // ── Total leads in period ──
  let totalLeads = 0;
  try {
    totalLeads = await prisma.lead.count(
      startDate ? { where: { createdAt: { gte: startDate } } } : {}
    );
  } catch (err) {
    console.error("[analytics] Failed to count leads:", err);
  }

  // ── Email stats ──
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
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
        {ranges.map((r) => (
          <Link
            key={r.key}
            to={`/analytics?range=${r.key}`}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              range === r.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.label}
          </Link>
        ))}
        <Link
          to={`/analytics?range=custom`}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            isCustom
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
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
              className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">To</span>
            <input
              type="date"
              name="to"
              className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="h-8 text-xs">
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
  const accents: Record<string, { bg: string; text: string; border: string }> = {
    violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    slate: { bg: "bg-slate-400/10", text: "text-slate-300", border: "border-slate-400/20" },
  };
  const a = accents[accent] || accents.violet;
  return (
    <Card className={`border ${a.border}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            {sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>}
          </div>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.bg}`}>
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
    <div className="flex items-end gap-3" style={{ height: 160 }}>
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-end gap-0.5 w-full" style={{ height: 130 }}>
            {/* Contacted bar */}
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-t bg-violet-500/50 min-h-[3px] transition-all"
                style={{ height: `${(d.contacted / maxVal) * 100}%` }}
              />
            </div>
            {/* Won bar */}
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-t bg-emerald-500/60 min-h-[3px] transition-all"
                style={{ height: `${(d.won / maxVal) * 100}%` }}
              />
            </div>
            {/* Lost bar */}
            <div className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-t bg-red-500/50 min-h-[3px] transition-all"
                style={{ height: `${(d.lost / maxVal) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function FunnelBar({ stage, count, maxCount }: { stage: string; count: number; maxCount: number }) {
  const width = maxCount > 0 ? Math.max((count / maxCount) * 100, count > 0 ? 6 : 0) : 0;
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-xs text-muted-foreground w-28 shrink-0 text-right truncate">
        {formatStage(stage)}
      </span>
      <div className="flex-1 h-8 bg-muted/20 rounded overflow-hidden relative">
        {count > 0 && (
          <div
            className={`h-full rounded flex items-center px-2.5 transition-all ${STAGE_BAR_COLORS[stage] || "bg-muted"}`}
            style={{ width: `${Math.min(width, 100)}%`, minWidth: 40 }}
          >
            <span className="text-xs font-semibold whitespace-nowrap">{count}</span>
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground w-10 shrink-0 text-right">{count}</span>
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
      <div className="flex flex-col items-center py-8 text-muted-foreground">
        <p className="text-sm">No records found for this period.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[10px] text-muted-foreground uppercase tracking-wider">
            <th className="pb-2.5 pr-4">Company</th>
            <th className="pb-2.5 pr-4">Contact</th>
            <th className="pb-2.5 pr-4">Date</th>
            <th className="pb-2.5 pr-4">By</th>
            <th className="pb-2.5">Current Stage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-muted/15 transition-colors">
              <td className="py-2.5 pr-4">
                <Link to={`/inbox/${r.leadId}`} className="font-medium text-violet-400 hover:underline">
                  {r.company}
                </Link>
              </td>
              <td className="py-2.5 pr-4 text-muted-foreground">{r.contact || "—"}</td>
              <td className="py-2.5 pr-4 text-muted-foreground whitespace-nowrap">
                {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </td>
              <td className="py-2.5 pr-4 text-muted-foreground">{r.changedBy || "—"}</td>
              <td className="py-2.5">
                <Badge className={`text-[10px] ${STAGE_COLORS[r.currentStage] || "bg-muted text-muted-foreground"}`}>
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
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      {label}
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
        active ? "bg-primary-foreground/20" : "bg-muted"
      }`}>
        {count}
      </span>
    </button>
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

  return (
    <AppShell user={data.user!}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Pipeline performance and outreach metrics</p>
          </div>
          <RangePicker range={data.range} />
        </div>

        {/* Row 1: KPI Cards */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KPICard icon={Users} label="Total Leads" value={data.totalLeads} accent="slate" />
          <KPICard icon={UserCheck} label="Contacted" value={data.stageCounts["FIRST_CONTACT"]} sub="Reached First Contact" accent="violet" />
          <KPICard icon={FileCheck} label="Proposals Sent" value={data.stageCounts["PROPOSAL_SENT"]} accent="orange" />
          <KPICard icon={Trophy} label="Deals Won" value={data.won} accent="emerald" />
          <KPICard icon={XCircle} label="Deals Lost" value={data.lost} accent="red" />
          <KPICard icon={Target} label="Win Rate" value={`${data.winRate}%`} sub={`${data.won}W / ${data.lost}L`} accent="amber" />
        </div>

        {/* Row 2: Funnel + Won/Lost */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Conversion Funnel */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {PIPELINE_STAGES.map((stage, i) => {
                const count = data.stageCounts[stage];
                const prevCount = i > 0 ? data.stageCounts[PIPELINE_STAGES[i - 1]] : 0;
                const maxCount = data.stageCounts["SOURCED"] || Math.max(...Object.values(data.stageCounts), 1);
                // Conversion rate: only meaningful when both stages have data
                const convRate = i > 0 && prevCount > 0 && count > 0
                  ? Math.round((count / prevCount) * 100)
                  : null;
                return (
                  <div key={stage}>
                    <FunnelBar stage={stage} count={count} maxCount={maxCount} />
                    {i < PIPELINE_STAGES.length - 1 && (
                      <div className="flex items-center gap-3 ml-[calc(7rem+0.5rem)] my-0.5">
                        <div className="h-px flex-1 bg-border/30" />
                        <span className="text-[10px] text-muted-foreground/60 font-medium">
                          {convRate !== null ? `${convRate}% conversion` : "—"}
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Won vs Lost */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Won vs Lost
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visual comparison */}
              <div className="flex gap-3">
                <div className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{data.won}</p>
                  <p className="text-xs text-emerald-400/70 mt-1">Won</p>
                </div>
                <div className="flex-1 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center">
                  <p className="text-3xl font-bold text-red-400">{data.lost}</p>
                  <p className="text-xs text-red-400/70 mt-1">Lost</p>
                </div>
              </div>

              {/* Ratio bar */}
              {data.won + data.lost > 0 && (
                <div className="space-y-1">
                  <div className="flex h-2 rounded-full overflow-hidden bg-muted/30">
                    <div
                      className="bg-emerald-500/70 transition-all"
                      style={{ width: `${(data.won / (data.won + data.lost)) * 100}%` }}
                    />
                    <div
                      className="bg-red-500/50 transition-all"
                      style={{ width: `${(data.lost / (data.won + data.lost)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{data.winRate}% won</span>
                    <span>{100 - data.winRate}% lost</span>
                  </div>
                </div>
              )}

              {/* Recent outcomes */}
              <div className="space-y-1.5 pt-2 border-t border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Recent outcomes</p>
                {[...data.wonHistory.slice(0, 3).map((h) => ({ ...h, outcome: "won" as const })),
                  ...data.lostHistory.slice(0, 3).map((h) => ({ ...h, outcome: "lost" as const })),
                ]
                  .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
                  .slice(0, 4)
                  .map((h) => (
                    <div key={h.id} className="flex items-center gap-2 text-xs">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${h.outcome === "won" ? "bg-emerald-400" : "bg-red-400"}`} />
                      <Link to={`/inbox/${h.lead?.id}`} className="truncate text-foreground/80 hover:text-violet-400 hover:underline flex-1">
                        {h.lead?.companyName}
                      </Link>
                      <span className="text-muted-foreground shrink-0">
                        {new Date(h.changedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Monthly Trends */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Monthly Trends
              </CardTitle>
              <div className="flex gap-3">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-sm bg-violet-500/50" /> Contacted
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500/60" /> Won
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-sm bg-red-500/50" /> Lost
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {data.monthlyTrends.every((m) => m.contacted === 0 && m.won === 0 && m.lost === 0) ? (
              <div className="flex flex-col items-center py-8 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No trend data for this period</p>
              </div>
            ) : (
              <GroupedBarChart data={data.monthlyTrends} />
            )}
          </CardContent>
        </Card>

        {/* Row 4: Lead Sources + Team Performance */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lead Sources */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Lead Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.leadSources.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No lead source data.</p>
              ) : (
                <div className="space-y-2.5">
                  {data.leadSources.slice(0, 8).map((s) => (
                    <div key={s.source} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-24 shrink-0 truncate text-right">{s.source}</span>
                      <div className="flex-1 h-6 bg-muted/20 rounded overflow-hidden">
                        <div
                          className="h-full rounded bg-violet-500/40 flex items-center px-2 transition-all"
                          style={{ width: `${Math.max((s.count / maxSource) * 100, 8)}%` }}
                        >
                          <span className="text-[10px] font-semibold">{s.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.teamStats.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No team activity yet.</p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_60px_60px_60px] text-[10px] text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/30">
                    <span>Member</span>
                    <span className="text-center">Contacted</span>
                    <span className="text-center">Won</span>
                    <span className="text-center">Rate</span>
                  </div>
                  {data.teamStats.map((t) => (
                    <div key={t.id} className="grid grid-cols-[1fr_60px_60px_60px] items-center text-xs py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-[10px] font-semibold">
                          {(t.name || t.email)[0].toUpperCase()}
                        </div>
                        <span className="truncate font-medium">{t.name || t.email}</span>
                      </div>
                      <span className="text-center text-muted-foreground">{t.contacted}</span>
                      <span className="text-center text-emerald-400 font-medium">{t.dealsWon}</span>
                      <span className="text-center text-muted-foreground">{t.winRate}%</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Row 5: Detail Tables */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Details
              </CardTitle>
              <div className="flex gap-1 rounded-lg bg-muted/50 p-0.5">
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
