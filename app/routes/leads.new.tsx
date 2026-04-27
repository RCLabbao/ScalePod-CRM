import { Form, useLoaderData, useActionData, useSearchParams } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { redirect } from "react-router";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  UserPlus,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Flame,
  Sun,
  Snowflake,
  CheckCircle2,
  AlertCircle,
  User,
  Building2,
  Globe,
  Link2,
  BarChart3,
  NotebookPen,
  ClipboardCheck,
  Mail,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import { scoreLead } from "../lib/scoring.server";
import { logActivity } from "../lib/activity-log.server";
import { useEffect, useState } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  let criteria: Awaited<ReturnType<typeof prisma.verificationCriteria.findMany>> = [];
  try {
    criteria = await prisma.verificationCriteria.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (err) {
    console.error("[leads/new] Failed to load criteria:", err);
  }

  return { user, criteria };
}

export async function action({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  const formData = await request.formData();
  const email = formData.get("email") as string;

  const existing = await prisma.lead.findUnique({ where: { email } });
  if (existing) {
    return { error: `A lead with this email already exists. (${existing.companyName})` };
  }

  const criteriaIds = formData.getAll("criteriaId") as string[];
  const responses: { criteriaId: string; response: string }[] = [];
  for (const cid of criteriaIds) {
    const resp = formData.get(`response_${cid}`) as string;
    if (resp) responses.push({ criteriaId: cid, response: resp });
  }

  let result;
  try {
    result = await scoreLead(responses);
  } catch (err) {
    console.error("[leads/new] Scoring failed:", err);
    return { error: "Failed to score lead. Please try again." };
  }

  const lead = await prisma.lead.create({
    data: {
      companyName: formData.get("companyName") as string,
      website: (formData.get("website") as string) || null,
      contactName: (formData.get("contactName") as string) || null,
      email,
      industry: (formData.get("industry") as string) || null,
      estimatedTraffic: (formData.get("estimatedTraffic") as string) || null,
      techStack: (formData.get("techStack") as string) || null,
      linkedin: (formData.get("linkedin") as string) || null,
      facebook: (formData.get("facebook") as string) || null,
      instagram: (formData.get("instagram") as string) || null,
      twitter: (formData.get("twitter") as string) || null,
      leadSource: (formData.get("leadSource") as string) || null,
      notes: (formData.get("notes") as string) || null,
      score: result.score,
      maxScore: result.maxScore,
      temperature: result.temperature,
      createdById: userId,
    },
  });

  if (responses.length > 0) {
    await prisma.$transaction(
      result.responses.map((r) =>
        prisma.leadVerification.create({
          data: {
            leadId: lead.id,
            criteriaId: r.criteriaId,
            response: r.response,
            score: r.score,
          },
        })
      )
    );
  }

  await logActivity({
    leadId: lead.id,
    userId,
    action: "LEAD_CREATED",
    description: `${user?.name || "Unknown"} added this lead`,
    metadata: {
      temperature: result.temperature,
      score: result.score,
      percentage: result.percentage,
    },
  });

  const params = new URLSearchParams({
    success: "true",
    leadId: lead.id,
    companyName: lead.companyName,
    temperature: result.temperature,
    score: String(Math.round(result.score)),
    maxScore: String(Math.round(result.maxScore)),
    percentage: String(Math.round(result.percentage)),
  });

  return redirect(`/leads/new?${params.toString()}`);
}

export default function NewLead() {
  const { user, criteria } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const successData = searchParams.get("success") === "true"
    ? {
        leadId: searchParams.get("leadId") || "",
        companyName: searchParams.get("companyName") || "",
        temperature: searchParams.get("temperature") || "COLD",
        score: Number(searchParams.get("score")) || 0,
        maxScore: Number(searchParams.get("maxScore")) || 0,
        percentage: Number(searchParams.get("percentage")) || 0,
      }
    : null;

  useEffect(() => {
    if (successData) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [successData]);

  const tempConfig = {
    HOT:  { bg: "bg-red-500/10", border: "border-red-500/25", ring: "ring-red-500/15", text: "text-red-400", icon: Flame },
    WARM: { bg: "bg-amber-500/10", border: "border-amber-500/25", ring: "ring-amber-500/15", text: "text-amber-400", icon: Sun },
    COLD: { bg: "bg-blue-500/10", border: "border-blue-500/25", ring: "ring-blue-500/15", text: "text-blue-400", icon: Snowflake },
  };

  const handleSubmit = () => {
    setSubmitting(true);
  };

  return (
    <AppShell user={user!}>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link to="/inbox">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Lead</h1>
            <p className="text-muted-foreground mt-1">
              Fill out the details and qualification scorecard
            </p>
          </div>
        </div>

        {/* Success banner */}
        {successData && (
          <Card className={`border ${tempConfig[successData.temperature as keyof typeof tempConfig]?.border || tempConfig.COLD.border} ${tempConfig[successData.temperature as keyof typeof tempConfig]?.bg || tempConfig.COLD.bg} overflow-hidden`}>
            <div className={`h-1 w-full ${tempConfig[successData.temperature as keyof typeof tempConfig]?.text.replace("text-", "bg-") || "bg-blue-400"}`} />
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tempConfig[successData.temperature as keyof typeof tempConfig]?.bg || tempConfig.COLD.bg} ring-1 ${tempConfig[successData.temperature as keyof typeof tempConfig]?.ring || tempConfig.COLD.ring}`}>
                <CheckCircle2 className={`h-5 w-5 ${tempConfig[successData.temperature as keyof typeof tempConfig]?.text || tempConfig.COLD.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">
                  {successData.companyName} added successfully
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    {successData.score}/{successData.maxScore} ({successData.percentage}%)
                  </span>
                  <TemperatureBadge temperature={successData.temperature} />
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/inbox/${successData.leadId}`}>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    View Lead
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={() => { setSearchParams({}, { replace: true }); }}
                >
                  Add Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Form method="post" className="space-y-6" onSubmit={handleSubmit}>
          {/* Error */}
          {actionData?.error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {actionData.error}
            </div>
          )}

          {/* Section 1: Point of Contact */}
          <SectionCard
            icon={<User className="h-4 w-4 text-violet-400" />}
            title="Point of Contact"
            description="Who are we reaching out to?"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contactName" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Contact Name *</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  placeholder="John Smith"
                  required
                  className="bg-background border-border/60 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  required
                  className="bg-background border-border/60 shadow-sm"
                />
              </div>
            </div>
          </SectionCard>

          {/* Section 2: Company Info */}
          <SectionCard
            icon={<Building2 className="h-4 w-4 text-blue-400" />}
            title="Company Info"
            description="Business details and background"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Acme Corp"
                  required
                  className="bg-background border-border/60 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="industry" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  placeholder="e.g. SaaS, E-commerce"
                  className="bg-background border-border/60 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Website</Label>
                <Input
                  id="website"
                  name="website"
                  placeholder="https://example.com"
                  className="bg-background border-border/60 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="estimatedTraffic" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Est. Monthly Traffic</Label>
                <Input
                  id="estimatedTraffic"
                  name="estimatedTraffic"
                  placeholder="e.g. 10K–50K"
                  className="bg-background border-border/60 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="techStack" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Tech Stack</Label>
                <Input
                  id="techStack"
                  name="techStack"
                  placeholder="e.g. WordPress, Shopify"
                  className="bg-background border-border/60 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="leadSource" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Lead Source</Label>
                <Input
                  id="leadSource"
                  name="leadSource"
                  placeholder="e.g. LinkedIn, Referral"
                  className="bg-background border-border/60 shadow-sm"
                />
              </div>
            </div>
          </SectionCard>

          {/* Section 3: Social Links */}
          <SectionCard
            icon={<Globe className="h-4 w-4 text-emerald-400" />}
            title="Social Links"
            description="Where to find them online"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <SocialField
                name="linkedin"
                label="LinkedIn"
                placeholder="https://linkedin.com/in/..."
                icon={<Linkedin className="h-3.5 w-3.5 text-blue-400" />}
              />
              <SocialField
                name="facebook"
                label="Facebook"
                placeholder="https://facebook.com/..."
                icon={<Facebook className="h-3.5 w-3.5 text-blue-500" />}
              />
              <SocialField
                name="instagram"
                label="Instagram"
                placeholder="https://instagram.com/..."
                icon={<Instagram className="h-3.5 w-3.5 text-pink-400" />}
              />
              <SocialField
                name="twitter"
                label="Twitter / X"
                placeholder="https://x.com/..."
                icon={<Twitter className="h-3.5 w-3.5 text-sky-400" />}
              />
            </div>
          </SectionCard>

          {/* Section 4: Notes */}
          <SectionCard
            icon={<NotebookPen className="h-4 w-4 text-amber-400" />}
            title="Notes"
            description="Any additional context about this lead"
          >
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Add notes about this lead..."
              className="bg-background border-border/60 shadow-sm resize-none"
            />
          </SectionCard>

          {/* Section 5: Lead Qualification Scorecard */}
          {criteria.length > 0 && (
            <SectionCard
              icon={<ClipboardCheck className="h-4 w-4 text-orange-400" />}
              title="Lead Qualification Scorecard"
              description="Answer each criterion to calculate the lead score. Higher scores = hotter leads."
            >
              <div className="space-y-3">
                {criteria.map((c, idx) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-border/40 bg-muted/20 p-4 space-y-3 transition-all hover:border-border/60 hover:bg-muted/30"
                  >
                    <input type="hidden" name="criteriaId" value={c.id} />
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">
                          <span className="text-muted-foreground/50 font-bold mr-1">{idx + 1}.</span>
                          {c.name}
                          {c.required && <span className="ml-1 text-red-400">*</span>}
                        </p>
                        {c.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[10px] font-bold uppercase tracking-wider rounded-md"
                      >
                        {c.weight}pt{c.weight > 1 ? "s" : ""}
                      </Badge>
                    </div>

                    {c.type === "YES_NO" && (
                      <div className="flex gap-3">
                        <ScoreOption name={`response_${c.id}`} value="yes" color="emerald" required={c.required}>
                          Yes
                        </ScoreOption>
                        <ScoreOption name={`response_${c.id}`} value="no" color="red" required={c.required}>
                          No
                        </ScoreOption>
                      </div>
                    )}

                    {c.type === "SCORE" && (
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <ScoreButton
                            key={score}
                            name={`response_${c.id}`}
                            value={String(score)}
                            required={c.required}
                            score={score}
                          />
                        ))}
                      </div>
                    )}

                    {c.type === "TEXT" && (
                      <Textarea
                        name={`response_${c.id}`}
                        rows={2}
                        placeholder="Enter your evaluation..."
                        required={c.required}
                        className="bg-background border-border/60 shadow-sm resize-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 p-4 ring-1 ring-border/20">
            <Link to="/inbox">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 rounded-lg shadow-sm"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {submitting ? "Scoring..." : "Score & Add Lead"}
            </Button>
          </div>
        </Form>
      </div>
    </AppShell>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="hover:shadow-md hover:-translate-y-px transition-all duration-200 border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 ring-1 ring-border/30">
            {icon}
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

function SocialField({
  name,
  label,
  placeholder,
  icon,
}: {
  name: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
        {icon} {label}
      </Label>
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        className="bg-background border-border/60 shadow-sm"
      />
    </div>
  );
}

function ScoreOption({
  name,
  value,
  color,
  required,
  children,
}: {
  name: string;
  value: string;
  color: "emerald" | "red" | "amber";
  required?: boolean;
  children: React.ReactNode;
}) {
  const styles = {
    emerald: "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 has-[:checked]:bg-emerald-500/15 has-[:checked]:border-emerald-500/40 has-[:checked]:text-emerald-400",
    red: "border-red-500/20 bg-red-500/5 hover:bg-red-500/10 has-[:checked]:bg-red-500/15 has-[:checked]:border-red-500/40 has-[:checked]:text-red-400",
    amber: "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 has-[:checked]:bg-amber-500/15 has-[:checked]:border-amber-500/40 has-[:checked]:text-amber-400",
  };
  return (
    <label className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 cursor-pointer transition-all duration-200 text-sm font-medium ${styles[color]}`}>
      <input
        type="radio"
        name={name}
        value={value}
        required={required}
        className="h-4 w-4 accent-current"
      />
      <span>{children}</span>
    </label>
  );
}

function ScoreButton({
  name,
  value,
  required,
  score,
}: {
  name: string;
  value: string;
  required?: boolean;
  score: number;
}) {
  const cls =
    score <= 2
      ? "border-red-500/20 text-red-400 hover:bg-red-500/10 has-[:checked]:bg-red-500/15 has-[:checked]:border-red-500/40"
      : score === 3
      ? "border-amber-500/20 text-amber-400 hover:bg-amber-500/10 has-[:checked]:bg-amber-500/15 has-[:checked]:border-amber-500/40"
      : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 has-[:checked]:bg-emerald-500/15 has-[:checked]:border-emerald-500/40";
  return (
    <label className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-sm font-bold transition-all duration-200 ${cls}`}>
      <input
        type="radio"
        name={name}
        value={value}
        required={required}
        className="fixed opacity-0 pointer-events-none"
      />
      {score}
    </label>
  );
}

function TemperatureBadge({ temperature }: { temperature: string }) {
  const config: Record<string, { classes: string; icon: typeof Flame }> = {
    HOT:  { classes: "bg-red-500/15 text-red-400 border-red-500/20", icon: Flame },
    WARM: { classes: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: Sun },
    COLD: { classes: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: Snowflake },
  };
  const c = config[temperature] || config.COLD;
  const Icon = c.icon;
  return (
    <strong className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold ${c.classes}`}>
      <Icon className="h-3 w-3" />
      {temperature}
    </strong>
  );
}
