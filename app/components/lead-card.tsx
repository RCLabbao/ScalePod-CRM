import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Mail, CheckSquare, Square, Flame, Snowflake, ThermometerSun } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";

export interface LeadCardLead {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string;
  industry: string | null;
  estimatedTraffic: string | null;
  stage: string;
  temperature?: string | null;
  assignedTo?: { name: string | null } | null;
}

interface LeadCardProps {
  lead: LeadCardLead;
  index: number;
  draggable?: boolean;
  onClick?: (leadId: string) => void;
  selected?: boolean;
  onSelect?: (leadId: string) => void;
}

function TemperatureIcon({ temp }: { temp?: string | null }) {
  if (temp === "HOT") return <Flame className="h-3 w-3 text-amber-400" />;
  if (temp === "WARM") return <ThermometerSun className="h-3 w-3 text-orange-400" />;
  if (temp === "COLD") return <Snowflake className="h-3 w-3 text-blue-400" />;
  return null;
}

function areEqual(prev: LeadCardProps, next: LeadCardProps) {
  return (
    prev.lead.id === next.lead.id &&
    prev.lead.companyName === next.lead.companyName &&
    prev.lead.contactName === next.lead.contactName &&
    prev.lead.industry === next.lead.industry &&
    prev.lead.temperature === next.lead.temperature &&
    prev.lead.assignedTo?.name === next.lead.assignedTo?.name &&
    prev.selected === next.selected &&
    prev.draggable === next.draggable &&
    prev.index === next.index
  );
}

export const LeadCard = React.memo(function LeadCard({
  lead,
  index,
  draggable = true,
  onClick,
  selected = false,
  onSelect,
}: LeadCardProps) {
  const assignedToName = lead.assignedTo?.name;

  return (
    <Draggable draggableId={lead.id} index={index} isDragDisabled={!draggable}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`transition-all duration-200 ${snapshot.isDragging ? "opacity-95" : ""}`}
          style={provided.draggableProps.style}
        >
          <Card
            className={`cursor-default p-3 transition-all duration-200 border-border/50 ${
              selected
                ? "ring-1 ring-primary/40 bg-primary/[0.03] shadow-sm"
                : "hover:shadow-md hover:-translate-y-px hover:border-border/80"
            } ${snapshot.isDragging ? "shadow-xl ring-1 ring-primary/20 rotate-1" : ""}`}
          >
            <div className="flex items-start gap-2">
              {/* Checkbox for multi-select */}
              {draggable && (
                <button
                  type="button"
                  onClick={() => onSelect?.(lead.id)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="mt-0.5 text-muted-foreground/60 hover:text-primary shrink-0 transition-colors"
                  title={selected ? "Deselect" : "Select for bulk move"}
                >
                  {selected ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              )}
              <div
                {...provided.dragHandleProps}
                className="mt-1 cursor-grab text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="12" r="1" />
                  <circle cx="9" cy="5" r="1" />
                  <circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="12" r="1" />
                  <circle cx="15" cy="5" r="1" />
                  <circle cx="15" cy="19" r="1" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onClick?.(lead.id)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="truncate text-sm font-semibold text-foreground/90 hover:text-foreground text-left transition-colors"
                  >
                    {lead.companyName}
                  </button>
                  <TemperatureIcon temp={lead.temperature} />
                </div>
                {lead.contactName && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
                    {lead.contactName}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  {lead.industry && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                      {lead.industry}
                    </Badge>
                  )}
                  {assignedToName && (
                    <span className="text-[10px] text-muted-foreground/50 truncate">
                      {assignedToName}
                    </span>
                  )}
                  <div className="ml-auto flex gap-0.5">
                    <Link
                      to={`/leads/${lead.id}/emails`}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-muted"
                      >
                        <Mail className="h-3 w-3 text-muted-foreground/60" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
}, areEqual);
