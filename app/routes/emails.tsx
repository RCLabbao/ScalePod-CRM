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
  Sparkles,
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
  let dbThreads: Awaited<ReturnType<typeof prisma.emailThread.findMany>> = [];
  let sentCount = 0;

  try {
    dbThreads = await prisma.emailThread.findMany({
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

    sentCount = await prisma.emailThread.count({ where: { status: "SENT" } });
  } catch (err: unknown) {
    console.error("[EmailHub] DB query failed:", err);
  }

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

      // Fetch each message individually so one failure doesn't kill the rest
      const results = await Promise.allSettled(
        listResult.messages.map((m) => getMessage(userId, m.id))
      );

      gmailMessages = results
        .filter((r): r is PromiseFulfilledResult<ParsedMessage> => r.status === "fulfilled")
        .map((r) => r.value);

      const failedCount = results.filter((r) => r.status === "rejected").length;
      if (failedCount > 0) {
        inboxError = `Loaded ${gmailMessages.length} messages, but ${failedCount} failed to load.`;
      }
    } catch (err: unknown) {
      // Extract detailed error info from Google API errors
      const gaxiosErr = err as any;
      const status = gaxiosErr?.response?.status;
      const errorData = gaxiosErr?.response?.data?.error;

      let errorCode = errorData;
      let errorDesc = gaxiosErr?.response?.data?.error_description;

      // Handle standard Google API Error structure vs OAuth error string
      if (typeof errorData === "object" && errorData !== null) {
        errorCode = errorData.status || errorData.code;
        errorDesc = errorData.message;
      }

      const msg = gaxiosErr?.message || String(err);

      if (status === 401 || msg.includes("Invalid Credentials") || errorCode === "invalid_grant" || errorCode === "UNAUTHENTICATED") {
        inboxError = `Gmail auth failed (HTTP ${status || 401}): Your Gmail token is invalid or expired.`;
      } else {
        inboxError = `Gmail error (HTTP ${status || "?"}, ${errorCode || "unknown"}): ${errorDesc || msg}`;
      }
      console.error("[EmailHub] Gmail error:", JSON.stringify({ status, errorCode, errorDesc, msg }));
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
      classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: Send,
    },
    REPLIED: {
      classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: MessageSquare,
    },
    WAITING: {
      classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: Clock,
    },
  };
  const c = config[status] || config.SENT;
  const Icon = c.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${c.classes}`}
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
      className={`relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`rounded-full px-1.5 py-0 text-[10px] font-bold leading-none ${
            active
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function GmailInboxRow({ msg }: { msg: ParsedMessage }) {
  const isUnread = msg.labelIds.includes("UNREAD");
  const senderName = msg.from.split("<")[0].trim();
  const initials = getInitials(senderName);
  return (
    <Link
      to={`/emails/inbox/${msg.id}`}
      className="group flex items-start gap-4 p-4 transition-all duration-200 hover:bg-muted/40 cursor-pointer"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isUnread ? "bg-violet-500/15 text-violet-300" : "bg-muted text-muted-foreground"}`}>
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-sm truncate ${isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
            {senderName}
          </span>
          {isUnread && (
            <span className="h-2 w-2 rounded-full bg-blue-400 shrink-0 ring-2 ring-blue-400/20" />
          )}
        </div>
        <p className={`text-sm truncate mt-0.5 ${isUnread ? "font-medium text-foreground" : "text-foreground/70"}`}>
          {msg.subject}
        </p>
        <p className="mt-1 truncate text-xs text-muted-foreground/80 leading-relaxed">
          {msg.snippet}
        </p>
      </div>
      <div className="shrink-0 text-right pt-1">
        <span className="text-[11px] tabular-nums text-muted-foreground/70 font-medium">
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
    <Link to={`/emails/threads/${thread.id}`} className="block cursor-pointer group">
      <Card className="transition-all duration-200 hover:shadow-md hover:border-border/80 hover:-translate-y-px">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 mt-0.5">
            <Send className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {thread.lead && (
                <span className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                  {thread.lead.companyName}
                </span>
              )}
              <StatusBadge status={thread.status} />
              {messageCount > 1 && (
                <span className="text-[11px] text-muted-foreground/60 font-medium">
                  {messageCount} messages
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-foreground/90 truncate mt-1">
              {thread.subject}
            </p>
            {thread.snippet && (
              <p className="mt-1 truncate text-xs text-muted-foreground/70 leading-relaxed">
                {thread.snippet}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right pt-1">
            <span className="text-[11px] tabular-nums text-muted-foreground/60 font-medium">
              {new Date(thread.lastMessage).toLocaleDateString()}
            </span>
            <div className="mt-1.5 flex justify-end">
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 transition-all duration-200 group-hover:text-muted-foreground/70 group-hover:translate-x-0.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function LoadingSpinner() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/60" />
        <p className="mt-3 text-sm text-muted-foreground">Loading emails...</p>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: typeof Mail;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-14">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/50">
          <Icon className="h-7 w-7 text-muted-foreground/60" />
        </div>
        <p className="mt-5 font-semibold text-foreground/90">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground max-w-xs text-center leading-relaxed">
          {subtitle}
        </p>
        {action && <div className="mt-5">{action}</div>}
      </CardContent>
    </Card>
  );
}

function SectionHeader({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="flex items-center gap-3 px-1 pb-1">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
        {children}
      </span>
      <div className="flex-1 h-px bg-border/40" />
      {count !== undefined && (
        <span className="text-[11px] font-semibold text-muted-foreground/50 tabular-nums">
          {count}
        </span>
      )}
    </div>
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

  // Derive an expired state if we hit a 401 when trying to fetch the inbox
  const isTokenExpired = !!inboxError && inboxError.includes("auth failed");
  const isActivelyConnected = gmailConnected && !isTokenExpired;

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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Email Hub</h1>
            <p className="text-muted-foreground mt-1">
              Track conversations, manage outreach, and stay on top of replies
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/emails/templates">
              <Button variant="outline" className="bg-background hover:bg-muted/60 border-border/60 shadow-sm">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Gmail connection status banner */}
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
            isActivelyConnected
              ? "bg-emerald-500/5 border-emerald-500/20"
              : isTokenExpired
              ? "bg-destructive/5 border-destructive/20"
              : "bg-amber-500/5 border-amber-500/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`relative flex h-2.5 w-2.5 rounded-full ${
                isActivelyConnected
                  ? "bg-emerald-400"
                  : isTokenExpired
                  ? "bg-destructive"
                  : "bg-amber-400"
              }`}
            >
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 ${
                  isActivelyConnected
                    ? "bg-emerald-400"
                    : isTokenExpired
                    ? "bg-destructive"
                    : "bg-amber-400"
                }`}
              />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {isActivelyConnected
                  ? "Gmail connected"
                  : isTokenExpired
                  ? "Gmail connection expired"
                  : "Gmail not connected"}
              </span>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {isActivelyConnected
                  ? "Ready to send and receive emails"
                  : isTokenExpired
                  ? "Please reconnect your account to resume"
                  : "Connect in Settings to unlock email features"}
              </span>
            </div>
          </div>
          {!isActivelyConnected && (
            <Link to="/settings">
              <Button size="sm" variant={isTokenExpired ? "destructive" : "outline"} className="h-8 text-xs">
                {isTokenExpired ? "Reconnect" : "Connect"}
              </Button>
            </Link>
          )}
        </div>

        {/* Tab navigation + search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-xl bg-muted/40 p-1 ring-1 ring-border/40">
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                name="q"
                placeholder="Search emails..."
                defaultValue={search}
                className="pl-9 w-64 bg-background border-border/60 shadow-sm focus-visible:ring-primary/20"
              />
            </div>
            {search && (
              <Button type="button" variant="ghost" size="sm" onClick={clearSearch} className="text-muted-foreground">
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
          <div className="space-y-5">
            {/* Gmail inbox section */}
            {gmailConnected && gmailMessages.length > 0 && (
              <>
                <SectionHeader count={gmailMessages.length}>Gmail Inbox</SectionHeader>
                <Card className="overflow-hidden ring-1 ring-border/50 shadow-sm">
                  <div className="divide-y divide-border/40">
                    {gmailMessages.map((msg) => (
                      <GmailInboxRow key={msg.id} msg={msg} />
                    ))}
                  </div>
                </Card>
              </>
            )}
            {gmailConnected && inboxError && (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Could not load Gmail inbox: {inboxError}
                </p>
              </div>
            )}

            {/* CRM threads section */}
            {filteredThreads.length > 0 && (
              <>
                <SectionHeader count={filteredThreads.length}>Sent from CRM</SectionHeader>
                <div className="space-y-3">
                  {filteredThreads.map((thread) => (
                    <ThreadRow key={thread.id} thread={thread} />
                  ))}
                </div>
              </>
            )}

            {/* Empty state: nothing at all */}
            {!gmailConnected && filteredThreads.length === 0 && (
              <EmptyState
                icon={Mail}
                title="No emails yet"
                subtitle="Connect Gmail to see your inbox, or send an email from a lead's profile to get started."
                action={
                  <Link to="/settings">
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <Sparkles className="mr-2 h-3.5 w-3.5" />
                      Connect Gmail
                    </Button>
                  </Link>
                }
              />
            )}
            {gmailConnected && gmailMessages.length === 0 && filteredThreads.length === 0 && !inboxError && (
              <EmptyState
                icon={Inbox}
                title="All caught up"
                subtitle="No emails in your inbox or sent threads yet. Send an email from a lead's profile to get started."
              />
            )}
          </div>
        ) : tab === "inbox" ? (
          // Gmail Inbox tab (dedicated)
          <div className="space-y-3">
            {!gmailConnected ? (
              <EmptyState
                icon={AlertCircle}
                title="Gmail not connected"
                subtitle="Connect your Gmail account to view and manage your inbox here."
                action={
                  <Link to="/settings">
                    <Button variant="outline" size="sm" className="shadow-sm">
                      Go to Settings
                    </Button>
                  </Link>
                }
              />
            ) : inboxError ? (
              <Card className="border-destructive/20">
                <CardContent className="flex flex-col items-center justify-center py-14">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/5 ring-1 ring-destructive/20">
                    <AlertCircle className="h-7 w-7 text-destructive/70" />
                  </div>
                  <p className="mt-5 font-semibold text-destructive/90">Failed to load inbox</p>
                  <p className="mt-1 text-sm text-muted-foreground max-w-sm text-center">
                    {inboxError}
                  </p>
                </CardContent>
              </Card>
            ) : gmailMessages.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="Inbox is empty"
                subtitle={search ? "No messages match your search." : "No messages in your Gmail inbox."}
              />
            ) : (
              <Card className="overflow-hidden ring-1 ring-border/50 shadow-sm">
                <div className="divide-y divide-border/40">
                  {gmailMessages.map((msg) => (
                    <GmailInboxRow key={msg.id} msg={msg} />
                  ))}
                </div>
              </Card>
            )}
          </div>
        ) : (
          // DB thread tabs (Sent / Drafts)
          <div className="space-y-5">
            {filteredThreads.length === 0 ? (
              <EmptyState
                icon={tab === "drafts" ? FileText : Mail}
                title={tab === "drafts" ? "No drafts yet" : search ? "No threads match your search" : "No sent emails yet"}
                subtitle={tab === "drafts" ? "Draft emails will appear here." : "Send an email from a lead's profile to get started."}
              />
            ) : (
              <>
                <SectionHeader count={filteredThreads.length}>
                  {tab === "drafts" ? "Drafts" : "Sent"}
                </SectionHeader>
                <div className="space-y-3">
                  {filteredThreads.map((thread) => (
                    <ThreadRow key={thread.id} thread={thread} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
