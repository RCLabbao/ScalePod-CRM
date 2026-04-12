import {
  Form,
  Link,
  useLoaderData,
  useActionData,
} from "react-router";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../lib/auth.guard";
import { scoreLead } from "../lib/scoring";
import { logActivity } from "../lib/activity-log";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, ShieldCheck, CheckCircle2, XCircle, Flame, Sun, Snowflake } from "lucide-react";

export async function loader({ request, params }: { request: Request; params: { leadId: string } }) {
  const userId = await requireAdmin(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
    include: {
      criteriaResponses: {
        include: { criteria: true, verifier: { select: { name: true, email: true } } },
      },
    },
  });

  if (!lead) {
    throw new Response("Lead not found", { status: 404 });
  }

  const criteria = await prisma.verificationCriteria.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const existingResponses = new Map(
    lead.criteriaResponses.map((v) => [v.criteriaId, v])
  );

  return { user, lead, criteria, existingResponses };
}

export async function action({ request, params }: { request: Request; params: { leadId: string } }) {
  const userId = await requireAdmin(request);
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  const leadId = params.leadId;
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "rescore") {
    const criteriaIds = formData.getAll("criteriaId") as string[];
    const responses: { criteriaId: string; response: string; notes: string }[] = [];

    for (const cid of criteriaIds) {
      const response = formData.get(`response_${cid}`) as string;
      const notes = (formData.get(`notes_${cid}`) as string) || "";
      if (response) responses.push({ criteriaId: cid, response, notes });
    }

    if (responses.length === 0) {
      return { error: "Please respond to at least one criterion." };
    }

    // Get previous temperature for comparison
    const previousLead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { temperature: true, score: true, maxScore: true },
    });

    // Upsert responses
    await prisma.$transaction(
      responses.map((r) =>
        prisma.leadVerification.upsert({
          where: { leadId_criteriaId: { leadId, criteriaId: r.criteriaId } },
          create: {
            leadId,
            criteriaId: r.criteriaId,
            verifiedBy: userId,
            response: r.response,
            notes: r.notes,
            score: 0, // will be recalculated by scoreLead
          },
          update: {
            verifiedBy: userId,
            response: r.response,
            notes: r.notes,
          },
        })
      )
    );

    // Re-score using the shared scoring function
    const scoredResponses = responses.map((r) => ({ criteriaId: r.criteriaId, response: r.response }));
    const result = await scoreLead(scoredResponses);

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        score: result.score,
        maxScore: result.maxScore,
        temperature: result.temperature,
      },
    });

    // Update individual scores
    for (const sr of result.responses) {
      await prisma.leadVerification.updateMany({
        where: { leadId, criteriaId: sr.criteriaId },
        data: { score: sr.score },
      });
    }

    // Log activity
    await logActivity({
      leadId,
      userId,
      action: "LEAD_SCORED",
      description: `${currentUser?.name || "Unknown"} re-scored this lead (${result.temperature})`,
      metadata: {
        score: result.score,
        maxScore: result.maxScore,
        temperature: result.temperature,
        previousTemperature: previousLead?.temperature,
        percentage: result.percentage,
      },
    });

    return { success: true, temperature: result.temperature, score: result.score, maxScore: result.maxScore };
  }

  return {};
}

export default function VerifyLead() {
  const { user, lead, criteria, existingResponses } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const tempConfig: Record<string, { classes: string; icon: typeof Flame }> = {
    HOT:  { classes: "bg-red-500/15 text-red-400 border-red-500/20", icon: Flame },
    WARM: { classes: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: Sun },
    COLD: { classes: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: Snowflake },
  };
  const temp = tempConfig[lead.temperature] || tempConfig.COLD;
  const TempIcon = temp.icon;

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/inbox">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Re-Score Lead</h1>
              <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${temp.classes}`}>
                <TempIcon className="h-3 w-3" />
                {lead.temperature}
              </span>
            </div>
            <p className="text-muted-foreground">
              {lead.companyName} &middot; {lead.email} &middot; Score: {Math.round(lead.score)}/{Math.round(lead.maxScore)}
            </p>
          </div>
        </div>

        {actionData?.success && (
          <div className={`rounded-md p-4 text-sm border ${
            actionData.temperature === "HOT"
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : actionData.temperature === "WARM"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                Re-scored: {actionData.score}/{actionData.maxScore} — {actionData.temperature}
              </span>
            </div>
          </div>
        )}
        {actionData?.error && (
          <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {actionData.error}
          </div>
        )}

        {/* Lead summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Company", lead.companyName],
                ["Contact", lead.contactName],
                ["Email", lead.email],
                ["Website", lead.website],
                ["Industry", lead.industry],
                ["Est. Traffic", lead.estimatedTraffic],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        {/* Re-score form */}
        {criteria.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12">
              <ShieldCheck className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-muted-foreground">No active criteria defined.</p>
              <Link to="/verification/criteria">
                <Button variant="outline" className="mt-3">Define Criteria</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Form method="post">
            <input type="hidden" name="intent" value="rescore" />
            <div className="space-y-4">
              {criteria.map((c) => {
                const existing = existingResponses.get(c.id);
                return (
                  <Card key={c.id}>
                    <CardContent className="p-5 space-y-3">
                      <input type="hidden" name="criteriaId" value={c.id} />
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
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
                            <input type="radio" name={`response_${c.id}`} value="yes" defaultChecked={existing?.response === "yes"} className="h-4 w-4 accent-emerald-500" />
                            <span className="text-sm font-medium text-emerald-400">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-2 cursor-pointer has-[:checked]:bg-red-500/20 has-[:checked]:border-red-500/40 transition-colors">
                            <input type="radio" name={`response_${c.id}`} value="no" defaultChecked={existing?.response === "no"} className="h-4 w-4 accent-red-500" />
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
                              <label key={score} className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors ${cls}`}>
                                <input type="radio" name={`response_${c.id}`} value={String(score)} defaultChecked={existing?.response === String(score)} className="sr-only" />
                                {score}
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {c.type === "TEXT" && (
                        <Textarea name={`response_${c.id}`} rows={2} placeholder="Enter your evaluation..." defaultValue={existing?.response || ""} />
                      )}

                      <Textarea name={`notes_${c.id}`} rows={1} placeholder="Optional notes..." defaultValue={existing?.notes || ""} className="text-xs" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <Button type="submit" size="lg" className="bg-violet-500/15 text-violet-400 border border-violet-500/20 hover:bg-violet-500/25">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Re-Score Lead
              </Button>
            </div>
          </Form>
        )}

        {/* Response history */}
        {lead.criteriaResponses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Scoring History</h3>
            {lead.criteriaResponses.map((v) => (
              <Card key={v.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{v.criteria.name}</span>
                      {v.verifier && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          by {v.verifier.name || v.verifier.email}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">{v.response}</span>
                      <span className="text-xs text-muted-foreground">{v.score}pts</span>
                    </div>
                  </div>
                  {v.notes && <p className="mt-1 text-sm text-muted-foreground">{v.notes}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(v.createdAt).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
