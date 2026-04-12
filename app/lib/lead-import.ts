import { prisma } from "./prisma";
import { parseCSV, mapRowToLead, type LeadFieldName } from "./csv-parser";
import { logActivity } from "./activity-log";

export async function processImport(importId: string) {
  const importJob = await prisma.leadImport.findUnique({
    where: { id: importId },
    include: { user: { select: { name: true } } },
  });

  if (!importJob || !importJob.csvData || !importJob.columnMapping) {
    throw new Error("Import job not found or missing data");
  }

  await prisma.leadImport.update({
    where: { id: importId },
    data: { status: "IMPORTING" },
  });

  const { rows } = parseCSV(importJob.csvData);
  const mapping = importJob.columnMapping as Record<string, LeadFieldName>;

  let imported = 0;
  let skipped = 0;
  const errors: { row: number; error: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const leadData = mapRowToLead(row, mapping);

    if (!leadData.email) {
      skipped++;
      errors.push({ row: i + 1, error: "Missing email" });
      continue;
    }

    if (!leadData.companyName) {
      skipped++;
      errors.push({ row: i + 1, error: "Missing company name" });
      continue;
    }

    try {
      const existing = await prisma.lead.findUnique({
        where: { email: leadData.email },
      });

      if (existing) {
        skipped++;
        errors.push({ row: i + 1, error: `Duplicate email (${existing.companyName})` });
        continue;
      }

      const lead = await prisma.lead.create({
        data: {
          companyName: leadData.companyName,
          contactName: leadData.contactName || null,
          email: leadData.email,
          industry: leadData.industry || null,
          website: leadData.website || null,
          estimatedTraffic: leadData.estimatedTraffic || null,
          techStack: leadData.techStack || null,
          leadSource: leadData.leadSource || "CSV Import",
          linkedin: leadData.linkedin || null,
          facebook: leadData.facebook || null,
          instagram: leadData.instagram || null,
          twitter: leadData.twitter || null,
          notes: leadData.notes || null,
          importId,
          createdById: importJob.userId,
        },
      });

      // Log activity for imported lead
      await logActivity({
        leadId: lead.id,
        userId: importJob.userId,
        action: "LEAD_CREATED",
        description: `${importJob.user?.name || "Unknown"} imported this lead`,
        metadata: { source: "CSV Import", fileName: importJob.fileName },
      });

      imported++;
    } catch (err) {
      skipped++;
      errors.push({ row: i + 1, error: String(err) });
    }
  }

  await prisma.leadImport.update({
    where: { id: importId },
    data: {
      status: "COMPLETED",
      totalRows: rows.length,
      importedRows: imported,
      skippedRows: skipped,
      errors: errors.length > 0 ? errors : null,
    },
  });

  return { imported, skipped, errors };
}
