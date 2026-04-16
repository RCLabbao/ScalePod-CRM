import { redirect } from "react-router";
import { getSession, sessionStorage } from "../sessions/session";
import { prisma } from "./prisma.server";

export async function requireAuth(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  // Verify user still exists (handles DB resets / deleted users)
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

  return userId;
}

export async function requireAdmin(request: Request) {
  const userId = await requireAuth(request);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
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
