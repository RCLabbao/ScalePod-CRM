import { data } from "react-router";
import { prisma } from "../lib/prisma";
import { logActivity } from "../lib/activity-log";
import { z } from "zod";

// API key auth middleware for external scrapers
function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get("X-API-Key");
  return !!apiKey && apiKey.length > 0;
}

const LeadPayloadSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().email("Invalid email format"),
  industry: z.string().optional(),
  estimatedTraffic: z.string().optional(),
  techStack: z.string().optional(),
  leadSource: z.string().optional().default("SCRAPER"),
  notes: z.string().optional(),
});

export async function loader({ request }: { request: Request }) {
  if (!validateApiKey(request)) {
    throw data({ error: "Unauthorized. Provide X-API-Key header." }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || undefined;
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const leads = await prisma.lead.findMany({
    where: status ? { status } : undefined,
    take: Math.min(limit, 100),
    skip: offset,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      website: true,
      contactName: true,
      email: true,
      industry: true,
      estimatedTraffic: true,
      techStack: true,
      status: true,
      stage: true,
      leadSource: true,
      createdAt: true,
    },
  });

  const total = await prisma.lead.count({
    where: status ? { status } : undefined,
  });

  return data({ leads, total, limit, offset });
}

export async function action({ request }: { request: Request }) {
  if (!validateApiKey(request)) {
    throw data({ error: "Unauthorized. Provide X-API-Key header." }, { status: 401 });
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
          leadSource: payload.leadSource,
          notes: payload.notes
            ? `${existing.notes || ""}\n[Updated]: ${payload.notes}`.trim()
            : existing.notes,
        },
      });

      // Log the update
      await logActivity({
        leadId: existing.id,
        action: "LEAD_EDITED",
        description: `External API updated lead data (${payload.leadSource})`,
        metadata: { source: payload.leadSource, merged: true },
      });

      return data({ lead: updated, merged: true }, { status: 200 });
    }

    const lead = await prisma.lead.create({
      data: {
        ...payload,
        status: "INBOX",
        stage: "SOURCED",
      },
    });

    // Log activity for API-created leads
    await logActivity({
      leadId: lead.id,
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
