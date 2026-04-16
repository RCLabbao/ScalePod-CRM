import { describe, it, expect } from "vitest";
import {
  checkDangerousSQL,
  parseSQLStatements,
  discoverMigrationFiles,
} from "../app/lib/migration-utils";
import * as fs from "node:fs";
import * as path from "node:path";

const PROJECT_ROOT = path.resolve(process.cwd());

// ── Dangerous SQL Detection ────────────────────────

describe("checkDangerousSQL", () => {
  it("blocks DROP DATABASE", () => {
    const result = checkDangerousSQL("DROP DATABASE scalepod_crm;");
    expect(result).not.toBeNull();
    expect(result).toContain("DROP DATABASE");
  });

  it("blocks TRUNCATE", () => {
    const result = checkDangerousSQL("TRUNCATE TABLE User;");
    expect(result).not.toBeNull();
    expect(result).toContain("TRUNCATE");
  });

  it("blocks DROP TABLE without IF EXISTS", () => {
    const result = checkDangerousSQL("DROP TABLE Lead;");
    expect(result).not.toBeNull();
    expect(result).toContain("DROP TABLE without IF EXISTS");
  });

  it("allows DROP TABLE with IF EXISTS", () => {
    const result = checkDangerousSQL("DROP TABLE IF EXISTS temp_table;");
    expect(result).toBeNull();
  });

  it("blocks DELETE without WHERE", () => {
    const result = checkDangerousSQL("DELETE FROM User;");
    expect(result).not.toBeNull();
    expect(result).toContain("DELETE without WHERE");
  });

  it("allows DELETE with WHERE", () => {
    const result = checkDangerousSQL("DELETE FROM User WHERE id = 'x';");
    expect(result).toBeNull();
  });

  it("allows safe ALTER TABLE", () => {
    const result = checkDangerousSQL(
      "ALTER TABLE `Lead` ADD COLUMN IF NOT EXISTS `phone` VARCHAR(191) NULL;"
    );
    expect(result).toBeNull();
  });

  it("allows safe CREATE TABLE IF NOT EXISTS", () => {
    const result = checkDangerousSQL(`
      CREATE TABLE IF NOT EXISTS \`_MigrationLog\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL UNIQUE
      );
    `);
    expect(result).toBeNull();
  });

  it("returns null for comment-only SQL", () => {
    const result = checkDangerousSQL(`
      -- This is just a comment
      -- Nothing executable here
    `);
    expect(result).toBeNull();
  });
});

// ── SQL Statement Parsing ──────────────────────────

describe("parseSQLStatements", () => {
  it("splits statements by semicolons", () => {
    const sql = "SELECT 1; SELECT 2; SELECT 3;";
    const stmts = parseSQLStatements(sql);
    expect(stmts).toEqual(["SELECT 1", "SELECT 2", "SELECT 3"]);
  });

  it("filters out comment-only blocks", () => {
    const sql = `
      -- This is a comment
      ALTER TABLE \`Lead\` ADD COLUMN \`phone\` VARCHAR(191);
      -- Another comment
    `;
    const stmts = parseSQLStatements(sql);
    expect(stmts).toHaveLength(1);
    expect(stmts[0]).toContain("ALTER TABLE");
  });

  it("filters out empty statements", () => {
    const sql = ";;; SELECT 1 ;;;";
    const stmts = parseSQLStatements(sql);
    expect(stmts).toEqual(["SELECT 1"]);
  });

  it("returns empty array for comment-only file", () => {
    const sql = `
      -- ── Baseline Migration ──────────────────────────
      -- This is a marker for the initial schema
      -- All tables are considered already applied
      -- ────────────────────────────────────────────────
    `;
    const stmts = parseSQLStatements(sql);
    expect(stmts).toEqual([]);
  });

  it("handles mixed comments and statements", () => {
    const sql = `
      -- Add phone column
      ALTER TABLE \`Lead\` ADD COLUMN \`phone\` VARCHAR(191);
      -- Add address column
      ALTER TABLE \`Lead\` ADD COLUMN \`address\` TEXT;
    `;
    const stmts = parseSQLStatements(sql);
    expect(stmts).toHaveLength(2);
  });
});

// ── Baseline Migration Safety ──────────────────────

describe("Baseline migration file (000_baseline.sql)", () => {
  const baselinePath = path.join(PROJECT_ROOT, "migrations", "000_baseline.sql");

  it("exists in migrations directory", () => {
    expect(fs.existsSync(baselinePath)).toBe(true);
  });

  it("contains NO executable SQL statements", () => {
    const sql = fs.readFileSync(baselinePath, "utf-8");
    const stmts = parseSQLStatements(sql);
    expect(stmts).toEqual([]);
  });

  it("passes dangerous SQL check", () => {
    const sql = fs.readFileSync(baselinePath, "utf-8");
    expect(checkDangerousSQL(sql)).toBeNull();
  });

  it("is safe to run — contains only comments", () => {
    const sql = fs.readFileSync(baselinePath, "utf-8");
    const lines = sql.split("\n").filter((l) => l.trim().length > 0);
    const allComments = lines.every(
      (l) => l.trim().startsWith("--") || l.trim().length === 0
    );
    expect(allComments).toBe(true);
  });
});

// ── database-setup.sql Warnings ────────────────────

describe("database-setup.sql", () => {
  const setupPath = path.join(PROJECT_ROOT, "database-setup.sql");

  it("exists", () => {
    expect(fs.existsSync(setupPath)).toBe(true);
  });

  it("contains a DO NOT RUN warning for existing databases", () => {
    const sql = fs.readFileSync(setupPath, "utf-8");
    expect(sql).toContain("DO NOT RUN THIS ON AN EXISTING DATABASE");
    expect(sql).toContain("wiping ALL data");
  });

  it("points users to the migration system instead", () => {
    const sql = fs.readFileSync(setupPath, "utf-8");
    expect(sql).toContain("migration system");
    expect(sql).toContain("migrations/");
  });
});

// ── Migration File Discovery ───────────────────────

describe("discoverMigrationFiles", () => {
  it("finds the baseline file in the project migrations dir", () => {
    const files = discoverMigrationFiles(
      path.join(PROJECT_ROOT, "migrations")
    );
    expect(files).toContain("000_baseline.sql");
  });

  it("returns files sorted alphabetically", () => {
    const files = discoverMigrationFiles(
      path.join(PROJECT_ROOT, "migrations")
    );
    const sorted = [...files].sort();
    expect(files).toEqual(sorted);
  });

  it("does not include README files", () => {
    const files = discoverMigrationFiles(
      path.join(PROJECT_ROOT, "migrations")
    );
    for (const f of files) {
      expect(f).not.toMatch(/^README/);
    }
  });

  it("returns empty array for nonexistent directory", () => {
    const files = discoverMigrationFiles("/nonexistent/path");
    expect(files).toEqual([]);
  });
});

// ── _MigrationLog CREATE TABLE SQL ─────────────────

describe("_MigrationLog table SQL", () => {
  const migrationLogSQL = `
    CREATE TABLE IF NOT EXISTS \`_MigrationLog\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL UNIQUE,
      \`appliedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`checksum\` VARCHAR(64) NULL
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `;

  it("uses IF NOT EXISTS — safe to re-run", () => {
    expect(migrationLogSQL).toContain("IF NOT EXISTS");
  });

  it("passes dangerous SQL check", () => {
    expect(checkDangerousSQL(migrationLogSQL)).toBeNull();
  });

  it("has UNIQUE constraint on name column", () => {
    expect(migrationLogSQL).toContain("UNIQUE");
    expect(migrationLogSQL).toContain("`name`");
  });
});
