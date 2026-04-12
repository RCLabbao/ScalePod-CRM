import { Link, useLoaderData } from "react-router";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth.guard";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Users, ShieldCheck, Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/use-theme";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, gmailTokens: true },
  });

  return { user };
}

export default function Settings() {
  const { user } = useLoaderData<typeof loader>();
  const { theme, toggleTheme } = useTheme();

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and integrations</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                Appearance
              </CardTitle>
              <CardDescription>Toggle between light and dark mode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5 text-violet-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <p className="font-medium capitalize">{theme} Mode</p>
                    <p className="text-sm text-muted-foreground">
                      {theme === "dark"
                        ? "Dark background with light text"
                        : "Light background with dark text"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={toggleTheme}>
                  Switch to {theme === "dark" ? "Light" : "Dark"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p>{user?.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <Badge variant="secondary">{user?.role}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Admin-only: User Management */}
          {user?.role === "ADMIN" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  User Management
                </CardTitle>
                <CardDescription>Create and manage team accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/settings/users">
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Admin-only: Verification Criteria */}
          {user?.role === "ADMIN" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Verification Criteria
                </CardTitle>
                <CardDescription>Customize how leads are evaluated</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/verification/criteria">
                  <Button variant="outline" className="w-full">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Manage Criteria
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Gmail Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Gmail Integration</CardTitle>
              <CardDescription>Connect your Gmail account for email outreach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Google OAuth</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.gmailTokens
                        ? "Gmail account connected"
                        : "No Gmail account connected"}
                    </p>
                  </div>
                </div>
                <Badge variant={user?.gmailTokens ? "success" : "secondary"}>
                  {user?.gmailTokens ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <Button
                className="w-full"
                variant={user?.gmailTokens ? "outline" : "default"}
                onClick={() => {
                  // TODO: Implement Google OAuth flow
                  alert("Google OAuth will be configured with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars");
                }}
              >
                {user?.gmailTokens ? "Reconnect Gmail" : "Connect Gmail"}
              </Button>
            </CardContent>
          </Card>

          {/* API Access */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Use the API endpoint to ingest leads from external scrapers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-sm font-medium">POST /api/leads</p>
                <pre className="overflow-x-auto text-xs">
{`curl -X POST https://your-domain.com/api/leads \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{
    "companyName": "Acme Corp",
    "email": "hello@acme.com",
    "website": "https://acme.com",
    "industry": "SaaS",
    "leadSource": "scraper-bot"
  }'`}
                </pre>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-sm font-medium">GET /api/leads?status=INBOX&limit=50</p>
                <pre className="overflow-x-auto text-xs">
{`curl https://your-domain.com/api/leads \\
  -H "X-API-Key: your-api-key"`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
