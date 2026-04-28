import { prisma } from "../lib/prisma.server";
import { data } from "react-router";

export async function loader({ request }: { request: Request }) {
  const results: Record<string, any> = {};

  // Test 1: Basic DB connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    results.dbConnection = "OK";
  } catch (err: any) {
    results.dbConnection = { error: err.message, code: err.code };
  }

  // Test 2: Does prisma.apiKey exist?
  try {
    const count = await prisma.apiKey.count();
    results.apiKeyModel = { exists: true, count };
  } catch (err: any) {
    results.apiKeyModel = { exists: false, error: err.message, code: err.code };
  }

  // Test 3: Check if ApiKey table exists in DB
  try {
    const tables: Array<{ tableName: string }> = await prisma.$queryRaw`
      SELECT TABLE_NAME as tableName FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ApiKey'
    `;
    results.apiKeyTable = tables.length > 0 ? "EXISTS" : "MISSING";
  } catch (err: any) {
    results.apiKeyTable = { error: err.message };
  }

  // Test 4: Prisma client models available
  try {
    results.prismaModels = Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_'));
  } catch (err: any) {
    results.prismaModels = { error: err.message };
  }

  // Test 5: Prisma client version info
  try {
    const pkg = await import('@prisma/client/package.json');
    results.prismaClientVersion = pkg.version;
  } catch {
    results.prismaClientVersion = "unknown";
  }

  return data(results);
}