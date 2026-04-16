import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);

  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");

  if (!jobId) {
    return Response.json({ error: "jobId is required" }, { status: 400 });
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
    return Response.json({ error: "Job not found" }, { status: 404 });
  }

  return Response.json(job);
}
