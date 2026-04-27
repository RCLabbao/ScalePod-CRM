/**
 * Shared API key types and constants.
 * Safe to import from both server and client code.
 */

export type ApiKeyTier = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";

export const TIER_LIMITS: Record<ApiKeyTier, { perMinute: number; perDay: number }> = {
  FREE:       { perMinute: 20,   perDay: 1000 },
  BASIC:      { perMinute: 60,   perDay: 10000 },
  PRO:        { perMinute: 300,  perDay: 100000 },
  ENTERPRISE: { perMinute: 1000, perDay: 1000000 },
};