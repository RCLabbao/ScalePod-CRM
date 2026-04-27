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

  const apiKey = await prisma.apiKey.findUnique({
    where: { hash },
    select: { id: true, tier: true, scopes: true, userId: true, active: true },
  });

  if (!apiKey || !apiKey.active) {
    return { valid: false };
  }

  // Update lastUsedAt asynchronously (don't block the request)
  prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  }).catch(() => {});

  return {
    valid: true,
    apiKey: {
      id: apiKey.id,
      tier: apiKey.tier as ApiKeyTier,
      scopes: (apiKey.scopes as string[]) || [],
      userId: apiKey.userId,
    },
  };
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