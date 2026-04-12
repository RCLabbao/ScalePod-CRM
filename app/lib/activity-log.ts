import { prisma } from "./prisma";

export type ActivityAction =
  | "LEAD_CREATED"
  | "LEAD_APPROVED"
  | "LEAD_REJECTED"
  | "STAGE_CHANGED"
  | "LEAD_ASSIGNED"
  | "LEAD_UNASSIGNED"
  | "LEAD_SCORED"
  | "LEAD_EDITED"
  | "NOTE_ADDED";

export interface ActivityLogInput {
  leadId: string;
  userId?: string | null;
  action: ActivityAction;
  description: string;
  metadata?: Record<string, unknown>;
}

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
 * Generate a human-readable description for activity actions
 */
export function getActivityDescription(
  action: ActivityAction,
  userName: string | null | undefined,
  metadata?: Record<string, unknown>
): string {
  const name = userName || "System";

  switch (action) {
    case "LEAD_CREATED":
      return `${name} added this lead`;
    case "LEAD_APPROVED":
      return `${name} approved this lead`;
    case "LEAD_REJECTED":
      return `${name} rejected this lead`;
    case "STAGE_CHANGED": {
      const fromStage = (metadata?.fromStage as string) || "Unknown";
      const toStage = (metadata?.toStage as string) || "Unknown";
      return `${name} moved from ${formatStage(fromStage)} to ${formatStage(toStage)}`;
    }
    case "LEAD_ASSIGNED": {
      const assignedTo = (metadata?.assignedToName as string) || "Unknown";
      return `${name} assigned to ${assignedTo}`;
    }
    case "LEAD_UNASSIGNED":
      return `${name} removed assignment`;
    case "LEAD_SCORED": {
      const score = metadata?.score;
      const temperature = metadata?.temperature;
      return `${name} scored this lead${score ? ` (${score} pts)` : ""}${temperature ? ` - ${temperature}` : ""}`;
    }
    case "LEAD_EDITED":
      return `${name} edited lead details`;
    case "NOTE_ADDED":
      return `${name} added a note`;
    default:
      return `${name} performed an action`;
  }
}

/**
 * Format stage name for display
 */
export function formatStage(stage: string): string {
  return stage
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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

/**
 * Get the icon/color for an activity action
 */
export function getActivityStyle(action: ActivityAction): {
  icon: string;
  bgColor: string;
  textColor: string;
} {
  switch (action) {
    case "LEAD_CREATED":
      return {
        icon: "+",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
      };
    case "LEAD_APPROVED":
      return {
        icon: "✓",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
      };
    case "LEAD_REJECTED":
      return {
        icon: "✕",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
      };
    case "STAGE_CHANGED":
      return {
        icon: "→",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
      };
    case "LEAD_ASSIGNED":
      return {
        icon: "@",
        bgColor: "bg-purple-100",
        textColor: "text-purple-700",
      };
    case "LEAD_UNASSIGNED":
      return {
        icon: "@",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
      };
    case "LEAD_SCORED":
      return {
        icon: "★",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
      };
    case "LEAD_EDITED":
      return {
        icon: "✎",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
      };
    case "NOTE_ADDED":
      return {
        icon: "💬",
        bgColor: "bg-indigo-100",
        textColor: "text-indigo-700",
      };
    default:
      return {
        icon: "•",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
      };
  }
}