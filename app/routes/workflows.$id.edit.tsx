import { Form, Link, useActionData, useLoaderData, useNavigation, redirect } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { getStagesWithMeta } from "../lib/stages.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import {
  ArrowLeft,
  Filter,
  Rocket,
  Zap,
  AlertTriangle,
  Trash2,
  GripVertical,
  Plus,
  User,
  MessageSquare,
  PenSquare,
  StickyNote,
  Mail,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

// ── Constants (shared with workflows.new.tsx) ──────────────────

const TRIGGER_OPTIONS = [
  { value: "LEAD_CREATED", label: "A lead is created" },
  { value: "STAGE_CHANGED", label: "A lead's stage changes" },
  { value: "TEMPERATURE_CHANGED", label: "A lead's temperature changes" },
  { value: "LEAD_APPROVED", label: "A lead is approved" },
  { value: "LEAD_SCORED", label: "A lead is scored" },
] as const;

const ACTION_TYPES = [
  { value: "ASSIGN_TO_USER", label: "Assign to a user", icon: User, color: "violet" },
  { value: "SEND_NOTIFICATION", label: "Send a notification", icon: MessageSquare, color: "sky" },
  { value: "UPDATE_FIELD", label: "Update a lead field", icon: PenSquare, color: "amber" },
  { value: "ADD_NOTE", label: "Add a note", icon: StickyNote, color: "emerald" },
  { value: "SEND_EMAIL", label: "Send an email", icon: Mail, color: "rose" },
] as const;

const TEMPERATURES = [
  { value: "HOT", label: "HOT" },
  { value: "WARM", label: "WARM" },
  { value: "COLD", label: "COLD" },
] as const;

const UPDATE_FIELDS = [
  { value: "stage", label: "Stage", type: "select" as const, options: [] as { value: string; label: string }[] },
  { value: "status", label: "Status", type: "select" as const, options: [
    { value: "INBOX", label: "Inbox" },
    { value: "ACTIVE", label: "Active" },
    { value: "REJECTED", label: "Rejected" },
  ]},
  { value: "temperature", label: "Temperature", type: "select" as const, options: TEMPERATURES },
  { value: "leadSource", label: "Lead Source", type: "text" as const },
  { value: "industry", label: "Industry", type: "text" as const },
  { value: "notes", label: "Notes", type: "textarea" as const },
] as const;

const TRIGGERS_WITH_CONDITION = new Set(["STAGE_CHANGED", "TEMPERATURE_CHANGED", "LEAD_SCORED"]);

const COLOR_MAP: Record<string, string> = {
  violet: "bg-violet-500/5 border-violet-500/10",
  sky: "bg-sky-500/5 border-sky-500/10",
  amber: "bg-amber-500/5 border-amber-500/10",
  emerald: "bg-emerald-500/5 border-emerald-500/10",
  rose: "bg-rose-500/5 border-rose-500/10",
};

const TEXT_COLOR_MAP: Record<string, string> = {
  violet: "text-violet-400",
  sky: "text-sky-400",
  amber: "text-amber-400",
  emerald: "text-emerald-400",
  rose: "text-rose-400",
};

// ── Action step type ──────────────────────────────────────────

interface ActionStep {
  id: string;
  dbId?: string; // existing DB id for updates
  type: string;
  configUserId: string;
  configMessage: string;
  configField: string;
  configValue: string;
  configNote: string;
  configFromUserId: string;
  configSubject: string;
  configBody: string;
}

function makeActionStep(type = "ASSIGN_TO_USER"): ActionStep {
  return {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    configUserId: "",
    configMessage: "",
    configField: "stage",
    configValue: "",
    configNote: "",
    configFromUserId: "",
    configSubject: "",
    configBody: "",
  };
}

function configFromStep(step: ActionStep): Record<string, unknown> | null {
  switch (step.type) {
    case "ASSIGN_TO_USER":
      return step.configUserId ? { userId: step.configUserId } : null;
    case "SEND_NOTIFICATION":
      return step.configMessage.trim() ? { message: step.configMessage.trim() } : null;
    case "UPDATE_FIELD":
      return (step.configField && step.configValue.trim()) ? { field: step.configField, value: step.configValue.trim() } : null;
    case "ADD_NOTE":
      return step.configNote.trim() ? { note: step.configNote.trim() } : null;
    case "SEND_EMAIL":
      return (step.configFromUserId && step.configSubject.trim() && step.configBody.trim())
        ? { fromUserId: step.configFromUserId, subject: step.configSubject.trim(), body: step.configBody.trim() }
        : null;
    default:
      return null;
  }
}

// ── Loader ────────────────────────────────────────────────────

export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  const userId = await requireAdmin(request);

  const [user, users, stages, gmailTokens, rule] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    getStagesWithMeta(),
    prisma.gmailToken.findMany({
      select: { userId: true, gmailAddress: true },
    }),
    prisma.workflowRule.findUnique({
      where: { id: params.id },
      include: { actions: { orderBy: { order: "asc" } } },
    }),
  ]);

  if (!rule) {
    throw new Response("Workflow not found", { status: 404 });
  }

  const gmailUserIds = new Set(gmailTokens.map((t) => t.userId));
  const gmailAddressMap = new Map(gmailTokens.map((t) => [t.userId, t.gmailAddress || "Gmail connected"]));

  // Convert DB actions to ActionStep state
  const actionSteps: ActionStep[] = rule.actions.length > 0
    ? rule.actions.map((a) => {
        const c = a.config as Record<string, unknown>;
        return {
          id: `act_${a.id}`,
          dbId: a.id,
          type: a.type,
          configUserId: (c.userId as string) || "",
          configMessage: (c.message as string) || "",
          configField: (c.field as string) || "stage",
          configValue: (c.value as string) || "",
          configNote: (c.note as string) || "",
          configFromUserId: (c.fromUserId as string) || "",
          configSubject: (c.subject as string) || "",
          configBody: (c.body as string) || "",
        };
      })
    : // Legacy fallback: single action/actionConfig
      [{
        id: `act_legacy_${rule.id}`,
        type: rule.action || "ASSIGN_TO_USER",
        configUserId: ((rule.actionConfig as any)?.userId as string) || "",
        configMessage: ((rule.actionConfig as any)?.message as string) || "",
        configField: ((rule.actionConfig as any)?.field as string) || "stage",
        configValue: ((rule.actionConfig as any)?.value as string) || "",
        configNote: ((rule.actionConfig as any)?.note as string) || "",
        configFromUserId: ((rule.actionConfig as any)?.fromUserId as string) || "",
        configSubject: ((rule.actionConfig as any)?.subject as string) || "",
        configBody: ((rule.actionConfig as any)?.body as string) || "",
      }];

  const triggerCondition = rule.triggerCondition as Record<string, string> | null;

  return { user, users, stages, gmailUserIds, gmailAddressMap, rule, actionSteps, triggerCondition };
}

// ── Action ────────────────────────────────────────────────────

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "deleteWorkflow") {
    await prisma.workflowRule.delete({ where: { id: params.id } });
    return redirect("/workflows");
  }

  if (intent !== "update") return {};

  const name = formData.get("name") as string;
  const triggerEvent = formData.get("triggerEvent") as string;
  const actionsJson = formData.get("actions") as string;

  if (!name?.trim() || !triggerEvent) {
    return { error: "Name and trigger event are required" };
  }

  let actions: Array<{ type: string; config: Record<string, unknown> }>;
  try {
    actions = JSON.parse(actionsJson || "[]");
  } catch {
    return { error: "Invalid action data" };
  }

  if (actions.length === 0) {
    return { error: "At least one action is required" };
  }

  // Validate SEND_EMAIL actions
  for (const act of actions) {
    if (act.type === "SEND_EMAIL") {
      const fromUserId = act.config.fromUserId as string;
      const senderToken = await prisma.gmailToken.findUnique({ where: { userId: fromUserId } });
      if (!senderToken) {
        return { error: "The selected email sender does not have Gmail connected." };
      }
    }
  }

  let triggerCondition: Record<string, string> | null = null;
  if (triggerEvent === "STAGE_CHANGED") {
    const toStage = formData.get("conditionToStage") as string;
    if (toStage) triggerCondition = { toStage };
  } else if (triggerEvent === "TEMPERATURE_CHANGED" || triggerEvent === "LEAD_SCORED") {
    const temperature = formData.get("conditionTemperature") as string;
    if (temperature) triggerCondition = { temperature };
  }

  try {
    // Delete existing actions and recreate
    await prisma.workflowAction.deleteMany({ where: { ruleId: params.id } });
    await prisma.workflowRule.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        triggerEvent,
        triggerCondition: triggerCondition as any,
        actions: {
          create: actions.map((act, i) => ({
            type: act.type,
            config: act.config as any,
            order: i,
          })),
        },
      },
    });
  } catch (err) {
    console.error("[workflows] Failed to update rule:", err);
    return { error: "Failed to update workflow rule." };
  }

  return redirect("/workflows");
}

// ── Action config component (shared with new page) ───────────

function ActionConfigFields({ step, onChange, users, stages, gmailUserIds, gmailAddressMap }: {
  step: ActionStep;
  onChange: (updated: ActionStep) => void;
  users: { id: string; name: string; email: string }[];
  stages: { name: string; label: string }[];
  gmailUserIds: Set<string>;
  gmailAddressMap: Map<string, string>;
}) {
  const selectedFieldDef = UPDATE_FIELDS.find((f) => f.value === step.configField);
  const valueInputType = selectedFieldDef?.type || "text";

  return (
    <div className="space-y-3">
      {step.type === "ASSIGN_TO_USER" && (
        <Select value={step.configUserId} onChange={(e) => onChange({ ...step, configUserId: e.target.value })} className="bg-background/50 border-border/60">
          <option value="">Select a user...</option>
          {users.map((u) => (<option key={u.id} value={u.id}>{u.name || u.email}</option>))}
        </Select>
      )}
      {step.type === "SEND_NOTIFICATION" && (
        <Textarea value={step.configMessage} onChange={(e) => onChange({ ...step, configMessage: e.target.value })} placeholder="Enter the notification message..." className="bg-background/50 border-border/60" rows={3} />
      )}
      {step.type === "UPDATE_FIELD" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-medium">Field</Label>
            <Select value={step.configField} onChange={(e) => onChange({ ...step, configField: e.target.value, configValue: "" })} className="mt-1 bg-background/50 border-border/60">
              {UPDATE_FIELDS.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium">Value</Label>
            {valueInputType === "select" ? (
              <Select value={step.configValue} onChange={(e) => onChange({ ...step, configValue: e.target.value })} className="mt-1 bg-background/50 border-border/60">
                <option value="">Select...</option>
                {step.configField === "stage"
                  ? stages.map((s) => (<option key={s.name} value={s.name}>{s.label}</option>))
                  : ((selectedFieldDef as any)?.options || []).map((opt: { value: string; label: string }) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </Select>
            ) : valueInputType === "textarea" ? (
              <Textarea value={step.configValue} onChange={(e) => onChange({ ...step, configValue: e.target.value })} placeholder={`Enter new ${selectedFieldDef?.label?.toLowerCase()}...`} className="mt-1 bg-background/50 border-border/60" rows={2} />
            ) : (
              <Input type="text" value={step.configValue} onChange={(e) => onChange({ ...step, configValue: e.target.value })} placeholder={`Enter new ${selectedFieldDef?.label?.toLowerCase()}...`} className="mt-1 bg-background/50 border-border/60" />
            )}
          </div>
        </div>
      )}
      {step.type === "ADD_NOTE" && (
        <Textarea value={step.configNote} onChange={(e) => onChange({ ...step, configNote: e.target.value })} placeholder="Enter the note to add..." className="bg-background/50 border-border/60" rows={3} />
      )}
      {step.type === "SEND_EMAIL" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-medium">Send from</Label>
            <Select value={step.configFromUserId} onChange={(e) => onChange({ ...step, configFromUserId: e.target.value })} className="mt-1 bg-background/50 border-border/60">
              <option value="">Select a sender...</option>
              {users.map((u) => (<option key={u.id} value={u.id} disabled={!gmailUserIds.has(u.id)}>{u.name || u.email}{gmailUserIds.has(u.id) ? ` (${gmailAddressMap.get(u.id)})` : " — Gmail not connected"}</option>))}
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium">Subject</Label>
            <Input type="text" value={step.configSubject} onChange={(e) => onChange({ ...step, configSubject: e.target.value })} placeholder='e.g. "Re: {{companyName}}"' className="mt-1 bg-background/50 border-border/60" />
          </div>
          <div>
            <Label className="text-xs font-medium">Body</Label>
            <Textarea value={step.configBody} onChange={(e) => onChange({ ...step, configBody: e.target.value })} placeholder="Hi {{contactName}}..." className="mt-1 bg-background/50 border-border/60" rows={4} />
            <p className="text-[11px] text-muted-foreground mt-1">Variables: {"{{companyName}}"}, {"{{contactName}}"}, {"{{email}}"}, {"{{industry}}"}, {"{{stage}}"}, {"{{website}}"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────

export default function WorkflowsEditPage() {
  const { user, users, stages, gmailUserIds, gmailAddressMap, rule, actionSteps: initialSteps, triggerCondition: initialCondition } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [triggerEvent, setTriggerEvent] = useState(rule.triggerEvent);
  const [conditionToStage, setConditionToStage] = useState((initialCondition as any)?.toStage || "");
  const [conditionTemperature, setConditionTemperature] = useState((initialCondition as any)?.temperature || "");
  const [actionSteps, setActionSteps] = useState<ActionStep[]>(initialSteps as ActionStep[]);

  const showFilter = TRIGGERS_WITH_CONDITION.has(triggerEvent);

  function addAction() { setActionSteps((prev) => [...prev, makeActionStep()]); }
  function removeAction(id: string) { setActionSteps((prev) => prev.filter((s) => s.id !== id)); }
  function updateAction(updated: ActionStep) { setActionSteps((prev) => prev.map((s) => (s.id === updated.id ? updated : s))); }
  function changeActionType(id: string, newType: string) { setActionSteps((prev) => prev.map((s) => (s.id === id ? { ...makeActionStep(newType), id: s.id } : s))); }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const items = Array.from(actionSteps);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setActionSteps(items);
  }

  const actionsPayload = actionSteps.map((s) => configFromStep(s)).filter(Boolean) as Array<{ type: string; config: Record<string, unknown> }>;

  return (
    <AppShell user={user!}>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/workflows">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Edit Workflow</h1>
            <p className="text-muted-foreground mt-0.5">{rule.name}</p>
          </div>
        </div>

        {actionData?.error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-400 flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 shrink-0" />{actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-0">
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="actions" value={JSON.stringify(actionsPayload)} />

          {/* Name */}
          <Card className="mb-4 border-border/40 bg-gradient-to-br from-card/80 to-card/40">
            <CardContent className="pt-6">
              <Label htmlFor="name" className="text-sm font-semibold">Workflow Name</Label>
              <Input id="name" name="name" type="text" required defaultValue={rule.name} className="mt-2 bg-background/50 border-border/60" />
            </CardContent>
          </Card>

          {/* Trigger */}
          <Card className="border-border/40 bg-gradient-to-br from-card/80 to-card/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-blue-500/15 text-blue-400 border-blue-500/20 w-fit">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5"><span className="text-xs font-bold">1</span></div>
                <span className="text-sm font-semibold">When this happens</span>
                <Zap className="h-3.5 w-3.5 opacity-60" />
              </div>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium">Trigger Event</Label>
              <Select name="triggerEvent" value={triggerEvent} onChange={(e) => { setTriggerEvent(e.target.value); setConditionToStage(""); setConditionTemperature(""); }} className="mt-2 bg-background/50 border-border/60">
                {TRIGGER_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </Select>
            </CardContent>
          </Card>

          {/* Filter (conditional) */}
          {showFilter ? (
            <Card className="mt-3 border-border/40 bg-gradient-to-br from-card/80 to-card/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-amber-500/15 text-amber-400 border-amber-500/20">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5"><span className="text-xs font-bold">2</span></div>
                    <span className="text-sm font-semibold">Filter</span>
                    <Filter className="h-3.5 w-3.5 opacity-60" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">Optional</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {triggerEvent === "STAGE_CHANGED" ? (
                  <div>
                    <Label className="text-sm font-medium">Only when stage changes to</Label>
                    <Select name="conditionToStage" value={conditionToStage} onChange={(e) => setConditionToStage(e.target.value)} className="mt-2 bg-background/50 border-border/60">
                      <option value="">Any stage</option>
                      {stages.map((s) => (<option key={s.name} value={s.name}>{s.label}</option>))}
                    </Select>
                  </div>
                ) : (
                  <div>
                    <Label className="text-sm font-medium">Only when temperature is</Label>
                    <Select name="conditionTemperature" value={conditionTemperature} onChange={(e) => setConditionTemperature(e.target.value)} className="mt-2 bg-background/50 border-border/60">
                      <option value="">Any temperature</option>
                      {TEMPERATURES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Actions */}
          <Card className="mt-3 border-border/40 bg-gradient-to-br from-card/80 to-card/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-emerald-500/15 text-emerald-400 border-emerald-500/20 w-fit">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5"><span className="text-xs font-bold">{showFilter ? "3" : "2"}</span></div>
                <span className="text-sm font-semibold">Then do these</span>
                <Rocket className="h-3.5 w-3.5 opacity-60" />
              </div>
              <CardDescription className="mt-2 pl-1">Add, remove, or reorder action steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="actions">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                      {actionSteps.map((step, index) => {
                        const actionDef = ACTION_TYPES.find((a) => a.value === step.type);
                        const Icon = actionDef?.icon || Zap;
                        const color = actionDef?.color || "slate";
                        return (
                          <Draggable key={step.id} draggableId={step.id} index={index}>
                            {(dragProvided, dragSnapshot) => (
                              <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} className={`rounded-xl border border-border/40 bg-card/60 p-4 space-y-3 transition-shadow ${dragSnapshot.isDragging ? "shadow-lg" : ""}`}>
                                <div className="flex items-center gap-2">
                                  <div {...dragProvided.dragHandleProps} className="cursor-grab text-muted-foreground/30 hover:text-muted-foreground shrink-0">
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                  <div className={`flex h-6 w-6 items-center justify-center rounded-md ${COLOR_MAP[color] || "bg-muted"}`}>
                                    <Icon className={`h-3 w-3 ${TEXT_COLOR_MAP[color] || "text-muted-foreground"}`} />
                                  </div>
                                  <Badge variant="outline" className="text-[10px] tabular-nums">Step {index + 1}</Badge>
                                  <Select value={step.type} onChange={(e) => changeActionType(step.id, e.target.value)} className="flex-1 bg-background/50 border-border/60 h-8 text-sm">
                                    {ACTION_TYPES.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                  </Select>
                                  {actionSteps.length > 1 && (
                                    <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground/40 hover:text-red-400 shrink-0" onClick={() => removeAction(step.id)}>
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                                <ActionConfigFields step={step} onChange={updateAction} users={users} stages={stages} gmailUserIds={gmailUserIds} gmailAddressMap={gmailAddressMap} />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <Button type="button" variant="outline" onClick={addAction} className="w-full border-dashed border-border/60 text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4 mr-2" />Add Action Step
              </Button>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="pt-6 pb-2 flex gap-3">
            <Button type="submit" disabled={isSubmitting || actionsPayload.length === 0} className="flex-1 h-11 text-base font-semibold shadow-lg shadow-primary/5 hover:shadow-primary/10">
              {isSubmitting ? (
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 animate-spin" />Saving...</span>
              ) : (
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Save Changes</span>
              )}
            </Button>
            <Form method="post" className="inline">
              <input type="hidden" name="intent" value="deleteWorkflow" />
              <Button type="submit" variant="outline" className="text-red-400 hover:text-red-300 hover:border-red-500/30" disabled={isSubmitting}>
                <Trash2 className="h-4 w-4 mr-2" />Delete
              </Button>
            </Form>
          </div>
        </Form>
      </div>
    </AppShell>
  );
}