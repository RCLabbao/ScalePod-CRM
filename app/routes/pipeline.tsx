import { Form, useLoaderData } from "react-router";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth.guard";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { LeadCard } from "../components/lead-card";
import { logActivity, formatStage } from "../lib/activity-log";
import { useEffect, useState, useCallback } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

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

  return {};
}

export default function Pipeline() {
  const { user, stages } = useLoaderData<typeof loader>();
  const [localStages, setLocalStages] = useState(stages);

  useEffect(() => {
    setLocalStages(stages);
  }, [stages]);

  const onDragEnd = useCallback(async (result: DropResult) => {
    if (user?.role !== "ADMIN") return;
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStage = result.destination.droppableId as Stage;

    // Optimistic update
    setLocalStages((prev) => {
      const lead = prev.flatMap((s) => s.leads).find((l) => l.id === leadId);
      if (!lead) return prev;

      return prev.map((stage) => ({
        ...stage,
        leads: stage.leads.filter((l) => l.id !== leadId).concat(
          stage.id === newStage ? [{ ...lead, stage: newStage }] : []
        ),
      }));
    });

    // Persist
    const formData = new FormData();
    formData.set("intent", "moveStage");
    formData.set("leadId", leadId);
    formData.set("newStage", newStage);

    await fetch("/pipeline", { method: "POST", body: formData });
  }, [user?.role]);

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">
            Drag and drop leads between stages to track progress
          </p>
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
                        <LeadCard key={lead.id} lead={lead} index={index} draggable={user?.role === "ADMIN"} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </AppShell>
  );
}
