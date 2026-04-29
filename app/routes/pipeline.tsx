import { Link } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { LeadCard } from "../components/lead-card";
import { LeadDetailModal } from "../components/lead-detail-modal";
import { logActivity } from "../lib/activity-log.server";
import { formatStage } from "../lib/activity-log";
import { getStagesWithMeta, invalidateStagesCache } from "../lib/stages.server";
import type { StageWithMeta } from "../lib/stages.server";
import { useEffect, useState, useCallback, useMemo } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import {
  X,
  Search,
  Flame,
  ThermometerSun,
  Snowflake,
  SlidersHorizontal,
  Inbox,
  AlertCircle,
  GripVertical,
  Settings2,
  LayoutGrid,
} from "lucide-react";

type Stage = string;

const TEMPERATURES = [
  { key: "ALL", label: "All", icon: SlidersHorizontal },
  { key: "HOT", label: "Hot", icon: Flame },
  { key: "WARM", label: "Warm", icon: ThermometerSun },
  { key: "COLD", label: "Cold", icon: Snowflake },
] as const;

type TemperatureKey = (typeof TEMPERATURES)[number]["key"];

export interface LoaderLead {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string;
  industry: string | null;
  estimatedTraffic: string | null;
  stage: string;
  temperature: string;
  assignedToId: string | null;
  assignedTo: { name: string | null } | null;
}

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const [leads, pipelineStages] = await Promise.all([
    prisma.lead.findMany({
      where: { status: "ACTIVE" },
      orderBy: { updatedAt: "desc" },
      include: {
        assignedTo: { select: { name: true } },
      },
    }),
    getStagesWithMeta(),
  ]);

  const grouped = pipelineStages.map((stage) => ({
    id: stage.name,
    label: stage.label,
    color: stage.meta.color,
    bg: stage.meta.bg,
    dot: stage.meta.dot,
    leads: leads.filter((l) => l.stage === stage.name) as LoaderLead[],
  }));

  return { user, stages: grouped, pipelineStages };
}

export async function action({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, role: true },
  });
  if (currentUser?.role !== "ADMIN") {
    throw new Response("Forbidden", { status: 403 });
  }
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "getLeadDetail") {
    const leadId = formData.get("leadId") as string;
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
        rejectedBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        stageHistory: {
          include: {
            changedBy: { select: { id: true, name: true, email: true } },
          },
          orderBy: { changedAt: "desc" },
        },
        activityLogs: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return { lead };
  }

  if (intent === "editLead") {
    const leadId = formData.get("leadId") as string;
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        companyName: formData.get("companyName") as string,
        contactName: (formData.get("contactName") as string) || null,
        email: formData.get("email") as string,
        website: (formData.get("website") as string) || null,
        industry: (formData.get("industry") as string) || null,
        estimatedTraffic: (formData.get("estimatedTraffic") as string) || null,
        techStack: (formData.get("techStack") as string) || null,
        leadSource: (formData.get("leadSource") as string) || null,
        linkedin: (formData.get("linkedin") as string) || null,
        facebook: (formData.get("facebook") as string) || null,
        instagram: (formData.get("instagram") as string) || null,
        twitter: (formData.get("twitter") as string) || null,
        notes: (formData.get("notes") as string) || null,
      },
    });

    await logActivity({
      leadId,
      userId,
      action: "LEAD_EDITED",
      description: `${currentUser?.name || "Unknown"} edited lead details`,
    });

    const updated = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
        rejectedBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        stageHistory: {
          include: { changedBy: { select: { id: true, name: true, email: true } } },
          orderBy: { changedAt: "desc" },
        },
        activityLogs: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return { lead: updated, edited: true };
  }

  if (currentUser?.role !== "ADMIN") {
    throw new Response("Forbidden", { status: 403 });
  }

  if (intent === "moveStage") {
    const leadId = formData.get("leadId") as string;
    const newStage = formData.get("newStage") as string;

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return { success: false };

    if (lead.stage === newStage) {
      return { success: true };
    }

    await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: { stage: newStage },
      }),
      prisma.stageHistory.create({
        data: {
          leadId,
          fromStage: lead.stage,
          toStage: newStage,
          changedById: userId,
        },
      }),
    ]);

    await logActivity({
      leadId,
      userId,
      action: "STAGE_CHANGED",
      description: `${currentUser.name || "Unknown"} moved from ${formatStage(lead.stage)} to ${formatStage(newStage)}`,
      metadata: {
        fromStage: lead.stage,
        toStage: newStage,
      },
    });

    return { success: true };
  }

  if (intent === "bulkMoveStage") {
    const leadIdsJson = formData.get("leadIds") as string;
    const newStage = formData.get("newStage") as string;
    const leadIds: string[] = JSON.parse(leadIdsJson);

    const leads = await prisma.lead.findMany({
      where: { id: { in: leadIds } },
    });

    const txOps: Promise<unknown>[] = [];
    for (const lead of leads) {
      if (lead.stage === newStage) continue;
      txOps.push(
        prisma.lead.update({
          where: { id: lead.id },
          data: { stage: newStage },
        }),
        prisma.stageHistory.create({
          data: {
            leadId: lead.id,
            fromStage: lead.stage,
            toStage: newStage,
            changedById: userId,
          },
        })
      );
      logActivity({
        leadId: lead.id,
        userId,
        action: "STAGE_CHANGED",
        description: `${currentUser.name || "Unknown"} moved from ${formatStage(lead.stage)} to ${formatStage(newStage)}`,
        metadata: { fromStage: lead.stage, toStage: newStage },
      }).catch(() => {});
    }

    if (txOps.length > 0) {
      await prisma.$transaction(txOps as any);
    }
    return { success: true };
  }

  if (intent === "reorderStages") {
    const orderJson = formData.get("order") as string;
    if (!orderJson) return { success: false };
    try {
      const order: string[] = JSON.parse(orderJson);
      const txOps = order.map((name, index) =>
        prisma.pipelineStage.update({
          where: { name },
          data: { position: index },
        })
      );
      await prisma.$transaction(txOps);
      invalidateStagesCache();
    } catch (err) {
      console.error("[pipeline] Failed to reorder stages:", err);
      return { success: false };
    }
    return { success: true };
  }

  return {};
}

function filterLeads(leads: LoaderLead[], search: string, tempFilter: TemperatureKey) {
  const q = search.trim().toLowerCase();
  return leads.filter((l) => {
    const matchesSearch =
      !q ||
      l.companyName.toLowerCase().includes(q) ||
      (l.contactName?.toLowerCase() ?? "").includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.industry?.toLowerCase() ?? "").includes(q);
    const matchesTemp = tempFilter === "ALL" || l.temperature === tempFilter;
    return matchesSearch && matchesTemp;
  });
}

export default function Pipeline() {
  const { user, stages: serverStages, pipelineStages } = useLoaderData<typeof loader>();
  const [localStages, setLocalStages] = useState(serverStages);
  const [search, setSearch] = useState("");
  const [tempFilter, setTempFilter] = useState<TemperatureKey>("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<Record<string, unknown> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);

  const detailFetcher = useFetcher<{ lead: Record<string, unknown>; edited?: boolean }>();
  const moveFetcher = useFetcher<{ success: boolean }>();
  const reorderFetcher = useFetcher<{ success: boolean }>();

  useEffect(() => {
    setLocalStages(serverStages);
  }, [serverStages]);

  const displayStages = useMemo(() => {
    return localStages.map((stage) => ({
      ...stage,
      leads: filterLeads(stage.leads, search, tempFilter),
    }));
  }, [localStages, search, tempFilter]);

  const totalVisible = useMemo(
    () => displayStages.reduce((sum, s) => sum + s.leads.length, 0),
    [displayStages]
  );
  const totalAll = useMemo(
    () => serverStages.reduce((sum, s) => sum + s.leads.length, 0),
    [serverStages]
  );

  useEffect(() => {
    if (detailFetcher.data?.lead) {
      setSelectedLead(detailFetcher.data.lead);
      if (!detailFetcher.data.edited) {
        setModalOpen(true);
      }
    }
  }, [detailFetcher.data]);

  useEffect(() => {
    if (moveFetcher.data) {
      if (!moveFetcher.data.success) {
        setMoveError("Failed to move lead. Please try again.");
      } else {
        setMoveError(null);
      }
    }
  }, [moveFetcher.data]);

  const handleLeadClick = useCallback(
    (leadId: string) => {
      detailFetcher.submit(
        { intent: "getLeadDetail", leadId },
        { method: "POST", action: "/pipeline" }
      );
    },
    [detailFetcher]
  );

  const handleSaveLead = useCallback(
    (formData: FormData) => {
      detailFetcher.submit(formData, { method: "POST", action: "/pipeline" });
    },
    [detailFetcher]
  );

  const handleSelect = useCallback((leadId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (result.type === "STAGE_COLUMNS") {
        if (!result.destination) return;
        setLocalStages((prev) => {
          const items = Array.from(prev);
          const [moved] = items.splice(result.source.index, 1);
          items.splice(result.destination!.index, 0, moved);
          return items;
        });
        const currentStages = [...localStages];
        const [moved] = currentStages.splice(result.source.index, 1);
        currentStages.splice(result.destination.index, 0, moved);
        reorderFetcher.submit(
          {
            intent: "reorderStages",
            order: JSON.stringify(currentStages.map((s) => s.id)),
          },
          { method: "POST", action: "/pipeline" }
        );
        return;
      }

      if (user?.role !== "ADMIN") return;
      if (!result.destination) return;

      const draggedId = result.draggableId;
      const newStage = result.destination.droppableId as Stage;

      const idsToMove = selectedIds.has(draggedId)
        ? Array.from(selectedIds)
        : [draggedId];

      setLocalStages((prev) => {
        const movingLeads = prev
          .flatMap((s) => s.leads)
          .filter((l) => idsToMove.includes(l.id));

        return prev.map((stage) => ({
          ...stage,
          leads: [
            ...stage.leads.filter((l) => !idsToMove.includes(l.id)),
            ...(stage.id === newStage
              ? movingLeads.map((l) => ({ ...l, stage: newStage }))
              : []),
          ],
        }));
      });

      clearSelection();
      setMoveError(null);

      if (idsToMove.length === 1) {
        moveFetcher.submit(
          { intent: "moveStage", leadId: idsToMove[0], newStage },
          { method: "POST", action: "/pipeline" }
        );
      } else {
        moveFetcher.submit(
          { intent: "bulkMoveStage", leadIds: JSON.stringify(idsToMove), newStage },
          { method: "POST", action: "/pipeline" }
        );
      }
    },
    [user?.role, selectedIds, moveFetcher, reorderFetcher, localStages]
  );

  const activeFilters = (search ? 1 : 0) + (tempFilter !== "ALL" ? 1 : 0);

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        {/* Modern Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-border/50">
                <LayoutGrid className="h-5 w-5 text-primary/80" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
            </div>
            <p className="text-muted-foreground text-sm pl-[52px]">
              {totalVisible === totalAll
                ? `${totalAll} active leads across ${serverStages.length} stages`
                : `Showing ${totalVisible} of ${totalAll} leads`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === "ADMIN" && (
              <Link to="/settings/stages">
                <Button variant="outline" size="sm" className="h-8 rounded-lg gap-1.5">
                  <Settings2 className="h-3.5 w-3.5" />
                  Manage Stages
                </Button>
              </Link>
            )}
            {selectedIds.size > 0 && (
              <>
                <Badge
                  variant="secondary"
                  className="text-sm px-3 py-1 rounded-full gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200"
                >
                  {selectedIds.size} selected
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="h-7 px-2 rounded-lg"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Modern Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search leads by company, contact, email, industry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-9 bg-background/50 border-border/60 shadow-sm rounded-xl focus-visible:ring-primary/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-muted-foreground transition-colors rounded-full hover:bg-muted/50 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Modern Temperature Pills */}
          <div className="flex items-center gap-1 rounded-2xl bg-muted/30 p-1 ring-1 ring-border/40">
            {TEMPERATURES.map((t) => {
              const Icon = t.icon;
              const active = tempFilter === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTempFilter(t.key)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? "" : "opacity-50"}`} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active filters indicator */}
        {activeFilters > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-1 duration-200">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>
              {activeFilters} filter{activeFilters > 1 ? "s" : ""} active
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs px-2 rounded-lg"
              onClick={() => {
                setSearch("");
                setTempFilter("ALL");
              }}
            >
              Reset all
            </Button>
          </div>
        )}

        {/* Move error */}
        {moveError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {moveError}
          </div>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="STAGE_COLUMNS" type="STAGE_COLUMNS" direction="horizontal">
            {(colProvided) => (
              <div
                ref={colProvided.innerRef}
                {...colProvided.droppableProps}
                className="flex gap-4 overflow-x-auto pb-4 px-0.5"
              >
                {displayStages.map((stage, colIndex) => (
                  <Draggable
                    key={stage.id}
                    draggableId={`column-${stage.id}`}
                    index={colIndex}
                  >
                    {(colDragProvided, colDragSnapshot) => (
                      <div
                        ref={colDragProvided.innerRef}
                        {...colDragProvided.draggableProps}
                        className={`flex w-72 shrink-0 flex-col transition-all duration-200 ${
                          colDragSnapshot.isDragging
                            ? "shadow-2xl opacity-95 rotate-1"
                            : ""
                        }`}
                      >
                        {/* Modern Column Header */}
                        <div
                          {...colDragProvided.dragHandleProps}
                          className={`rounded-t-2xl border border-b-0 px-4 py-3 ${stage.color} ${stage.bg} cursor-grab active:cursor-grabbing backdrop-blur-sm transition-all duration-200`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              {user?.role === "ADMIN" && (
                                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30" />
                              )}
                              <div className={`h-2.5 w-2.5 rounded-full ${stage.dot} ring-2 ring-white/20`} />
                              <h3 className="text-sm font-semibold text-card-foreground">
                                {stage.label}
                              </h3>
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-[11px] text-secondary-foreground tabular-nums rounded-lg px-2 py-0.5"
                            >
                              {stage.leads.length}
                            </Badge>
                          </div>
                        </div>

                        <Droppable droppableId={stage.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex-1 space-y-2 rounded-b-2xl border border-t-0 bg-muted/20 p-2.5 transition-colors duration-200 overflow-y-auto ${
                                snapshot.isDraggingOver
                                  ? "bg-muted/50 ring-1 ring-primary/20"
                                  : ""
                              }`}
                              style={{
                                maxHeight: "calc(100vh - 320px)",
                                minHeight: "200px",
                              }}
                            >
                              {stage.leads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 px-2 text-center">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border/40">
                                    <Inbox className="h-5 w-5 text-muted-foreground/30" />
                                  </div>
                                  <p className="mt-3 text-xs text-muted-foreground/50 font-medium">
                                    No leads
                                  </p>
                                </div>
                              ) : (
                                stage.leads.map((lead, index) => (
                                  <LeadCard
                                    key={lead.id}
                                    lead={lead}
                                    index={index}
                                    draggable={user?.role === "ADMIN"}
                                    onClick={handleLeadClick}
                                    selected={selectedIds.has(lead.id)}
                                    onSelect={handleSelect}
                                  />
                                ))
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {colProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <LeadDetailModal
          lead={selectedLead as never}
          stages={pipelineStages}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSave={user?.role === "ADMIN" ? handleSaveLead : undefined}
          saving={detailFetcher.state === "submitting"}
        />
      </div>
    </AppShell>
  );
}
