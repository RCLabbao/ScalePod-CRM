import { Form, Link, useActionData, useLoaderData, useNavigation } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAdmin } from "../lib/auth.guard.server";
import { generateApiKey, maskKey, invalidateApiKeyCache } from "../lib/api-key.server";
import { TIER_LIMITS, type ApiKeyTier } from "../lib/api-key.shared";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Key, ArrowLeft, Plus, Trash2, Clock, Shield } from "lucide-react";
import { data } from "react-router";

type ApiKeyRow = {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  tier: string;
  active: boolean;
  lastUsedAt: string | null;
  createdAt: string;
};

export async function loader({ request }: { request: Request }) {
  const userId = await requireAdmin(request);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  const keys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      prefix: true,
      scopes: true,
      tier: true,
      active: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });

  return { keys: keys as unknown as ApiKeyRow[], user };
}

export async function action({ request }: { request: Request }) {
  const userId = await requireAdmin(request);

  if (request.method === "DELETE") {
    const formData = await request.formData();
    const keyId = formData.get("keyId") as string;

    if (!keyId) {
      throw data({ error: "keyId is required" }, { status: 400 });
    }

    const existing = await prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    });

    if (!existing) {
      throw data({ error: "API key not found" }, { status: 404 });
    }

    await prisma.apiKey.delete({ where: { id: keyId } });

    // Invalidate cache so the deleted key can't be used anymore
    if (existing.hash) {
      invalidateApiKeyCache(existing.hash);
    }

    return { success: true, revoked: keyId };
  }

  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      const name = formData.get("name") as string;
      const tier = (formData.get("tier") as string) || "FREE";
      const scopeLeadsRead = formData.get("scope_leads_read") === "on";
      const scopeLeadsWrite = formData.get("scope_leads_write") === "on";
      const scopeScraperRead = formData.get("scope_scraper_read") === "on";

      if (!name || name.trim().length === 0) {
        throw data({ error: "Key name is required" }, { status: 400 });
      }

      const scopes: string[] = [];
      if (scopeLeadsWrite) {
        scopes.push("leads:write");
      } else if (scopeLeadsRead) {
        scopes.push("leads:read");
      }
      if (scopeScraperRead) {
        scopes.push("scraper:read");
      }
      if (scopes.length === 0) {
        scopes.push("leads:read");
      }

      const { rawKey, prefix, hash } = generateApiKey();

      await prisma.apiKey.create({
        data: {
          name: name.trim(),
          prefix,
          hash,
          scopes,
          tier: tier as ApiKeyTier,
          userId,
        },
      });

      return { rawKey, prefix, name: name.trim() };
    } catch (err: any) {
      // Return the actual error for debugging
      const message = err?.message || err?.toString() || "Unknown error";
      return { error: message };
    }
  }

  throw data({ error: "Method not allowed" }, { status: 405 });
}

export default function ApiKeysSettings() {
  const { keys, user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isCreating = navigation.state === "submitting" && navigation.formData?.get("intent") === "create";
  const justCreated = actionData && "rawKey" in actionData;

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
              <Key className="h-8 w-8" />
              API Keys
            </h1>
            <p className="text-muted-foreground">Manage API keys for external integrations</p>
          </div>
        </div>

        {/* Show newly created key ONCE */}
        {justCreated && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Save this key now — you won't see it again
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Key Name</p>
                <p>{actionData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Key</p>
                <code className="block rounded bg-muted p-3 text-sm break-all select-all">
                  {actionData.rawKey}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                Store this in a secure location (e.g., environment variable or secrets manager).
                After leaving this page, only the prefix <code>{actionData.prefix}</code>... will be visible.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Create new key form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New API Key
            </CardTitle>
            <CardDescription>Generate a key for external systems to access the ScalePod API</CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <input type="hidden" name="intent" value="create" />

              <div>
                <label className="text-sm font-medium">Key Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g., Shopify Scraper, Lead Sync Service"
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tier</label>
                <select
                  name="tier"
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {Object.entries(TIER_LIMITS).map(([tier, limits]) => (
                    <option key={tier} value={tier}>
                      {tier} — {limits.perMinute}/min, {limits.perDay}/day
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Scopes</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="scope_leads_write" defaultChecked className="rounded" />
                    <span>Leads: Read & Write</span>
                    <span className="text-xs text-muted-foreground">(includes read)</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="scope_leads_read" className="rounded" />
                    <span>Leads: Read Only</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="scope_scraper_read" className="rounded" />
                    <span>Scraper: Read Status</span>
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Generating..." : "Generate API Key"}
              </Button>
            </Form>
          </CardContent>
        </Card>

        {/* Existing keys */}
        <Card>
          <CardHeader>
            <CardTitle>Active API Keys</CardTitle>
            <CardDescription>{keys.length} key{keys.length !== 1 ? "s" : ""} configured</CardDescription>
          </CardHeader>
          <CardContent>
            {keys.length === 0 ? (
              <p className="text-sm text-muted-foreground">No API keys created yet.</p>
            ) : (
              <div className="space-y-3">
                {keys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{key.name}</p>
                        <Badge variant="secondary">{key.tier}</Badge>
                        <Badge variant={key.active ? "success" : "outline"}>
                          {key.active ? "Active" : "Revoked"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        {key.prefix}...
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {(key.scopes as string[]).join(", ")}
                        </span>
                        {key.lastUsedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last used {new Date(key.lastUsedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Form method="delete">
                      <input type="hidden" name="keyId" value={key.id} />
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Revoke
                      </Button>
                    </Form>
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