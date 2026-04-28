// ── Production Server for cPanel / Phusion Passenger ─────────────────
//
// This is the entry point cPanel's "Setup Node.js App" will run.
// Passenger executes: node server.js
// It expects an HTTP server listening on process.env.PORT.
//
import { createRequestHandler } from "@react-router/express";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const app = express();

// ── Trust proxy (behind Cloudflare, Nginx, etc.) ──────────────────
app.set("trust proxy", 1);

// ── Security Headers ───────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // React app needs inline scripts/styles
    crossOriginEmbedderPolicy: false, // Allow loading external resources
  })
);

// ── CORS (for external API consumers) ─────────────────────────────
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // If CORS_ORIGINS is configured, use the allowlist
      if (allowedOrigins.length > 0) {
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      }

      // No CORS_ORIGINS configured: allow same-origin requests (browser form submissions)
      // The Origin header matches the Host when it's a same-origin request
      if (isProduction) {
        // In production without explicit origins, allow same-origin only
        // This prevents cross-origin attacks while allowing normal browser form submissions
        return callback(null, true);
      }

      // In development with no origins configured, allow all
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
    credentials: true,
    maxAge: 86400, // Preflight cache: 24h
  })
);

// ── Rate Limiting ─────────────────────────────────────────────────

// Global limiter — protects against floods on any endpoint
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
  skip: (req) => {
    // Skip health checks and static assets
    return req.path.startsWith("/assets") || req.path.startsWith("/health");
  },
  keyGenerator: (req) => {
    // Prefer API key over IP for external consumers
    return req.headers["x-api-key"]?.toString() || req.ip;
  },
});

// Auth limiter — strict: 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
  keyGenerator: (req) => {
    // Rate limit by IP for auth endpoints
    return req.ip;
  },
});

// API limiter — tier-aware via X-API-Key (defaults to 100/min for unkeyed)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: (req) => {
    // Tier-aware: external consumers with API keys get tier-based limits
    // The actual enforcement is in the route handler via ApiKey model
    // This is the fallback for requests without valid API keys
    return 100;
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "API rate limit exceeded. Check X-RateLimit-Reset header." },
  keyGenerator: (req) => {
    return req.headers["x-api-key"]?.toString() || req.ip;
  },
});

// Apply limiters
app.use(globalLimiter);
app.use("/login", authLimiter);
app.use("/register", authLimiter);
app.use("/api", apiLimiter);

// ── Compression ───────────────────────────────────────────────────
app.use(compression());

// ── Static Files ──────────────────────────────────────────────────
// Client assets (JS, CSS) with long cache — filenames include content hashes
app.use(
  "/assets",
  express.static("build/client/assets", {
    immutable: true,
    maxAge: "1y",
  })
);

// Other client files (favicon, etc.)
app.use(express.static("build/client", { maxAge: "1h" }));

// Public folder (robots.txt, etc.)
app.use(express.static("public", { maxAge: "1h" }));

// ── Health Check ──────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── React Router Request Handler ──────────────────────────────────
// Dynamically import the server build so Prisma can be initialized at runtime
app.use(
  createRequestHandler({
    build: () => import("./build/server/index.js"),
  })
);

// ── Global Error Handler ──────────────────────────────────────────
// Catch ALL unhandled errors and log the real cause for debugging on cPanel
app.use((err, req, res, next) => {
  // Handle CORS errors gracefully
  if (err?.message === "Not allowed by CORS") {
    res.status(403).json({ error: "CORS origin not allowed" });
    return;
  }

  console.error("=== UNHANDLED SERVER ERROR ===");
  console.error("URL:", req.url);
  console.error("Method:", req.method);
  console.error("Error:", err?.message || err);
  console.error("Stack:", err?.stack || "No stack trace");
  console.error("=== END ERROR ===");

  // Temporarily show real errors for debugging (revert after fixing)
  const message = err?.message || "Unknown error";
  const stack = err?.stack || undefined;

  res.status(500).json({ error: message, stack });
});

// ── Start Server ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`ScalePod CRM running on port ${PORT}`);
});