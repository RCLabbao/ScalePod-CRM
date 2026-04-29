import { Form, Link, useActionData, useLoaderData, useNavigation } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Plus, Trash2, Workflow, ToggleLeft, ToggleRight, History } from "lucide-react";
import { data } from "react-router";

const TRIGGER_EVENTS = [
  "LEAD_CREATED",
  "STAGE_CHANGED",
  "TEMPERATURE_CHANGED",
  "LEAD_APPROVED",
  "LEAD_SCORED",
] as const;

const ACTIONS = ["ASSIGN_TO_USER", "SEND_NOTIFICATION", "UPDATE_FIELD", "ADD_NOTE"] as const;

const ALLOWED_UPDATE_FIELDS = ["stage", "status", "temperature", "leadSource", "industry", "notes"];

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

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const name = formData.get("name") as string;
    const triggerEvent = formData.get("triggerEvent") as string;
    const actionType = formData.get("actionType") as string;
    const conditionJson = formData.get("condition") as string;
    const configJson = formData.get("actionConfig") as string;

    if (!name?.trim() || !triggerEvent || !actionType) {
      return { error: "Name, trigger event, and action are required" };
    }

    let triggerCondition = null;
    if (conditionJson?.trim()) {
      try {
        triggerCondition = JSON.parse(conditionJson);
      } catch {
        return { error: "Invalid condition JSON" };
      }
    }

    let actionConfig: Record<string, unknown> = {};
    if (configJson?.trim()) {
      try {
        actionConfig = JSON.parse(configJson);
      } catch {
        return { error: "Invalid action config JSON" };
      }
    }

    try {
      await prisma.workflowRule.create({
        data: {
          name: name.trim(),
          triggerEvent,
          triggerCondition: triggerCondition as any,
          action: actionType,
          actionConfig: actionConfig as any,
        },
      });
    } catch (err) {
      console.error("[workflows] Failed to create rule:", err);
      return { error: "Failed to create workflow rule. Make sure database migrations are up to date." };
    }

    return { success: true, created: name };
  }

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

function summarizeCondition(condition: Record<string, unknown> | null): string {
  if (!condition || Object.keys(condition).length === 0) return "Any";
  return Object.entries(condition)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
}

function summarizeAction(action: string, config: Record<string, unknown>): string {
  switch (action) {
    case "ASSIGN_TO_USER":
      return `Assign to user${config.userId ? ` ${config.userId}` : ""}`;
    case "SEND_NOTIFICATION":
      return `Send notification${config.message ? `: "${String(config.message).slice(0, 30)}"` : ""}`;
    case "UPDATE_FIELD":
      return `Set ${config.field || "?"} = "${config.value || "?"}"`;
    case "ADD_NOTE":
      return `Add note: "${String(config.note || "").slice(0, 30)}"`;
    default:
      return action;
  }
}

export default function WorkflowsSettings() {
  const { rules, recentLogs, users, user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Workflow className="h-8 w-8" />
              Workflows
            </h1>
            <p className="text-muted-foreground">Automate actions when leads change state</p>
          </div>
        </div>

        {actionData?.error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {actionData.error}
          </div>
        )}
        {actionData?.success && actionData?.created && (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            Workflow "{actionData.created}" created successfully.
          </div>
        )}
        {actionData?.success && actionData?.deleted && (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            Workflow deleted.
          </div>
        )}

        {/* Create new workflow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Workflow Rule
            </CardTitle>
            <CardDescription>Define a trigger and an action to automate lead management</CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <input type="hidden" name="intent" value="create" />

              <div>
                <label className="text-sm font-medium">Rule Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder='e.g., "Assign HOT leads to sales manager"'
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Trigger Event</label>
                  <select
                    name="triggerEvent"
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {TRIGGER_EVENTS.map((e) => (
                      <option key={e} value={e}>
                        {e.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Action</label>
                  <select
                    id="actionTypeSelect"
                    name="actionType"
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {ACTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Condition Filter <span className="text-muted-foreground font-normal">(optional JSON)</span>
                </label>
                <input
                  name="condition"
                  type="text"
                  placeholder='e.g., {"temperature": "HOT"} or {"toStage": "MEETING_BOOKED"}'
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only fire when metadata matches these key-value pairs. Leave empty to match all.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Action Config (JSON)</label>
                <textarea
                  name="actionConfig"
                  rows={3}
                  placeholder='For ASSIGN_TO_USER: {"userId": "user_id"}&#10;For UPDATE_FIELD: {"field": "stage", "value": "QUALIFIED"}&#10;For ADD_NOTE: {"note": "Auto-contacted"}'
                  className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available fields for UPDATE_FIELD: {ALLOWED_UPDATE_FIELDS.join(", ")}
                </p>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && navigation.formData?.get("intent") === "create" ? "Creating..." : "Create Workflow"}
              </Button>
            </Form>
          </CardContent>
        </Card>

        {/* Existing rules */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Rules</CardTitle>
            <CardDescription>{rules.length} rule{rules.length !== 1 ? "s" : ""} configured</CardDescription>
          </CardHeader>
          <CardContent>
            {rules.length === 0 ? (
              <p className="text-sm text-muted-foreground">No workflow rules yet. Create one above to start automating.</p>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{rule.name}</p>
                        <Badge variant="secondary">{rule.triggerEvent.replace(/_/g, " ")}</Badge>
                        <Badge variant="outline">{rule.action.replace(/_/g, " ")}</Badge>
                        <Badge variant={rule.active ? "success" : "outline"}>
                          {rule.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        When <span className="font-mono text-xs">{rule.triggerEvent.replace(/_/g, " ")}</span>
                        {rule.triggerCondition && Object.keys(rule.triggerCondition).length > 0 && (
                          <> where <span className="font-mono text-xs">{summarizeCondition(rule.triggerCondition)}</span></>
                        )}
                        {" → "}
                        <span className="font-mono text-xs">{summarizeAction(rule.action, rule.actionConfig)}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Form method="post">
                        <input type="hidden" name="intent" value="toggleActive" />
                        <input type="hidden" name="ruleId" value={rule.id} />
                        <input type="hidden" name="active" value={String(rule.active)} />
                        <Button type="submit" variant="ghost" size="sm">
                          {rule.active ? "Disable" : "Enable"}
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent workflow logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Recent Workflow Executions
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