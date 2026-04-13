import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { formatStage, getActivityStyle } from "../lib/activity-log";
import type { ActivityAction } from "../lib/activity-log";
import {
  Building2,
  Globe,
  Mail,
  User,
  BarChart3,
  Link as LinkIcon,
  ArrowRight,
  Clock,
  Pencil,
  X,
  Save,
} from "lucide-react";

// Shape returned by the action
interface LeadUser {
  id: string;
  name: string | null;
  email: string;
}

interface StageHistoryEntry {
  id: string;
  fromStage: string | null;
  toStage: string;
  changedAt: string;
  changedBy: LeadUser | null;
}

interface ActivityLogEntry {
  id: string;
  action: string;
  description: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: LeadUser | null;
}

export interface LeadDetail {
  id: string;
  companyName: string;
  website: string | null;
  contactName: string | null;
  email: string;
  industry: string | null;
  estimatedTraffic: string | null;
  techStack: string | null;
  linkedin: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  leadSource: string | null;
  stage: string;
  temperature: string;
  score: number;
  maxScore: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: LeadUser | null;
  approvedBy: LeadUser | null;
  rejectedBy: LeadUser | null;
  assignedTo: LeadUser | null;
  stageHistory: StageHistoryEntry[];
  activityLogs: ActivityLogEntry[];
}

interface LeadDetailModalProps {
  lead: LeadDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (formData: FormData) => void;
  saving?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const TEMP_COLORS: Record<string, string> = {
  HOT: "bg-red-500/20 text-red-400 border-red-500/30",
  WARM: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  COLD: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const STAGE_COLORS: Record<string, string> = {
  SOURCED: "bg-slate-500/20 text-slate-300",
  QUALIFIED: "bg-blue-500/20 text-blue-300",
  FIRST_CONTACT: "bg-violet-500/20 text-violet-300",
  MEETING_BOOKED: "bg-amber-500/20 text-amber-300",
  PROPOSAL_SENT: "bg-orange-500/20 text-orange-300",
  CLOSED_WON: "bg-emerald-500/20 text-emerald-300",
  CLOSED_LOST: "bg-red-500/20 text-red-300",
};

export function LeadDetailModal({
  lead,
  open,
  onOpenChange,
  onSave,
  saving,
}: LeadDetailModalProps) {
  const [editing, setEditing] = useState(false);

  // Sync lead data into form state when lead changes
  useEffect(() => {
    setEditing(false);
  }, [lead?.id]);

  if (!lead) return null;

  const mergedTimeline = [
    ...lead.stageHistory.map((s) => ({
      type: "stage" as const,
      id: s.id,
      date: new Date(s.changedAt),
      entry: s,
    })),
    ...lead.activityLogs.map((a) => ({
      type: "activity" as const,
      id: a.id,
      date: new Date(a.createdAt),
      entry: a,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const scorePercent =
    lead.maxScore > 0 ? Math.round((lead.score / lead.maxScore) * 100) : 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("intent", "editLead");
    fd.set("leadId", lead.id);
    onSave?.(fd);
    setEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              {editing ? "Edit Lead" : lead.companyName}
              {!editing && (
                <Badge
                  className={`${TEMP_COLORS[lead.temperature] || ""} text-[10px]`}
                >
                  {lead.temperature}
                </Badge>
              )}
            </DialogTitle>
            {onSave && (
              <Button
                variant={editing ? "default" : "outline"}
                size="sm"
                onClick={() => setEditing(!editing)}
                className="h-7 gap-1.5"
              >
                {editing ? (
                  <>
                    <X className="h-3.5 w-3.5" /> Cancel
                  </>
                ) : (
                  <>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogHeader>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="leadId" value={lead.id} />
            <div className="grid grid-cols-2 gap-3">
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
              <Textarea name="notes" rows={3} defaultValue={lead.notes || ""} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={saving}
                className="gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <>
            {/* Lead Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {lead.contactName && (
                <DetailRow
                  icon={<User className="h-3.5 w-3.5" />}
                  label="Contact"
                  value={lead.contactName}
                />
              )}
              <DetailRow
                icon={<Mail className="h-3.5 w-3.5" />}
                label="Email"
                value={lead.email}
              />
              {lead.website && (
                <DetailRow
                  icon={<Globe className="h-3.5 w-3.5" />}
                  label="Website"
                  value={lead.website}
                />
              )}
              {lead.industry && (
                <DetailRow
                  icon={<Building2 className="h-3.5 w-3.5" />}
                  label="Industry"
                  value={lead.industry}
                />
              )}
              {lead.estimatedTraffic && (
                <DetailRow
                  icon={<BarChart3 className="h-3.5 w-3.5" />}
                  label="Est. Traffic"
                  value={lead.estimatedTraffic}
                />
              )}
              {lead.leadSource && (
                <DetailRow
                  icon={<LinkIcon className="h-3.5 w-3.5" />}
                  label="Source"
                  value={lead.leadSource}
                />
              )}
              {lead.techStack && (
                <DetailRow
                  icon={<BarChart3 className="h-3.5 w-3.5" />}
                  label="Tech Stack"
                  value={lead.techStack}
                />
              )}
            </div>

            {/* Stage & Score */}
            <div className="flex items-center gap-4 rounded-md border p-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Current Stage</p>
                <Badge
                  className={`mt-1 ${STAGE_COLORS[lead.stage] || "bg-muted text-muted-foreground"}`}
                >
                  {formatStage(lead.stage)}
                </Badge>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  Score ({lead.score}/{lead.maxScore})
                </p>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Accountability */}
            <div className="rounded-md border p-3 space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Accountability
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {lead.createdBy && (
                  <div>
                    <span className="text-muted-foreground">Created by: </span>
                    <span className="font-medium">{lead.createdBy.name || lead.createdBy.email}</span>
                  </div>
                )}
                {lead.approvedBy && (
                  <div>
                    <span className="text-muted-foreground">Approved by: </span>
                    <span className="font-medium text-emerald-400">{lead.approvedBy.name || lead.approvedBy.email}</span>
                  </div>
                )}
                {lead.assignedTo && (
                  <div>
                    <span className="text-muted-foreground">Assigned to: </span>
                    <span className="font-medium">{lead.assignedTo.name || lead.assignedTo.email}</span>
                  </div>
                )}
                {lead.rejectedBy && (
                  <div>
                    <span className="text-muted-foreground">Rejected by: </span>
                    <span className="font-medium text-red-400">{lead.rejectedBy.name || lead.rejectedBy.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Activity Timeline
              </h4>
              <div className="relative space-y-0">
                {mergedTimeline.map((item) => {
                  if (item.type === "stage") {
                    const s = item.entry;
                    return (
                      <TimelineItem
                        key={`stage-${s.id}`}
                        icon={<ArrowRight className="h-3 w-3" />}
                        bgColor="bg-blue-100"
                        textColor="text-blue-700"
                        date={s.changedAt}
                      >
                        <span className="font-medium">
                          {s.changedBy?.name || s.changedBy?.email || "Unknown"}
                        </span>{" "}
                        moved from{" "}
                        <span className="font-medium">
                          {s.fromStage ? formatStage(s.fromStage) : "—"}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {formatStage(s.toStage)}
                        </span>
                      </TimelineItem>
                    );
                  }

                  const a = item.entry;
                  const style = getActivityStyle(a.action as ActivityAction);
                  return (
                    <TimelineItem
                      key={`activity-${a.id}`}
                      icon={<span className="text-xs">{style.icon}</span>}
                      bgColor={style.bgColor}
                      textColor={style.textColor}
                      date={a.createdAt}
                    >
                      {a.description}
                    </TimelineItem>
                  );
                })}
                {mergedTimeline.length === 0 && (
                  <p className="text-xs text-muted-foreground py-2">
                    No activity recorded yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="h-8 text-sm"
      />
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="truncate text-foreground">{value}</p>
      </div>
    </div>
  );
}

function TimelineItem({
  icon,
  bgColor,
  textColor,
  date,
  children,
}: {
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  date: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 py-1.5 text-xs">
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${bgColor} ${textColor}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-foreground leading-relaxed">{children}</div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          {formatDate(date)}
        </div>
      </div>
    </div>
  );
}
