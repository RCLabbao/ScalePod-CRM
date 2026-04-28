import { data } from "react-router";
import { prisma } from "../lib/prisma.server";
import { logActivity } from "../lib/activity-log.server";
import { validateApiKey, hasScope, type ApiKeyTier, TIER_LIMITS } from "../lib/api-key.server";
import { z } from "zod";

// ── API Key Auth ──────────────────────────────────────────────────
async function authenticate(request: Request) {
  const key = request.headers.get("X-API-Key");
  if (!key) {
    throw data({ error: "Unauthorized. Provide X-API-Key header." }, { status: 401 });
  }

  const result = await validateApiKey(key);
  if (!result.valid || !result.apiKey) {
    throw data({ error: "Invalid API key." }, { status: 401 });
  }

  return result.apiKey;
}

function requireScope(scopes: string[], scope: string) {
  if (!hasScope(scopes, scope)) {
    throw data({ error: `Insufficient scope. Required: ${scope}` }, { status: 403 });
  }
}

// ── Zod Schemas ───────────────────────────────────────────────────

const LEAD_STATUSES = ["INBOX", "ACTIVE", "REJECTED", "QUALIFIED", "CONVERTED"] as const;
const LEAD_STAGES = ["SOURCED", "OUTREACH", "RESPONDED", "DEMO", "PROPOSAL", "NEGOTIATION", "CLOSED"] as const;

const LeadPayloadSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  industry: z.string().optional(),
  estimatedTraffic: z.string().optional(),
  techStack: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  leadSource: z.string().optional().default("API"),
  notes: z.string().optional(),
});

const LeadsQuerySchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

const LEAD_PUBLIC_FIELDS = {
  id: true,
  companyName: true,
  website: true,
  contactName: true,
  email: true,
  industry: true,
  estimatedTraffic: true,
  techStack: true,
  linkedin: true,
  facebook: true,
  instagram: true,
  twitter: true,
  status: true,
  stage: true,
  leadSource: true,
  createdAt: true,
} as const;

// ── In-memory rate limit tracking ─────────────────────────────────
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(keyId: string, tier: ApiKeyTier): { allowed: boolean; remaining: number; resetAt: number } {
  const limits = TIER_LIMITS[tier];
  const now = Date.now();
  let entry = rateLimitStore.get(keyId);

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + 60_000 };
    rateLimitStore.set(keyId, entry);
  }

  entry.count++;
  const remaining = Math.max(0, limits.perMinute - entry.count);
  const allowed = entry.count <= limits.perMinute;

  return { allowed, remaining, resetAt: entry.resetAt };
}

function rateLimitHeaders(tier: ApiKeyTier, remaining: number, resetAt: number) {
  const limits = TIER_LIMITS[tier];
  return {
    "X-RateLimit-Limit": String(limits.perMinute),
    "X-RateLimit-Remaining": String(Math.max(0, remaining)),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
  };
}

// ── GET /api/leads ────────────────────────────────────────────────

export async function loader({ request }: { request: Request }) {
  const apiKey = await authenticate(request);
  requireScope(apiKey.scopes, "leads:read");

  // Enforce rate limit
  const rl = checkRateLimit(apiKey.id, apiKey.tier);
  if (!rl.allowed) {
    throw data(
      { error: "Rate limit exceeded. Retry after the time shown in X-RateLimit-Reset." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)), ...rateLimitHeaders(apiKey.tier, 0, rl.resetAt) } }
    );
  }

  // Validate query params
  const url = new URL(request.url);
  const queryResult = LeadsQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!queryResult.success) {
    throw data({ error: "Invalid query parameters", issues: queryResult.error.issues }, { status: 400 });
  }
  const { status, limit, offset } = queryResult.data;

  const leads = await prisma.lead.findMany({
    where: status ? { status } : undefined,
    take: limit,
    skip: offset,
    orderBy: { createdAt: "desc" },
    select: LEAD_PUBLIC_FIELDS,
  });

  const total = await prisma.lead.count({
    where: status ? { status } : undefined,
  });

  return data(
    { leads, total, limit, offset },
    {
      headers: rateLimitHeaders(apiKey.tier, rl.remaining, rl.resetAt),
    }
  );
}

// ── POST /api/leads ───────────────────────────────────────────────

export async function action({ request }: { request: Request }) {
  const apiKey = await authenticate(request);
  requireScope(apiKey.scopes, "leads:write");

  // Enforce rate limit
  const rl = checkRateLimit(apiKey.id, apiKey.tier);
  if (!rl.allowed) {
    throw data(
      { error: "Rate limit exceeded. Retry after the time shown in X-RateLimit-Reset." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)), ...rateLimitHeaders(apiKey.tier, 0, rl.resetAt) } }
    );
  }

  if (request.method !== "POST") {
    throw data({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const payload = LeadPayloadSchema.parse(body);

    const existing = await prisma.lead.findUnique({
      where: { email: payload.email },
    });

    if (existing) {
      const updated = await prisma.lead.update({
        where: { id: existing.id },
        data: {
          companyName: payload.companyName,
          website: payload.website ?? existing.website,
          contactName: payload.contactName ?? existing.contactName,
          industry: payload.industry ?? existing.industry,
          estimatedTraffic: payload.estimatedTraffic ?? existing.estimatedTraffic,
          techStack: payload.techStack ?? existing.techStack,
          linkedin: payload.linkedin ?? existing.linkedin,
          facebook: payload.facebook ?? existing.facebook,
          instagram: payload.instagram ?? existing.instagram,
          twitter: payload.twitter ?? existing.twitter,
          leadSource: payload.leadSource,
          notes: payload.notes
            ? `${existing.notes || ""}\n[Updated]: ${payload.notes}`.trim()
            : existing.notes,
        },
      });

      await logActivity({
        leadId: existing.id,
        userId: apiKey.userId,
        action: "LEAD_EDITED",
        description: `External API updated lead data (${payload.leadSource})`,
        metadata: { source: payload.leadSource, merged: true },
      });

      return data({ lead: updated, merged: true }, { status: 200 });
    }

    const lead = await prisma.lead.create({
      data: {
        companyName: payload.companyName,
        website: payload.website,
        contactName: payload.contactName,
        email: payload.email,
        industry: payload.industry,
        estimatedTraffic: payload.estimatedTraffic,
        techStack: payload.techStack,
        linkedin: payload.linkedin,
        facebook: payload.facebook,
        instagram: payload.instagram,
        twitter: payload.twitter,
        leadSource: payload.leadSource,
        notes: payload.notes,
        status: "INBOX",
        stage: "SOURCED",
      },
    });

    await logActivity({
      leadId: lead.id,
      userId: apiKey.userId,
      action: "LEAD_CREATED",
      description: `Added via external API (${payload.leadSource})`,
      metadata: { source: payload.leadSource },
    });

    return data({ lead, merged: false }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw data(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }
    throw data({ error: "Internal server error" }, { status: 500 });
  }
}