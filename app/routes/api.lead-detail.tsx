import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth.guard";
import { data } from "react-router";

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);

  const url = new URL(request.url);
  const leadId = url.searchParams.get("leadId");
  if (!leadId) {
    return data({ error: "leadId is required" }, { status: 400 });
  }

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

  if (!lead) {
    return data({ error: "Lead not found" }, { status: 404 });
  }

  return data({ lead });
}
