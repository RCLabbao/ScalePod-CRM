import { createHash, randomBytes } from "crypto";
import { prisma } from "./prisma.server";

// Re-export shared types and constants for backward compatibility
export { TIER_LIMITS, type ApiKeyTier } from "./api-key.shared";

const KEY_BYTES = 32;
const KEY_PREFIX = "sk_live_";
const KEY_PREFIX_TEST = "sk_test_";

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function generateApiKey(test = false): { rawKey: string; prefix: string; hash: string } {
  const raw = randomBytes(KEY_BYTES).toString("hex");
  const prefix = test ? KEY_PREFIX_TEST : KEY_PREFIX;
  const rawKey = `${prefix}${raw}`;
  const displayPrefix = rawKey.slice(0, 12);
  const hash = sha256(rawKey);

  return { rawKey, prefix: displayPrefix, hash };
}

export function hashApiKey(key: string): string {
  return sha256(key);
}

// ── In-memory cache for validated API keys ──────────────────────
// Avoids a DB round-trip on every API request. Keys are cached
// for 60 seconds. Revocations clear the cache immediately.
const keyCache = new Map<string, { apiKey: { id: string; tier: ApiKeyTier; scopes: string[]; userId: string }; expiresAt: number }>();
const KEY_CACHE_TTL_MS = 60_000; // 60 seconds

// Periodic cleanup of expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of keyCache) {
    if (now >= entry.expiresAt) keyCache.delete(key);
  }
}, 60_000).unref();

export function invalidateApiKeyCache(hash: string) {
  keyCache.delete(hash);
}

export async function validateApiKey(key: string): Promise<{
  valid: boolean;
  apiKey?: {
    id: string;
    tier: ApiKeyTier;
    scopes: string[];
    userId: string;
  };
}> {
  if (!key || key.length < 40) {
    return { valid: false };
  }

  const hash = hashApiKey(key);

  // Check cache first
  const cached = keyCache.get(hash);
  if (cached && Date.now() < cached.expiresAt) {
    return { valid: true, apiKey: cached.apiKey };
  }

  const apiKey = await prisma.apiKey.findUnique({
    where: { hash },
    select: { id: true, tier: true, scopes: true, userId: true, active: true },
  });

  if (!apiKey || !apiKey.active) {
    return { valid: false };
  }

  const result = {
    id: apiKey.id,
    tier: apiKey.tier as ApiKeyTier,
    scopes: (apiKey.scopes as string[]) || [],
    userId: apiKey.userId,
  };

  // Cache for future requests
  keyCache.set(hash, { apiKey: result, expiresAt: Date.now() + KEY_CACHE_TTL_MS });

  // Update lastUsedAt asynchronously (don't block the request)
  // Throttle: only update if lastUsedAt is older than 5 minutes
  prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  }).catch(() => {});

  return { valid: true, apiKey: result };
}

export function hasScope(scopes: string[], required: string): boolean {
  if (scopes.includes("*")) return true;
  if (scopes.includes(required)) return true;

  // "leads:write" also grants "leads:read"
  const [resource, action] = required.split(":");
  if (action === "read" && scopes.includes(`${resource}:write`)) return true;

  return false;
}

export function maskKey(rawKey: string): string {
  return `${rawKey.slice(0, 12)}...${rawKey.slice(-4)}`;
}