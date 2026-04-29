import { prisma } from "./prisma.server";
import { sendEmail } from "./google-auth.server";
import { plainTextToHtml } from "./email-html";

// ── Types ──────────────────────────────────────────────────────

type WorkflowAction = "ASSIGN_TO_USER" | "SEND_NOTIFICATION" | "UPDATE_FIELD" | "ADD_NOTE" | "SEND_EMAIL";

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
      include: {
        actions: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
      },
    });

    for (const rule of rules) {
      try {
        const conditionMatch = matchesCondition(rule.triggerCondition as Record<string, unknown> | null, metadata);
        if (!conditionMatch) continue;

        const ctx: WorkflowExecutionContext = { leadId, metadata };

        // Execute all action steps for this rule
        const actions = rule.actions && rule.actions.length > 0
          ? rule.actions
          : // Fallback: legacy single-action rules that haven't been migrated yet
            rule.action && rule.action !== "LEGACY"
              ? [{ id: `legacy_${rule.id}`, ruleId: rule.id, type: rule.action as string, config: rule.actionConfig as Record<string, unknown>, order: 0, active: true, createdAt: rule.createdAt, updatedAt: rule.updatedAt }]
              : [];

        for (const actionStep of actions) {
          try {
            await executeAction(actionStep.type as WorkflowAction, actionStep.config as Record<string, unknown>, ctx, rule.id);
          } catch (err) {
            await logWorkflowError(rule.id, leadId, err instanceof Error ? err.message : String(err));
            // Continue executing remaining actions even if one fails
          }
        }
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
    case "SEND_EMAIL":
      await sendWorkflowEmail(config, ctx, ruleId);
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

// ── Template Interpolation ────────────────────────────────────

function interpolateTemplate(
  template: string,
  lead: { companyName: string | null; contactName: string | null; email: string | null; industry: string | null; leadSource: string | null; stage: string | null; website: string | null }
): string {
  const vars: Record<string, string> = {
    companyName: lead.companyName || "",
    contactName: lead.contactName || "",
    email: lead.email || "",
    industry: lead.industry || "",
    leadSource: lead.leadSource || "",
    stage: lead.stage || "",
    website: lead.website || "",
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

// ── Send Workflow Email ───────────────────────────────────────

async function sendWorkflowEmail(
  config: Record<string, unknown>,
  ctx: WorkflowExecutionContext,
  ruleId: string
): Promise<void> {
  const fromUserId = config.fromUserId as string;
  const subjectTemplate = config.subject as string;
  const bodyTemplate = config.body as string;

  if (!fromUserId) {
    await logWorkflowError(ruleId, ctx.leadId, "Missing fromUserId in actionConfig");
    return;
  }
  if (!subjectTemplate || !bodyTemplate) {
    await logWorkflowError(ruleId, ctx.leadId, "Missing subject or body in actionConfig");
    return;
  }

  const lead = await prisma.lead.findUnique({
    where: { id: ctx.leadId },
    select: { id: true, companyName: true, contactName: true, email: true, industry: true, leadSource: true, stage: true, website: true },
  });

  if (!lead) {
    await logWorkflowError(ruleId, ctx.leadId, "Lead not found");
    return;
  }
  if (!lead.email) {
    await logWorkflowError(ruleId, ctx.leadId, `SEND_EMAIL failed: Lead "${lead.companyName}" has no email address`);
    return;
  }

  const gmailToken = await prisma.gmailToken.findUnique({ where: { userId: fromUserId } });
  if (!gmailToken) {
    const user = await prisma.user.findUnique({ where: { id: fromUserId }, select: { name: true } });
    await logWorkflowError(ruleId, ctx.leadId, `SEND_EMAIL failed: User "${user?.name || fromUserId}" does not have Gmail connected`);
    return;
  }

  const subject = interpolateTemplate(subjectTemplate, lead);
  const bodyPlain = interpolateTemplate(bodyTemplate, lead);
  const htmlBody = plainTextToHtml(bodyPlain);

  try {
    const result = await sendEmail(fromUserId, {
      to: lead.email,
      subject,
      body: bodyPlain,
      htmlBody,
    });

    const now = new Date();
    const thread = await prisma.emailThread.create({
      data: {
        leadId: lead.id,
        gmailThreadId: result.gmailThreadId,
        subject,
        snippet: bodyPlain.substring(0, 200),
        status: "SENT",
        lastMessage: now,
      },
    });

    await prisma.emailMessage.create({
      data: {
        threadId: thread.id,
        gmailMessageId: result.gmailMessageId,
        fromAddress: gmailToken.gmailAddress || "me",
        toAddress: lead.email,
        subject,
        bodyPlain,
        bodyHtml: htmlBody,
        snippet: bodyPlain.substring(0, 200),
        direction: "sent",
        sentAt: now,
      },
    });

    await prisma.workflowLog.create({
      data: {
        ruleId,
        leadId: ctx.leadId,
        success: true,
        result: {
          action: "SEND_EMAIL",
          fromUserId,
          fromAddress: gmailToken.gmailAddress,
          toAddress: lead.email,
          subject,
        } as any,
      },
    });
  } catch (sendErr: unknown) {
    const errMsg = sendErr instanceof Error ? sendErr.message : String(sendErr);
    await logWorkflowError(ruleId, ctx.leadId, `SEND_EMAIL failed: ${errMsg}`);
  }
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