import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { validateApiKey, hasScope } from "../lib/api-key.server";
import { data } from "react-router";
import { z } from "zod";

// ── Dual auth: API key with leads:read scope OR session ─────────
async function authenticate(request: Request) {
  const apiKeyHeader = request.headers.get("X-API-Key");
  if (apiKeyHeader) {
    const result = await validateApiKey(apiKeyHeader);
    if (!result.valid || !result.apiKey) {
      throw data({ error: "Invalid API key." }, { status: 401 });
    }
    if (!hasScope(result.apiKey.scopes, "leads:read")) {
      throw data({ error: "Insufficient scope. Required: leads:read" }, { status: 403 });
    }
    return result.apiKey.userId;
  }

  return await requireAuth(request);
}

const LeadDetailQuerySchema = z.object({
  leadId: z.string().min(1, "leadId is required").max(50),
});

export async function loader({ request }: { request: Request }) {
  await authenticate(request);

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
        take: 50,
      },
      activityLogs: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    },
  });

  if (!lead) {
    throw data({ error: "Lead not found" }, { status: 404 });
  }

  return data({ lead });
}