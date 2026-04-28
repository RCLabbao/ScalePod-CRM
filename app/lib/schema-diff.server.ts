import { prisma } from "./prisma.server";
import { checkDangerousSQL } from "./migration-utils";
import * as fs from "node:fs";
import * as path from "node:path";

// ── Types ──────────────────────────────────────────────

interface ColumnDef {
  name: string;
  type: string;
  nullable: boolean;
  default_value: string | null;
}

interface SchemaModel {
  name: string;
  tableName: string;
  fields: SchemaField[];
}

interface SchemaField {
  name: string;
  dbType: string;
  nullable: boolean;
  default_value: string | null;
  isId: boolean;
  isUnique: boolean;
}

export interface DiffSection {
  model: string;
  table: string;
  status: "missing_table" | "missing_columns" | "ok";
  sql: string;
  missingColumns: string[];
}

// ── Map Prisma types to MySQL DDL ──────────────────────

function prismaTypeToMysql(field: SchemaField): string {
  const t = field.dbType;
  // Handle @db.Text, @db.LongText, @db.Long etc.
  if (t.includes("LongText")) return "LONGTEXT";
  if (t.includes("Text")) return "TEXT";
  if (t.includes("Long")) return "BIGINT";
  if (t.includes("Double")) return "DOUBLE";
  if (t.includes("Decimal")) return "DECIMAL(65,30)";

  // Map base Prisma types
  if (t === "String") return "VARCHAR(191)";
  if (t === "Int") return "INT";
  if (t === "BigInt") return "BIGINT";
  if (t === "Float") return "DOUBLE";
  if (t === "Decimal") return "DECIMAL(65,30)";
  if (t === "Boolean") return "BOOLEAN";
  if (t === "DateTime") return "DATETIME(3)";
  if (t === "Json") return "JSON";
  if (t === "Bytes") return "LONGBLOB";

  return t; // Fallback: use as-is (e.g., already a MySQL type)
}

function mysqlDefaultExpr(field: SchemaField): string | null {
  if (!field.default_value) return null;

  const d = field.default_value;

  if (d === "autoincrement()") return null; // AUTO_INCREMENT handled separately
  if (d === "now()" || d === "CURRENT_TIMESTAMP") return "DEFAULT CURRENT_TIMESTAMP(3)";
  if (d === "cuid()" || d === "uuid()" || d === "nanoid()") return null; // App-level defaults
  if (d === "true()") return "DEFAULT TRUE";
  if (d === "false()") return "DEFAULT FALSE";
  if (d.startsWith("'") || d.startsWith('"')) return `DEFAULT ${d}`;
  if (d.match(/^\d+$/)) return `DEFAULT ${d}`;
  if (d.match(/^\d+\.\d+$/)) return `DEFAULT ${d}`;

  return `DEFAULT ${d}`;
}

// ── Parse Prisma schema (with proper brace matching) ───

function parsePrismaSchema(schemaPath: string): SchemaModel[] {
  const content = fs.readFileSync(schemaPath, "utf-8");
  const models: SchemaModel[] = [];

  // Strip single-line comments first so } inside comments doesn't break parsing
  const stripped = content.replace(/\/\/.*$/gm, "");

  // Match model blocks using brace depth counting instead of [^}]*
  // This correctly handles nested braces and comments
  const modelStartRegex = /^model\s+(\w+)\s*\{/gm;
  let match: RegExpExecArray | null;

  while ((match = modelStartRegex.exec(stripped)) !== null) {
    const modelName = match[1];
    const startIdx = match.index + match[0].length;

    // Find matching closing brace using depth counting
    let depth = 1;
    let endIdx = startIdx;
    while (depth > 0 && endIdx < stripped.length) {
      if (stripped[endIdx] === "{") depth++;
      else if (stripped[endIdx] === "}") depth--;
      endIdx++;
    }

    const body = stripped.slice(startIdx, endIdx - 1); // exclude the closing }

    // Parse the model body
    const fields: SchemaField[] = [];
    let tableName = modelName; // Default table name is model name

    // Check for @@map
    const mapMatch = body.match(/@@map\s*\(\s*"(\w+)"\s*\)/);
    if (mapMatch) {
      tableName = mapMatch[1];
    }

    // Parse fields
    const lines = body.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("@@")) continue;

      // Match: fieldName Type @attrs...
      const fieldMatch = trimmed.match(/^(\w+)\s+(\w+)(?:\s+(.*))?$/);
      if (!fieldMatch) continue;

      const [, fieldName, fieldType, attrsStr] = fieldMatch;

      // Skip relation fields (those with @relation)
      if (attrsStr && attrsStr.includes("@relation")) continue;

      // Skip enum types and other non-primitive types
      const prismaTypes = ["String", "Int", "BigInt", "Float", "Decimal", "Boolean", "DateTime", "Json", "Bytes"];
      if (!prismaTypes.includes(fieldType) && !attrsStr?.includes("@db.")) continue;

      // Parse attributes
      const attrs = attrsStr || "";
      const isId = attrs.includes("@id");
      const isUnique = attrs.includes("@unique") || isId;
      const nullable = attrs.includes("?");

      // Extract @db.XXX type override
      const dbTypeMatch = attrs.match(/@db\.(\w+(?:\(\d+\))?)/);
      const dbType = dbTypeMatch ? dbTypeMatch[1] : fieldType;

      // Extract default value — handle nested parens like cuid(), now(), autoincrement()
      let default_value: string | null = null;
      const defaultMatch = attrs.match(/@default\s*\((.+)\)(?:\s|$)/);
      if (defaultMatch) {
        default_value = defaultMatch[1].trim();
      }

      // Build the full DB type string
      let fullDbType = dbType;
      // Handle @db.VarChar(X) etc.
      const varcharMatch = attrs.match(/@db\.VarChar\((\d+)\)/);
      if (varcharMatch) {
        fullDbType = `VARCHAR(${varcharMatch[1]})`;
      }

      fields.push({
        name: fieldName,
        dbType: fullDbType,
        nullable,
        default_value,
        isId,
        isUnique,
      });
    }

    // Only include models that have at least one field
    if (fields.length > 0) {
      models.push({ name: modelName, tableName, fields });
    }
  }

  return models;
}

// ── Query existing database structure ──────────────────

async function getExistingTables(): Promise<Set<string>> {
  const rows: Array<{ TABLE_NAME: string }> = await prisma.$queryRaw`
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
  `;
  return new Set(rows.map((r) => r.TABLE_NAME));
}

async function getExistingColumns(tableName: string): Promise<Map<string, ColumnDef>> {
  const rows: Array<{ COLUMN_NAME: string; COLUMN_TYPE: string; IS_NULLABLE: string; COLUMN_DEFAULT: string | null }> =
    await prisma.$queryRaw`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${tableName}
    `;
  const map = new Map<string, ColumnDef>();
  for (const r of rows) {
    map.set(r.COLUMN_NAME, {
      name: r.COLUMN_NAME,
      type: r.COLUMN_TYPE,
      nullable: r.IS_NULLABLE === "YES",
      default_value: r.COLUMN_DEFAULT,
    });
  }
  return map;
}

// ── Generate DDL for a missing table ──────────────────

function generateCreateTableSQL(model: SchemaModel): string {
  const lines: string[] = [];
  const pks: string[] = [];

  lines.push(`CREATE TABLE IF NOT EXISTS \`${model.tableName}\` (`);

  for (const field of model.fields) {
    const mysqlType = prismaTypeToMysql(field);
    const parts: string[] = [`  \`${field.name}\` ${mysqlType}`];

    if (!field.nullable && !field.isId) parts.push("NOT NULL");

    const defaultExpr = mysqlDefaultExpr(field);
    if (defaultExpr) parts.push(defaultExpr);

    lines.push(parts.join(" ") + ",");

    if (field.isId) pks.push(field.name);
  }

  // Add PRIMARY KEY
  if (pks.length > 0) {
    lines.push(`  PRIMARY KEY (\`${pks.join("`, `")}\`),`);
  }

  // Add unique constraints
  for (const field of model.fields) {
    if (field.isUnique && !field.isId) {
      lines.push(`  UNIQUE INDEX \`${model.tableName}_${field.name}_key\` (\`${field.name}\`),`);
    }
  }

  // Add indexes for relation fields (foreign keys)
  for (const field of model.fields) {
    if (field.name.endsWith("Id") && !field.isId && !field.isUnique) {
      lines.push(`  INDEX \`${model.tableName}_${field.name}_idx\` (\`${field.name}\`),`);
    }
  }

  // Remove trailing comma from last line
  let lastLine = lines[lines.length - 1];
  if (lastLine.endsWith(",")) {
    lines[lines.length - 1] = lastLine.slice(0, -1);
  }

  lines.push(`) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

  return lines.join("\n");
}

// ── Generate DDL for missing columns ───────────────────

function generateAlterTableSQL(model: SchemaModel, missingColumns: SchemaField[]): string {
  const lines: string[] = [];
  const table = model.tableName;

  for (const field of missingColumns) {
    const mysqlType = prismaTypeToMysql(field);
    const parts: string[] = [`ALTER TABLE \`${table}\` ADD COLUMN \`${field.name}\` ${mysqlType}`];

    if (!field.nullable) parts.push("NOT NULL");

    const defaultExpr = mysqlDefaultExpr(field);
    if (defaultExpr) parts.push(defaultExpr);
    else if (!field.nullable && field.default_value === null) {
      // For NOT NULL columns without a default, we need to handle existing rows.
      // Use a sensible fallback based on type.
      if (mysqlType.startsWith("VARCHAR") || mysqlType === "TEXT" || mysqlType === "LONGTEXT") {
        parts.push("DEFAULT ''");
      } else if (mysqlType === "INT" || mysqlType === "BIGINT") {
        parts.push("DEFAULT 0");
      } else if (mysqlType === "BOOLEAN") {
        parts.push("DEFAULT FALSE");
      } else if (mysqlType === "JSON") {
        // Make nullable for existing rows
        parts[0] = parts[0].replace("NOT NULL", "");
        parts.push("DEFAULT NULL");
      } else if (mysqlType === "DATETIME(3)") {
        parts.push("DEFAULT CURRENT_TIMESTAMP(3)");
      } else if (mysqlType === "DOUBLE") {
        parts.push("DEFAULT 0");
      }
    }

    lines.push(parts.join(" ") + ";");
  }

  return lines.join("\n");
}

// ── Main: Compute schema diff ─────────────────────────

export async function getSchemaDiff(): Promise<DiffSection[]> {
  const schemaPath = path.resolve(process.cwd(), "prisma", "schema.prisma");
  const models = parsePrismaSchema(schemaPath);
  const existingTables = await getExistingTables();
  const sections: DiffSection[] = [];

  // Also ignore internal tables
  const ignoredTables = new Set(["_MigrationLog", "_prisma_migrations"]);

  for (const model of models) {
    // Skip ignored tables
    if (ignoredTables.has(model.tableName)) continue;

    if (!existingTables.has(model.tableName)) {
      // Entire table is missing
      const sql = generateCreateTableSQL(model);
      sections.push({
        model: model.name,
        table: model.tableName,
        status: "missing_table",
        sql,
        missingColumns: model.fields.map((f) => f.name),
      });
    } else {
      // Table exists — check for missing columns
      const existingColumns = await getExistingColumns(model.tableName);
      const missing = model.fields.filter((f) => !existingColumns.has(f.name));

      if (missing.length > 0) {
        const sql = generateAlterTableSQL(model, missing);
        sections.push({
          model: model.name,
          table: model.tableName,
          status: "missing_columns",
          sql,
          missingColumns: missing.map((f) => f.name),
        });
      }
      // If no missing columns, table is ok — don't include in diff
    }
  }

  return sections;
}

// ── Apply a schema diff section ────────────────────────

export async function applySchemaDiffSQL(sql: string): Promise<{ success: boolean; error?: string }> {
  // Safety check
  const danger = checkDangerousSQL(sql);
  if (danger) {
    return { success: false, error: danger };
  }

  try {
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt);
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: sanitizeErrorMessage(message) };
  }
}

function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/mysql:\/\//g, "mysql:[redacted]@")
    .replace(/password=\S+/g, "password=[redacted]")
    .replace(/host=\S+/g, "host=[redacted]")
    .slice(0, 200);
}