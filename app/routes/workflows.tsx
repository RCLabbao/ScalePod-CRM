import { Form, Link, useActionData, useLoaderData, useNavigation } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { formatStage } from "../lib/activity-log";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Plus, Trash2, Workflow, History, ToggleLeft, ToggleRight } from "lucide-react";

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

const ACTION_LABELS: Record<string, string> = {
  ASSIGN_TO_USER: "Assign to User",
  SEND_NOTIFICATION: "Send Notification",
  UPDATE_FIELD: "Update Field",
  ADD_NOTE: "Add Note",
};

function formatCondition(event: string, condition: Record<string, unknown>): string {
  if (condition.toStage) return `to ${formatStage(condition.toStage as string)}`;
  if (condition.temperature) return `temp is ${condition.temperature}`;
  return Object.entries(condition).map(([k, v]) => `${k}=${v}`).join(", ");
}

function formatAction(action: string, config: Record<string, unknown>, userMap: Map<string, string>): string {
  switch (action) {
    case "ASSIGN_TO_USER": {
      const name = config.userId ? userMap.get(config.userId as string) || String(config.userId).slice(0, 8) : "?";
      return `Assign to ${name}`;
    }
    case "SEND_NOTIFICATION":
      return 'Notify: "' + String(config.message || "").slice(0, 25) + '"';
    case "UPDATE_FIELD":
      return "Set " + (config.field as string || "?") + " = " + (config.value as string || "?");
    case "ADD_NOTE":
      return 'Note: "' + String(config.note || "").slice(0, 25) + '"';
    default:
      return action;
  }
}

function hasCondition(triggerEvent: string): boolean {
  return triggerEvent === "STAGE_CHANGED" || triggerEvent === "TEMPERATURE_CHANGED" || triggerEvent === "LEAD_SCORED";
}

// ── Step dot component ────────────────────────────────────────

function StepDot({ n, color }: { n: 1 | 2 | 3; color: "blue" | "amber" | "emerald" }) {
  const bg: Record<string, string> = { blue: "bg-blue-500/20", amber: "bg-amber-500/20", emerald: "bg-emerald-500/20" };
  const text: Record<string, string> = { blue: "text-blue-400", amber: "text-amber-400", emerald: "text-emerald-400" };
  return (
    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${bg[color]}`}>
      <span className={`text-[10px] font-bold ${text[color]}`}>{n}</span>
    </div>
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
      await prisma.workflowRule.update({ where: { id: ruleId }, data: { active: !active } });
    } catch (err) {
      console.error("[workflows] Failed to toggle rule:", err);
      return { error: "Failed to update workflow rule." };
    }
    return { success: true };
  }

  return {};
}

// ── Page Component ────────────────────────────────────────────

export default function WorkflowsPage() {
  const { rules, recentLogs, users, user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const userMap = new Map(users.map((u) => [u.id, u.name || u.email]));

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Workflow className="h-8 w-8" />
              Workflows
            </h1>
            <p className="text-muted-foreground">Automate actions when leads change state</p>
          </div>
          <Link to="/workflows/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </Link>
        </div>

        {actionData?.error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {actionData.error}
          </div>
        )}
        {actionData?.success && actionData?.deleted && (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            Workflow deleted.
          </div>
        )}

        {/* Workflow rules */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Rules</CardTitle>
            <CardDescription>{rules.length} rule{rules.length !== 1 ? "s" : ""} configured</CardDescription>
          </CardHeader>
          <CardContent>
            {rules.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50">
                  <Workflow className="h-5 w-5 text-muted-foreground/40" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground/80">No workflows yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">Create one to start automating lead actions.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => {
                  const showFilter = hasCondition(rule.triggerEvent) && rule.triggerCondition && Object.keys(rule.triggerCondition).length > 0;

                  return (
                    <div key={rule.id} className="flex items-center justify-between rounded-lg border p-4 gap-4">
                      {/* Mini-flow visualization */}
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        {/* Step 1: Trigger */}
                        <div className="flex items-center gap-1.5">
                          <StepDot n={1} color="blue" />
                          <Badge variant="secondary">{TRIGGER_LABELS[rule.triggerEvent] || rule.triggerEvent}</Badge>
                        </div>

                        {/* Arrow + Step 2: Filter (conditional) */}
                        {showFilter ? (
                          <>
                            <span className="text-muted-foreground/40 text-xs">─▶</span>
                            <div className="flex items-center gap-1.5">
                              <StepDot n={2} color="amber" />
                              <Badge variant="outline">{formatCondition(rule.triggerEvent, rule.triggerCondition!)}</Badge>
                            </div>
                          </>
                        ) : null}

                        {/* Arrow + Step 3: Action */}
                        <span className="text-muted-foreground/40 text-xs">─▶</span>
                        <div className="flex items-center gap-1.5">
                          <StepDot n={3} color="emerald" />
                          <Badge variant="outline">{formatAction(rule.action, rule.actionConfig, userMap)}</Badge>
                        </div>

                        {/* Active badge */}
                        <Badge variant={rule.active ? "success" : "outline"} className="ml-1">
                          {rule.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Form method="post">
                          <input type="hidden" name="intent" value="toggleActive" />
                          <input type="hidden" name="ruleId" value={rule.id} />
                          <input type="hidden" name="active" value={String(rule.active)} />
                          <Button type="submit" variant="ghost" size="sm">
                            {rule.active ? (
                              <ToggleRight className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </Form>
                        <Form method="post">
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="ruleId" value={rule.id} />
                          <Button type="submit" variant="outline" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Form>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent workflow logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Recent Executions
            </CardTitle>
            <CardDescription>Last {recentLogs.length} executions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No workflow executions yet.</p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_80px_60px] text-[10px] text-muted-foreground/50 uppercase tracking-wider pb-1.5 border-b border-border/40 font-bold">
                  <span>Rule</span>
                  <span>Lead</span>
                  <span>Result</span>
                  <span>Time</span>
                </div>
                {recentLogs.map((log) => (
                  <div key={log.id} className="grid grid-cols-[1fr_1fr_80px_60px] items-center text-xs py-1.5 hover:bg-muted/15 rounded-lg transition-colors px-1 -mx-1">
                    <span className="truncate font-medium">{log.rule.name}</span>
                    <span className="truncate text-muted-foreground">{log.lead?.companyName || "—"}</span>
                    <span>
                      {log.success ? (
                        <Badge variant="success" className="text-[10px]">OK</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px]">Fail</Badge>
                      )}
                    </span>
                    <span className="text-muted-foreground/60 tabular-nums text-[11px]">
                      {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
                {recentLogs.some((l) => !l.success && l.error) && (
                  <div className="pt-2 border-t border-border/30 space-y-1">
                    {recentLogs
                      .filter((l) => !l.success && l.error)
                      .slice(0, 3)
                      .map((l) => (
                        <p key={l.id} className="text-xs text-red-400/80 font-mono">
                          {l.rule.name}: {l.error}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}