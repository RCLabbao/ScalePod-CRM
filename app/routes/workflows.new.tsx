import { Form, Link, useActionData, useLoaderData, useNavigation, redirect } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { getStagesWithMeta } from "../lib/stages.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import {
  ArrowLeft,
  ChevronDown,
  Bell,
  Filter,
  Rocket,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  User,
  MessageSquare,
  PenSquare,
  StickyNote,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

// ── Constants ──────────────────────────────────────────────────

const TRIGGER_OPTIONS = [
  { value: "LEAD_CREATED", label: "A lead is created", icon: Sparkles },
  { value: "STAGE_CHANGED", label: "A lead's stage changes", icon: ArrowRight },
  { value: "TEMPERATURE_CHANGED", label: "A lead's temperature changes", icon: Zap },
  { value: "LEAD_APPROVED", label: "A lead is approved", icon: CheckCircle2 },
  { value: "LEAD_SCORED", label: "A lead is scored", icon: Zap },
] as const;

const ACTION_OPTIONS = [
  { value: "ASSIGN_TO_USER", label: "Assign the lead to a user", icon: User },
  { value: "SEND_NOTIFICATION", label: "Send a notification", icon: MessageSquare },
  { value: "UPDATE_FIELD", label: "Update a lead field", icon: PenSquare },
  { value: "ADD_NOTE", label: "Add a note to the lead", icon: StickyNote },
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

const STEP_META = [
  { n: 1, color: "blue", label: "Trigger", icon: Zap },
  { n: 2, color: "amber", label: "Filter", icon: Filter },
  { n: 3, color: "emerald", label: "Action", icon: Rocket },
] as const;

// ── Step connector ────────────────────────────────────────────

function StepConnector() {
  return (
    <div className="flex justify-center py-1">
      <div className="flex flex-col items-center">
        <div className="h-4 w-px bg-gradient-to-b from-border via-border to-transparent" />
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/30 -mt-1" />
      </div>
    </div>
  );
}

function StepBadge({ step }: { step: typeof STEP_META[number] }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  const Icon = step.icon;
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${colorMap[step.color]}`}>
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/5`}>
        <span className="text-xs font-bold">{step.n}</span>
      </div>
      <span className="text-sm font-semibold">{step.label}</span>
      <Icon className="h-3.5 w-3.5 opacity-60" />
    </div>
  );
}

// ── Loader ────────────────────────────────────────────────────

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);

  const [user, users, stages] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    getStagesWithMeta(),
  ]);

  return { user, users, stages };
}

// ── Action ────────────────────────────────────────────────────

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent !== "create") return {};

  const name = formData.get("name") as string;
  const triggerEvent = formData.get("triggerEvent") as string;
  const actionType = formData.get("actionType") as string;

  if (!name?.trim() || !triggerEvent || !actionType) {
    return { error: "Name, trigger event, and action are required" };
  }

  let triggerCondition: Record<string, string> | null = null;
  if (triggerEvent === "STAGE_CHANGED") {
    const toStage = formData.get("conditionToStage") as string;
    if (toStage) triggerCondition = { toStage };
  } else if (triggerEvent === "TEMPERATURE_CHANGED" || triggerEvent === "LEAD_SCORED") {
    const temperature = formData.get("conditionTemperature") as string;
    if (temperature) triggerCondition = { temperature };
  }

  let actionConfig: Record<string, unknown> = {};
  switch (actionType) {
    case "ASSIGN_TO_USER": {
      const userId = formData.get("configUserId") as string;
      if (!userId) return { error: "Please select a user to assign" };
      actionConfig = { userId };
      break;
    }
    case "SEND_NOTIFICATION": {
      const message = formData.get("configMessage") as string;
      if (!message?.trim()) return { error: "Please enter a notification message" };
      actionConfig = { message: message.trim() };
      break;
    }
    case "UPDATE_FIELD": {
      const field = formData.get("configField") as string;
      const value = formData.get("configValue") as string;
      if (!field || !value?.trim()) return { error: "Please select a field and enter a value" };
      actionConfig = { field, value: value.trim() };
      break;
    }
    case "ADD_NOTE": {
      const note = formData.get("configNote") as string;
      if (!note?.trim()) return { error: "Please enter note text" };
      actionConfig = { note: note.trim() };
      break;
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

  return redirect("/workflows");
}

// ── Page Component ────────────────────────────────────────────

export default function WorkflowsNewPage() {
  const { user, users, stages } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const [triggerEvent, setTriggerEvent] = useState("LEAD_CREATED");
  const [conditionToStage, setConditionToStage] = useState("");
  const [conditionTemperature, setConditionTemperature] = useState("");

  const [actionType, setActionType] = useState("ASSIGN_TO_USER");
  const [configUserId, setConfigUserId] = useState("");
  const [configMessage, setConfigMessage] = useState("");
  const [configField, setConfigField] = useState("stage");
  const [configValue, setConfigValue] = useState("");
  const [configNote, setConfigNote] = useState("");

  const showFilter = TRIGGERS_WITH_CONDITION.has(triggerEvent);
  const selectedFieldDef = UPDATE_FIELDS.find((f) => f.value === configField);
  const valueInputType = selectedFieldDef?.type || "text";

  function handleTriggerChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setTriggerEvent(e.target.value);
    setConditionToStage("");
    setConditionTemperature("");
  }

  function handleActionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setActionType(e.target.value);
    setConfigUserId("");
    setConfigMessage("");
    setConfigField("stage");
    setConfigValue("");
    setConfigNote("");
  }

  function handleFieldChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setConfigField(e.target.value);
    setConfigValue("");
  }

  const triggerIcon = TRIGGER_OPTIONS.find((t) => t.value === triggerEvent)?.icon || Zap;
  const TriggerIcon = triggerIcon;

  return (
    <AppShell user={user!}>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/workflows">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/80">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Workflow</h1>
            <p className="text-muted-foreground mt-0.5">Build an automation rule in 3 steps</p>
          </div>
        </div>

        {actionData?.error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-400 flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-0">
          <input type="hidden" name="intent" value="create" />

          {/* Workflow name */}
          <Card className="mb-4 border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500/40 via-violet-500/40 to-emerald-500/40" />
            <CardContent className="pt-6">
              <Label htmlFor="name" className="text-sm font-semibold">Workflow Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder='e.g., "Assign HOT leads to sales manager"'
                className="mt-2 bg-background/50 border-border/60 focus:border-primary/40 focus:ring-primary/20"
              />
            </CardContent>
          </Card>

          {/* Step 1: Trigger */}
          <Card className="border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-blue-500/20">
            <CardHeader className="pb-3">
              <StepBadge step={STEP_META[0]} />
              <CardDescription className="mt-2 pl-1">Choose the event that starts this workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium">Trigger Event</Label>
              <Select
                name="triggerEvent"
                value={triggerEvent}
                onChange={handleTriggerChange}
                className="mt-2 bg-background/50 border-border/60 focus:border-blue-500/40"
              >
                {TRIGGER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>

              {/* Selected trigger summary */}
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-blue-500/5 border border-blue-500/10 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                  <TriggerIcon className="h-4 w-4" />
                </div>
                <p className="text-xs text-blue-400/80">
                  This workflow will run every time a lead
                  {triggerEvent === "LEAD_CREATED" && " is created"}
                  {triggerEvent === "STAGE_CHANGED" && " moves to a different stage"}
                  {triggerEvent === "TEMPERATURE_CHANGED" && "'s temperature changes"}
                  {triggerEvent === "LEAD_APPROVED" && " is approved"}
                  {triggerEvent === "LEAD_SCORED" && " is scored"}
                </p>
              </div>
            </CardContent>
          </Card>

          <StepConnector />

          {/* Step 2: Filter */}
          {showFilter ? (
            <>
              <Card className="border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-amber-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <StepBadge step={STEP_META[1]} />
                    <Badge variant="outline" className="text-[10px] border-muted-foreground/20">Optional</Badge>
                  </div>
                  <CardDescription className="mt-2 pl-1">Narrow down when this workflow should run</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {triggerEvent === "STAGE_CHANGED" ? (
                    <div>
                      <Label className="text-sm font-medium">Only when stage changes to</Label>
                      <Select
                        name="conditionToStage"
                        value={conditionToStage}
                        onChange={(e) => setConditionToStage(e.target.value)}
                        className="mt-2 bg-background/50 border-border/60"
                      >
                        <option value="">Any stage</option>
                        {stages.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  ) : (
                    <div>
                      <Label className="text-sm font-medium">Only when temperature is</Label>
                      <Select
                        name="conditionTemperature"
                        value={conditionTemperature}
                        onChange={(e) => setConditionTemperature(e.target.value)}
                        className="mt-2 bg-background/50 border-border/60"
                      >
                        <option value="">Any temperature</option>
                        {TEMPERATURES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Leave unselected to match all {triggerEvent === "STAGE_CHANGED" ? "stages" : "temperatures"}.
                  </p>
                </CardContent>
              </Card>
              <StepConnector />
            </>
          ) : null}

          {/* Step 3: Action */}
          <Card className="border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-emerald-500/20">
            <CardHeader className="pb-3">
              <StepBadge step={STEP_META[2]} />
              <CardDescription className="mt-2 pl-1">Choose what happens when the trigger fires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-sm font-medium">Action</Label>
                <Select
                  name="actionType"
                  value={actionType}
                  onChange={handleActionChange}
                  className="mt-2 bg-background/50 border-border/60"
                >
                  {ACTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Dynamic action config */}
              {actionType === "ASSIGN_TO_USER" && (
                <div className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-violet-400" />
                    <span className="text-sm font-medium text-violet-400/90">Assign to</span>
                  </div>
                  <Select
                    name="configUserId"
                    value={configUserId}
                    onChange={(e) => setConfigUserId(e.target.value)}
                    className="bg-background/50 border-border/60"
                  >
                    <option value="">Select a user...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name || u.email}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {actionType === "SEND_NOTIFICATION" && (
                <div className="rounded-xl bg-sky-500/5 border border-sky-500/10 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-sky-400" />
                    <span className="text-sm font-medium text-sky-400/90">Message</span>
                  </div>
                  <Textarea
                    name="configMessage"
                    value={configMessage}
                    onChange={(e) => setConfigMessage(e.target.value)}
                    placeholder="Enter the notification message..."
                    className="bg-background/50 border-border/60 min-h-[80px]"
                    rows={3}
                  />
                </div>
              )}

              {actionType === "UPDATE_FIELD" && (
                <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <PenSquare className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400/90">Field Update</span>
                  </div>

                  <div>
                    <Label className="text-xs font-medium">Field to update</Label>
                    <Select
                      name="configField"
                      value={configField}
                      onChange={handleFieldChange}
                      className="mt-1.5 bg-background/50 border-border/60"
                    >
                      {UPDATE_FIELDS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium">Set value to</Label>
                    {valueInputType === "select" ? (
                      <Select
                        name="configValue"
                        value={configValue}
                        onChange={(e) => setConfigValue(e.target.value)}
                        className="mt-1.5 bg-background/50 border-border/60"
                      >
                        <option value="">Select...</option>
                        {configField === "stage"
                          ? stages.map((s) => (
                              <option key={s.name} value={s.name}>
                                {s.label}
                              </option>
                            ))
                          : ((selectedFieldDef as any)?.options || []).map(
                              (opt: { value: string; label: string }) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              )
                            )}
                      </Select>
                    ) : valueInputType === "textarea" ? (
                      <Textarea
                        name="configValue"
                        value={configValue}
                        onChange={(e) => setConfigValue(e.target.value)}
                        placeholder={`Enter new ${selectedFieldDef?.label?.toLowerCase()}...`}
                        className="mt-1.5 bg-background/50 border-border/60 min-h-[60px]"
                        rows={2}
                      />
                    ) : (
                      <Input
                        name="configValue"
                        type="text"
                        value={configValue}
                        onChange={(e) => setConfigValue(e.target.value)}
                        placeholder={`Enter new ${selectedFieldDef?.label?.toLowerCase()}...`}
                        className="mt-1.5 bg-background/50 border-border/60"
                      />
                    )}
                  </div>
                </div>
              )}

              {actionType === "ADD_NOTE" && (
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400/90">Note</span>
                  </div>
                  <Textarea
                    name="configNote"
                    value={configNote}
                    onChange={(e) => setConfigNote(e.target.value)}
                    placeholder="Enter the note to add to the lead..."
                    className="bg-background/50 border-border/60 min-h-[80px]"
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="pt-6 pb-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  Create Workflow
                </span>
              )}
            </Button>
          </div>
        </Form>
      </div>
    </AppShell>
  );
}
