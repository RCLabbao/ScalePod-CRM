import { prisma } from "./prisma.server";
import type { ActivityAction, ActivityLogInput } from "./activity-log";

export type { ActivityLogInput };

/**
 * Log an activity for a lead.
 * This creates an audit trail entry showing who did what and when.
 */
export async function logActivity(input: ActivityLogInput) {
  return prisma.activityLog.create({
    data: {
      leadId: input.leadId,
      userId: input.userId,
      action: input.action,
      description: input.description,
      metadata: input.metadata,
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
