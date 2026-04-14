import {
  Form,
  useLoaderData,
  useActionData,
  useFetcher,
} from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { requireAuth } from "../lib/auth.guard.server";
import { getScoreConfig } from "../lib/scoring.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown, ShieldCheck } from "lucide-react";
import { useState } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const criteria = await prisma.verificationCriteria.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const scoreConfig = await getScoreConfig();

  return { user, criteria, scoreConfig };
}

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;
    const type = formData.get("type") as string;
    const weight = parseInt(formData.get("weight") as string) || 1;
    const required = formData.get("required") === "on";

    if (!name) return { error: "Criterion name is required." };

    const maxOrder = await prisma.verificationCriteria.aggregate({
      _max: { sortOrder: true },
    });

    await prisma.verificationCriteria.create({
      data: {
        name,
        description,
        type,
        weight,
        required,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
      },
    });

    return { success: true };
  }

  if (intent === "update") {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;
    const type = formData.get("type") as string;
    const weight = parseInt(formData.get("weight") as string) || 1;
    const required = formData.get("required") === "on";
    const active = formData.get("active") === "on";

    await prisma.verificationCriteria.update({
      where: { id },
      data: { name, description, type, weight, required, active },
    });

    return { success: true };
  }

  if (intent === "delete") {
    await prisma.verificationCriteria.delete({
      where: { id: formData.get("id") as string },
    });
    return { success: true };
  }

  if (intent === "reorder") {
    const id = formData.get("id") as string;
    const direction = formData.get("direction") as string;
    const criteria = await prisma.verificationCriteria.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const idx = criteria.findIndex((c) => c.id === id);
    if (idx < 0) return {};

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= criteria.length) return {};

    const [a, b] = [criteria[idx], criteria[swapIdx]];
    await prisma.$transaction([
      prisma.verificationCriteria.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
      prisma.verificationCriteria.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
    ]);

    return { success: true };
  }

  if (intent === "updateScoreConfig") {
    const hotThreshold = parseFloat(formData.get("hotThreshold") as string);
    const warmThreshold = parseFloat(formData.get("warmThreshold") as string);

    if (isNaN(hotThreshold) || isNaN(warmThreshold)) {
      return { error: "Thresholds must be valid numbers." };
    }
    if (hotThreshold <= warmThreshold) {
      return { error: "Hot threshold must be higher than warm threshold." };
    }

    await prisma.scoreConfig.upsert({
      where: { id: "default" },
      update: { hotThreshold, warmThreshold },
      create: { id: "default", hotThreshold, warmThreshold },
    });

    return { success: true };
  }

  return {};
}

export default function VerificationCriteria() {
  const { user, criteria, scoreConfig } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Verification Criteria</h1>
            <p className="text-muted-foreground">
              Define the criteria admins use to evaluate and verify leads
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => { setShowForm(true); setEditingId(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Criterion
            </Button>
          )}
        </div>

        {actionData?.success && (
          <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20">
            Saved successfully.
          </div>
        )}
        {actionData?.error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {actionData.error}
          </div>
        )}

        {/* Score Thresholds */}
        {isAdmin && scoreConfig && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Score Thresholds</CardTitle>
              <CardDescription>
                Leads scoring at or above the hot threshold are marked HOT. Below warm threshold = COLD. In between = WARM.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="flex items-end gap-4">
                <input type="hidden" name="intent" value="updateScoreConfig" />
                <div className="space-y-1">
                  <Label htmlFor="hotThreshold" className="text-xs text-red-400">Hot Threshold (%)</Label>
                  <Input
                    id="hotThreshold"
                    name="hotThreshold"
                    type="number"
                    min={1}
                    max={100}
                    defaultValue={scoreConfig.hotThreshold}
                    className="w-24"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="warmThreshold" className="text-xs text-amber-400">Warm Threshold (%)</Label>
                  <Input
                    id="warmThreshold"
                    name="warmThreshold"
                    type="number"
                    min={0}
                    max={99}
                    defaultValue={scoreConfig.warmThreshold}
                    className="w-24"
                  />
                </div>
                <Button type="submit" size="sm">Update Thresholds</Button>
              </Form>
            </CardContent>
          </Card>
        )}

        {showForm && (
          <CriteriaForm
            onSubmit={() => { setShowForm(false); setEditingId(null); }}
            existing={editingId ? criteria.find((c) => c.id === editingId) : undefined}
          />
        )}

        <div className="space-y-3">
          {criteria.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ShieldCheck className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">No criteria defined yet</p>
                <p className="text-sm text-muted-foreground">
                  Create verification criteria to standardize how leads are evaluated.
                </p>
              </CardContent>
            </Card>
          ) : (
            criteria.map((c, idx) => (
              <Card key={c.id} className={!c.active ? "opacity-50" : ""}>
                <CardContent className="flex items-center gap-4 p-4">
                  {isAdmin && (
                    <div className="flex flex-col gap-0.5">
                      <Form method="post">
                        <input type="hidden" name="intent" value="reorder" />
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button type="submit" className="text-muted-foreground hover:text-foreground" disabled={idx === 0}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                      </Form>
                      <Form method="post">
                        <input type="hidden" name="intent" value="reorder" />
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button type="submit" className="text-muted-foreground hover:text-foreground" disabled={idx === criteria.length - 1}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </Form>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      <Badge className={`text-[10px] ${
                          c.type === "YES_NO" ? "bg-blue-500/15 text-blue-400 border-blue-500/20" :
                          c.type === "SCORE" ? "bg-violet-500/15 text-violet-400 border-violet-500/20" :
                          "bg-amber-500/15 text-amber-400 border-amber-500/20"
                        }`}>
                        {c.type === "YES_NO" ? "Yes / No" : c.type === "SCORE" ? "Score (1-5)" : "Text"}
                      </Badge>
                      {c.required && <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/15 px-1.5 py-0 text-[10px] font-semibold text-emerald-400">Required</span>}
                      {!c.active && <span className="inline-flex items-center rounded-md border border-red-500/20 bg-red-500/15 px-1.5 py-0 text-[10px] font-semibold text-red-400">Inactive</span>}
                    </div>
                    {c.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Weight: {c.weight}
                  </div>

                  {isAdmin && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(c.id);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={c.id} />
                        <Button type="submit" variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </Form>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}

function CriteriaForm({
  onSubmit,
  existing,
}: {
  onSubmit: () => void;
  existing?: {
    id: string;
    name: string;
    description: string | null;
    type: string;
    weight: number;
    required: boolean;
    active: boolean;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{existing ? "Edit Criterion" : "New Criterion"}</CardTitle>
        <CardDescription>
          Define how this criterion evaluates a lead
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-4" onSubmit={onSubmit}>
          <input type="hidden" name="intent" value={existing ? "update" : "create"} />
          {existing && <input type="hidden" name="id" value={existing.id} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Criterion Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Has valid website"
                required
                defaultValue={existing?.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Response Type</Label>
              <Select name="type" defaultValue={existing?.type || "YES_NO"}>
                <option value="YES_NO">Yes / No</option>
                <option value="SCORE">Score (1-5)</option>
                <option value="TEXT">Free Text</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (importance)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min={1}
                max={10}
                defaultValue={existing?.weight || 1}
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="required"
                  defaultChecked={existing?.required ?? true}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm">Required</span>
              </label>
              {existing && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={existing.active}
                    className="h-4 w-4 rounded"
                  />
                  <span className="text-sm">Active</span>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description / Instructions</Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              placeholder="What the verifier should look for..."
              defaultValue={existing?.description || ""}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onSubmit}>
              Cancel
            </Button>
            <Button type="submit">
              {existing ? "Update" : "Create"} Criterion
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
