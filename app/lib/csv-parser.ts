interface CSVRow {
  [key: string]: string;
}

export function parseCSV(text: string): { headers: string[]; rows: CSVRow[] } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCSVLine(lines[0]);
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;
    const row: CSVRow = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.trim() || "";
    });
    rows.push(row);
  }

  return { headers, rows };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current.trim());
  return result;
}

export const LEAD_FIELDS = [
  { value: "companyName", label: "Company Name", required: true },
  { value: "contactName", label: "Contact Name" },
  { value: "email", label: "Email", required: true },
  { value: "industry", label: "Industry" },
  { value: "website", label: "Website" },
  { value: "estimatedTraffic", label: "Est. Traffic" },
  { value: "techStack", label: "Tech Stack" },
  { value: "leadSource", label: "Lead Source" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
  { value: "notes", label: "Notes" },
] as const;

export type LeadFieldName = (typeof LEAD_FIELDS)[number]["value"];

export function mapRowToLead(
  row: CSVRow,
  mapping: Record<string, LeadFieldName>
): Record<string, string> {
  const lead: Record<string, string> = {};
  for (const [csvCol, leadField] of Object.entries(mapping)) {
    const value = row[csvCol];
    if (value) lead[leadField] = sanitizeCSVCell(value);
  }
  return lead;
}

// Strip formula prefixes that could cause CSV injection on export
function sanitizeCSVCell(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `'${value}`;
  }
  return value;
}
