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
import { ArrowLeft, ChevronDown, Bell, Filter, Rocket } from "lucide-react";
import { useState } from "react";

// ── Constants ──────────────────────────────────────────────────

const TRIGGER_OPTIONS = [
  { value: "LEAD_CREATED", label: "A lead is created" },
  { value: "STAGE_CHANGED", label: "A lead's stage changes" },
  { value: "TEMPERATURE_CHANGED", label: "A lead's temperature changes" },
  { value: "LEAD_APPROVED", label: "A lead is approved" },
  { value: "LEAD_SCORED", label: "A lead is scored" },
] as const;

const ACTION_OPTIONS = [
  { value: "ASSIGN_TO_USER", label: "Assign the lead to a user" },
  { value: "SEND_NOTIFICATION", label: "Send a notification" },
  { value: "UPDATE_FIELD", label: "Update a lead field" },
  { value: "ADD_NOTE", label: "Add a note to the lead" },
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

// ── Step dot component ────────────────────────────────────────

function StepDot({ n, color }: { n: 1 | 2 | 3; color: "blue" | "amber" | "emerald" }) {
  const bg: Record<string, string> = { blue: "bg-blue-500/20", amber: "bg-amber-500/20", emerald: "bg-emerald-500/20" };
  const text: Record<string, string> = { blue: "text-blue-400", amber: "text-amber-400", emerald: "text-emerald-400" };
  return (
    <div className={`flex h-7 w-7 items-center justify-center rounded-full ${bg[color]}`}>
      <span className={`text-xs font-bold ${text[color]}`}>{n}</span>
    </div>
  );
}

function StepConnector() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="h-5 w-px bg-border" />
      <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
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

  // Build triggerCondition from structured fields
  let triggerCondition: Record<string, string> | null = null;
  if (triggerEvent === "STAGE_CHANGED") {
    const toStage = formData.get("conditionToStage") as string;
    if (toStage) triggerCondition = { toStage };
  } else if (triggerEvent === "TEMPERATURE_CHANGED" || triggerEvent === "LEAD_SCORED") {
    const temperature = formData.get("conditionTemperature") as string;
    if (temperature) triggerCondition = { temperature };
  }

  // Build actionConfig from structured fields
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

  // Step 1 state
  const [triggerEvent, setTriggerEvent] = useState("LEAD_CREATED");

  // Step 2 state
  const [conditionToStage, setConditionToStage] = useState("");
  const [conditionTemperature, setConditionTemperature] = useState("");

  // Step 3 state
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

  return (
    <AppShell user={user!}>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/workflows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Workflow</h1>
            <p className="text-muted-foreground">When this happens, do that</p>
          </div>
        </div>

        {actionData?.error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-0">
          <input type="hidden" name="intent" value="create" />

          {/* Workflow name */}
          <Card className="mb-4">
            <CardContent className="pt-6">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder='e.g., "Assign HOT leads to sales manager"'
                className="mt-1.5"
              />
            </CardContent>
          </Card>

          {/* Step 1: When this happens */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <StepDot n={1} color="blue" />
                <CardTitle className="text-sm font-semibold">When this happens</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Label>Trigger Event</Label>
              <Select name="triggerEvent" value={triggerEvent} onChange={handleTriggerChange} className="mt-1.5">
                {TRIGGER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </CardContent>
          </Card>

          <StepConnector />

          {/* Step 2: Filter conditions (conditional) */}
          {showFilter ? (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2.5">
                    <StepDot n={2} color="amber" />
                    <CardTitle className="text-sm font-semibold">Filter conditions</CardTitle>
                    <Badge variant="outline" className="text-[10px] ml-auto">Optional</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {triggerEvent === "STAGE_CHANGED" ? (
                    <>
                      <Label>Only when stage changes to</Label>
                      <Select name="conditionToStage" value={conditionToStage} onChange={(e) => setConditionToStage(e.target.value)} className="mt-1.5">
                        <option value="">Any stage</option>
                        {stages.map((s) => (
                          <option key={s.name} value={s.name}>{s.label}</option>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <>
                      <Label>Only when temperature is</Label>
                      <Select name="conditionTemperature" value={conditionTemperature} onChange={(e) => setConditionTemperature(e.target.value)} className="mt-1.5">
                        <option value="">Any temperature</option>
                        {TEMPERATURES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </Select>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Leave unselected to match all.
                  </p>
                </CardContent>
              </Card>
              <StepConnector />
            </>
          ) : null}

          {/* Step 3: Then do this */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <StepDot n={3} color="emerald" />
                <CardTitle className="text-sm font-semibold">Then do this</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Action</Label>
                <Select name="actionType" value={actionType} onChange={handleActionChange} className="mt-1.5">
                  {ACTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>

              {/* Dynamic action config */}
              {actionType === "ASSIGN_TO_USER" && (
                <div>
                  <Label>Assign to</Label>
                  <Select name="configUserId" value={configUserId} onChange={(e) => setConfigUserId(e.target.value)} className="mt-1.5">
                    <option value="">Select a user...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name || u.email}</option>
                    ))}
                  </Select>
                </div>
              )}

              {actionType === "SEND_NOTIFICATION" && (
                <div>
                  <Label>Message</Label>
                  <Textarea
                    name="configMessage"
                    value={configMessage}
                    onChange={(e) => setConfigMessage(e.target.value)}
                    placeholder="Enter the notification message..."
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              )}

              {actionType === "UPDATE_FIELD" && (
                <>
                  <div>
                    <Label>Field to update</Label>
                    <Select name="configField" value={configField} onChange={handleFieldChange} className="mt-1.5">
                      {UPDATE_FIELDS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label>Set value to</Label>
                    {valueInputType === "select" ? (
                      <Select name="configValue" value={configValue} onChange={(e) => setConfigValue(e.target.value)} className="mt-1.5">
                        <option value="">Select...</option>
                        {configField === "stage"
                          ? stages.map((s) => (
                              <option key={s.name} value={s.name}>{s.label}</option>
                            ))
                          : ((selectedFieldDef as any)?.options || []).map((opt: { value: string; label: string }) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                      </Select>
                    ) : valueInputType === "textarea" ? (
                      <Textarea
                        name="configValue"
                        value={configValue}
                        onChange={(e) => setConfigValue(e.target.value)}
                        placeholder={`Enter new ${selectedFieldDef?.label?.toLowerCase()}...`}
                        className="mt-1.5"
                        rows={2}
                      />
                    ) : (
                      <Input
                        name="configValue"
                        type="text"
                        value={configValue}
                        onChange={(e) => setConfigValue(e.target.value)}
                        placeholder={`Enter new ${selectedFieldDef?.label?.toLowerCase()}...`}
                        className="mt-1.5"
                      />
                    )}
                  </div>
                </>
              )}

              {actionType === "ADD_NOTE" && (
                <div>
                  <Label>Note text</Label>
                  <Textarea
                    name="configNote"
                    value={configNote}
                    onChange={(e) => setConfigNote(e.target.value)}
                    placeholder="Enter the note to add to the lead..."
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="pt-6">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create Workflow"}
            </Button>
          </div>
        </Form>
      </div>
    </AppShell>
  );
}