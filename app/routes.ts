import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // Auth
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  // Dashboard
  route("dashboard", "routes/dashboard.tsx"),
  // Lead Inbox
  route("inbox", "routes/inbox.tsx"),
  route("inbox/:leadId", "routes/inbox.$leadId.tsx"),
  route("leads/new", "routes/leads.new.tsx"),
  // Verification
  route("verification/criteria", "routes/verification.criteria.tsx"),
  route("verification/:leadId", "routes/verification.$leadId.tsx"),
  // User Management
  route("users", "routes/users.tsx"),
  route("users/new", "routes/users.new.tsx"),
  // Pipeline
  route("pipeline", "routes/pipeline.tsx"),
  // Email Outreach
  route("emails", "routes/emails.tsx"),
  route("emails/templates", "routes/emails.templates.tsx"),
  route("leads/:leadId/emails", "routes/leads.$leadId.emails.tsx"),
  // API Gateway
  route("api/leads", "routes/api.leads.tsx"),
  // CSV Import
  route("imports", "routes/imports.tsx"),
  route("imports/new", "routes/imports.new.tsx"),
  // Settings
  route("settings", "routes/settings.tsx"),
  route("settings/users", "routes/settings.users.tsx"),
] satisfies RouteConfig;
