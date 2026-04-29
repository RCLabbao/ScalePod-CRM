export type ActivityAction =
  | "LEAD_CREATED"
  | "LEAD_APPROVED"
  | "LEAD_REJECTED"
  | "STAGE_CHANGED"
  | "LEAD_ASSIGNED"
  | "LEAD_UNASSIGNED"
  | "LEAD_SCORED"
  | "LEAD_EDITED"
  | "NOTE_ADDED"
  | "LEAD_SCRAPED"
  | "TEMPERATURE_CHANGED";

export interface ActivityLogInput {
  leadId: string;
  userId?: string | null;
  action: ActivityAction;
  description: string;
  metadata?: Record<string, unknown>;
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
 * Get the icon/color for an activity action
 */
export function getActivityStyle(action: ActivityAction): {
  icon: string;
  bgColor: string;
  textColor: string;
} {
  switch (action) {
    case "LEAD_CREATED":
      return { icon: "+", bgColor: "bg-green-100", textColor: "text-green-700" };
    case "LEAD_APPROVED":
      return { icon: "✓", bgColor: "bg-green-100", textColor: "text-green-700" };
    case "LEAD_REJECTED":
      return { icon: "✕", bgColor: "bg-red-100", textColor: "text-red-700" };
    case "STAGE_CHANGED":
      return { icon: "→", bgColor: "bg-blue-100", textColor: "text-blue-700" };
    case "LEAD_ASSIGNED":
      return { icon: "@", bgColor: "bg-purple-100", textColor: "text-purple-700" };
    case "LEAD_UNASSIGNED":
      return { icon: "@", bgColor: "bg-gray-100", textColor: "text-gray-700" };
    case "LEAD_SCORED":
      return { icon: "★", bgColor: "bg-yellow-100", textColor: "text-yellow-700" };
    case "LEAD_EDITED":
      return { icon: "✎", bgColor: "bg-gray-100", textColor: "text-gray-700" };
    case "NOTE_ADDED":
      return { icon: "💬", bgColor: "bg-indigo-100", textColor: "text-indigo-700" };
    case "LEAD_SCRAPED":
      return { icon: "🔍", bgColor: "bg-cyan-100", textColor: "text-cyan-700" };
    case "TEMPERATURE_CHANGED":
      return { icon: "🌡", bgColor: "bg-orange-100", textColor: "text-orange-700" };
    default:
      return { icon: "•", bgColor: "bg-gray-100", textColor: "text-gray-700" };
  }
}
