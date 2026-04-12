import { Form, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth.guard";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, ExternalLink as LinkIcon, Linkedin, Facebook, Instagram, Twitter, User, CheckCircle, XCircle, Clock, Activity, UserPlus } from "lucide-react";
import { Link } from "react-router";
import { logActivity, getActivityStyle, formatStage } from "../lib/activity-log";
import type { ActivityAction } from "../lib/activity-log";

export async function loader({ request, params }: { request: Request; params: { leadId: string } }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
    include: {
      emails: true,
      stageHistory: {
        orderBy: { changedAt: "desc" },
        include: { changedBy: { select: { id: true, name: true, email: true } } },
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
        take: 50,
      },
      createdBy: { select: { id: true, name: true, email: true } },
      approvedBy: { select: { id: true, name: true, email: true } },
      rejectedBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });

  if (!lead) {
    throw new Response("Lead not found", { status: 404 });
  }

  // Get all users for assignment dropdown
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });

  return { user, lead, users };
}

export async function action({ request }: { request: Request }) {
  const userId = await requireAuth(request);
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, role: true },
  });

  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const leadId = formData.get("leadId") as string;

  if (intent === "updateNotes") {
    const notes = formData.get("notes") as string;
    await prisma.lead.update({ where: { id: leadId }, data: { notes } });

    await logActivity({
      leadId,
      userId,
      action: "NOTE_ADDED",
      description: `${currentUser?.name || "Unknown"} updated notes`,
    });

    return { success: true };
  }

  if (intent === "assignLead") {
    const assignedToId = (formData.get("assignedToId") as string) || null;
    const assignedUser = assignedToId
      ? await prisma.user.findUnique({ where: { id: assignedToId }, select: { name: true } })
      : null;

    await prisma.lead.update({
      where: { id: leadId },
      data: { assignedToId },
    });

    if (assignedToId && assignedUser) {
      await logActivity({
        leadId,
        userId,
        action: "LEAD_ASSIGNED",
        description: `${currentUser?.name || "Unknown"} assigned to ${assignedUser.name}`,
        metadata: { assignedToId, assignedToName: assignedUser.name },
      });
    } else {
      await logActivity({
        leadId,
        userId,
        action: "LEAD_UNASSIGNED",
        description: `${currentUser?.name || "Unknown"} removed assignment`,
      });
    }

    return { success: true };
  }

  return {};
}

export default function LeadDetail() {
  const { user, lead, users } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const isAdmin = user?.role === "ADMIN";

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
              <h1 className="text-2xl font-bold">{lead.companyName}</h1>
              <StatusBadge status={lead.status} />
              <StageBadge stage={lead.stage} />
            </div>
            <p className="text-muted-foreground">{lead.email}</p>
          </div>
        </div>

        {/* Accountability Summary */}
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {lead.createdBy && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                    <UserPlus className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Added by</p>
                    <p className="text-sm font-medium">{lead.createdBy.name || lead.createdBy.email}</p>
                  </div>
                </div>
              )}
              {lead.approvedBy && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Approved by</p>
                    <p className="text-sm font-medium">{lead.approvedBy.name || lead.approvedBy.email}</p>
                  </div>
                </div>
              )}
              {lead.rejectedBy && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rejected by</p>
                    <p className="text-sm font-medium">{lead.rejectedBy.name || lead.rejectedBy.email}</p>
                  </div>
                </div>
              )}
              {lead.assignedTo && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                    <User className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned to</p>
                    <p className="text-sm font-medium">{lead.assignedTo.name || lead.assignedTo.email}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Company", lead.companyName],
                    ["Website", lead.website],
                    ["Contact", lead.contactName],
                    ["Email", lead.email],
                    ["Industry", lead.industry],
                    ["Est. Traffic", lead.estimatedTraffic],
                    ["Tech Stack", lead.techStack],
                    ["Lead Source", lead.leadSource],
                    ["Status", lead.status],
                    ["Stage", lead.stage.replace(/_/g, " ")],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                      <dd className="mt-1 text-sm">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>

                {/* Social Links */}
                {(lead.linkedin || lead.facebook || lead.instagram || lead.twitter) && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <dt className="text-sm font-medium text-muted-foreground mb-2">Social Profiles</dt>
                    <div className="flex flex-wrap gap-2">
                      {lead.linkedin && (
                        <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors">
                          <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                        </a>
                      )}
                      {lead.facebook && (
                        <a href={lead.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors">
                          <Facebook className="h-3.5 w-3.5" /> Facebook
                        </a>
                      )}
                      {lead.instagram && (
                        <a href={lead.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-pink-500/20 bg-pink-500/10 px-2.5 py-1 text-xs font-medium text-pink-400 hover:bg-pink-500/20 transition-colors">
                          <Instagram className="h-3.5 w-3.5" /> Instagram
                        </a>
                      )}
                      {lead.twitter && (
                        <a href={lead.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400 hover:bg-sky-500/20 transition-colors">
                          <Twitter className="h-3.5 w-3.5" /> Twitter / X
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lead.activityLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {lead.activityLogs.map((log) => {
                      const style = getActivityStyle(log.action as ActivityAction);
                      return (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-3"
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.bgColor}`}>
                            <span className={`text-sm font-bold ${style.textColor}`}>{style.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{log.description}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(log.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stage History */}
            <Card>
              <CardHeader>
                <CardTitle>Stage History</CardTitle>
              </CardHeader>
              <CardContent>
                {lead.stageHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No stage changes recorded.</p>
                ) : (
                  <div className="space-y-3">
                    {lead.stageHistory.map((h) => (
                      <div key={h.id} className="flex items-center gap-3 text-sm">
                        <Badge variant="outline" className="shrink-0">
                          {h.fromStage?.replace(/_/g, " ") || "New"}
                        </Badge>
                        <span className="text-muted-foreground">&rarr;</span>
                        <Badge>{h.toStage.replace(/_/g, " ")}</Badge>
                        {h.changedBy && (
                          <span className="text-xs text-muted-foreground">
                            by {h.changedBy.name || h.changedBy.email}
                          </span>
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {new Date(h.changedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Lead Assignment */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form method="post" className="space-y-3">
                    <input type="hidden" name="intent" value="assignLead" />
                    <input type="hidden" name="leadId" value={lead.id} />
                    <select
                      name="assignedToId"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue={lead.assignedTo?.id || ""}
                    >
                      <option value="">Unassigned</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name || u.email} ({u.role})
                        </option>
                      ))}
                    </select>
                    <Button type="submit" size="sm" className="w-full">
                      Update Assignment
                    </Button>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {isAdmin ? (
                  <Form method="post" className="space-y-3">
                    <input type="hidden" name="intent" value="updateNotes" />
                    <input type="hidden" name="leadId" value={lead.id} />
                    <Textarea
                      name="notes"
                      rows={6}
                      defaultValue={lead.notes || ""}
                      placeholder="Add notes about this lead..."
                    />
                    <Button type="submit" size="sm" className="w-full">Save Notes</Button>
                  </Form>
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {lead.notes || "No notes."}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { classes: string }> = {
    INBOX: { classes: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    ACTIVE: { classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    REJECTED: { classes: "bg-red-500/15 text-red-400 border-red-500/20" },
  };
  const c = config[status] || config.INBOX;
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`}>
      {status}
    </span>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const config: Record<string, { classes: string }> = {
    SOURCED: { classes: "bg-slate-500/15 text-slate-300 border-slate-500/20" },
    QUALIFIED: { classes: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    FIRST_CONTACT: { classes: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
    MEETING_BOOKED: { classes: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
    PROPOSAL_SENT: { classes: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
    CLOSED_WON: { classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    CLOSED_LOST: { classes: "bg-red-500/15 text-red-400 border-red-500/20" },
  };
  const c = config[stage] || config.SOURCED;
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`}>
      {stage.replace(/_/g, " ")}
    </span>
  );
}
