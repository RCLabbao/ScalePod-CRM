import { Form, useLoaderData, useFetcher } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { LeadCard } from "../components/lead-card";
import { LeadDetailModal } from "../components/lead-detail-modal";
import { logActivity } from "../lib/activity-log.server";
import { formatStage } from "../lib/activity-log";
import { useEffect, useState, useCallback, useRef } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { GripVertical, X } from "lucide-react";

const STAGES = [
  { id: "SOURCED", label: "Sourced", color: "border-t-slate-400", bg: "bg-slate-500/10", dot: "bg-slate-400" },
  { id: "QUALIFIED", label: "Qualified", color: "border-t-blue-400", bg: "bg-blue-500/10", dot: "bg-blue-400" },
  { id: "FIRST_CONTACT", label: "First Contact", color: "border-t-violet-400", bg: "bg-violet-500/10", dot: "bg-violet-400" },
  { id: "MEETING_BOOKED", label: "Meeting Booked", color: "border-t-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-400" },
  { id: "PROPOSAL_SENT", label: "Proposal Sent", color: "border-t-orange-400", bg: "bg-orange-500/10", dot: "bg-orange-400" },
  { id: "CLOSED_WON", label: "Closed Won", color: "border-t-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
  { id: "CLOSED_LOST", label: "Closed Lost", color: "border-t-red-400", bg: "bg-red-500/10", dot: "bg-red-400" },
] as const;

type Stage = (typeof STAGES)[number]["id"];

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const leads = await prisma.lead.findMany({
    where: { status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
  });

  const grouped = STAGES.map((stage) => ({
    ...stage,
    leads: leads.filter((l) => l.stage === stage.id),
  }));

  return { user, stages: grouped };
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

  // Any authenticated user can view lead details
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

  // Admin: edit lead details
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

    // Return updated lead for the modal
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

    // Skip if same stage
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

    // Log activity
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

  // Bulk move: move multiple leads at once
  if (intent === "bulkMoveStage") {
    const leadIdsJson = formData.get("leadIds") as string;
    const newStage = formData.get("newStage") as string;
    const leadIds: string[] = JSON.parse(leadIdsJson);

    const leads = await prisma.lead.findMany({
      where: { id: { in: leadIds } },
    });

    const operations: Promise<unknown>[] = [];
    for (const lead of leads) {
      if (lead.stage === newStage) continue;
      operations.push(
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
        }),
        logActivity({
          leadId: lead.id,
          userId,
          action: "STAGE_CHANGED",
          description: `${currentUser.name || "Unknown"} moved from ${formatStage(lead.stage)} to ${formatStage(newStage)}`,
          metadata: { fromStage: lead.stage, toStage: newStage },
        })
      );
    }

    await prisma.$transaction(operations.filter(Boolean));
    return { success: true };
  }

  return {};
}

export default function Pipeline() {
  const { user, stages } = useLoaderData<typeof loader>();
  const [localStages, setLocalStages] = useState(stages);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<Record<string, unknown> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const detailFetcher = useFetcher<{ lead: Record<string, unknown> }>();

  useEffect(() => {
    setLocalStages(stages);
  }, [stages]);

  useEffect(() => {
    if (detailFetcher.data?.lead) {
      setSelectedLead(detailFetcher.data.lead);
      if (!detailFetcher.data.edited) {
        setModalOpen(true);
      }
      // After edit, refresh the card data in the pipeline
      if (detailFetcher.data.edited) {
        const updated = detailFetcher.data.lead as { id: string; companyName: string; stage: string; contactName: string | null; email: string; industry: string | null; estimatedTraffic: string | null };
        setLocalStages((prev) =>
          prev.map((stage) => ({
            ...stage,
            leads: stage.leads.map((l) =>
              l.id === updated.id ? { ...l, ...updated } : l
            ),
          }))
        );
      }
    }
  }, [detailFetcher.data]);

  const handleLeadClick = useCallback((leadId: string) => {
    detailFetcher.submit(
      { intent: "getLeadDetail", leadId },
      { method: "POST", action: "/pipeline" }
    );
  }, [detailFetcher]);

  const handleSaveLead = useCallback((formData: FormData) => {
    detailFetcher.submit(formData, { method: "POST", action: "/pipeline" });
  }, [detailFetcher]);

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

  const onDragEnd = useCallback(async (result: DropResult) => {
    if (user?.role !== "ADMIN") return;
    if (!result.destination) return;

    const draggedId = result.draggableId;
    const newStage = result.destination.droppableId as Stage;

    // Determine which leads to move
    const idsToMove = selectedIds.has(draggedId)
      ? Array.from(selectedIds)
      : [draggedId];

    // Optimistic update for all selected leads
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

    // Clear selection after drag
    setSelectedIds(new Set());

    // Persist
    if (idsToMove.length === 1) {
      const formData = new FormData();
      formData.set("intent", "moveStage");
      formData.set("leadId", idsToMove[0]);
      formData.set("newStage", newStage);
      await fetch("/pipeline", { method: "POST", body: formData });
    } else {
      const formData = new FormData();
      formData.set("intent", "bulkMoveStage");
      formData.set("leadIds", JSON.stringify(idsToMove));
      formData.set("newStage", newStage);
      await fetch("/pipeline", { method: "POST", body: formData });
    }
  }, [user?.role, selectedIds]);

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
            <p className="text-muted-foreground">
              Select leads with checkboxes, then drag to move. Click a company name for details.
            </p>
          </div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {selectedIds.size} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-7 px-2"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {localStages.map((stage) => (
              <div
                key={stage.id}
                className="flex w-72 shrink-0 flex-col"
              >
                <div className={`rounded-t-lg border border-b-0 p-3 ${stage.color} ${stage.bg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${stage.dot}`} />
                      <h3 className="text-sm font-semibold text-card-foreground">{stage.label}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs text-secondary-foreground">
                      {stage.leads.length}
                    </Badge>
                  </div>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-2 rounded-b-lg border border-t-0 bg-muted/30 p-2 transition-colors min-h-[200px] ${
                        snapshot.isDraggingOver ? "bg-muted/60" : ""
                      }`}
                    >
                      {stage.leads.map((lead, index) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          index={index}
                          draggable={user?.role === "ADMIN"}
                          onClick={handleLeadClick}
                          selected={selectedIds.has(lead.id)}
                          onSelect={handleSelect}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        <LeadDetailModal
          lead={selectedLead as never}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSave={user?.role === "ADMIN" ? handleSaveLead : undefined}
          saving={detailFetcher.state === "submitting"}
        />
      </div>
    </AppShell>
  );
}
