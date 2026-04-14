import { Form, Link, useLoaderData, useActionData, useSearchParams } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Search, ExternalLink, CheckCircle2, XCircle, ShieldCheck, Flame, Sun, Snowflake } from "lucide-react";
import { scoreLead } from "../lib/scoring.server";
import { logActivity } from "../lib/activity-log.server";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const url = new URL(request.url);
  const search = url.searchParams.get("q") || "";
  const status = url.searchParams.get("status") || "INBOX";
  const tempFilter = url.searchParams.get("temp") || "";

  const leads = await prisma.lead.findMany({
    where: {
      status,
      ...(tempFilter ? { temperature: tempFilter } : {}),
      ...(search
        ? {
            OR: [
              { companyName: { contains: search } },
              { email: { contains: search } },
              { contactName: { contains: search } },
              { industry: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { score: "desc" },
    include: { criteriaResponses: { include: { criteria: true } } },
  });

  const criteria = await prisma.verificationCriteria.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return { user, leads, search, status, tempFilter, criteria };
}

export async function action({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, role: true },
  });
  if (currentUser?.role !== "ADMIN") {
    throw new Response("Forbidden", { status: 403 });
  }
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const email = formData.get("email") as string;

    const existing = await prisma.lead.findUnique({ where: { email } });
    if (existing) {
      return { error: "A lead with this email already exists." };
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
      description: `${currentUser.name || "Unknown"} added this lead`,
      metadata: {
        temperature: result.temperature,
        score: result.score,
        percentage: result.percentage,
      },
    });

    return { success: true, temperature: result.temperature, score: result.score, maxScore: result.maxScore };
  }

  if (intent === "accept") {
    const leadId = formData.get("leadId") as string;
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { companyName: true },
    });

    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "ACTIVE", approvedById: userId, rejectedById: null },
    });

    // Log activity
    await logActivity({
      leadId,
      userId,
      action: "LEAD_APPROVED",
      description: `${currentUser.name || "Unknown"} approved this lead`,
    });

    return { success: true, message: `${lead?.companyName} approved` };
  }

  if (intent === "reject") {
    const leadId = formData.get("leadId") as string;
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { companyName: true },
    });

    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "REJECTED", rejectedById: userId, approvedById: null },
    });

    // Log activity
    await logActivity({
      leadId,
      userId,
      action: "LEAD_REJECTED",
      description: `${currentUser.name || "Unknown"} rejected this lead`,
    });

    return { success: true, message: `${lead?.companyName} rejected` };
  }

  return {};
}

export default function Inbox() {
  const { user, leads, search, status, tempFilter, criteria } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAdmin = user?.role === "ADMIN";

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lead Inbox</h1>
            <p className="text-muted-foreground">
              {isAdmin ? "Manage and review scored leads" : "View scored leads"}
            </p>
          </div>
          {isAdmin && (
            <Link to="/leads/new">
              <Button className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25">
                <Plus className="mr-2 h-4 w-4" />
                Add Lead
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.value) params.set("q", e.target.value);
                else params.delete("q");
                setSearchParams(params);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "INBOX", label: "Inbox", activeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
              { key: "ACTIVE", label: "Active", activeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
              { key: "REJECTED", label: "Rejected", activeClass: "bg-red-500/20 text-red-400 border-red-500/30" },
            ].map((s) => (
              <Button
                key={s.key}
                variant="outline"
                size="sm"
                className={status === s.key ? s.activeClass : ""}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("status", s.key);
                  setSearchParams(params);
                }}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Temperature filter */}
        <div className="flex gap-2">
          <span className="flex items-center text-sm text-muted-foreground">Temperature:</span>
          {[
            { key: "", label: "All", activeClass: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
            { key: "HOT", label: "Hot", activeClass: "bg-red-500/20 text-red-400 border-red-500/30" },
            { key: "WARM", label: "Warm", activeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
            { key: "COLD", label: "Cold", activeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
          ].map((v) => (
            <Button
              key={v.key || "all"}
              variant="outline"
              size="sm"
              className={tempFilter === v.key ? v.activeClass : ""}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                if (v.key) params.set("temp", v.key);
                else params.delete("temp");
                setSearchParams(params);
              }}
            >
              {v.label}
            </Button>
          ))}
        </div>

        {/* Success message */}
        {actionData?.success && actionData?.temperature && (
          <div className={`rounded-md p-3 text-sm border ${
            actionData.temperature === "HOT"
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : actionData.temperature === "WARM"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
          }`}>
            Lead added! Score: {actionData.score}/{actionData.maxScore} — <strong>{actionData.temperature}</strong>
          </div>
        )}

        {/* Leads table */}
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contact</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Email</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Industry</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Score</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Temp</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stage</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      No leads found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-b transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="font-medium">{lead.companyName}</div>
                        {lead.website && (
                          <div className="text-xs text-muted-foreground">{lead.website}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">{lead.contactName || "—"}</td>
                      <td className="hidden px-4 py-3 md:table-cell">{lead.email}</td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        {lead.industry && (
                          <span className="inline-flex items-center rounded-md border border-blue-500/20 bg-blue-500/10 px-1.5 py-0 text-xs text-blue-400">{lead.industry}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold">{Math.round(lead.score)}/{Math.round(lead.maxScore)}</span>
                          <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                lead.maxScore > 0 && (lead.score / lead.maxScore) >= 0.8
                                  ? "bg-red-400"
                                  : lead.maxScore > 0 && (lead.score / lead.maxScore) >= 0.5
                                  ? "bg-amber-400"
                                  : "bg-blue-400"
                              }`}
                              style={{ width: `${lead.maxScore > 0 ? (lead.score / lead.maxScore) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <TemperatureBadge temperature={lead.temperature} />
                      </td>
                      <td className="px-4 py-3">
                        <StageBadge stage={lead.stage} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {isAdmin && lead.status === "INBOX" && (
                            <>
                              <Form method="post">
                                <input type="hidden" name="intent" value="accept" />
                                <input type="hidden" name="leadId" value={lead.id} />
                                <Button type="submit" size="icon" variant="ghost" title="Accept lead">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                </Button>
                              </Form>
                              <Form method="post">
                                <input type="hidden" name="intent" value="reject" />
                                <input type="hidden" name="leadId" value={lead.id} />
                                <Button type="submit" size="icon" variant="ghost" title="Reject lead">
                                  <XCircle className="h-4 w-4 text-red-400" />
                                </Button>
                              </Form>
                            </>
                          )}
                          {isAdmin && (
                            <Link to={`/verification/${lead.id}`}>
                              <Button size="icon" variant="ghost" title="Re-score lead">
                                <ShieldCheck className="h-4 w-4 text-violet-400" />
                              </Button>
                            </Link>
                          )}
                          <Link to={`/leads/${lead.id}/emails`}>
                            <Button size="icon" variant="ghost" title="Email lead">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const config: Record<string, { classes: string }> = {
    SOURCED:        { classes: "bg-slate-500/15 text-slate-300 border-slate-500/20" },
    QUALIFIED:      { classes: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    FIRST_CONTACT:  { classes: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
    MEETING_BOOKED: { classes: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
    PROPOSAL_SENT:  { classes: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
    CLOSED_WON:     { classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    CLOSED_LOST:    { classes: "bg-red-500/15 text-red-400 border-red-500/20" },
  };
  const c = config[stage] || config.SOURCED;
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`}>
      {stage.replace(/_/g, " ")}
    </span>
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
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`}>
      <Icon className="h-3 w-3" />
      {temperature}
    </span>
  );
}
