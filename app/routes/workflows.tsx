import { Form, Link, useActionData, useLoaderData, useNavigation } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { formatStage } from "../lib/activity-log";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Plus,
  Trash2,
  Workflow,
  History,
  Zap,
  ArrowRight,
  Filter,
  Play,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

type WorkflowRuleRow = {
  id: string;
  name: string;
  description: string | null;
  triggerEvent: string;
  triggerCondition: Record<string, unknown> | null;
  action: string;
  actionConfig: Record<string, unknown>;
  active: boolean;
  createdAt: string;
};

type WorkflowLogRow = {
  id: string;
  ruleId: string;
  leadId: string | null;
  success: boolean;
  error: string | null;
  result: Record<string, unknown> | null;
  createdAt: string;
  rule: { name: string };
  lead: { companyName: string | null } | null;
};

// ── Human-readable helpers ────────────────────────────────────

const TRIGGER_LABELS: Record<string, string> = {
  LEAD_CREATED: "Lead Created",
  STAGE_CHANGED: "Stage Changed",
  TEMPERATURE_CHANGED: "Temp Changed",
  LEAD_APPROVED: "Lead Approved",
  LEAD_SCORED: "Lead Scored",
};

const TRIGGER_ICONS: Record<string, React.ReactNode> = {
  LEAD_CREATED: <Zap className="h-3.5 w-3.5" />,
  STAGE_CHANGED: <ArrowRight className="h-3.5 w-3.5" />,
  TEMPERATURE_CHANGED: <Filter className="h-3.5 w-3.5" />,
  LEAD_APPROVED: <CheckCircle2 className="h-3.5 w-3.5" />,
  LEAD_SCORED: <Zap className="h-3.5 w-3.5" />,
};

const ACTION_LABELS: Record<string, string> = {
  ASSIGN_TO_USER: "Assign to User",
  SEND_NOTIFICATION: "Send Notification",
  UPDATE_FIELD: "Update Field",
  ADD_NOTE: "Add Note",
};

const ACTION_COLORS: Record<string, string> = {
  ASSIGN_TO_USER: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  SEND_NOTIFICATION: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  UPDATE_FIELD: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ADD_NOTE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

function formatCondition(event: string, condition: Record<string, unknown>): string {
  if (condition.toStage) return `to ${formatStage(condition.toStage as string)}`;
  if (condition.temperature) return `temp is ${condition.temperature}`;
  return Object.entries(condition)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
}

function formatAction(action: string, config: Record<string, unknown>, userMap: Map<string, string>): string {
  switch (action) {
    case "ASSIGN_TO_USER": {
      const name = config.userId
        ? userMap.get(config.userId as string) || String(config.userId).slice(0, 8)
        : "?";
      return `Assign to ${name}`;
    }
    case "SEND_NOTIFICATION":
      return `"${String(config.message || "").slice(0, 30)}"`;
    case "UPDATE_FIELD":
      return `Set ${config.field as string || "?"} → ${(config.value as string || "?").slice(0, 20)}`;
    case "ADD_NOTE":
      return `"${String(config.note || "").slice(0, 30)}"`;
    default:
      return action;
  }
}

function hasCondition(triggerEvent: string): boolean {
  return (
    triggerEvent === "STAGE_CHANGED" ||
    triggerEvent === "TEMPERATURE_CHANGED" ||
    triggerEvent === "LEAD_SCORED"
  );
}

// ── Loader ────────────────────────────────────────────────────

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  let rules: any[] = [];
  try {
    rules = await prisma.workflowRule.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[workflows] Failed to load rules — run pending migrations:", err);
  }

  let recentLogs: any[] = [];
  try {
    recentLogs = await prisma.workflowLog.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        rule: { select: { name: true } },
        lead: { select: { companyName: true } },
      },
    });
  } catch (err) {
    console.error("[workflows] Failed to load logs — run pending migrations:", err);
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return {
    rules: rules as unknown as WorkflowRuleRow[],
    recentLogs: recentLogs as unknown as WorkflowLogRow[],
    users,
    user,
  };
}

// ── Action ────────────────────────────────────────────────────

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "delete") {
    const ruleId = formData.get("ruleId") as string;
    if (!ruleId) return { error: "Rule ID required" };
    try {
      await prisma.workflowRule.delete({ where: { id: ruleId } });
    } catch (err) {
      console.error("[workflows] Failed to delete rule:", err);
      return { error: "Failed to delete workflow rule." };
    }
    return { success: true, deleted: true };
  }

  if (intent === "toggleActive") {
    const ruleId = formData.get("ruleId") as string;
    const active = formData.get("active") === "true";
    if (!ruleId) return { error: "Rule ID required" };
    try {
      await prisma.workflowRule.update({
        where: { id: ruleId },
        data: { active: !active },
      });
    } catch (err) {
      console.error("[workflows] Failed to toggle rule:", err);
      return { error: "Failed to update workflow rule." };
    }
    return { success: true };
  }

  return {};
}

// ── Components ────────────────────────────────────────────────

function RuleFlowCard({
  rule,
  userMap,
}: {
  rule: WorkflowRuleRow;
  userMap: Map<string, string>;
}) {
  const showFilter =
    hasCondition(rule.triggerEvent) &&
    rule.triggerCondition &&
    Object.keys(rule.triggerCondition).length > 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm transition-all duration-300 hover:border-border/60 hover:shadow-lg hover:shadow-primary/5">
      {/* Subtle gradient accent on the left */}
      <div
        className={`absolute left-0 top-0 h-full w-1 transition-colors duration-300 ${
          rule.active ? "bg-emerald-500/60" : "bg-muted-foreground/20"
        }`}
      />

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Flow visualization */}
        <div className="flex flex-col gap-3 min-w-0 flex-1">
          {/* Rule name */}
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-foreground">{rule.name}</h3>
            {rule.active ? (
              <Badge
                variant="outline"
                className="text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium px-2"
              >
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] border-muted-foreground/20 bg-muted/40 text-muted-foreground font-medium px-2"
              >
                Inactive
              </Badge>
            )}
          </div>

          {/* Flow nodes */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Trigger node */}
            <div className="flex items-center gap-2 rounded-xl bg-blue-500/8 border border-blue-500/15 px-3 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                {TRIGGER_ICONS[rule.triggerEvent] || <Zap className="h-3.5 w-3.5" />}
              </div>
              <span className="text-xs font-medium text-blue-400/90">
                {TRIGGER_LABELS[rule.triggerEvent] || rule.triggerEvent}
              </span>
            </div>

            {/* Arrow */}
            {showFilter ? (
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
            )}

            {/* Condition node (if applicable) */}
            {showFilter ? (
              <>
                <div className="flex items-center gap-2 rounded-xl bg-amber-500/8 border border-amber-500/15 px-3 py-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                    <Filter className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-medium text-amber-400/90">
                    {formatCondition(rule.triggerEvent, rule.triggerCondition!)}
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
              </>
            ) : null}

            {/* Action node */}
            <div
              className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 ${
                ACTION_COLORS[rule.action] || "bg-muted/40 border-border/40 text-muted-foreground"
              }`}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5">
                <Play className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium">
                {formatAction(rule.action, rule.actionConfig, userMap)}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Modern toggle switch */}
          <Form method="post">
            <input type="hidden" name="intent" value="toggleActive" />
            <input type="hidden" name="ruleId" value={rule.id} />
            <input type="hidden" name="active" value={String(rule.active)} />
            <button
              type="submit"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                rule.active ? "bg-emerald-500/80" : "bg-muted-foreground/25"
              }`}
              title={rule.active ? "Deactivate" : "Activate"}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                  rule.active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </Form>

          <Form method="post">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="ruleId" value={rule.id} />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg text-muted-foreground/50 hover:text-red-400 hover:bg-red-500/10 opacity-60 group-hover:opacity-100 transition-all duration-200"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function EmptyRulesState() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent blur-2xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 ring-1 ring-border/50 shadow-xl">
          <Workflow className="h-7 w-7 text-muted-foreground/40" />
        </div>
      </div>
      <p className="mt-5 text-sm font-semibold text-foreground/80">No workflows yet</p>
      <p className="mt-1 text-xs text-muted-foreground max-w-[260px]">
        Create your first workflow to automate actions when leads change state.
      </p>
      <Link to="/workflows/new" className="mt-4">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Create Workflow
        </Button>
      </Link>
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────

export default function WorkflowsPage() {
  const { rules, recentLogs, users, user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const userMap = new Map(users.map((u) => [u.id, u.name || u.email]));

  const activeCount = rules.filter((r) => r.active).length;

  return (
    <AppShell user={user!}>
      <div className="space-y-8">
        {/* Modern header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 ring-1 ring-border/50">
                <Workflow className="h-5 w-5 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
            </div>
            <p className="text-muted-foreground text-sm pl-[52px]">
              {rules.length > 0
                ? `${activeCount} of ${rules.length} rule${rules.length !== 1 ? "s" : ""} active`
                : "Automate actions when leads change state"}
            </p>
          </div>
          <Link to="/workflows/new">
            <Button className="gap-2 shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-shadow">
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </Link>
        </div>

        {/* Alerts */}
        {actionData?.error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-400 flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {actionData.error}
          </div>
        )}
        {actionData?.success && actionData?.deleted && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-4 text-sm text-emerald-400 flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Workflow deleted successfully.
          </div>
        )}

        {/* Workflow rules */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-muted-foreground/60" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Rules
            </h2>
          </div>

          {rules.length === 0 ? (
            <Card className="border-border/40 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm">
              <CardContent>
                <EmptyRulesState />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <RuleFlowCard key={rule.id} rule={rule} userMap={userMap} />
              ))}
            </div>
          )}
        </section>

        {/* Recent workflow logs */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <History className="h-4 w-4 text-muted-foreground/60" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Executions
            </h2>
          </div>

          <Card className="border-border/40 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              {recentLogs.length === 0 ? (
                <div className="flex items-center gap-3 px-6 py-8 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground/40" />
                  No workflow executions yet.
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {/* Header row */}
                  <div className="grid grid-cols-[1fr_1fr_100px_80px] gap-4 px-6 py-3 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider bg-muted/20">
                    <span>Rule</span>
                    <span>Lead</span>
                    <span>Result</span>
                    <span className="text-right">Time</span>
                  </div>

                  {recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="grid grid-cols-[1fr_1fr_100px_80px] gap-4 items-center px-6 py-3 text-sm hover:bg-muted/20 transition-colors duration-150"
                    >
                      <span className="truncate font-medium text-foreground/90">
                        {log.rule.name}
                      </span>
                      <span className="truncate text-muted-foreground text-xs">
                        {log.lead?.companyName || "—"}
                      </span>
                      <span>
                        {log.success ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            OK
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-red-500/30 bg-red-500/10 text-red-400 font-medium gap-1"
                          >
                            <XCircle className="h-3 w-3" />
                            Fail
                          </Badge>
                        )}
                      </span>
                      <span className="text-right text-muted-foreground/60 tabular-nums text-[11px]">
                        {new Date(log.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}

                  {/* Error summary */}
                  {recentLogs.some((l) => !l.success && l.error) && (
                    <div className="px-6 py-3 bg-red-500/5 border-t border-red-500/10 space-y-1.5">
                      {recentLogs
                        .filter((l) => !l.success && l.error)
                        .slice(0, 3)
                        .map((l) => (
                          <p key={l.id} className="text-xs text-red-400/80 font-mono flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            {l.rule.name}: {l.error}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
