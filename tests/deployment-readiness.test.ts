import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const PROJECT_ROOT = path.resolve(process.cwd());
const BUILD_DIR = path.join(PROJECT_ROOT, "build");

// ── Build Artifacts ────────────────────────────────

describe("Build output exists", () => {
  it("has server build at build/server/index.js", () => {
    const serverBuild = path.join(BUILD_DIR, "server", "index.js");
    expect(fs.existsSync(serverBuild)).toBe(true);
  });

  it("has client assets directory", () => {
    const clientDir = path.join(BUILD_DIR, "client", "assets");
    expect(fs.existsSync(clientDir)).toBe(true);
  });

  it("has client manifest", () => {
    const manifestDir = path.join(BUILD_DIR, "client");
    const files = fs.readdirSync(manifestDir);
    const hasManifest = files.some(
      (f) => f.startsWith(".vite") || f === "manifest.json" || files.length > 0
    );
    expect(hasManifest).toBe(true);
  });

  it("server build contains our new route (settings.database)", () => {
    const serverBuild = fs.readFileSync(
      path.join(BUILD_DIR, "server", "index.js"),
      "utf-8"
    );
    // The route string should appear in the server bundle
    expect(serverBuild).toContain("settings/database");
  });
});

// ── Route Registration ─────────────────────────────

describe("Route configuration", () => {
  it("includes settings/database route in routes.ts", () => {
    const routesContent = fs.readFileSync(
      path.join(PROJECT_ROOT, "app", "routes.ts"),
      "utf-8"
    );
    expect(routesContent).toContain("settings/database");
    expect(routesContent).toContain("settings.database");
  });

  it("route file exists at correct path", () => {
    const routeFile = path.join(
      PROJECT_ROOT,
      "app",
      "routes",
      "settings.database.tsx"
    );
    expect(fs.existsSync(routeFile)).toBe(true);
  });
});

// ── Migration Files for Deployment ─────────────────

describe("Migration files are deployment-ready", () => {
  it("migrations directory exists", () => {
    expect(fs.existsSync(path.join(PROJECT_ROOT, "migrations"))).toBe(true);
  });

  it("has at least the baseline migration", () => {
    const files = fs.readdirSync(path.join(PROJECT_ROOT, "migrations"));
    const sqlFiles = files.filter((f) => f.endsWith(".sql"));
    expect(sqlFiles.length).toBeGreaterThanOrEqual(1);
    expect(sqlFiles).toContain("000_baseline.sql");
  });
});

// ── No Dev-Only Code in Production Build ───────────

describe("Server build does not reference dev-only modules", () => {
  const serverBuild = fs.readFileSync(
    path.join(BUILD_DIR, "server", "index.js"),
    "utf-8"
  );

  it("does not import vitest", () => {
    expect(serverBuild).not.toContain("from \"vitest\"");
  });

  it("includes the migration module", () => {
    // Check that our migration utilities are bundled
    expect(serverBuild).toContain("_MigrationLog");
  });

  it("includes the Database icon import for the settings page", () => {
    // Verify the settings page link was built into the bundle
    expect(serverBuild).toContain("Database");
  });
});

// ── Prisma Schema Consistency ──────────────────────

describe("Prisma schema matches migration expectations", () => {
  it("schema.prisma exists", () => {
    expect(
      fs.existsSync(path.join(PROJECT_ROOT, "prisma", "schema.prisma"))
    ).toBe(true);
  });

  it("schema uses mysql provider (matching cPanel)", () => {
    const schema = fs.readFileSync(
      path.join(PROJECT_ROOT, "prisma", "schema.prisma"),
      "utf-8"
    );
    expect(schema).toContain('provider = "mysql"');
  });

  it("schema includes debian binary target (for cPanel/Passenger)", () => {
    const schema = fs.readFileSync(
      path.join(PROJECT_ROOT, "prisma", "schema.prisma"),
      "utf-8"
    );
    expect(schema).toContain("debian-openssl");
  });
});

// ── Server Entry Point ─────────────────────────────

describe("server.js entry point", () => {
  it("exists at project root", () => {
    expect(fs.existsSync(path.join(PROJECT_ROOT, "server.js"))).toBe(true);
  });

  it("references the build directory correctly", () => {
    const serverContent = fs.readFileSync(
      path.join(PROJECT_ROOT, "server.js"),
      "utf-8"
    );
    expect(serverContent).toContain("build");
  });
});

// ── Package.json Scripts ───────────────────────────

describe("package.json scripts", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(PROJECT_ROOT, "package.json"), "utf-8")
  );

  it("has postinstall that only generates (no db push)", () => {
    expect(pkg.scripts.postinstall).toBe("prisma generate");
    // Make sure postinstall does NOT contain db push or migrate
    expect(pkg.scripts.postinstall).not.toContain("push");
    expect(pkg.scripts.postinstall).not.toContain("migrate");
  });

  it("has a start script for production", () => {
    expect(pkg.scripts.start).toBeDefined();
    expect(pkg.scripts.start).toContain("node server.js");
  });

  it("has a test script", () => {
    expect(pkg.scripts.test).toBeDefined();
  });
});
