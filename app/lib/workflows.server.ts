import { prisma } from "./prisma.server";

// ── Types ──────────────────────────────────────────────────────

type WorkflowAction = "ASSIGN_TO_USER" | "SEND_NOTIFICATION" | "UPDATE_FIELD" | "ADD_NOTE";

interface WorkflowExecutionContext {
  leadId: string;
  metadata: Record<string, unknown>;
}

// ── Evaluate and Execute ───────────────────────────────────────

/**
 * Evaluate all active workflow rules matching the given event.
 * Called fire-and-forget from logActivity — must never throw.
 */
export async function evaluateWorkflows(
  event: string,
  leadId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  try {
    const rules = await prisma.workflowRule.findMany({
      where: { triggerEvent: event, active: true },
    });

    for (const rule of rules) {
      try {
        const conditionMatch = matchesCondition(rule.triggerCondition as Record<string, unknown> | null, metadata);
        if (!conditionMatch) continue;

        const ctx: WorkflowExecutionContext = { leadId, metadata };
        await executeAction(rule.action as WorkflowAction, rule.actionConfig as Record<string, unknown>, ctx, rule.id);
      } catch (err) {
        // Log the error but continue evaluating other rules
        await logWorkflowError(rule.id, leadId, err instanceof Error ? err.message : String(err));
      }
    }
  } catch {
    // Swallow all errors — this function must never throw
  }
}

// ── Condition Matching ──────────────────────────────────────────

function matchesCondition(
  condition: Record<string, unknown> | null | undefined,
  metadata: Record<string, unknown>
): boolean {
  if (!condition || Object.keys(condition).length === 0) return true;

  for (const [key, expected] of Object.entries(condition)) {
    const actual = metadata[key];
    if (actual === undefined || actual === null) return false;
    if (String(actual) !== String(expected)) return false;
  }

  return true;
}

// ── Action Execution ───────────────────────────────────────────

async function executeAction(
  action: WorkflowAction,
  config: Record<string, unknown>,
  ctx: WorkflowExecutionContext,
  ruleId: string
): Promise<void> {
  switch (action) {
    case "ASSIGN_TO_USER":
      await assignToUser(config, ctx, ruleId);
      break;
    case "SEND_NOTIFICATION":
      await sendNotification(config, ctx, ruleId);
      break;
    case "UPDATE_FIELD":
      await updateField(config, ctx, ruleId);
      break;
    case "ADD_NOTE":
      await addNote(config, ctx, ruleId);
      break;
    default:
      await logWorkflowError(ruleId, ctx.leadId, `Unknown action: ${action}`);
  }
}

async function assignToUser(
  config: Record<string, unknown>,
  ctx: WorkflowExecutionContext,
  ruleId: string
): Promise<void> {
  const userId = config.userId as string;
  if (!userId) {
    await logWorkflowError(ruleId, ctx.leadId, "Missing userId in actionConfig");
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true } });
  if (!user) {
    await logWorkflowError(ruleId, ctx.leadId, `User not found: ${userId}`);
    return;
  }

  await prisma.lead.update({
    where: { id: ctx.leadId },
    data: { assignedToId: userId },
  });

  await prisma.workflowLog.create({
    data: {
      ruleId,
      leadId: ctx.leadId,
      success: true,
      result: { action: "ASSIGN_TO_USER", userId, userName: user.name } as any,
    },
  });
}

async function sendNotification(
  config: Record<string, unknown>,
  ctx: WorkflowExecutionContext,
  ruleId: string
): Promise<void> {
  // Log as notification for now — future enhancement can add email/push
  await prisma.workflowLog.create({
    data: {
      ruleId,
      leadId: ctx.leadId,
      success: true,
      result: { action: "SEND_NOTIFICATION", message: String(config.message || "Workflow notification triggered") } as any,
    },
  });
}

async function updateField(
  config: Record<string, unknown>,
  ctx: WorkflowExecutionContext,
  ruleId: string
): Promise<void> {
  const field = config.field as string;
  const value = config.value as string;
  if (!field || value === undefined) {
    await logWorkflowError(ruleId, ctx.leadId, "Missing field or value in actionConfig");
    return;
  }

  // Only allow updating specific safe fields on Lead
  const allowedFields = new Set(["stage", "status", "temperature", "leadSource", "industry", "notes"]);
  if (!allowedFields.has(field)) {
    await logWorkflowError(ruleId, ctx.leadId, `Field not allowed for update: ${field}`);
    return;
  }

  await prisma.lead.update({
    where: { id: ctx.leadId },
    data: { [field]: value },
  });

  await prisma.workflowLog.create({
    data: {
      ruleId,
      leadId: ctx.leadId,
      success: true,
      result: { action: "UPDATE_FIELD", field, value } as any,
    },
  });
}

async function addNote(
  config: Record<string, unknown>,
  ctx: WorkflowExecutionContext,
  ruleId: string
): Promise<void> {
  const noteText = config.note as string;
  if (!noteText) {
    await logWorkflowError(ruleId, ctx.leadId, "Missing note text in actionConfig");
    return;
  }

  const lead = await prisma.lead.findUnique({
    where: { id: ctx.leadId },
    select: { notes: true },
  });

  if (!lead) {
    await logWorkflowError(ruleId, ctx.leadId, "Lead not found");
    return;
  }

  const separator = lead.notes ? "\n" : "";
  await prisma.lead.update({
    where: { id: ctx.leadId },
    data: { notes: `${lead.notes || ""}${separator}[Workflow]: ${noteText}` },
  });

  await prisma.workflowLog.create({
    data: {
      ruleId,
      leadId: ctx.leadId,
      success: true,
      result: { action: "ADD_NOTE", note: noteText } as any,
    },
  });
}

// ── Error Logging ──────────────────────────────────────────────

async function logWorkflowError(ruleId: string, leadId: string, error: string): Promise<void> {
  try {
    await prisma.workflowLog.create({
      data: {
        ruleId,
        leadId,
        success: false,
        error: error.slice(0, 500),
      },
    });
  } catch {
    // Even error logging can fail — swallow completely
  }
}