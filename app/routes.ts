import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // Auth
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("auth/google", "routes/auth.google.tsx"),
  route("auth/google/callback", "routes/auth.google.callback.tsx"),
  // Dashboard
  route("dashboard", "routes/dashboard.tsx"),
  // Analytics
  route("analytics", "routes/analytics.tsx"),
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
  route("emails/threads/:threadId", "routes/emails.threads.$threadId.tsx"),
  route("emails/inbox/:messageId", "routes/emails.inbox.$messageId.tsx"),
  route("leads/:leadId/emails", "routes/leads.$leadId.emails.tsx"),
  // API Gateway
  route("api/leads", "routes/api.leads.tsx"),
  route("api/lead-detail", "routes/api.lead-detail.tsx"),
  route("api/scraper", "routes/api.scraper.tsx"),
  route("api/diagnostic", "routes/api.diagnostic.tsx"),
  route("docs/api", "routes/docs.api.tsx"),
  // CSV Import
  route("imports", "routes/imports.tsx"),
  route("imports/new", "routes/imports.new.tsx"),
  // Settings
  route("settings", "routes/settings.tsx"),
  route("settings/users", "routes/settings.users.tsx"),
  route("settings/database", "routes/settings.database.tsx"),
  route("settings/api-keys", "routes/settings.api-keys.tsx"),
  route("settings/scoring-rules", "routes/settings.scoring-rules.tsx"),
  route("settings/stages", "routes/settings.stages.tsx"),
  route("settings/workflows", "routes/settings.workflows.tsx"),
  // Workflows
  route("workflows", "routes/workflows.tsx"),
  route("workflows/new", "routes/workflows.new.tsx"),
  route("workflows/:id/edit", "routes/workflows.$id.edit.tsx"),
  // Shopify Scraper
  route("scraper", "routes/scraper.tsx"),
  route("scraper/new", "routes/scraper.new.tsx"),
  route("scraper/:jobId", "routes/scraper.$jobId.tsx"),
] satisfies RouteConfig;
