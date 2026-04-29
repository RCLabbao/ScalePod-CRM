import { Form, Link, useActionData, useFetcher, useLoaderData, useNavigation } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { recalculateAllLeadScores } from "../lib/scoring-rules.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Plus, Trash2, Zap, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import { data } from "react-router";

const FIELD_TYPES = ["INDUSTRY", "ESTIMATED_TRAFFIC", "TECH_STACK", "LEAD_SOURCE", "WEBSITE"] as const;
const OPERATORS = ["CONTAINS", "EQUALS", "STARTS_WITH", "REGEX"] as const;

type ScoringRuleRow = {
  id: string;
  name: string;
  description: string | null;
  fieldType: string;
  operator: string;
  value: string;
  points: number;
  active: boolean;
  priority: number;
};

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const rules = await prisma.scoringRule.findMany({
    orderBy: { priority: "asc" },
  });

  const scoreConfig = await prisma.scoreConfig.findUnique({ where: { id: "default" } });

  return {
    rules: rules as unknown as ScoringRuleRow[],
    scoreConfig,
    user,
  };
}

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const name = formData.get("name") as string;
    const fieldType = formData.get("fieldType") as string;
    const operator = formData.get("operator") as string;
    const value = formData.get("value") as string;
    const points = parseFloat(formData.get("points") as string) || 0;
    const priority = parseInt(formData.get("priority") as string) || 0;

    if (!name?.trim() || !value?.trim()) {
      return { error: "Name and value are required" };
    }

    await prisma.scoringRule.create({
      data: { name: name.trim(), fieldType, operator, value: value.trim(), points, priority },
    });

    return { success: true, created: name };
  }

  if (intent === "delete") {
    const ruleId = formData.get("ruleId") as string;
    if (!ruleId) return { error: "Rule ID required" };
    await prisma.scoringRule.delete({ where: { id: ruleId } });
    return { success: true, deleted: true };
  }

  if (intent === "toggleActive") {
    const ruleId = formData.get("ruleId") as string;
    const active = formData.get("active") === "true";
    if (!ruleId) return { error: "Rule ID required" };
    await prisma.scoringRule.update({ where: { id: ruleId }, data: { active: !active } });
    return { success: true };
  }

  if (intent === "toggleAutoScore") {
    const current = await prisma.scoreConfig.findUnique({ where: { id: "default" } });
    await prisma.scoreConfig.update({
      where: { id: "default" },
      data: { autoScore: !(current?.autoScore ?? true) },
    });
    return { success: true };
  }

  if (intent === "recalculateAll") {
    const result = await recalculateAllLeadScores();
    return { success: true, updated: result.updated, errors: result.errors };
  }

  return {};
}

export default function ScoringRulesSettings() {
  const { rules, scoreConfig, user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";
  const autoScoreEnabled = scoreConfig?.autoScore ?? true;

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Zap className="h-8 w-8" />
              Scoring Rules
            </h1>
            <p className="text-muted-foreground">Attribute-based rules that auto-score leads</p>
          </div>
        </div>

        {actionData?.error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {actionData.error}
          </div>
        )}
        {actionData?.success && actionData?.created && (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            Rule "{actionData.created}" created successfully.
          </div>
        )}
        {actionData?.success && actionData?.updated !== undefined && (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            Recalculated {actionData.updated} leads ({actionData.errors} errors).
          </div>
        )}

        {/* Auto-score toggle + Recalculate */}
        <Card>
          <CardHeader>
            <CardTitle>Auto-Scoring</CardTitle>
            <CardDescription>Automatically score new leads using rules when they are created</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form method="post" className="flex items-center justify-between rounded-lg border p-4">
              <input type="hidden" name="intent" value="toggleAutoScore" />
              <div className="flex items-center gap-3">
                {autoScoreEnabled ? (
                  <ToggleRight className="h-5 w-5 text-emerald-400" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Auto-Score</p>
                  <p className="text-sm text-muted-foreground">
                    {autoScoreEnabled ? "Enabled — new leads are scored automatically" : "Disabled — new leads get default score (0)"}
                  </p>
                </div>
              </div>
              <Button type="submit" variant="outline" size="sm">
                {autoScoreEnabled ? "Disable" : "Enable"}
              </Button>
            </Form>

            <Form method="post">
              <input type="hidden" name="intent" value="recalculateAll" />
              <Button type="submit" variant="outline" disabled={isSubmitting} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                {isSubmitting && navigation.formData?.get("intent") === "recalculateAll"
                  ? "Recalculating..."
                  : "Recalculate All Lead Scores"}
              </Button>
            </Form>
          </CardContent>
        </Card>

        {/* Create new rule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Scoring Rule
            </CardTitle>
            <CardDescription>Assign bonus points when a lead field matches a rule</CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <input type="hidden" name="intent" value="create" />

              <div>
                <label className="text-sm font-medium">Rule Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder='e.g., "High-Value Industry" or "Shopify Merchant"'
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Field</label>
                  <select
                    name="fieldType"
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {FIELD_TYPES.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Operator</label>
                  <select
                    name="operator"
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {OPERATORS.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Match Value</label>
                <input
                  name="value"
                  type="text"
                  required
                  placeholder='e.g., SaaS, Shopify, ^https://'
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Points</label>
                  <input
                    name="points"
                    type="number"
                    step="0.5"
                    defaultValue={10}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <input
                    name="priority"
                    type="number"
                    defaultValue={0}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && navigation.formData?.get("intent") === "create" ? "Creating..." : "Create Rule"}
              </Button>
            </Form>
          </CardContent>
        </Card>

        {/* Existing rules */}
        <Card>
          <CardHeader>
            <CardTitle>Scoring Rules</CardTitle>
            <CardDescription>{rules.length} rule{rules.length !== 1 ? "s" : ""} configured</CardDescription>
          </CardHeader>
          <CardContent>
            {rules.length === 0 ? (
              <p className="text-sm text-muted-foreground">No scoring rules yet. Create one above to start auto-scoring leads.</p>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{rule.name}</p>
                        <Badge variant="secondary">{rule.fieldType.replace(/_/g, " ")}</Badge>
                        <Badge variant="outline">{rule.operator}</Badge>
                        <Badge variant={rule.active ? "success" : "outline"}>
                          {rule.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        {rule.fieldType.replace(/_/g, " ")} {rule.operator.toLowerCase()} "{rule.value}"
                      </p>
                      <p className="text-sm font-medium">
                        +{rule.points} points (priority {rule.priority})
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Form method="post">
                        <input type="hidden" name="intent" value="toggleActive" />
                        <input type="hidden" name="ruleId" value={rule.id} />
                        <input type="hidden" name="active" value={String(rule.active)} />
                        <Button type="submit" variant="ghost" size="sm">
                          {rule.active ? "Disable" : "Enable"}
                        </Button>
                      </Form>
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="ruleId" value={rule.id} />
                        <Button type="submit" variant="outline" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}