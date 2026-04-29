import { prisma } from "./prisma.server";
import { scoreLead, getScoreConfig } from "./scoring.server";
import { logActivity } from "./activity-log.server";

// ── Types ──────────────────────────────────────────────────────

type FieldType = "INDUSTRY" | "ESTIMATED_TRAFFIC" | "TECH_STACK" | "LEAD_SOURCE" | "WEBSITE";
type Operator = "CONTAINS" | "EQUALS" | "STARTS_WITH" | "REGEX";

interface RuleMatch {
  ruleId: string;
  ruleName: string;
  points: number;
}

interface RulesResult {
  bonusPoints: number;
  matchedRules: RuleMatch[];
}

interface LeadFieldData {
  industry?: string | null;
  estimatedTraffic?: string | null;
  techStack?: string | null;
  leadSource?: string | null;
  website?: string | null;
}

// ── Rule Evaluation ─────────────────────────────────────────────

function matchRule(rule: { fieldType: string; operator: string; value: string }, leadData: LeadFieldData): boolean {
  const fieldValue = getFieldValue(rule.fieldType as FieldType, leadData);
  if (fieldValue === null || fieldValue === undefined) return false;

  const ruleValue = rule.value;
  const fieldLower = fieldValue.toLowerCase();
  const ruleLower = ruleValue.toLowerCase();

  switch (rule.operator as Operator) {
    case "CONTAINS":
      return fieldLower.includes(ruleLower);
    case "EQUALS":
      return fieldLower === ruleLower;
    case "STARTS_WITH":
      return fieldLower.startsWith(ruleLower);
    case "REGEX":
      try {
        return new RegExp(ruleValue, "i").test(fieldValue);
      } catch {
        return false;
      }
    default:
      return false;
  }
}

function getFieldValue(fieldType: FieldType, leadData: LeadFieldData): string | null {
  switch (fieldType) {
    case "INDUSTRY":
      return leadData.industry ?? null;
    case "ESTIMATED_TRAFFIC":
      return leadData.estimatedTraffic ?? null;
    case "TECH_STACK":
      return leadData.techStack ?? null;
    case "LEAD_SOURCE":
      return leadData.leadSource ?? null;
    case "WEBSITE":
      return leadData.website ?? null;
    default:
      return null;
  }
}

export async function evaluateRules(leadData: LeadFieldData): Promise<RulesResult> {
  const rules = await prisma.scoringRule.findMany({
    where: { active: true },
    orderBy: { priority: "asc" },
  });

  let bonusPoints = 0;
  const matchedRules: RuleMatch[] = [];

  for (const rule of rules) {
    if (matchRule(rule, leadData)) {
      bonusPoints += rule.points;
      matchedRules.push({
        ruleId: rule.id,
        ruleName: rule.name,
        points: rule.points,
      });
    }
  }

  return { bonusPoints, matchedRules };
}

// ── Combined Scoring ───────────────────────────────────────────

interface CombinedScoreResult {
  score: number;
  maxScore: number;
  percentage: number;
  temperature: "HOT" | "WARM" | "COLD";
  bonusPoints: number;
  matchedRules: RuleMatch[];
  criteriaScore: number;
  criteriaMaxScore: number;
}

/**
 * Score a lead using both criteria-based scoring and attribute-based rules.
 * If no criteria responses are provided, only rule-based bonus points are applied.
 */
export async function scoreLeadWithRules(
  criteriaResponses: { criteriaId: string; response: string; score: number }[] | undefined,
  leadData: LeadFieldData
): Promise<CombinedScoreResult> {
  const config = await getScoreConfig();
  const hotThreshold = config?.hotThreshold ?? 80;
  const warmThreshold = config?.warmThreshold ?? 50;

  // Evaluate attribute-based rules
  const { bonusPoints, matchedRules } = await evaluateRules(leadData);

  let criteriaScore = 0;
  let criteriaMaxScore = 0;
  let criteriaResponsesResult: { criteriaId: string; response: string; score: number }[] = [];

  if (criteriaResponses && criteriaResponses.length > 0) {
    const criteriaResult = await scoreLead(criteriaResponses);
    criteriaScore = criteriaResult.score;
    criteriaMaxScore = criteriaResult.maxScore;
    criteriaResponsesResult = criteriaResult.responses;
  }

  const totalScore = criteriaScore + bonusPoints;
  const totalMax = criteriaMaxScore + bonusPoints; // bonus points also increase max
  const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : (bonusPoints > 0 ? (totalScore / bonusPoints) * 100 : 0);

  let temperature: "HOT" | "WARM" | "COLD";
  if (percentage >= hotThreshold) {
    temperature = "HOT";
  } else if (percentage >= warmThreshold) {
    temperature = "WARM";
  } else {
    temperature = "COLD";
  }

  return {
    score: totalScore,
    maxScore: totalMax,
    percentage,
    temperature,
    bonusPoints,
    matchedRules,
    criteriaScore,
    criteriaMaxScore,
  };
}

// ── Recalculate All ────────────────────────────────────────────

/**
 * Recalculate scores for all leads using current rules and criteria.
 * Returns counts of updated leads and errors.
 */
export async function recalculateAllLeadScores(): Promise<{ updated: number; errors: number }> {
  const config = await getScoreConfig();
  if (!config.autoScore) {
    return { updated: 0, errors: 0 };
  }

  const leads = await prisma.lead.findMany({
    select: {
      id: true,
      industry: true,
      estimatedTraffic: true,
      techStack: true,
      leadSource: true,
      website: true,
    },
  });

  let updated = 0;
  let errors = 0;

  for (const lead of leads) {
    try {
      // Get existing criteria responses for this lead
      const verifications = await prisma.leadVerification.findMany({
        where: { leadId: lead.id },
        select: { criteriaId: true, response: true, score: true },
      });

      const criteriaResponses = verifications.map((v) => ({
        criteriaId: v.criteriaId,
        response: v.response,
        score: v.score,
      }));

      const result = await scoreLeadWithRules(criteriaResponses, {
        industry: lead.industry,
        estimatedTraffic: lead.estimatedTraffic,
        techStack: lead.techStack,
        leadSource: lead.leadSource,
        website: lead.website,
      });

      // Get current temperature for change detection
      const currentLead = await prisma.lead.findUnique({
        where: { id: lead.id },
        select: { temperature: true },
      });

      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          score: result.score,
          maxScore: result.maxScore,
          temperature: result.temperature,
        },
      });

      // Log temperature change if it occurred
      if (currentLead && currentLead.temperature !== result.temperature) {
        await logActivity({
          leadId: lead.id,
          action: "TEMPERATURE_CHANGED",
          description: `Temperature changed from ${currentLead.temperature} to ${result.temperature}`,
          metadata: {
            previousTemperature: currentLead.temperature,
            newTemperature: result.temperature,
            temperature: result.temperature,
            score: result.score,
            maxScore: result.maxScore,
            percentage: Math.round(result.percentage),
          },
        });
      }

      updated++;
    } catch {
      errors++;
    }
  }

  return { updated, errors };
}