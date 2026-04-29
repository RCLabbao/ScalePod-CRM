import { prisma } from "./prisma.server";
import type { ActivityAction, ActivityLogInput } from "./activity-log";
import { evaluateWorkflows } from "./workflows.server";

export type { ActivityLogInput };

/**
 * Log an activity for a lead and fire matching workflow rules.
 * Workflow evaluation is fire-and-forget — errors never block the caller.
 */
export async function logActivity(input: ActivityLogInput) {
  const log = await prisma.activityLog.create({
    data: {
      leadId: input.leadId,
      userId: input.userId,
      action: input.action,
      description: input.description,
      metadata: input.metadata as any,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Fire-and-forget: evaluate workflow rules after logging
  evaluateWorkflows(input.action, input.leadId, input.metadata ?? {}).catch(() => {
    // Swallow errors — workflow failures must not break activity logging
  });

  return log;
}

/**
 * Get all activities for a lead, ordered by most recent first
 */
export async function getLeadActivities(leadId: string) {
  return prisma.activityLog.findMany({
    where: { leadId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
