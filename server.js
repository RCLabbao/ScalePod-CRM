// ── Production Server for cPanel / Phusion Passenger ─────────────────
//
// This is the entry point cPanel's "Setup Node.js App" will run.
// Passenger executes: node server.js
// It expects an HTTP server listening on process.env.PORT.
//
import { createRequestHandler } from "@react-router/express";
import compression from "compression";
import express from "express";

const PORT = process.env.PORT || 3000;
const app = express();

// ── Compression ───────────────────────────────────────────────────────
app.use(compression());

// ── Static Files ──────────────────────────────────────────────────────
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

// ── React Router Request Handler ──────────────────────────────────────
// Dynamically import the server build so Prisma can be initialized at runtime
app.use(
  createRequestHandler({
    build: () => import("./build/server/index.js"),
  })
);

// ── Start Server ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`ScalePod CRM running on port ${PORT}`);
});
