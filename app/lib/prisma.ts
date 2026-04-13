import { PrismaClient } from "@prisma/client";

// Build connection URL from separate env vars to avoid URL parsing issues
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || "3306";
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

let datasourceUrl: string | undefined;

if (dbUser && dbPass && dbName) {
  datasourceUrl = `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
  console.log(`[DB] Connecting as ${dbUser}@${dbHost}:${dbPort}/${dbName}`);
} else {
  console.log("[DB] Using DATABASE_URL from env");
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    ...(datasourceUrl ? { datasourceUrl } : {}),
    log: [
      { emit: "stdout", level: "error" },
    ],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
