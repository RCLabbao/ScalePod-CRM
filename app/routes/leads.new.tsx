import { Form, useLoaderData, useActionData, useNavigate } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
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
} from "lucide-react";
import { Link } from "react-router";
import { scoreLead } from "../lib/scoring.server";
import { logActivity } from "../lib/activity-log.server";
import { useEffect } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const criteria = await prisma.verificationCriteria.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

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

  // Gather criteria responses
  const criteriaIds = formData.getAll("criteriaId") as string[];
  const responses: { criteriaId: string; response: string }[] = [];
  for (const cid of criteriaIds) {
    const resp = formData.get(`response_${cid}`) as string;
    if (resp) responses.push({ criteriaId: cid, response: resp });
  }

  // Score the lead
  const result = await scoreLead(responses);

  // Create lead with score and creator tracking
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

  // Save criteria responses
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

  // Log activity
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

  return {
    success: true,
    leadId: lead.id,
    companyName: lead.companyName,
    temperature: result.temperature,
    score: result.score,
    maxScore: result.maxScore,
    percentage: result.percentage,
  };
}

export default function NewLead() {
  const { user, criteria } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [actionData]);

  return (
    <AppShell user={user!}>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/inbox">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Lead</h1>
            <p className="text-sm text-muted-foreground">
              Fill out the details and qualification scorecard
            </p>
          </div>
        </div>

        {/* Success banner */}
        {actionData?.success && (
          <Card className={`border-2 ${
            actionData.temperature === "HOT"
              ? "border-red-500/40 bg-red-500/5"
              : actionData.temperature === "WARM"
              ? "border-amber-500/40 bg-amber-500/5"
              : "border-blue-500/40 bg-blue-500/5"
          }`}>
            <CardContent className="flex items-center gap-4 p-5">
              <CheckCircle2 className={`h-8 w-8 shrink-0 ${
                actionData.temperature === "HOT"
                  ? "text-red-400"
                  : actionData.temperature === "WARM"
                  ? "text-amber-400"
                  : "text-blue-400"
              }`} />
              <div className="flex-1">
                <p className="font-semibold">
                  {actionData.companyName} added successfully!
                </p>
                <p className="text-sm text-muted-foreground">
                  Score: {Math.round(actionData.score!)}/{Math.round(actionData.maxScore!)} ({Math.round(actionData.percentage!)}%) —{" "}
                  <TemperatureBadge temperature={actionData.temperature!} />
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/inbox/${actionData.leadId}`}>
                  <Button variant="outline" size="sm">View Lead</Button>
                </Link>
                <Button size="sm" onClick={() => navigate("/leads/new", { replace: true })}>
                  Add Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Form method="post" className="space-y-6">
          {/* Error */}
          {actionData?.error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {actionData.error}
            </div>
          )}

          {/* Section 1: Point of Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Point of Contact</CardTitle>
              <CardDescription>Who are we reaching out to?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input id="contactName" name="contactName" placeholder="John Smith" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" placeholder="john@company.com" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company Info</CardTitle>
              <CardDescription>Business details and background</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input id="companyName" name="companyName" placeholder="Acme Corp" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" name="industry" placeholder="e.g. SaaS, E-commerce" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" placeholder="https://example.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="estimatedTraffic">Est. Monthly Traffic</Label>
                  <Input id="estimatedTraffic" name="estimatedTraffic" placeholder="e.g. 10K-50K" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="techStack">Tech Stack</Label>
                  <Input id="techStack" name="techStack" placeholder="e.g. WordPress, Shopify" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="leadSource">Lead Source</Label>
                  <Input id="leadSource" name="leadSource" placeholder="e.g. LinkedIn, Referral" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Social Links</CardTitle>
              <CardDescription>Where to find them online</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="linkedin" className="flex items-center gap-1.5">
                    <Linkedin className="h-3.5 w-3.5 text-blue-400" /> LinkedIn
                  </Label>
                  <Input id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="facebook" className="flex items-center gap-1.5">
                    <Facebook className="h-3.5 w-3.5 text-blue-500" /> Facebook
                  </Label>
                  <Input id="facebook" name="facebook" placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="instagram" className="flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5 text-pink-400" /> Instagram
                  </Label>
                  <Input id="instagram" name="instagram" placeholder="https://instagram.com/..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="twitter" className="flex items-center gap-1.5">
                    <Twitter className="h-3.5 w-3.5 text-sky-400" /> Twitter / X
                  </Label>
                  <Input id="twitter" name="twitter" placeholder="https://x.com/..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
              <CardDescription>Any additional context about this lead</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea id="notes" name="notes" rows={3} placeholder="Add notes about this lead..." />
            </CardContent>
          </Card>

          {/* Section 5: Lead Qualification Scorecard */}
          {criteria.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lead Qualification Scorecard</CardTitle>
                <CardDescription>
                  Answer each criterion to calculate the lead score. Higher scores = hotter leads.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {criteria.map((c, idx) => (
                  <div key={c.id} className="rounded-lg border border-border/50 bg-muted/10 p-4 space-y-3">
                    <input type="hidden" name="criteriaId" value={c.id} />
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">
                          {idx + 1}. {c.name}
                          {c.required && <span className="ml-1 text-red-400">*</span>}
                        </p>
                        {c.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400 border border-violet-500/20">
                        {c.weight}pt{c.weight > 1 ? "s" : ""}
                      </span>
                    </div>

                    {c.type === "YES_NO" && (
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 cursor-pointer has-[:checked]:bg-emerald-500/20 has-[:checked]:border-emerald-500/40 transition-colors">
                          <input type="radio" name={`response_${c.id}`} value="yes" required={c.required} className="h-4 w-4 accent-emerald-500" />
                          <span className="text-sm font-medium text-emerald-400">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-2 cursor-pointer has-[:checked]:bg-red-500/20 has-[:checked]:border-red-500/40 transition-colors">
                          <input type="radio" name={`response_${c.id}`} value="no" required={c.required} className="h-4 w-4 accent-red-500" />
                          <span className="text-sm font-medium text-red-400">No</span>
                        </label>
                      </div>
                    )}

                    {c.type === "SCORE" && (
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((score) => {
                          const cls = score <= 2
                            ? "border-red-500/20 text-red-400 hover:bg-red-500/10 has-[:checked]:bg-red-500/20 has-[:checked]:border-red-500/40"
                            : score === 3
                            ? "border-amber-500/20 text-amber-400 hover:bg-amber-500/10 has-[:checked]:bg-amber-500/20 has-[:checked]:border-amber-500/40"
                            : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 has-[:checked]:bg-emerald-500/20 has-[:checked]:border-emerald-500/40";
                          return (
                            <label key={score} className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors ${cls}`}>
                              <input type="radio" name={`response_${c.id}`} value={String(score)} required={c.required} className="sr-only" />
                              {score}
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {c.type === "TEXT" && (
                      <Textarea name={`response_${c.id}`} rows={2} placeholder="Enter your evaluation..." required={c.required} />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
            <Link to="/inbox">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Score & Add Lead
            </Button>
          </div>
        </Form>
      </div>
    </AppShell>
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
    <strong className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`}>
      <Icon className="h-3 w-3" />
      {temperature}
    </strong>
  );
}
