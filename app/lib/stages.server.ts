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

// ── Queries ────────────────────────────────────────────────────

export async function getStages(): Promise<StageRow[]> {
  if (stagesCache && Date.now() < stagesCacheExpiry) {
    return stagesCache;
  }

  let stages: StageRow[] = [];
  try {
    stages = await prisma.pipelineStage.findMany({
      orderBy: { position: "asc" },
    }) as StageRow[];
  } catch (err) {
    console.error("[stages] Failed to load pipeline stages — run pending migrations:", err);
  }

  // Fallback: if PipelineStage table exists but has no rows (migration not seeded yet),
  // return the default stages so the app keeps working
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

  try {
    const count = await prisma.pipelineStage.count();
    if (count > 0) {
      seeded = true;
      return;
    }

    for (const s of DEFAULT_STAGE_SEED) {
      await prisma.pipelineStage.create({
        data: {
          name: s.name,
          label: s.label,
          colorKey: s.colorKey,
          position: s.position,
        },
      });
    }

    console.log("[stages] Seeded default pipeline stages");
    invalidateStagesCache();
  } catch (err) {
    console.error("[stages] Failed to seed default stages:", err);
  }

  seeded = true;
}