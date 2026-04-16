import { prisma } from "./prisma.server";
import { checkDangerousSQL, parseSQLStatements, discoverMigrationFiles } from "./migration-utils";
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

    // ── Safety check: block dangerous SQL patterns ────
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

        // Record the migration as applied (parameterized)
        await tx.$executeRawUnsafe(
          `INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES (?, NOW(3))`,
          [migration.name]
        );
      });

      appliedList.push(migration.name);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ migration: migration.name, error: message });
      break;
    }
  }

  return { applied: appliedList, errors };
}

// ── Mark the baseline as applied (first-time setup) ─
export async function markBaselineApplied(): Promise<boolean> {
  await ensureMigrationTable();

  const applied = await getAppliedMigrations();
  if (applied.includes("000_baseline.sql")) {
    return false;
  }

  await prisma.$executeRawUnsafe(
    `INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES (?, NOW(3))`,
    ["000_baseline.sql"]
  );

  return true;
}
