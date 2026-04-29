import { Form, Link, useActionData, useLoaderData, useNavigation, redirect } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { getStagesWithMeta, invalidateStagesCache, seedDefaultStages, checkTableExists } from "../lib/stages.server";
import { STAGE_COLOR_PALETTE, PALETTE_OPTIONS } from "../lib/stages";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Pencil,
  Save,
  X,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Palette,
} from "lucide-react";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

// ── Loader ────────────────────────────────────────────────────

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);

  const [user, stages] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true },
    }),
    getStagesWithMeta(),
  ]);

  // Seed default stages if the table is empty (ensures table exists)
  await seedDefaultStages();

  const leadCounts: Record<string, number> = {};
  for (const stage of stages) {
    try {
      leadCounts[stage.name] = await prisma.lead.count({
        where: { stage: stage.name },
      });
    } catch {
      leadCounts[stage.name] = 0;
    }
  }

  return { user, stages, leadCounts };
}

// ── Action ────────────────────────────────────────────────────

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  // Ensure the PipelineStage table exists before any mutations
  if (!(await checkTableExists())) {
    return { error: "The PipelineStage table does not exist in the database. Please run migration 005_pipeline_stages.sql first." };
  }
  await seedDefaultStages();

  try {
    if (intent === "addStage") {
      const name = (formData.get("name") as string)?.trim().toUpperCase().replace(/\s+/g, "_");
      const label = (formData.get("label") as string)?.trim();
      const colorKey = formData.get("colorKey") as string;

      if (!name || !label) {
        return { error: "Stage name and label are required" };
      }

      type StageRow = { id: string; name: string; label: string; colorKey: string; position: number };
      const existing = await prisma.$queryRaw<StageRow[]>`SELECT * FROM PipelineStage WHERE name = ${name} LIMIT 1`;
      if (existing.length > 0) {
        return { error: `A stage with name "${name}" already exists` };
      }

      const maxPosRows = await prisma.$queryRaw<{ maxPos: number | null }[]>`SELECT MAX(position) as maxPos FROM PipelineStage`;
      const nextPos = (maxPosRows[0]?.maxPos ?? -1) + 1;

      await prisma.$executeRaw`
        INSERT INTO PipelineStage (id, name, label, colorKey, position, createdAt, updatedAt)
        VALUES (${`stage_${name.toLowerCase()}`}, ${name}, ${label}, ${colorKey || "slate"}, ${nextPos}, NOW(), NOW())
      `;
      invalidateStagesCache();

      return redirect("/settings/stages");
    }

    if (intent === "editStage") {
      const id = formData.get("id") as string;
      const label = (formData.get("label") as string)?.trim();
      const colorKey = formData.get("colorKey") as string;
      const newName = (formData.get("name") as string)?.trim().toUpperCase().replace(/\s+/g, "_");

      if (!id || !label || !newName) {
        return { error: "All fields are required" };
      }

      type StageRow = { id: string; name: string; label: string; colorKey: string; position: number };
      const stageRows = await prisma.$queryRaw<StageRow[]>`SELECT * FROM PipelineStage WHERE id = ${id} LIMIT 1`;
      if (stageRows.length === 0) {
        return { error: "Stage not found" };
      }
      const stage = stageRows[0];

      if (newName !== stage.name) {
        const dupRows = await prisma.$queryRaw<StageRow[]>`SELECT * FROM PipelineStage WHERE name = ${newName} AND id != ${id} LIMIT 1`;
        if (dupRows.length > 0) {
          return { error: `A stage with name "${newName}" already exists` };
        }

        await prisma.$executeRaw`UPDATE PipelineStage SET name = ${newName}, label = ${label}, colorKey = ${colorKey}, updatedAt = NOW() WHERE id = ${id}`;
        await prisma.$executeRaw`UPDATE Lead SET stage = ${newName} WHERE stage = ${stage.name}`;
        await prisma.$executeRaw`UPDATE StageHistory SET fromStage = ${newName} WHERE fromStage = ${stage.name}`;
        await prisma.$executeRaw`UPDATE StageHistory SET toStage = ${newName} WHERE toStage = ${stage.name}`;
      } else {
        await prisma.$executeRaw`UPDATE PipelineStage SET label = ${label}, colorKey = ${colorKey}, updatedAt = NOW() WHERE id = ${id}`;
      }

      invalidateStagesCache();
      return redirect("/settings/stages");
    }

    if (intent === "deleteStage") {
      const id = formData.get("id") as string;

      type StageRow = { id: string; name: string; label: string };
      const stageRows = await prisma.$queryRaw<StageRow[]>`SELECT * FROM PipelineStage WHERE id = ${id} LIMIT 1`;
      if (stageRows.length === 0) {
        return { error: "Stage not found" };
      }
      const stage = stageRows[0];

      type CountRow = { cnt: bigint };
      const countRows = await prisma.$queryRaw<CountRow[]>`SELECT COUNT(*) as cnt FROM Lead WHERE stage = ${stage.name}`;
      const leadCount = Number(countRows[0]?.cnt ?? 0);
      if (leadCount > 0) {
        return {
          error: `Cannot delete "${stage.label}" — ${leadCount} lead${leadCount !== 1 ? "s" : ""} are currently in this stage. Move them first.`,
        };
      }

      await prisma.$executeRaw`DELETE FROM PipelineStage WHERE id = ${id}`;
      invalidateStagesCache();
      return redirect("/settings/stages");
    }

    if (intent === "reorderStages") {
      const orderJson = formData.get("order") as string;
      if (!orderJson) return { error: "No order provided" };

      const order: string[] = JSON.parse(orderJson);
      let updated = 0;
      for (let i = 0; i < order.length; i++) {
        const result = await prisma.$executeRaw`UPDATE PipelineStage SET position = ${i}, updatedAt = NOW() WHERE id = ${order[i]}`;
        updated += Number(result);
      }
      if (updated === 0) {
        return { error: `Reorder had no effect. IDs sent: [${order.join(", ")}]. The PipelineStage rows may have different IDs than what the frontend loaded.` };
      }
      invalidateStagesCache();
      return redirect("/settings/stages");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : "";
    return { error: `Failed to ${intent === "addStage" ? "create" : intent === "editStage" ? "update" : intent === "deleteStage" ? "delete" : "reorder"} stage.\n\nError: ${msg}\n\nStack: ${stack || "none"}` };
  }

  return {};
}

// ── Color swatch component ────────────────────────────────────

function ColorSwatch({ colorKey }: { colorKey: string }) {
  const classes = STAGE_COLOR_PALETTE[colorKey] || STAGE_COLOR_PALETTE.slate;
  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 rounded-full ${classes.dot} ring-2 ring-white/10`} />
      <span className="text-[11px] text-muted-foreground capitalize font-medium">{colorKey}</span>
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────

export default function SettingsStagesPage() {
  const { user, stages, leadCounts } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [localStages, setLocalStages] = useState(stages);
  const [editName, setEditName] = useState("");

  if (navigation.state === "idle" && localStages !== stages) {
    setLocalStages(stages);
    setEditingId(null);
    setShowAdd(false);
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const items = Array.from(localStages);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setLocalStages(items);
  }

  function submitReorder() {
    const form = document.getElementById("reorderForm") as HTMLFormElement;
    const orderInput = form.querySelector('[name="order"]') as HTMLInputElement;
    orderInput.value = JSON.stringify(localStages.map((s) => s.id));
    form.requestSubmit();
  }

  const orderChanged = localStages.some((s, i) => s.id !== stages[i]?.id);

  return (
    <AppShell user={user!}>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Modern Header */}
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/80">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-border/50">
                <Layers className="h-5 w-5 text-primary/80" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Pipeline Stages</h1>
            </div>
            <p className="text-muted-foreground text-sm pl-[52px]">
              Add, edit, and reorder your sales pipeline stages
            </p>
          </div>
          <Button
            onClick={() => { setShowAdd(!showAdd); setEditingId(null); }}
            size="sm"
            className="rounded-lg gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Stage
          </Button>
        </div>

        {actionData?.error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-400 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <pre className="whitespace-pre-wrap font-sans">{actionData.error}</pre>
          </div>
        )}

        {/* Add stage form */}
        {showAdd && (
          <Card className="border-border/40 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500/40 to-violet-500/40" />
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-400" />
                New Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="addStage" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-name" className="text-sm font-medium">Name (stored key)</Label>
                    <Input
                      id="add-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. NEGOTIATION"
                      className="mt-1.5 bg-background/50 border-border/60 uppercase"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Auto-formatted to UPPERCASE_SNAKE
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="add-label" className="text-sm font-medium">Display Label</Label>
                    <Input
                      id="add-label"
                      name="label"
                      type="text"
                      required
                      placeholder="e.g. Negotiation"
                      className="mt-1.5 bg-background/50 border-border/60"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="add-colorKey" className="text-sm font-medium">Color</Label>
                  <Select name="colorKey" defaultValue="slate" className="mt-1.5 bg-background/50 border-border/60">
                    {PALETTE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button type="submit" disabled={isSubmitting} size="sm" className="rounded-lg">
                    {isSubmitting ? "Creating..." : "Create Stage"}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="rounded-lg" onClick={() => setShowAdd(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Stage list with drag-and-drop */}
        <Form id="reorderForm" method="post">
          <input type="hidden" name="intent" value="reorderStages" />
          <input type="hidden" name="order" value="" />
        </Form>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="stages">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                {localStages.map((stage, index) => {
                  const isEditing = editingId === stage.id;
                  const count = leadCounts[stage.name] ?? 0;
                  const meta = stage.meta;

                  return (
                    <Draggable key={stage.id} draggableId={stage.id} index={index}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className={`rounded-2xl border ${meta.border} ${meta.bg} backdrop-blur-sm transition-all duration-200 ${
                            dragSnapshot.isDragging
                              ? "shadow-2xl opacity-95 rotate-1 scale-[1.01]"
                              : "hover:shadow-md hover:border-border/60"
                          }`}
                        >
                          {isEditing ? (
                            <Form method="post" className="p-5 space-y-4">
                              <input type="hidden" name="intent" value="editStage" />
                              <input type="hidden" name="id" value={stage.id} />
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Name (stored key)</Label>
                                  <Input
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={stage.name}
                                    className="mt-1.5 bg-background/50 border-border/60 uppercase"
                                    onChange={(e) => setEditName(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Display Label</Label>
                                  <Input
                                    name="label"
                                    type="text"
                                    required
                                    defaultValue={stage.label}
                                    className="mt-1.5 bg-background/50 border-border/60"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Color</Label>
                                <Select name="colorKey" defaultValue={stage.colorKey} className="mt-1.5 bg-background/50 border-border/60">
                                  {PALETTE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </Select>
                              </div>
                              {editName.toUpperCase().replace(/\s+/g, "_") !== stage.name && editName !== "" && (
                                <div className="flex items-center gap-2 rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
                                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                                  <p className="text-xs text-amber-400/80">
                                    Renaming will cascade update all leads and stage history in this stage.
                                  </p>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Button type="submit" disabled={isSubmitting} size="sm" className="rounded-lg gap-1.5">
                                  <Save className="h-3.5 w-3.5" />
                                  {isSubmitting ? "Saving..." : "Save"}
                                </Button>
                                <Button type="button" variant="ghost" size="sm" className="rounded-lg" onClick={() => setEditingId(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </Form>
                          ) : (
                            <div className="flex items-center gap-3 p-4">
                              <div
                                {...dragProvided.dragHandleProps}
                                className="cursor-grab text-muted-foreground/30 hover:text-muted-foreground/60 shrink-0 transition-colors"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <div className={`h-2.5 w-2.5 rounded-full ${meta.dot} ring-2 ring-white/10 shrink-0`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{stage.label}</span>
                                  <Badge variant="outline" className="text-[10px] font-mono rounded-md px-1.5">
                                    {stage.name}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {count} lead{count !== 1 ? "s" : ""} · Position {stage.position}
                                </p>
                              </div>
                              <ColorSwatch colorKey={stage.colorKey} />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-muted/50 transition-colors"
                                onClick={() => {
                                  setEditingId(stage.id);
                                  setShowAdd(false);
                                  setEditName(stage.name);
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Form method="post" className="inline">
                                <input type="hidden" name="intent" value="deleteStage" />
                                <input type="hidden" name="id" value={stage.id} />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 rounded-lg text-muted-foreground/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                  disabled={isSubmitting}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </Form>
                            </div>
                          )}
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

        {orderChanged && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-400/90 flex-1">
              Stage order has changed. Save to persist the new order.
            </p>
            <Button size="sm" onClick={submitReorder} disabled={isSubmitting} className="rounded-lg gap-1.5">
              <Save className="h-3.5 w-3.5" />
              {isSubmitting ? "Saving..." : "Save Order"}
            </Button>
          </div>
        )}

        {stages.length === 0 && (
          <Card className="border-border/40 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent blur-2xl" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 ring-1 ring-border/50 shadow-xl">
                    <Layers className="h-7 w-7 text-muted-foreground/40" />
                  </div>
                </div>
                <p className="mt-5 text-sm font-semibold text-foreground/80">No pipeline stages configured</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                  Add stages to define your sales pipeline workflow.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
