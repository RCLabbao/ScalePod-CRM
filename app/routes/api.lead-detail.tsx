import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { data } from "react-router";
import { z } from "zod";

const LeadDetailQuerySchema = z.object({
  leadId: z.string().min(1, "leadId is required").max(50),
});

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);

  const url = new URL(request.url);
  const result = LeadDetailQuerySchema.safeParse({
    leadId: url.searchParams.get("leadId") || "",
  });
  if (!result.success) {
    throw data({ error: "Invalid query parameters", issues: result.error.issues }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({
    where: { id: result.data.leadId },
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
    throw data({ error: "Lead not found" }, { status: 404 });
  }

  return data({ lead });
}