import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { validateApiKey, hasScope } from "../lib/api-key.server";
import { data } from "react-router";
import { z } from "zod";

// ── Dual auth: session OR API key with scraper:read scope ─────────
async function authenticate(request: Request) {
  const apiKeyHeader = request.headers.get("X-API-Key");
  if (apiKeyHeader) {
    const result = await validateApiKey(apiKeyHeader);
    if (!result.valid || !result.apiKey) {
      throw data({ error: "Invalid API key." }, { status: 401 });
    }
    if (!hasScope(result.apiKey.scopes, "scraper:read")) {
      throw data({ error: "Insufficient scope. Required: scraper:read" }, { status: 403 });
    }
    return result.apiKey.userId;
  }

  return await requireAuth(request);
}

const ScraperQuerySchema = z.object({
  jobId: z.string().min(1, "jobId is required").max(50),
});

export async function loader({ request }: { request: Request }) {
  await authenticate(request);

  const url = new URL(request.url);
  const result = ScraperQuerySchema.safeParse({
    jobId: url.searchParams.get("jobId") || "",
  });
  if (!result.success) {
    throw data({ error: "Invalid query parameters", issues: result.error.issues }, { status: 400 });
  }

  const job = await prisma.scraperJob.findUnique({
    where: { id: result.data.jobId },
    select: {
      status: true,
      totalDiscovered: true,
      totalValid: true,
      totalEnriched: true,
      totalImported: true,
      totalSkipped: true,
      totalFailed: true,
    },
  });

  if (!job) {
    throw data({ error: "Job not found" }, { status: 404 });
  }

  return data(job);
}