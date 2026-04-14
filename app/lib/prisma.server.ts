import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

if (!process.env.DATABASE_URL && process.env.DB_USER) {
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "3306";
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASSWORD;
  const name = process.env.DB_NAME;

  process.env.DATABASE_URL = `mysql://${user}:${pass}@${host}:${port}/${name}`;
  console.log(`[DB] Built from separate vars: ${user}@${host}:${port}/${name}`);
}

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
