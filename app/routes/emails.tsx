import { Link, useLoaderData, useNavigation, useSearchParams } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import {
  listMessages,
  getMessage,
  type ParsedMessage,
} from "../lib/google-auth.server";
import { AppShell } from "../components/app-shell";
import {
  Card,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Mail,
  FileText,
  Send,
  MessageSquare,
  Clock,
  Inbox,
  ArrowRight,
  Search,
  AlertCircle,
  Loader2,
} from "lucide-react";

type TabKey = "all" | "inbox" | "sent" | "drafts";

// ── Loader ─────────────────────────────────────────────────────

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, gmailTokens: true },
  });

  const gmailConnected = !!user?.gmailTokens;
  const url = new URL(request.url);
  const tab = (url.searchParams.get("tab") || "all") as TabKey;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const search = url.searchParams.get("q") || "";
  const pageSize = 20;

  // Fetch DB-based threads (for All / Sent / Drafts tabs)
  const dbThreads = await prisma.emailThread.findMany({
    include: {
      lead: {
        select: { companyName: true, contactName: true, email: true },
      },
      messages: {
        orderBy: { sentAt: "desc" },
        take: 1,
      },
    },
    orderBy: { lastMessage: "desc" },
    ...(search
      ? {
          where: {
            OR: [
              { subject: { contains: search } },
              { snippet: { contains: search } },
              { lead: { companyName: { contains: search } } },
              { lead: { contactName: { contains: search } } },
            ],
          },
        }
      : {}),
  });

  // Count by status for tab badges
  const [sentCount] = await Promise.all([
    prisma.emailThread.count({ where: { status: "SENT" } }),
  ]);

  // Fetch Gmail inbox messages (inbox tab, and all tab when connected)
  let gmailMessages: ParsedMessage[] = [];
  let inboxError: string | null = null;

  if (gmailConnected && (tab === "inbox" || tab === "all")) {
    try {
      const listResult = await listMessages(userId, {
        labelIds: ["INBOX"],
        maxResults: pageSize,
        pageToken: page > 1 ? url.searchParams.get("pageToken") || undefined : undefined,
        q: search || undefined,
      });

      gmailMessages = await Promise.all(
        listResult.messages.map((m) => getMessage(userId, m.id))
      );
    } catch (err: any) {
      inboxError = err?.message || "Failed to fetch Gmail inbox.";
    }
  }

  return {
    user,
    gmailConnected,
    tab,
    page,
    search,
    dbThreads,
    sentCount,
    gmailMessages,
    inboxError,
  };
}

// ── Sub-components ─────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { classes: string; icon: typeof Send }> = {
    SENT: {
      classes: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      icon: Send,
    },
    REPLIED: {
      classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      icon: MessageSquare,
    },
    WAITING: {
      classes: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      icon: Clock,
    },
  };
  const c = config[status] || config.SENT;
  const Icon = c.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function TabButton({
  active,
  count,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  count?: number;
  icon: typeof Inbox;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
            active
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function GmailInboxRow({ msg }: { msg: ParsedMessage }) {
  const isUnread = msg.labelIds.includes("UNREAD");
  return (
    <Link
      to={`/emails/inbox/${msg.id}`}
      className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/30 cursor-pointer"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
        <Mail className="h-5 w-5 text-violet-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-sm truncate ${isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
            {msg.from.split("<")[0].trim()}
          </span>
          {isUnread && (
            <span className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />
          )}
        </div>
        <p className={`text-sm truncate ${isUnread ? "font-medium text-foreground" : "text-foreground/80"}`}>
          {msg.subject}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {msg.snippet}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <span className="text-xs text-muted-foreground">
          {formatDate(msg.date)}
        </span>
      </div>
    </Link>
  );
}

function ThreadRow({
  thread,
}: {
  thread: {
    id: string;
    leadId: string | null;
    subject: string | null;
    snippet: string | null;
    status: string;
    lastMessage: string | Date;
    lead: { companyName: string; contactName: string; email: string } | null;
    messages: { direction: string }[];
  };
}) {
  const messageCount = thread.messages?.length || 0;
  return (
    <Link to={`/emails/threads/${thread.id}`} className="block cursor-pointer">
      <Card className="transition-all hover:bg-muted/30 hover:border-border">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <Send className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {thread.lead && (
                <span className="text-sm font-medium text-violet-400 hover:text-violet-300">
                  {thread.lead.companyName}
                </span>
              )}
              <StatusBadge status={thread.status} />
            </div>
            <p className="text-sm font-medium text-foreground/80 truncate">
              {thread.subject}
            </p>
            {thread.snippet && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {thread.snippet}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            {messageCount > 1 && (
              <p className="text-xs text-muted-foreground mb-0.5">
                {messageCount} messages
              </p>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(thread.lastMessage).toLocaleDateString()}
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}

function LoadingSpinner() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Loading emails...</p>
      </CardContent>
    </Card>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString();
  } catch {
    return dateStr;
  }
}

// ── Main Component ─────────────────────────────────────────────

export default function EmailHub() {
  const {
    user,
    gmailConnected,
    tab,
    search,
    dbThreads,
    sentCount,
    gmailMessages,
    inboxError,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [, setSearchParams] = useSearchParams();

  const isLoading = navigation.state === "loading";

  const setTab = (t: TabKey) => {
    setSearchParams((prev) => {
      prev.set("tab", t);
      prev.delete("page");
      return prev;
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = fd.get("q") as string;
    setSearchParams((prev) => {
      if (q) prev.set("q", q);
      else prev.delete("q");
      prev.delete("page");
      return prev;
    });
  };

  const clearSearch = () => {
    setSearchParams((prev) => {
      prev.delete("q");
      prev.delete("page");
      return prev;
    });
  };

  const filteredThreads = (() => {
    switch (tab) {
      case "sent":
        return dbThreads.filter((t) => t.status === "SENT");
      case "drafts":
        return [];
      default:
        return dbThreads;
    }
  })();

  const tabs: {
    key: TabKey;
    label: string;
    icon: typeof Inbox;
    count?: number;
  }[] = [
    { key: "all", label: "All", icon: Mail },
    { key: "inbox", label: "Gmail Inbox", icon: Inbox },
    { key: "sent", label: "Sent", icon: Send, count: sentCount },
    { key: "drafts", label: "Drafts", icon: FileText },
  ];

  return (
    <AppShell user={user!}>
      <div className="space-y-6">
        {/* Header */}
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

        {/* Gmail connection banner */}
        <Card
          className={`border-l-4 ${
            gmailConnected
              ? "border-l-emerald-500"
              : "border-l-amber-500"
          }`}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  gmailConnected ? "bg-emerald-500/10" : "bg-amber-500/10"
                }`}
              >
                <Mail
                  className={`h-5 w-5 ${
                    gmailConnected ? "text-emerald-400" : "text-amber-400"
                  }`}
                />
              </div>
              <div>
                <p className="font-medium">Gmail Integration</p>
                <p className="text-sm text-muted-foreground">
                  {gmailConnected
                    ? "Connected and ready to send emails"
                    : "Connect your Gmail account in Settings to send emails and view inbox"}
                </p>
              </div>
            </div>
            {!gmailConnected && (
              <Link to="/settings">
                <Button size="sm" variant="outline">
                  Connect
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Tab navigation + search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
            {tabs.map((t) => (
              <TabButton
                key={t.key}
                active={tab === t.key}
                icon={t.icon}
                label={t.label}
                count={t.count}
                onClick={() => setTab(t.key)}
              />
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search emails..."
                defaultValue={search}
                className="pl-9 w-64"
              />
            </div>
            {search && (
              <Button type="button" variant="ghost" size="sm" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </form>
        </div>

        {/* Tab content — show spinner during navigation */}
        {isLoading ? (
          <LoadingSpinner />
        ) : tab === "all" ? (
          /* All tab: combine Gmail inbox + DB threads */
          <div className="space-y-3">
            {/* Gmail inbox section */}
            {gmailConnected && gmailMessages.length > 0 && (
              <>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
                  Gmail Inbox ({gmailMessages.length})
                </p>
                <Card>
                  <div className="divide-y divide-border/50">
                    {gmailMessages.map((msg) => (
                      <GmailInboxRow key={msg.id} msg={msg} />
                    ))}
                  </div>
                </Card>
              </>
            )}
            {gmailConnected && inboxError && (
              <Card className="border-destructive/30">
                <CardContent className="flex items-center gap-3 p-3">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Could not load Gmail inbox: {inboxError}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* CRM threads section */}
            {filteredThreads.length > 0 && (
              <>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 pt-2">
                  Sent from CRM ({filteredThreads.length})
                </p>
                {filteredThreads.map((thread) => (
                  <ThreadRow key={thread.id} thread={thread} />
                ))}
              </>
            )}

            {/* Empty state: nothing at all */}
            {!gmailConnected && filteredThreads.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                    <Mail className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="mt-4 font-medium">No emails yet</p>
                  <p className="text-sm text-muted-foreground">
                    Connect Gmail to see your inbox, or send an email from a lead's profile.
                  </p>
                </CardContent>
              </Card>
            )}
            {gmailConnected && gmailMessages.length === 0 && filteredThreads.length === 0 && !inboxError && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                    <Mail className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="mt-4 font-medium">No emails yet</p>
                  <p className="text-sm text-muted-foreground">
                    Send an email from a lead's profile to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : tab === "inbox" ? (
          // Gmail Inbox tab (dedicated)
          <div className="space-y-2">
            {!gmailConnected ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                    <AlertCircle className="h-8 w-8 text-amber-400" />
                  </div>
                  <p className="mt-4 font-medium">Gmail not connected</p>
                  <p className="text-sm text-muted-foreground">
                    Connect your Gmail account to view your inbox here.
                  </p>
                  <Link to="/settings" className="mt-4">
                    <Button variant="outline">Go to Settings</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : inboxError ? (
              <Card className="border-destructive/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <p className="mt-4 font-medium text-destructive">
                    Failed to load inbox
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {inboxError}
                  </p>
                </CardContent>
              </Card>
            ) : gmailMessages.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                    <Inbox className="h-8 w-8 text-violet-400" />
                  </div>
                  <p className="mt-4 font-medium">Inbox is empty</p>
                  <p className="text-sm text-muted-foreground">
                    {search
                      ? "No messages match your search."
                      : "No messages in your Gmail inbox."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <div className="divide-y divide-border/50">
                  {gmailMessages.map((msg) => (
                    <GmailInboxRow key={msg.id} msg={msg} />
                  ))}
                </div>
              </Card>
            )}
          </div>
        ) : (
          // DB thread tabs (Sent / Drafts)
          <div className="space-y-3">
            {filteredThreads.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                    <Mail className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="mt-4 font-medium">
                    {tab === "drafts"
                      ? "No drafts yet"
                      : search
                        ? "No threads match your search"
                        : "No sent emails yet"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tab === "drafts"
                      ? "Draft emails will appear here."
                      : "Send an email from a lead's profile to get started."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredThreads.map((thread) => (
                <ThreadRow key={thread.id} thread={thread} />
              ))
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
