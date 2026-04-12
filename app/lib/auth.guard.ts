import { redirect } from "react-router";
import { getSession } from "../sessions/session";
import { prisma } from "./prisma";

export async function requireAuth(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
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
