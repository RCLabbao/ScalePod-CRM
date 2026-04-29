import { redirect } from "react-router";
import { getSession, sessionStorage } from "../sessions/session";
import { prisma } from "./prisma.server";

// ── Light-weight session-only cache ──────────────────────────────
// Verifies user existence at most once per 60s per user ID.
// This avoids a DB query on every single request while still
// handling the edge case of deleted users.
const userExistenceCache = new Map<string, { exists: boolean; expiresAt: number }>();
const USER_CACHE_TTL_MS = 60_000; // 60 seconds

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of userExistenceCache) {
    if (now >= entry.expiresAt) userExistenceCache.delete(key);
  }
}, 60_000).unref();

export async function requireAuth(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  // Check cache before hitting DB
  const cached = userExistenceCache.get(userId);
  if (cached && Date.now() < cached.expiresAt && cached.exists) {
    return userId;
  }

  const exists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!exists) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }

  userExistenceCache.set(userId, { exists: true, expiresAt: Date.now() + USER_CACHE_TTL_MS });
  return userId;
}

export async function requireAdmin(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  // Single query: get role + verify existence
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }

  if (user.role !== "ADMIN") {
    throw redirect("/dashboard");
  }

  return userId;
}

export async function getUserRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role || "AGENT";
}