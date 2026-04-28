import { Form, useLoaderData, useActionData } from "react-router";
import { prisma } from "../lib/prisma.server";
import { requireAuth } from "../lib/auth.guard.server";
import { sendEmail, getGmailSignature, buildHtmlEmail } from "../lib/google-auth.server";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, ExternalLink as LinkIcon, Linkedin, Facebook, Instagram, Twitter, User, CheckCircle, XCircle, Clock, Activity, UserPlus, Send, Mail, Pencil, Save } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { logActivity } from "../lib/activity-log.server";
import { getActivityStyle, formatStage } from "../lib/activity-log";
import type { ActivityAction } from "../lib/activity-log";

function isSafeUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export async function loader({ request, params }: { request: Request; params: { leadId: string } }) {
  const userId = await requireAuth(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, gmailTokens: true },
  });

  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
    include: {
      emails: {
        orderBy: { lastMessage: "desc" },
        take: 3,
      },
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

  return { user, lead, users, gmailConnected: !!user?.gmailTokens };
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

  if (intent === "sendEmail") {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;

    if (!lead?.email) {
      return { error: "This lead has no email address." };
    }
    if (!subject?.trim() || !body?.trim()) {
      return { error: "Subject and body are required." };
    }

    try {
      const signature = await getGmailSignature(userId);
      const htmlBody = buildHtmlEmail(body, signature);

      const result = await sendEmail(userId, {
        to: lead.email,
        subject,
        body,
        htmlBody,
      });

      const now = new Date();
      const gmailToken = await prisma.gmailToken.findUnique({ where: { userId } });

      const thread = await prisma.emailThread.create({
        data: {
          leadId: lead.id,
          gmailThreadId: result.gmailThreadId,
          subject,
          snippet: body.substring(0, 200),
          status: "SENT",
          lastMessage: now,
        },
      });

      await prisma.emailMessage.create({
        data: {
          threadId: thread.id,
          gmailMessageId: result.gmailMessageId,
          fromAddress: gmailToken?.gmailAddress || "me",
          toAddress: lead.email,
          subject,
          bodyPlain: body,
          bodyHtml: htmlBody,
          snippet: body.substring(0, 200),
          direction: "sent",
          sentAt: now,
        },
      });

      await logActivity({
        leadId,
        userId,
        action: "NOTE_ADDED",
        description: `${currentUser?.name || "Unknown"} sent an email: "${subject}"`,
      });

      return { success: true, sentSubject: subject };
    } catch (err: any) {
      const message = err?.message?.includes("has not connected Gmail")
        ? "Gmail is not connected. Go to Settings to connect your account."
        : err?.message || "Failed to send email.";
      return { error: message };
    }
  }

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

  if (intent === "editLead") {
    if (currentUser?.role !== "ADMIN") {
      return { error: "Only admins can edit leads." };
    }

    const oldLead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!oldLead) {
      return { error: "Lead not found." };
    }

    const data = {
      companyName: formData.get("companyName") as string,
      contactName: (formData.get("contactName") as string) || null,
      email: formData.get("email") as string,
      website: (formData.get("website") as string) || null,
      industry: (formData.get("industry") as string) || null,
      estimatedTraffic: (formData.get("estimatedTraffic") as string) || null,
      techStack: (formData.get("techStack") as string) || null,
      leadSource: (formData.get("leadSource") as string) || null,
      linkedin: (formData.get("linkedin") as string) || null,
      facebook: (formData.get("facebook") as string) || null,
      instagram: (formData.get("instagram") as string) || null,
      twitter: (formData.get("twitter") as string) || null,
      notes: (formData.get("notes") as string) || null,
      temperature: (formData.get("temperature") as string) || oldLead.temperature,
      stage: (formData.get("stage") as string) || oldLead.stage,
      status: (formData.get("status") as string) || oldLead.status,
    };

    await prisma.lead.update({ where: { id: leadId }, data });

    // Log stage change if it changed
    if (oldLead.stage !== data.stage) {
      await prisma.stageHistory.create({
        data: {
          leadId,
          fromStage: oldLead.stage,
          toStage: data.stage,
          changedById: userId,
        },
      });
    }

    await logActivity({
      leadId,
      userId,
      action: "LEAD_EDITED",
      description: `${currentUser?.name || "Unknown"} edited lead details`,
    });

    return { success: true };
  }

  return {};
}

export default function LeadDetail() {
  const { user, lead, users, gmailConnected } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const isAdmin = user?.role === "ADMIN";
  const [editing, setEditing] = useState(false);

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
                <div className="flex items-center justify-between">
                  <CardTitle>Lead Details</CardTitle>
                  {isAdmin && (
                    <Button
                      variant={editing ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEditing(!editing)}
                      className="h-7 gap-1.5"
                    >
                      {editing ? (
                        <>
                          <XCircle className="h-3.5 w-3.5" /> Cancel
                        </>
                      ) : (
                        <>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <Form method="post" className="space-y-4">
                    <input type="hidden" name="intent" value="editLead" />
                    <input type="hidden" name="leadId" value={lead.id} />

                    {/* Temperature, Stage, Status */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Temperature" name="temperature" type="select" defaultValue={lead.temperature} options={[
                        { value: "HOT", label: "Hot" },
                        { value: "WARM", label: "Warm" },
                        { value: "COLD", label: "Cold" },
                      ]} />
                      <Field label="Stage" name="stage" type="select" defaultValue={lead.stage} options={[
                        { value: "SOURCED", label: "Sourced" },
                        { value: "QUALIFIED", label: "Qualified" },
                        { value: "FIRST_CONTACT", label: "First Contact" },
                        { value: "MEETING_BOOKED", label: "Meeting Booked" },
                        { value: "PROPOSAL_SENT", label: "Proposal Sent" },
                        { value: "CLOSED_WON", label: "Closed Won" },
                        { value: "CLOSED_LOST", label: "Closed Lost" },
                      ]} />
                      <Field label="Status" name="status" type="select" defaultValue={lead.status} options={[
                        { value: "INBOX", label: "Inbox" },
                        { value: "ACTIVE", label: "Active" },
                        { value: "REJECTED", label: "Rejected" },
                      ]} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Company Name" name="companyName" defaultValue={lead.companyName} required />
                      <Field label="Contact Name" name="contactName" defaultValue={lead.contactName || ""} />
                      <Field label="Email" name="email" type="email" defaultValue={lead.email} required />
                      <Field label="Website" name="website" defaultValue={lead.website || ""} />
                      <Field label="Industry" name="industry" defaultValue={lead.industry || ""} />
                      <Field label="Est. Traffic" name="estimatedTraffic" defaultValue={lead.estimatedTraffic || ""} />
                      <Field label="Tech Stack" name="techStack" defaultValue={lead.techStack || ""} />
                      <Field label="Lead Source" name="leadSource" defaultValue={lead.leadSource || ""} />
                      <Field label="LinkedIn" name="linkedin" defaultValue={lead.linkedin || ""} />
                      <Field label="Facebook" name="facebook" defaultValue={lead.facebook || ""} />
                      <Field label="Instagram" name="instagram" defaultValue={lead.instagram || ""} />
                      <Field label="Twitter / X" name="twitter" defaultValue={lead.twitter || ""} />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Notes</Label>
                      <Textarea name="notes" rows={4} defaultValue={lead.notes || ""} />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" className="gap-1.5">
                        <Save className="h-3.5 w-3.5" />
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    {/* Temperature & Stage badges */}
                    <div className="mb-4 flex items-center gap-3">
                      <StatusBadge status={lead.status} />
                      <StageBadge stage={lead.stage} />
                      <TemperatureBadge temperature={lead.temperature} />
                      <span className="text-sm text-muted-foreground">
                        Score: {Math.round(lead.score)}/{Math.round(lead.maxScore)}
                      </span>
                    </div>

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
                          {lead.linkedin && isSafeUrl(lead.linkedin) && (
                            <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors">
                              <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                            </a>
                          )}
                          {lead.facebook && isSafeUrl(lead.facebook) && (
                            <a href={lead.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors">
                              <Facebook className="h-3.5 w-3.5" /> Facebook
                            </a>
                          )}
                          {lead.instagram && isSafeUrl(lead.instagram) && (
                            <a href={lead.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-pink-500/20 bg-pink-500/10 px-2.5 py-1 text-xs font-medium text-pink-400 hover:bg-pink-500/20 transition-colors">
                              <Instagram className="h-3.5 w-3.5" /> Instagram
                            </a>
                          )}
                          {lead.twitter && isSafeUrl(lead.twitter) && (
                            <a href={lead.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400 hover:bg-sky-500/20 transition-colors">
                              <Twitter className="h-3.5 w-3.5" /> Twitter / X
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </>
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

            {/* Quick Compose Email */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Lead
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!gmailConnected ? (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-400">
                      Connect Gmail in Settings to send emails directly.
                    </p>
                    <Link to="/settings">
                      <Button variant="outline" size="sm" className="w-full">
                        Go to Settings
                      </Button>
                    </Link>
                  </div>
                ) : !lead.email ? (
                  <p className="text-xs text-muted-foreground">
                    No email address on file for this lead.
                  </p>
                ) : (
                  <Form method="post" className="space-y-3">
                    <input type="hidden" name="intent" value="sendEmail" />
                    <input type="hidden" name="leadId" value={lead.id} />
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">To</p>
                      <p className="text-sm rounded-md bg-muted/50 px-3 py-1.5 truncate">{lead.email}</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Subject</Label>
                      <Input
                        name="subject"
                        placeholder="Email subject..."
                        required
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Message</Label>
                      <Textarea
                        name="body"
                        placeholder="Write your message..."
                        rows={5}
                        required
                        className="text-sm"
                      />
                    </div>
                    {actionData?.sentSubject && (
                      <p className="text-xs text-emerald-400">
                        Sent: "{actionData.sentSubject}"
                      </p>
                    )}
                    {actionData?.error && (
                      <p className="text-xs text-destructive">{actionData.error}</p>
                    )}
                    <Button type="submit" size="sm" className="w-full">
                      <Send className="mr-2 h-3 w-3" />
                      Send Email
                    </Button>
                  </Form>
                )}
                {/* Recent emails link */}
                {lead.emails.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <Link
                      to={`/leads/${lead.id}/emails`}
                      className="text-xs text-violet-400 hover:underline flex items-center gap-1"
                    >
                      View all email history ({lead.emails.length})
                      <ArrowLeft className="h-3 w-3 rotate-180" />
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes — hidden when editing since notes are in the edit form */}
            {!editing && (
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
            )}
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

function TemperatureBadge({ temperature }: { temperature: string }) {
  const config: Record<string, { classes: string; icon: string }> = {
    HOT:  { classes: "bg-red-500/15 text-red-400 border-red-500/20", icon: "🔥" },
    WARM: { classes: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: "☀️" },
    COLD: { classes: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: "❄️" },
  };
  const c = config[temperature] || config.COLD;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${c.classes}`}>
      {c.icon} {temperature}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  options,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}) {
  if (type === "select" && options) {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <select
          name={name}
          defaultValue={defaultValue}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input name={name} type={type} defaultValue={defaultValue} required={required} className="h-9 text-sm" />
    </div>
  );
}
