import { Link, useLoaderData, type MetaFunction } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Shield,
  Zap,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Server,
  Lock,
  Clock,
  ArrowLeft,
  ChevronUp,
  Menu,
  X,
  BookOpen,
  FileJson,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });
  return { user };
}

export const meta: MetaFunction = () => [
  { title: "API Reference — ScalePod CRM" },
];

const TIER_LIMITS = {
  FREE:       { perMinute: 20,   perDay: 1000 },
  BASIC:      { perMinute: 60,   perDay: 10000 },
  PRO:        { perMinute: 300,  perDay: 100000 },
  ENTERPRISE: { perMinute: 1000, perDay: 1000000 },
} as const;

const SECTIONS = [
  { id: "getting-started", label: "Getting Started", icon: Zap },
  { id: "authentication", label: "Authentication", icon: Lock },
  { id: "rate-limits", label: "Rate Limits", icon: Clock },
  { id: "scopes", label: "Scopes", icon: Shield },
  { id: "leads-get", label: "GET /api/leads", icon: Server },
  { id: "leads-post", label: "POST /api/leads", icon: Server },
  { id: "lead-detail-get", label: "GET /api/lead-detail", icon: Server },
  { id: "scraper-get", label: "GET /api/scraper", icon: Server },
  { id: "errors", label: "Error Reference", icon: AlertTriangle },
] as const;

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  return (
    <div className="rounded-xl border border-border/40 overflow-hidden bg-[#0d1117] shadow-sm group">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">{lang}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors rounded-md px-2 py-1 hover:bg-white/5"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3.5 text-[13px] leading-relaxed overflow-x-auto" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" }}>
        <code className="text-blue-50/90 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: typeof Zap; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/40 shrink-0 mt-0.5 shadow-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function EndpointBadge({ method }: { method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    POST: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    PUT: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    DELETE: "bg-red-500/15 text-red-400 border-red-500/25",
    PATCH: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  };
  return (
    <Badge className={`rounded-md text-[10px] font-bold border px-2 py-0.5 ${colors[method] || colors.GET}`}>
      {method}
    </Badge>
  );
}

function EndpointBar({ method, path, scope }: { method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; path: string; scope: string }) {
  const borderColors: Record<string, string> = {
    GET: "border-l-emerald-400",
    POST: "border-l-blue-400",
    PUT: "border-l-amber-400",
    DELETE: "border-l-red-400",
    PATCH: "border-l-violet-400",
  };
  return (
    <div className={`flex items-center gap-3 flex-wrap rounded-xl border border-border/40 bg-muted/20 pl-3 pr-4 py-2.5 border-l-[3px] ${borderColors[method] || borderColors.GET}`}>
      <EndpointBadge method={method} />
      <code className="text-sm font-mono text-foreground/80">{path}</code>
      <Badge variant="secondary" className="rounded-full text-[10px] border-border/30 ml-auto">{scope}</Badge>
    </div>
  );
}

function ParamRow({ name, type, required, desc }: { name: string; type: string; required?: boolean; desc: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/20 last:border-0">
      <div className="min-w-[180px] shrink-0">
        <code className="text-[13px] font-mono text-violet-400 font-medium">{name}</code>
        {required && <span className="ml-1.5 text-red-400 text-[10px] font-bold">required</span>}
      </div>
      <div className="flex-1 min-w-0">
        <Badge variant="secondary" className="rounded text-[10px] font-mono mb-0.5 border-border/30">{type}</Badge>
        <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function ResponseField({ name, type, desc, nullable }: { name: string; type: string; desc: string; nullable?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-1.5 border-b border-border/10 last:border-0">
      <code className="text-[12px] font-mono text-blue-400/80 min-w-[140px] shrink-0">{name}</code>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-mono text-amber-400/70">{type}</span>
        {nullable && <span className="ml-1 text-[10px] text-muted-foreground/40">nullable</span>}
        <p className="text-[12px] text-muted-foreground/70">{desc}</p>
      </div>
    </div>
  );
}

function Callout({
  icon: Icon,
  title,
  children,
  variant = "info",
}: {
  icon: typeof AlertTriangle;
  title: string;
  children: React.ReactNode;
  variant?: "info" | "warning" | "error" | "tip";
}) {
  const styles = {
    info:   { bg: "bg-blue-500/5",   border: "border-blue-500/15",   text: "text-blue-400",   title: "text-blue-400/90" },
    warning:{ bg: "bg-amber-500/5",  border: "border-amber-500/15",  text: "text-amber-400",  title: "text-amber-400/90" },
    error:  { bg: "bg-red-500/5",    border: "border-red-500/15",    text: "text-red-400",    title: "text-red-400/90" },
    tip:    { bg: "bg-violet-500/5", border: "border-violet-500/15", text: "text-violet-400", title: "text-violet-400/90" },
  };
  const s = styles[variant];
  return (
    <div className={`rounded-xl border ${s.border} ${s.bg} p-4 flex items-start gap-3`}>
      <Icon className={`h-4 w-4 ${s.text} shrink-0 mt-0.5`} />
      <div>
        <p className={`text-sm font-semibold ${s.title}`}>{title}</p>
        <div className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function ApiDocs() {
  const { user } = useLoaderData<typeof loader>();
  const [activeSection, setActiveSection] = useState("getting-started");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLElement | null>(null);

  // Resolve the actual scrollable container (<main> from AppShell)
  useEffect(() => {
    if (mainRef.current) {
      scrollContainerRef.current = mainRef.current.closest("main") as HTMLElement | null;
    }
  }, []);

  // IntersectionObserver to track active section
  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root, rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Show back-to-top after scrolling
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => setShowBackToTop(el.scrollTop > 600);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    const scroller = scrollContainerRef.current;
    if (el && scroller) {
      const top = el.getBoundingClientRect().top + scroller.scrollTop - 120;
      scroller.scrollTo({ top, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppShell user={user!}>
      <div className="flex gap-6 max-w-[1400px] mx-auto relative">
        {/* Sidebar Navigation — Desktop */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-[72px] self-start max-h-[calc(100vh-120px)] overflow-y-auto px-2 py-1 z-10">
          <div className="space-y-0.5">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200 text-left ${
                    active
                      ? "bg-background text-foreground font-medium shadow-sm ring-1 ring-border/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground/50"}`} />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-border/40 bg-muted/20 p-3 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Base URL</p>
            <code className="block text-xs font-mono text-violet-400 break-all">https://yourdomain.com/api</code>
          </div>

          <div className="mt-3 rounded-xl border border-border/40 bg-muted/20 p-3 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Content-Type</p>
            <code className="block text-xs font-mono text-blue-400">application/json</code>
          </div>
        </aside>

        {/* Main Content */}
        <div ref={mainRef} className="flex-1 min-w-0 space-y-14 pb-20 scroll-smooth relative">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-muted/60 via-muted/30 to-background p-6 sm:p-8 shadow-sm ring-1 ring-border/20">
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative flex items-start gap-3 sm:gap-4">
              <Link to="/settings/api-keys">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted mt-1 shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="rounded-full text-[10px] font-bold uppercase tracking-wider border-border/40 bg-background/80 backdrop-blur-sm">
                    REST API v1
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">API Reference</h1>
                <p className="text-muted-foreground mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
                  Comprehensive documentation for the ScalePod CRM REST API. Manage leads,
                  monitor scraper jobs, and integrate with your external systems.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Section Nav */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-4 py-2.5 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Menu className="h-4 w-4 text-muted-foreground" />
                {SECTIONS.find((s) => s.id === activeSection)?.label || "Jump to section"}
              </span>
              {mobileNavOpen ? <X className="h-4 w-4" /> : <ChevronUp className="h-4 w-4 rotate-180" />}
            </button>
            {mobileNavOpen && (
              <div className="mt-1 rounded-xl border border-border/40 bg-background shadow-lg overflow-hidden">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                      activeSection === s.id ? "bg-muted/40 font-medium" : "text-muted-foreground hover:bg-muted/20"
                    }`}
                  >
                    <s.icon className="h-3.5 w-3.5 shrink-0" />
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Getting Started */}
          <section id="getting-started" className="scroll-mt-28">
            <SectionHeader
              icon={Zap}
              title="Getting Started"
              subtitle="Everything you need to make your first API call"
            />
            <Card className="border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200">
              <CardContent className="p-5 space-y-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The ScalePod API is organized around REST. All requests return JSON responses
                  and use standard HTTP verbs. Authentication is handled via API keys passed in
                  the <code className="text-violet-400 font-mono text-xs">X-API-Key</code> header.
                </p>

                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: "Format", value: "JSON", desc: "Request/response bodies", icon: BookOpen },
                    { label: "Auth", value: "API Key", desc: "Header-based", icon: Lock },
                    { label: "HTTPS", value: "Required", desc: "TLS 1.2+", icon: Globe },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-border/30 bg-gradient-to-br from-muted/40 to-muted/10 p-4 text-center hover:border-border/50 transition-colors">
                      <item.icon className="h-4 w-4 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold">{item.label}</p>
                      <p className="text-sm font-bold mt-0.5">{item.value}</p>
                      <p className="text-[10px] text-muted-foreground/60">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Quick test</p>
                  <CodeBlock
                    lang="bash"
                    code={`curl -X GET \\
  https://yourdomain.com/api/leads \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json"`}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Authentication */}
          <section id="authentication" className="scroll-mt-28">
            <SectionHeader
              icon={Lock}
              title="Authentication"
              subtitle="API keys and security best practices"
            />
            <Card className="border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200">
              <CardContent className="p-5 space-y-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every request must include a valid API key in the{" "}
                  <code className="text-violet-400 font-mono text-xs">X-API-Key</code> header.
                  Keys are generated from the{" "}
                  <Link to="/settings/api-keys" className="text-violet-400 hover:underline">API Keys</Link>{" "}
                  settings page and are scoped to specific operations.
                </p>

                <Callout icon={AlertTriangle} title="Security Notice" variant="warning">
                  Store API keys in environment variables, never commit them to version control.
                  The full key is shown only once at creation time — after that, only the prefix is visible.
                </Callout>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Example request with auth</p>
                  <CodeBlock
                    lang="bash"
                    code={`curl -X POST \\
  https://yourdomain.com/api/leads \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "companyName": "Acme Corp",
    "email": "hello@acme.com",
    "leadSource": "External CRM"
  }'`}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" className="scroll-mt-28">
            <SectionHeader
              icon={Clock}
              title="Rate Limits"
              subtitle="Tier-based request throttling"
            />
            <Card className="border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200">
              <CardContent className="p-5 space-y-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rate limits are enforced per API key tier. Every response includes rate limit
                  headers so you can track remaining quota client-side.
                </p>

                <div className="overflow-x-auto rounded-xl border border-border/30 bg-muted/10">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-left text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold">
                        <th className="pb-2.5 pr-4 px-4 pt-3">Tier</th>
                        <th className="pb-2.5 pr-4 text-right px-4 pt-3">Requests / Minute</th>
                        <th className="pb-2.5 pr-4 text-right px-4 pt-3">Requests / Day</th>
                        <th className="pb-2.5 px-4 pt-3">Burst Behavior</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {Object.entries(TIER_LIMITS).map(([tier, limits]) => (
                        <tr key={tier} className="hover:bg-muted/10 transition-colors">
                          <td className="py-2.5 pr-4 px-4">
                            <Badge variant="secondary" className="rounded-md text-[10px] font-bold border-border/30">{tier}</Badge>
                          </td>
                          <td className="py-2.5 pr-4 text-right tabular-nums font-medium px-4">{limits.perMinute}</td>
                          <td className="py-2.5 pr-4 text-right tabular-nums font-medium px-4">{limits.perDay.toLocaleString()}</td>
                          <td className="py-2.5 text-muted-foreground text-xs px-4">
                            {tier === "FREE" ? "Strict — no burst" : tier === "ENTERPRISE" ? "High burst tolerance" : "Standard token bucket"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response headers</p>
                  <CodeBlock
                    lang="http"
                    code={`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1714329600`}
                  />
                </div>

                <Callout icon={AlertTriangle} title="429 Too Many Requests" variant="error">
                  Exceeding your rate limit returns a 429 error. Retry after the timestamp
                  specified in <code className="font-mono">X-RateLimit-Reset</code>.
                </Callout>
              </CardContent>
            </Card>
          </section>

          {/* Scopes */}
          <section id="scopes" className="scroll-mt-28">
            <SectionHeader
              icon={Shield}
              title="Scopes"
              subtitle="Fine-grained access control"
            />
            <Card className="border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200">
              <CardContent className="p-5 space-y-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  API keys are scoped to specific resources and actions. Write access implicitly
                  grants read access for the same resource. Use the minimum scope needed for your integration.
                </p>

                <div className="space-y-2">
                  {[
                    { scope: "leads:read",  desc: "List leads and read lead details",  example: "Dashboard widgets, reporting" },
                    { scope: "leads:write", desc: "Create and update leads",          example: "CRM sync, form submissions", note: "includes leads:read" },
                    { scope: "scraper:read", desc: "Monitor scraper job status",       example: "Progress dashboards, alerts" },
                  ].map((s) => (
                    <div key={s.scope} className="flex items-start gap-3 rounded-xl border border-border/30 bg-muted/20 p-3.5 hover:border-border/50 transition-colors">
                      <code className="text-[12px] font-mono text-violet-400 font-medium min-w-[120px] shrink-0">{s.scope}</code>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{s.desc}</p>
                        <p className="text-xs text-muted-foreground">{s.example}</p>
                        {s.note && <Badge className="mt-1 rounded text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20 border">{s.note}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>

                <Callout icon={Shield} title="Scope Inheritance" variant="tip">
                  A key with <code className="font-mono">leads:write</code> can perform both
                  GET and POST on <code className="font-mono">/api/leads</code>. The wildcard
                  scope <code className="font-mono">*</code> grants full access to all endpoints.
                </Callout>
              </CardContent>
            </Card>
          </section>

          {/* GET /api/leads */}
          <section id="leads-get" className="scroll-mt-28">
            <SectionHeader
              icon={Server}
              title="List Leads"
              subtitle="Retrieve paginated lead data"
            />
            <Card className="border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200">
              <CardContent className="p-5 space-y-6">
                <EndpointBar method="GET" path="/api/leads" scope="Requires leads:read" />

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Returns a paginated list of leads with optional status filtering. Results are
                  ordered by <code className="font-mono text-xs">createdAt</code> descending.
                </p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Query Parameters</p>
                  <div className="rounded-xl border border-border/30 bg-muted/10 px-4">
                    <ParamRow name="status" type="string" desc="Filter by lead status: INBOX, ACTIVE, REJECTED" />
                    <ParamRow name="stage" type="string" desc="Filter by any active pipeline stage (e.g. SOURCED, QUALIFIED, etc.)" />
                    <ParamRow name="limit" type="integer" desc="Number of results per page (max 100, default 50)" />
                    <ParamRow name="offset" type="integer" desc="Number of results to skip (default 0)" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Request Headers</p>
                  <div className="rounded-xl border border-border/30 bg-muted/10 px-4">
                    <ParamRow name="X-API-Key" type="string" required desc="Your API key" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response — 200 OK</p>
                  <CodeBlock
                    lang="json"
                    code={`{
  "leads": [
    {
      "id": "clv...abc",
      "companyName": "Acme Corp",
      "website": "https://acme.com",
      "contactName": "John Smith",
      "email": "john@acme.com",
      "industry": "SaaS",
      "estimatedTraffic": "50K-100K",
      "techStack": "Shopify, React",
      "linkedin": "https://linkedin.com/in/john",
      "facebook": null,
      "instagram": null,
      "twitter": "https://x.com/acme",
      "status": "ACTIVE",
      "stage": "QUALIFIED",
      "leadSource": "API",
      "createdAt": "2024-04-28T10:00:00.000Z"
    }
  ],
  "total": 1247,
  "limit": 50,
  "offset": 0
}`}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response Fields</p>
                  <div className="rounded-xl border border-border/30 bg-muted/10 px-4">
                    <ResponseField name="id" type="string" desc="Unique lead identifier (CUID)" />
                    <ResponseField name="companyName" type="string" desc="Company or organization name" />
                    <ResponseField name="website" type="string" desc="Company website URL" nullable />
                    <ResponseField name="contactName" type="string" desc="Primary contact person" nullable />
                    <ResponseField name="email" type="string" desc="Contact email address" />
                    <ResponseField name="industry" type="string" desc="Industry category" nullable />
                    <ResponseField name="estimatedTraffic" type="string" desc="Estimated monthly traffic range" nullable />
                    <ResponseField name="techStack" type="string" desc="Technology stack in use" nullable />
                    <ResponseField name="linkedin" type="string" desc="LinkedIn profile URL" nullable />
                    <ResponseField name="facebook" type="string" desc="Facebook page URL" nullable />
                    <ResponseField name="instagram" type="string" desc="Instagram profile URL" nullable />
                    <ResponseField name="twitter" type="string" desc="Twitter/X profile URL" nullable />
                    <ResponseField name="status" type="string" desc="Lead status: INBOX, ACTIVE, REJECTED" />
                    <ResponseField name="stage" type="string" desc="Pipeline stage — any active stage configured in Settings > Pipeline Stages" />
                    <ResponseField name="leadSource" type="string" desc="Origin of the lead" />
                    <ResponseField name="createdAt" type="string (ISO 8601)" desc="Record creation timestamp" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Example</p>
                  <CodeBlock
                    lang="bash"
                    code={`curl -X GET \\
  "https://yourdomain.com/api/leads?status=ACTIVE&limit=10&offset=0" \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* POST /api/leads */}
          <section id="leads-post" className="scroll-mt-28">
            <SectionHeader
              icon={Server}
              title="Create or Update Lead"
              subtitle="Upsert lead data from external systems"
            />
            <Card className="border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200">
              <CardContent className="p-5 space-y-6">
                <EndpointBar method="POST" path="/api/leads" scope="Requires leads:write" />

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Creates a new lead or updates an existing one if the email already exists.
                  The <code className="font-mono text-xs">email</code> field is used as the unique key.
                  On update, only provided fields are merged; existing notes are preserved with an append.
                </p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Request Headers</p>
                  <div className="rounded-xl border border-border/30 bg-muted/10 px-4">
                    <ParamRow name="X-API-Key" type="string" required desc="Your API key" />
                    <ParamRow name="Content-Type" type="string" required desc="Must be application/json" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Request Body</p>
                  <div className="rounded-xl border border-border/30 bg-muted/10 px-4">
                    <ParamRow name="companyName" type="string" required desc="Company or organization name" />
                    <ParamRow name="email" type="string" required desc="Contact email address (unique key)" />
                    <ParamRow name="website" type="string" desc="Company website URL" />
                    <ParamRow name="contactName" type="string" desc="Primary contact person" />
                    <ParamRow name="industry" type="string" desc="Industry category" />
                    <ParamRow name="estimatedTraffic" type="string" desc="Estimated monthly traffic range" />
                    <ParamRow name="techStack" type="string" desc="Technology stack in use" />
                    <ParamRow name="linkedin" type="string" desc="LinkedIn profile URL" />
                    <ParamRow name="facebook" type="string" desc="Facebook page URL" />
                    <ParamRow name="instagram" type="string" desc="Instagram profile URL" />
                    <ParamRow name="twitter" type="string" desc="Twitter/X profile URL" />
                    <ParamRow name="leadSource" type="string" desc={'Origin identifier. Defaults to "API"'} />
                    <ParamRow name="notes" type="string" desc="Additional notes. On update, appended to existing notes." />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response — 201 Created (new lead)</p>
                  <CodeBlock
                    lang="json"
                    code={`{
  "lead": {
    "id": "clv...abc",
    "companyName": "Acme Corp",
    "email": "hello@acme.com",
    "status": "INBOX",
    "stage": "SOURCED",
    "leadSource": "External CRM",
    "createdAt": "2024-04-28T10:00:00.000Z"
  },
  "merged": false
}`}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response — 200 OK (existing lead updated)</p>
                  <CodeBlock
                    lang="json"
                    code={`{
  "lead": {
    "id": "clv...abc",
    "companyName": "Acme Corp",
    "email": "hello@acme.com",
    "status": "ACTIVE",
    "stage": "QUALIFIED",
    "leadSource": "External CRM",
    "createdAt": "2024-04-28T10:00:00.000Z",
    "updatedAt": "2024-04-29T14:30:00.000Z"
  },
  "merged": true
}`}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Example</p>
                  <CodeBlock
                    lang="bash"
                    code={`curl -X POST \\
  https://yourdomain.com/api/leads \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "companyName": "Acme Corp",
    "email": "hello@acme.com",
    "website": "https://acme.com",
    "industry": "SaaS",
    "leadSource": "External CRM",
    "notes": "Referred by existing customer"
  }'`}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* GET /api/lead-detail */}
          <section id="lead-detail-get" className="scroll-mt-28">
            <SectionHeader
              icon={Server}
              title="Get Lead Detail"
              subtitle="Full lead record with history and activity"
            />
            <Card className="border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200">
              <CardContent className="p-5 space-y-6">
                <EndpointBar method="GET" path="/api/lead-detail?leadId={'{leadId}'}" scope="Requires leads:read or session auth" />

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Returns a single lead with full relational data including creator, approver,
                  assignee, stage history, and activity logs. Use this when you need the complete
                  picture of a lead beyond the list view. Supports dual authentication:
                  API key with <code className="font-mono text-xs">leads:read</code> scope, or active browser session.
                </p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Query Parameters</p>
                  <div className="rounded-xl border border-border/30 bg-muted/10 px-4">
                    <ParamRow name="leadId" type="string" required desc="Lead identifier (CUID)" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Request Headers</p>
                  <div className="rounded-xl border border-border/30 bg-muted/10 px-4">
                    <ParamRow name="X-API-Key" type="string" desc="Your API key (if using API key auth)" />
                    <ParamRow name="Cookie" type="string" desc="Session cookie (if using browser auth)" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response — 200 OK</p>
                  <CodeBlock
                    lang="json"
                    code={`{
  "lead": {
    "id": "clv...abc",
    "companyName": "Acme Corp",
    "website": "https://acme.com",
    "contactName": "John Smith",
    "email": "john@acme.com",
    "industry": "SaaS",
    "estimatedTraffic": "50K-100K",
    "techStack": "Shopify, React",
    "linkedin": "https://linkedin.com/in/john",
    "facebook": null,
    "instagram": null,
    "twitter": "https://x.com/acme",
    "status": "ACTIVE",
    "stage": "QUALIFIED",
    "leadSource": "API",
    "notes": "Referred by existing customer",
    "createdAt": "2024-04-28T10:00:00.000Z",
    "updatedAt": "2024-04-29T14:30:00.000Z",
    "createdBy": { "id": "usr...", "name": "Jane Admin", "email": "jane@scalepod.io" },
    "approvedBy": null,
    "rejectedBy": null,
    "assignedTo": { "id": "usr...", "name": "Mike SDR", "email": "mike@scalepod.io" },
    "stageHistory": [
      {
        "id": "sh...",
        "fromStage": "SOURCED",
        "toStage": "QUALIFIED",
        "changedAt": "2024-04-29T10:00:00.000Z",
        "changedBy": { "id": "usr...", "name": "Jane Admin", "email": "jane@scalepod.io" }
      }
    ],
    "activityLogs": [
      {
        "id": "al...",
        "action": "STAGE_CHANGE",
        "details": "Moved to QUALIFIED",
        "createdAt": "2024-04-29T10:00:00.000Z",
        "user": { "id": "usr...", "name": "Jane Admin", "email": "jane@scalepod.io" }
      }
    ]
  }
}`}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Example</p>
                  <CodeBlock
                    lang="bash"
                    code={`curl -X GET \\
  "https://yourdomain.com/api/lead-detail?leadId=clv...abc" \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* GET /api/scraper */}
          <section id="scraper-get" className="scroll-mt-28">
            <SectionHeader
              icon={Server}
              title="Get Scraper Job Status"
              subtitle="Monitor discovery and enrichment progress"
            />
            <Card className="border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200">
              <CardContent className="p-5 space-y-6">
                <EndpointBar method="GET" path="/api/scraper?jobId={'{jobId}'}" scope="Requires scraper:read or session auth" />

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Returns the current status and progress counters for a scraper job. This endpoint
                  supports dual authentication: API key with <code className="font-mono text-xs">scraper:read</code>{" "}
                  scope, or active browser session.
                </p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Query Parameters</p>
                  <div className="rounded-xl border border-border/30 bg-muted/10 px-4">
                    <ParamRow name="jobId" type="string" required desc="Scraper job identifier" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Request Headers</p>
                  <div className="rounded-xl border border-border/30 bg-muted/10 px-4">
                    <ParamRow name="X-API-Key" type="string" desc="Your API key (if using API key auth)" />
                    <ParamRow name="Cookie" type="string" desc="Session cookie (if using browser auth)" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response — 200 OK</p>
                  <CodeBlock
                    lang="json"
                    code={`{
  "status": "COMPLETED",
  "totalDiscovered": 452,
  "totalValid": 389,
  "totalEnriched": 312,
  "totalImported": 298,
  "totalSkipped": 91,
  "totalFailed": 3
}`}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response Fields</p>
                  <div className="rounded-xl border border-border/30 bg-muted/10 px-4">
                    <ResponseField name="status" type="string" desc="Job state: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED" />
                    <ResponseField name="totalDiscovered" type="integer" desc="Total URLs discovered" />
                    <ResponseField name="totalValid" type="integer" desc="URLs passing basic validation" />
                    <ResponseField name="totalEnriched" type="integer" desc="URLs successfully enriched with contact data" />
                    <ResponseField name="totalImported" type="integer" desc="Leads created in the CRM" />
                    <ResponseField name="totalSkipped" type="integer" desc="URLs skipped (duplicates, blacklisted, etc.)" />
                    <ResponseField name="totalFailed" type="integer" desc="URLs that failed processing" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Example</p>
                  <CodeBlock
                    lang="bash"
                    code={`curl -X GET \\
  "https://yourdomain.com/api/scraper?jobId=cm1...xyz" \\
  -H "X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Error Reference */}
          <section id="errors" className="scroll-mt-28">
            <SectionHeader
              icon={AlertTriangle}
              title="Error Reference"
              subtitle="HTTP status codes and error payloads"
            />
            <Card className="border-border/40 hover:shadow-md hover:-translate-y-px transition-all duration-200">
              <CardContent className="p-5 space-y-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All errors follow a consistent JSON structure. Check the HTTP status code and the
                  <code className="font-mono text-xs">error</code> field for details.
                </p>

                <div className="space-y-2">
                  {[
                    { code: "400", label: "Bad Request", desc: "Validation failed or malformed payload. Check the issues array for field-level errors.", color: "amber" },
                    { code: "401", label: "Unauthorized", desc: "Missing or invalid X-API-Key header. Ensure your key is active and correctly formatted.", color: "red" },
                    { code: "403", label: "Forbidden", desc: "Valid key, but insufficient scope for the requested operation.", color: "red" },
                    { code: "404", label: "Not Found", desc: "The requested resource (lead, job, etc.) does not exist.", color: "slate" },
                    { code: "405", label: "Method Not Allowed", desc: "HTTP verb not supported on this endpoint.", color: "slate" },
                    { code: "429", label: "Too Many Requests", desc: "Rate limit exceeded. Wait until the X-RateLimit-Reset timestamp before retrying.", color: "orange" },
                    { code: "500", label: "Internal Server Error", desc: "Unexpected server failure. Contact support if this persists.", color: "red" },
                  ].map((e) => (
                    <div key={e.code} className="flex items-start gap-3 rounded-xl border border-border/30 bg-muted/20 p-3.5 hover:border-border/50 transition-colors">
                      <Badge className={`shrink-0 rounded text-[10px] font-bold border ${
                        e.color === "amber" ? "bg-amber-500/15 text-amber-400 border-amber-500/25" :
                        e.color === "orange" ? "bg-orange-500/15 text-orange-400 border-orange-500/25" :
                        e.color === "red" ? "bg-red-500/15 text-red-400 border-red-500/25" :
                        "bg-slate-500/15 text-slate-300 border-slate-500/25"
                      }`}>
                        {e.code}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{e.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Validation error example (400)</p>
                  <CodeBlock
                    lang="json"
                    code={`{
  "error": "Validation failed",
  "issues": [
    {
      "code": "invalid_string",
      "path": ["email"],
      "message": "Invalid email format"
    },
    {
      "code": "too_small",
      "path": ["companyName"],
      "message": "Company name is required"
    }
  ]
}`}
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Back to top */}
        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-lg ring-1 ring-border/40 hover:shadow-xl hover:-translate-y-px transition-all duration-200"
            aria-label="Back to top"
          >
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>
    </AppShell>
  );
}
