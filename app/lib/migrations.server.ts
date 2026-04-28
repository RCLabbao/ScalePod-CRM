import { prisma } from "./prisma.server";
import { checkDangerousSQL, parseSQLStatements, discoverMigrationFiles, sanitizeMigrationName, getNextMigrationNumber } from "./migration-utils";
import * as fs from "node:fs";
import * as path from "node:path";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "migrations");

// ── Ensure the _MigrationLog table exists ──────────
async function ensureMigrationTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS \`_MigrationLog\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL UNIQUE,
      \`appliedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`checksum\` VARCHAR(64) NULL
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
}

// ── Get list of already-applied migration names ────
async function getAppliedMigrations(): Promise<string[]> {
  await ensureMigrationTable();
  const rows: Array<{ name: string }> = await prisma.$queryRaw`
    SELECT \`name\` FROM \`_MigrationLog\` ORDER BY \`name\` ASC
  `;
  return rows.map((r: { name: string }) => r.name);
}

// ── Record a migration as applied (parameterized — no SQL injection) ──
async function recordMigration(name: string) {
  const safeName = sanitizeMigrationName(name);
  await prisma.$executeRaw`INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES (${safeName}, NOW(3))`;
}

// ── Compute pending migrations ─────────────────────
export async function getMigrationStatus() {
  const applied = await getAppliedMigrations();
  const files = discoverMigrationFiles(MIGRATIONS_DIR).map((name) => ({
    name,
    filePath: path.join(MIGRATIONS_DIR, name),
  }));

  const appliedSet = new Set(applied);

  const migrations = files.map((f) => ({
    name: f.name,
    applied: appliedSet.has(f.name),
  }));

  const pending = migrations.filter((m) => !m.applied);

  return {
    migrations,
    pendingCount: pending.length,
    appliedCount: applied.length,
    total: files.length,
  };
}

// ── Apply all pending migrations ───────────────────
export async function applyPendingMigrations(): Promise<{
  applied: string[];
  errors: Array<{ migration: string; error: string }>;
}> {
  const status = await getMigrationStatus();
  const pending = status.migrations.filter((m) => !m.applied);

  if (pending.length === 0) {
    return { applied: [], errors: [] };
  }

  const appliedList: string[] = [];
  const errors: Array<{ migration: string; error: string }> = [];

  for (const migration of pending) {
    const sql = fs.readFileSync(
      path.join(MIGRATIONS_DIR, migration.name),
      "utf-8"
    );

    const danger = checkDangerousSQL(sql);
    if (danger) {
      errors.push({ migration: migration.name, error: `Blocked: ${danger}` });
      break;
    }

    try {
      await prisma.$transaction(async (tx) => {
        const statements = parseSQLStatements(sql);
        for (const stmt of statements) {
          await tx.$executeRawUnsafe(stmt);
        }
        await recordMigration(migration.name);
      });

      appliedList.push(migration.name);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ migration: migration.name, error: sanitizeErrorMessage(message) });
      break;
    }
  }

  return { applied: appliedList, errors };
}

// ── Create a new migration file from the UI ──────────
export async function createMigration(
  name: string,
  sql: string,
  options?: { autoApply?: boolean }
): Promise<{ filename: string; applied: boolean; error?: string }> {
  const dir = MIGRATIONS_DIR;

  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return { filename: "", applied: false, error: "Name can only contain letters, numbers, dashes, and underscores." };
  }

  if (!sql.trim()) {
    return { filename: "", applied: false, error: "SQL content cannot be empty." };
  }

  const danger = checkDangerousSQL(sql);
  if (danger) {
    return { filename: "", applied: false, error: danger };
  }

  const nextNum = getNextMigrationNumber(dir);
  const filename = `${String(nextNum).padStart(3, "0")}_${name}.sql`;
  const filePath = path.join(dir, filename);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, sql, "utf-8");

  if (options?.autoApply) {
    const result = await applySingleMigration(filename);
    if (result.error) {
      return { filename, applied: false, error: result.error };
    }
    return { filename, applied: true };
  }

  return { filename, applied: false };
}

// ── Apply a single migration by filename ─────────────
export async function applySingleMigration(
  filename: string
): Promise<{ applied: boolean; error?: string }> {
  sanitizeMigrationName(filename);
  const filePath = path.join(MIGRATIONS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return { applied: false, error: `Migration file not found: ${filename}` };
  }

  const applied = await getAppliedMigrations();
  if (applied.includes(filename)) {
    return { applied: false, error: `Migration already applied: ${filename}` };
  }

  const sql = fs.readFileSync(filePath, "utf-8");

  try {
    await prisma.$transaction(async (tx) => {
      const statements = parseSQLStatements(sql);
      for (const stmt of statements) {
        await tx.$executeRawUnsafe(stmt);
      }
      await recordMigration(filename);
    });
    return { applied: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { applied: false, error: sanitizeErrorMessage(message) };
  }
}

// ── Mark the baseline as applied (first-time setup) ─
export async function markBaselineApplied(): Promise<boolean> {
  await ensureMigrationTable();

  const applied = await getAppliedMigrations();
  if (applied.includes("000_baseline.sql")) {
    return false;
  }

  await recordMigration("000_baseline.sql");
  return true;
}

// ── Mark a pending migration as already applied ────────
export async function markMigrationApplied(filename: string): Promise<{ success: boolean; error?: string }> {
  await ensureMigrationTable();

  sanitizeMigrationName(filename);

  const filePath = path.join(MIGRATIONS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return { success: false, error: `Migration file not found: ${filename}` };
  }

  const applied = await getAppliedMigrations();
  if (applied.includes(filename)) {
    return { success: false, error: `Migration already marked as applied: ${filename}` };
  }

  await recordMigration(filename);
  return { success: true };
}

// ── Sanitize error messages before returning to the UI ──
function sanitizeErrorMessage(message: string): string {
  // Strip common DB driver details that leak internal info
  return message
    .replace(/mysql:\/\//g, "mysql:[redacted]@")
    .replace(/password=\S+/g, "password=[redacted]")
    .replace(/host=\S+/g, "host=[redacted]")
    .slice(0, 200); // Truncate long messages
}