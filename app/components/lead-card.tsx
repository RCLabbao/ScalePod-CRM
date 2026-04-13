import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { GripVertical, Mail, CheckSquare, Square } from "lucide-react";
import { Button } from "./ui/button";

interface Lead {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string;
  industry: string | null;
  estimatedTraffic: string | null;
  stage: string;
}

interface LeadCardProps {
  lead: Lead;
  index: number;
  draggable?: boolean;
  onClick?: (leadId: string) => void;
  selected?: boolean;
  onSelect?: (leadId: string) => void;
}

export function LeadCard({ lead, index, draggable = true, onClick, selected = false, onSelect }: LeadCardProps) {
  return (
    <Draggable draggableId={lead.id} index={index} isDragDisabled={!draggable}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${snapshot.isDragging ? "opacity-90 shadow-lg" : ""}`}
        >
          <Card className={`cursor-default p-3 transition-all hover:shadow-md ${selected ? "ring-2 ring-primary bg-primary/5" : ""}`}>
            <div className="flex items-start gap-2">
              {/* Checkbox for multi-select */}
              {draggable && (
                <button
                  type="button"
                  onClick={() => onSelect?.(lead.id)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="mt-0.5 text-muted-foreground hover:text-primary shrink-0"
                  title={selected ? "Deselect" : "Select for bulk move"}
                >
                  {selected ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              )}
              {draggable && (
                <div
                  {...provided.dragHandleProps}
                  className="mt-1 cursor-grab text-muted-foreground hover:text-foreground"
                >
                  <GripVertical className="h-4 w-4" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onClick?.(lead.id)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="truncate text-sm font-medium hover:underline text-left"
                  >
                    {lead.companyName}
                  </button>
                </div>
                {lead.contactName && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {lead.contactName}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  {lead.industry && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {lead.industry}
                    </Badge>
                  )}
                  <div className="ml-auto flex gap-1">
                    <Link to={`/leads/${lead.id}/emails`} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Mail className="h-3 w-3" />
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
}
