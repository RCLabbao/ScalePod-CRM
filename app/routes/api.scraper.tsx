import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { validateApiKey, hasScope } from "../lib/api-key.server";
import { data } from "react-router";

// ── Dual auth: session OR API key with scraper:read scope ─────────
async function authenticate(request: Request) {
  // Try API key first
  const apiKeyHeader = request.headers.get("X-API-Key");
  if (apiKeyHeader) {
    const result = await validateApiKey(apiKeyHeader);
    if (result.valid && result.apiKey) {
      if (!hasScope(result.apiKey.scopes, "scraper:read")) {
        throw data({ error: "Insufficient scope. Required: scraper:read" }, { status: 403 });
      }
      return result.apiKey.userId;
    }
  }

  // Fall back to session auth
  return await requireAuth(request);
}

export async function loader({ request }: { request: Request }) {
  await authenticate(request);

  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");

  if (!jobId) {
    return data({ error: "jobId is required" }, { status: 400 });
  }

  const job = await prisma.scraperJob.findUnique({
    where: { id: jobId },
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
    return data({ error: "Job not found" }, { status: 404 });
  }

  return data(job);
}