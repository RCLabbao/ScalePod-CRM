// ── Stage Color Palette ────────────────────────────────────────
// Maps colorKey strings to Tailwind class objects.
// All classes must be statically present in source code for JIT purging.

export const STAGE_COLOR_PALETTE: Record<string, {
  color: string;
  bg: string;
  bar: string;
  dot: string;
  text: string;
  border: string;
}> = {
  slate:   { color: "border-t-slate-400",   bg: "bg-slate-400/10",   bar: "bg-slate-400/50",  dot: "bg-slate-400",   text: "text-slate-300", border: "border-slate-400/20" },
  blue:    { color: "border-t-blue-400",    bg: "bg-blue-400/10",    bar: "bg-blue-400/60",   dot: "bg-blue-400",    text: "text-blue-400", border: "border-blue-400/20" },
  violet:  { color: "border-t-violet-400",  bg: "bg-violet-400/10", bar: "bg-violet-400/60", dot: "bg-violet-400",  text: "text-violet-400", border: "border-violet-400/20" },
  amber:   { color: "border-t-amber-400",  bg: "bg-amber-400/10",   bar: "bg-amber-400/60",  dot: "bg-amber-400",  text: "text-amber-400", border: "border-amber-400/20" },
  orange:  { color: "border-t-orange-400",  bg: "bg-orange-400/10", bar: "bg-orange-400/60",  dot: "bg-orange-400",  text: "text-orange-400", border: "border-orange-400/20" },
  emerald: { color: "border-t-emerald-400", bg: "bg-emerald-400/10", bar: "bg-emerald-400/60", dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-400/20" },
  red:     { color: "border-t-red-400",     bg: "bg-red-400/10",     bar: "bg-red-400/60",    dot: "bg-red-400",     text: "text-red-400", border: "border-red-400/20" },
  pink:    { color: "border-t-pink-400",    bg: "bg-pink-400/10",    bar: "bg-pink-400/60",   dot: "bg-pink-400",    text: "text-pink-400", border: "border-pink-400/20" },
  cyan:    { color: "border-t-cyan-400",    bg: "bg-cyan-400/10",    bar: "bg-cyan-400/60",   dot: "bg-cyan-400",    text: "text-cyan-400", border: "border-cyan-400/20" },
  indigo:  { color: "border-t-indigo-400",  bg: "bg-indigo-400/10", bar: "bg-indigo-400/60", dot: "bg-indigo-400",  text: "text-indigo-400", border: "border-indigo-400/20" },
  lime:    { color: "border-t-lime-400",    bg: "bg-lime-400/10",    bar: "bg-lime-400/60",   dot: "bg-lime-400",    text: "text-lime-400", border: "border-lime-400/20" },
  teal:    { color: "border-t-teal-400",    bg: "bg-teal-400/10",    bar: "bg-teal-400/60",   dot: "bg-teal-400",    text: "text-teal-400", border: "border-teal-400/20" },
};

const DEFAULT_CLASSES = STAGE_COLOR_PALETTE.slate;

export function getStageClasses(colorKey: string) {
  return STAGE_COLOR_PALETTE[colorKey] || DEFAULT_CLASSES;
}

// ── Format Stage Name ─────────────────────────────────────────

export function formatStage(stage: string): string {
  return stage
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// ── Default Seed Data ────────────────────────────────────────

export const DEFAULT_STAGE_SEED = [
  { name: "SOURCED",        label: "Sourced",        colorKey: "slate",   position: 0 },
  { name: "QUALIFIED",      label: "Qualified",      colorKey: "blue",    position: 1 },
  { name: "FIRST_CONTACT", label: "First Contact",  colorKey: "violet", position: 2 },
  { name: "MEETING_BOOKED",label: "Meeting Booked",  colorKey: "amber",  position: 3 },
  { name: "PROPOSAL_SENT",  label: "Proposal Sent",   colorKey: "orange", position: 4 },
  { name: "CLOSED_WON",     label: "Closed Won",      colorKey: "emerald",position: 5 },
  { name: "CLOSED_LOST",    label: "Closed Lost",     colorKey: "red",    position: 6 },
];

// ── Palette Keys for UI Dropdowns ────────────────────────────

export const PALETTE_OPTIONS = Object.keys(STAGE_COLOR_PALETTE).map((key) => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1),
}));