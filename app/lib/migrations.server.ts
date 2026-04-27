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

// ── Record a migration as applied (safe interpolation) ──
async function recordMigration(tx: ReturnType<typeof prisma.$extends> extends (...args: any[]) => infer R ? R : never, name: string) {
  const safeName = sanitizeMigrationName(name);
  await tx.$executeRawUnsafe(
    `INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES ('${safeName}', NOW(3))`
  );
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

        // Record the migration as applied
        const safeName = sanitizeMigrationName(migration.name);
        await tx.$executeRawUnsafe(
          `INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES ('${safeName}', NOW(3))`
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

// ── Create a new migration file from the UI ──────────
export async function createMigration(
  name: string,
  sql: string,
  options?: { autoApply?: boolean }
): Promise<{ filename: string; applied: boolean; error?: string }> {
  const dir = MIGRATIONS_DIR;

  // Validate name: only alphanumeric, dashes, underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return { filename: "", applied: false, error: "Name can only contain letters, numbers, dashes, and underscores." };
  }

  // Validate SQL content
  if (!sql.trim()) {
    return { filename: "", applied: false, error: "SQL content cannot be empty." };
  }

  const danger = checkDangerousSQL(sql);
  if (danger) {
    return { filename: "", applied: false, error: danger };
  }

  // Determine next sequence number
  const nextNum = getNextMigrationNumber(dir);
  const filename = `${String(nextNum).padStart(3, "0")}_${name}.sql`;
  const filePath = path.join(dir, filename);

  // Ensure migrations directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the migration file
  fs.writeFileSync(filePath, sql, "utf-8");

  // Auto-apply if requested
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
  const safeName = sanitizeMigrationName(filename);
  const filePath = path.join(MIGRATIONS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return { applied: false, error: `Migration file not found: ${filename}` };
  }

  // Check if already applied
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
      await tx.$executeRawUnsafe(
        `INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES ('${safeName}', NOW(3))`
      );
    });
    return { applied: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { applied: false, error: message };
  }
}

// ── Mark the baseline as applied (first-time setup) ─
export async function markBaselineApplied(): Promise<boolean> {
  await ensureMigrationTable();

  const applied = await getAppliedMigrations();
  if (applied.includes("000_baseline.sql")) {
    return false;
  }

  const safeName = sanitizeMigrationName("000_baseline.sql");
  await prisma.$executeRawUnsafe(
    `INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES ('${safeName}', NOW(3))`
  );

  return true;
}

// ── Mark a pending migration as already applied ────────
// Use when the migration's SQL changes already exist in the database
// (e.g., table was created manually before the migration system existed)
export async function markMigrationApplied(filename: string): Promise<{ success: boolean; error?: string }> {
  await ensureMigrationTable();

  // Validate filename
  const safeName = sanitizeMigrationName(filename);

  // Check that the file actually exists
  const filePath = path.join(MIGRATIONS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return { success: false, error: `Migration file not found: ${filename}` };
  }

  // Check it's not already marked as applied
  const applied = await getAppliedMigrations();
  if (applied.includes(filename)) {
    return { success: false, error: `Migration already marked as applied: ${filename}` };
  }

  // Record it as applied without executing the SQL
  await prisma.$executeRawUnsafe(
    `INSERT INTO \`_MigrationLog\` (\`name\`, \`appliedAt\`) VALUES ('${safeName}', NOW(3))`
  );

  return { success: true };
}
