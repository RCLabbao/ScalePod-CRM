import * as fs from "node:fs";
import * as path from "node:path";

// ── Dangerous SQL patterns that are blocked by default ──
const DANGEROUS_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bDROP\s+DATABASE\b/i, label: "DROP DATABASE" },
  { pattern: /\bTRUNCATE\s+/i, label: "TRUNCATE" },
  { pattern: /\bDROP\s+TABLE\s+(?!IF\s+EXISTS)/i, label: "DROP TABLE without IF EXISTS" },
  { pattern: /\bDELETE\s+FROM\s+\w+\s*;/i, label: "DELETE without WHERE clause" },
];

/**
 * Checks SQL for dangerous patterns that could destroy data.
 * Returns a warning string if dangerous patterns found, null if safe.
 */
export function checkDangerousSQL(sql: string): string | null {
  for (const { pattern, label } of DANGEROUS_PATTERNS) {
    if (pattern.test(sql)) {
      return `Potentially dangerous SQL detected: "${label}". ` +
        `Use IF EXISTS for drops, and always include WHERE clauses for deletes.`;
    }
  }
  return null;
}

/**
 * Parses SQL text into executable statements.
 * Splits by semicolons, trims whitespace, and filters out
 * comment-only lines and empty statements.
 */
export function parseSQLStatements(sql: string): string[] {
  return sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => {
      if (s.length === 0) return false;
      // Skip lines that are only comments
      const withoutComments = s.replace(/--.*/g, "").trim();
      return withoutComments.length > 0;
    });
}

/**
 * Returns sorted list of .sql migration files from a directory.
 * Skips README files.
 */
export function discoverMigrationFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f: string) => f.endsWith(".sql") && !f.startsWith("README"))
    .sort();
}

/**
 * Validates a migration filename is safe for SQL string interpolation.
 * Only allows: alphanumeric, dashes, underscores, dots.
 * Throws if the name contains anything dangerous.
 */
export function sanitizeMigrationName(name: string): string {
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
    throw new Error(`Invalid migration filename: "${name}"`);
  }
  return name;
}
