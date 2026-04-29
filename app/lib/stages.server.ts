import { prisma } from "./prisma.server";
import { getStageClasses, DEFAULT_STAGE_SEED, type StageMeta } from "./stages";

// ── Types ──────────────────────────────────────────────────────

export type StageRow = {
  id: string;
  name: string;
  label: string;
  colorKey: string;
  position: number;
};

export type StageWithMeta = StageRow & {
  meta: ReturnType<typeof getStageClasses>;
};

// ── In-Memory Cache ────────────────────────────────────────────

let stagesCache: StageRow[] | null = null;
let stagesCacheExpiry = 0;
const CACHE_TTL_MS = 60_000;

export function invalidateStagesCache() {
  stagesCache = null;
  stagesCacheExpiry = 0;
}

// ── Check if PipelineStage table exists ────────────────────────

let tableExists: boolean | null = null;

export async function checkTableExists(): Promise<boolean> {
  if (tableExists !== null) return tableExists;
  try {
    await prisma.$queryRaw`SELECT 1 FROM PipelineStage LIMIT 1`;
    tableExists = true;
  } catch {
    tableExists = false;
  }
  return tableExists;
}

// ── Queries (raw SQL — works without generated Prisma model) ──

export async function getStages(): Promise<StageRow[]> {
  if (stagesCache && Date.now() < stagesCacheExpiry) {
    return stagesCache;
  }

  let stages: StageRow[] = [];
  if (await checkTableExists()) {
    try {
      stages = await prisma.$queryRaw<StageRow[]>`
        SELECT id, name, label, colorKey, position
        FROM PipelineStage
        ORDER BY position ASC
      `;
    } catch (err) {
      console.error("[stages] Failed to load pipeline stages:", err);
    }
  }

  // Fallback: table doesn't exist or has no rows
  if (stages.length === 0) {
    stages = DEFAULT_STAGE_SEED.map((s, i) => ({
      id: `default_${i}`,
      name: s.name,
      label: s.label,
      colorKey: s.colorKey,
      position: s.position,
    }));
  }

  stagesCache = stages;
  stagesCacheExpiry = Date.now() + CACHE_TTL_MS;
  return stages;
}

export async function getStagesWithMeta(): Promise<StageWithMeta[]> {
  const stages = await getStages();
  return stages.map((s) => ({
    ...s,
    meta: getStageClasses(s.colorKey),
  }));
}

export async function getValidStageNames(): Promise<string[]> {
  const stages = await getStages();
  return stages.map((s) => s.name);
}

export async function getFirstStageName(): Promise<string> {
  const stages = await getStages();
  return stages.length > 0 ? stages[0].name : "SOURCED";
}

// ── Seed Default Stages ────────────────────────────────────────

let seeded = false;

export async function seedDefaultStages(): Promise<void> {
  if (seeded) return;

  if (!(await checkTableExists())) {
    // Table doesn't exist yet — can't seed
    return;
  }

  try {
    const rows = await prisma.$queryRaw<StageRow[]>`SELECT id FROM PipelineStage LIMIT 1`;
    if (rows.length > 0) {
      seeded = true;
      return;
    }

    for (const s of DEFAULT_STAGE_SEED) {
      await prisma.$executeRaw`
        INSERT INTO PipelineStage (id, name, label, colorKey, position, createdAt, updatedAt)
        VALUES (${s.name.toLowerCase().replace(/_/g, "")}, ${s.name}, ${s.label}, ${s.colorKey}, ${s.position}, NOW(), NOW())
      `;
    }

    console.log("[stages] Seeded default pipeline stages");
    invalidateStagesCache();
    seeded = true;
  } catch (err) {
    console.error("[stages] Failed to seed default stages:", err);
  }
}