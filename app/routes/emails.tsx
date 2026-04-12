import { Link, useLoaderData } from "react-router";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth.guard";
import { AppShell } from "../components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Mail, FileText, Send, MessageSquare, Clock } from "lucide-react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, gmailTokens: true },
  });

  const threads = await prisma.emailThread.findMany({
    include: { lead: { select: { companyName: true, contactName: true, email: true } } },
    orderBy: { lastMessage: "desc" },
  });

  const gmailConnected = !!user?.gmailTokens;

  return { user, threads, gmailConnected };
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { classes: string; icon: typeof Send }> = {
    SENT:    { classes: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: Send },
    REPLIED: { classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: MessageSquare },
    WAITING: { classes: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: Clock },
  };
  const c = config[status] || config.SENT;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

export default function EmailHub() {
  const { user, threads, gmailConnected } = useLoaderData<typeof loader>();

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Email Hub</h1>
            <p className="text-muted-foreground">
              Track email conversations and outreach
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/emails/templates">
              <Button className="bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25">
                <FileText className="mr-2 h-4 w-4" />
                Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Gmail connection status */}
        <Card className={`border-l-4 ${gmailConnected ? "border-l-emerald-500" : "border-l-amber-500"}`}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${gmailConnected ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
                <Mail className={`h-5 w-5 ${gmailConnected ? "text-emerald-400" : "text-amber-400"}`} />
              </div>
              <div>
                <p className="font-medium">Gmail Integration</p>
                <p className="text-sm text-muted-foreground">
                  {gmailConnected
                    ? "Connected and ready to send emails"
                    : "Connect your Gmail account to send emails"}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
              gmailConnected
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/15 text-amber-400 border-amber-500/20"
            }`}>
              {gmailConnected ? "Connected" : "Not Connected"}
            </span>
          </CardContent>
        </Card>

        {/* Email threads */}
        <div className="space-y-3">
          {threads.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                  <Mail className="h-8 w-8 text-blue-400" />
                </div>
                <p className="mt-4 font-medium">No email threads yet</p>
                <p className="text-sm text-muted-foreground">
                  Send an email from a lead&apos;s profile to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            threads.map((thread) => (
              <Card key={thread.id} className="transition-colors hover:bg-muted/30">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                    <Mail className="h-5 w-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/leads/${thread.leadId}/emails`}
                        className="font-medium hover:underline"
                      >
                        {thread.lead.companyName}
                      </Link>
                      <StatusBadge status={thread.status} />
                    </div>
                    <p className="text-sm font-medium text-foreground/80">{thread.subject}</p>
                    {thread.snippet && (
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {thread.snippet}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right text-xs text-muted-foreground">
                    {new Date(thread.lastMessage).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
