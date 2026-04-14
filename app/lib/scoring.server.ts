import { prisma } from "./prisma.server";

interface CriteriaResponse {
  criteriaId: string;
  response: string;
}

interface ScoreResult {
  score: number;
  maxScore: number;
  percentage: number;
  temperature: "HOT" | "WARM" | "COLD";
  responses: { criteriaId: string; response: string; score: number }[];
}

/**
 * Calculate lead score from criteria responses.
 * Used by both manual intake and scraper API.
 *
 * Scoring rules:
 *   YES_NO: "yes" = weight, "no" = 0
 *   SCORE:  value * weight (1-5 scale)
 *   TEXT:   0 (qualitative only, does not affect score)
 */
export async function scoreLead(responses: CriteriaResponse[]): Promise<ScoreResult> {
  const criteria = await prisma.verificationCriteria.findMany({
    where: { active: true },
  });

  const criteriaMap = new Map(criteria.map((c) => [c.id, c]));
  const config = await getScoreConfig();

  const hotThreshold = config?.hotThreshold ?? 80;
  const warmThreshold = config?.warmThreshold ?? 50;

  let totalScore = 0;
  let totalMax = 0;
  const scored: { criteriaId: string; response: string; score: number }[] = [];

  for (const r of responses) {
    const c = criteriaMap.get(r.criteriaId);
    if (!c) continue;

    let points = 0;
    let maxForThis = 0;

    if (c.type === "YES_NO") {
      maxForThis = c.weight;
      points = r.response === "yes" ? c.weight : 0;
    } else if (c.type === "SCORE") {
      maxForThis = 5 * c.weight;
      const val = parseFloat(r.response);
      if (!isNaN(val) && val >= 1 && val <= 5) {
        points = val * c.weight;
      }
    }
    // TEXT criteria: no score contribution

    totalScore += points;
    totalMax += maxForThis;
    scored.push({ criteriaId: r.criteriaId, response: r.response, score: points });
  }

  const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

  let temperature: "HOT" | "WARM" | "COLD";
  if (percentage >= hotThreshold) {
    temperature = "HOT";
  } else if (percentage >= warmThreshold) {
    temperature = "WARM";
  } else {
    temperature = "COLD";
  }

  return { score: totalScore, maxScore: totalMax, percentage, temperature, responses: scored };
}

export async function getScoreConfig() {
  return prisma.scoreConfig.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
}
