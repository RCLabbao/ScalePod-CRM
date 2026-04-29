import { prisma } from "../prisma.server";
import { logActivity } from "../activity-log.server";
import { scoreLeadWithRules } from "../scoring-rules.server";
import { getScoreConfig } from "../scoring.server";
import { getFirstStageName } from "../stages.server";
import { parseUploadedUrls, deduplicateUrls } from "./discovery";
import { discoverFromDNS } from "./discovery-dns";
import { validateShopifyStore } from "./validator";
import { enrichStore } from "./enricher";
import type { ScraperConfig, ScraperError, StoreResult } from "./types";
import { DEFAULT_SCRAPER_CONFIG } from "./types";

// ── Main Pipeline ────────────────────────────────────────

export async function runScraperPipeline(jobId: string): Promise<void> {
  const job = await prisma.scraperJob.findUnique({ where: { id: jobId } });
  if (!job) return;

  const config: ScraperConfig = job.config
    ? { ...DEFAULT_SCRAPER_CONFIG, ...(job.config as any) }
    : DEFAULT_SCRAPER_CONFIG;

  const errors: ScraperError[] = [];

  const updateJob = (data: Record<string, any>) =>
    prisma.scraperJob.update({ where: { id: jobId }, data });

  const addError = (url: string, phase: ScraperError["phase"], error: string) => {
    errors.push({ url, phase, error, timestamp: new Date().toISOString() });
  };

  let imported = 0;
  let skipped = 0;

  try {
    // ── Phase 1: Discovery ───────────────────────────────
    await updateJob({ status: "DISCOVERING", startedAt: new Date() });

    let discoveredUrls: string[];

    if (job.discoveryMode === "URL_UPLOAD") {
      discoveredUrls = parseUploadedUrls(job.uploadedUrls || "");
    } else if (job.discoveryMode === "DNS_SCAN") {
      const result = await discoverFromDNS("MAJESTIC", async (checked, total, found) => {
        await updateJob({ totalDiscovered: found });
      });
      discoveredUrls = result.urls;
    } else {
      discoveredUrls = [];
    }

    discoveredUrls = deduplicateUrls(discoveredUrls);
    await updateJob({
      discoveredUrls,
      totalDiscovered: discoveredUrls.length,
      status: "ENRICHING", // Skip separate VALIDATING status — validate + enrich in one step
    });

    if (discoveredUrls.length === 0) {
      await updateJob({ status: "COMPLETED", completedAt: new Date() });
      return;
    }

    // ── Phase 2: Validate + Enrich + Import (streaming) ──
    // Process stores in parallel batches. Each store is validated, enriched,
    // and imported immediately — leads appear in the inbox as they're found.

    const concurrency = config.concurrency || 5;

    for (let batchStart = 0; batchStart < discoveredUrls.length; batchStart += concurrency) {
      // Check for cancellation
      const current = await prisma.scraperJob.findUnique({ where: { id: jobId } });
      if (current?.status === "CANCELLED") return;

      const batchUrls = discoveredUrls.slice(batchStart, batchStart + concurrency);

      // Process this batch in parallel
      const batchResults = await Promise.allSettled(
        batchUrls.map(async (url) => {
          // 2a. Validate
          const validation = await validateShopifyStore(url);
          if (!validation.isValidShopify) {
            return { type: "skipped" as const, url, reason: "not shopify" };
          }

          // 2b. Enrich
          const store = await enrichStore(url, config, {
            storeName: validation.storeName,
            currency: validation.currency,
          });

          // 2c. Import immediately (streaming)
          return { type: "store" as const, store, productCount: validation.productCount };
        })
      );

      // Import each result
      for (const batchResult of batchResults) {
        if (batchResult.status === "rejected") {
          const url = batchUrls[batchResults.indexOf(batchResult)] || "unknown";
          addError(url, "ENRICHMENT", String(batchResult.reason));
          continue;
        }

        const result = batchResult.value;

        if (result.type === "skipped") {
          skipped++;
          continue;
        }

        const store = result.store;
        store.productCount = result.productCount;

        // Import this store now
        try {
          await importStore(store, jobId, job.userId);
          imported++;
        } catch (err) {
          addError(store.url, "IMPORT", String(err));
          skipped++;
        }
      }

      // Update job progress after each batch
      await updateJob({
        totalEnriched: imported + skipped,
        totalImported: imported,
        totalSkipped: skipped,
        totalFailed: errors.length,
        errors,
      });

      // Rate limit between batches
      if (batchStart + concurrency < discoveredUrls.length) {
        await sleep(randomDelay(config.delay));
      }

      // Longer pause every batchSize stores
      if ((batchStart + concurrency) % config.batchSize === 0) {
        await sleep(config.batchPause);
      }
    }

    await updateJob({
      status: "COMPLETED",
      completedAt: new Date(),
      totalImported: imported,
      totalSkipped: skipped,
      totalFailed: errors.length,
      errors,
    });
  } catch (err) {
    await updateJob({
      status: "FAILED",
      completedAt: new Date(),
      totalImported: imported,
      totalSkipped: skipped,
      totalFailed: errors.length,
      errors: [...errors, {
        url: "pipeline",
        phase: "DISCOVERY",
        error: String(err),
        timestamp: new Date().toISOString(),
      }],
    });
  }
}

// ── Import a single store as a Lead ──────────────────────

async function importStore(store: StoreResult, jobId: string, userId: string) {
  // Must have at least an email or company name
  if (!store.email && !store.storeName) {
    throw new Error("No email or company name");
  }

  // De-duplicate by email
  if (store.email) {
    const existing = await prisma.lead.findUnique({
      where: { email: store.email },
    });
    if (existing) {
      // Enrich existing lead with new data
      const updateData: Record<string, any> = {};
      if (store.storeName && !existing.companyName) updateData.companyName = store.storeName;
      if (store.contactName && !existing.contactName) updateData.contactName = store.contactName;
      if (store.industry && !existing.industry) updateData.industry = store.industry;
      if (store.phone && !existing.notes?.includes(store.phone)) updateData.notes = (existing.notes || "") + `\nPhone: ${store.phone}`;
      if (store.facebook && !existing.facebook) updateData.facebook = store.facebook;
      if (store.instagram && !existing.instagram) updateData.instagram = store.instagram;
      if (store.twitter && !existing.twitter) updateData.twitter = store.twitter;
      if (store.linkedin && !existing.linkedin) updateData.linkedin = store.linkedin;
      if (store.tiktok) updateData.notes = (updateData.notes || existing.notes || "") + `\nTikTok: ${store.tiktok}`;
      if (store.youtube) updateData.notes = (updateData.notes || existing.notes || "") + `\nYouTube: ${store.youtube}`;
      if (store.pinterest) updateData.notes = (updateData.notes || existing.notes || "") + `\nPinterest: ${store.pinterest}`;
      updateData.techStack = "Shopify";
      updateData.scraperJobId = jobId;

      await prisma.lead.update({ where: { id: existing.id }, data: updateData });

      await logActivity({
        leadId: existing.id,
        action: "LEAD_SCRAPED",
        description: `Lead enriched via Shopify scraper: ${store.url}`,
        metadata: { source: "SHOPIFY_SCRAPER", storeUrl: store.url },
      });

      throw new Error("Duplicate — enriched existing lead");
    }
  }

  // De-duplicate by domain
  const domain = new URL(store.url).hostname.replace("www.", "");
  const existingByDomain = await prisma.lead.findFirst({
    where: { website: { contains: domain } },
  });
  if (existingByDomain) {
    throw new Error("Duplicate domain");
  }

  // Build notes with all extra data
  const noteLines = [`Auto-scraped from Shopify store: ${store.url}`];
  if (store.abn) noteLines.push(`ABN: ${store.abn}`);
  if (store.phone) noteLines.push(`Phone: ${store.phone}`);
  if (store.address) noteLines.push(`Address: ${store.address}`);
  if (store.productCount) noteLines.push(`Products: ~${store.productCount}`);
  if (store.tiktok) noteLines.push(`TikTok: ${store.tiktok}`);
  if (store.youtube) noteLines.push(`YouTube: ${store.youtube}`);
  if (store.pinterest) noteLines.push(`Pinterest: ${store.pinterest}`);
  if (store.storeDescription) noteLines.push(`Description: ${store.storeDescription.substring(0, 300)}`);

  // Create lead
  const lead = await prisma.lead.create({
    data: {
      companyName: store.storeName || domain,
      website: store.url,
      contactName: store.contactName,
      email: store.email || `${domain.replace(/\.[a-z.]+$/, "")}@placeholder.placeholder`,
      industry: store.industry,
      techStack: "Shopify",
      leadSource: "SHOPIFY_SCRAPER",
      status: "INBOX",
      stage: await getFirstStageName(),
      temperature: "COLD",
      facebook: store.facebook,
      instagram: store.instagram,
      twitter: store.twitter,
      linkedin: store.linkedin,
      notes: store.email ? noteLines.join("\n") : `No email found. ${noteLines.join("\n")}`,
      scraperJobId: jobId,
      createdById: userId,
    },
  });

  // Auto-score the scraper lead using rules
  const scoreConfig = await getScoreConfig();
  if (scoreConfig.autoScore) {
    try {
      const scoreResult = await scoreLeadWithRules(undefined, {
        industry: store.industry,
        estimatedTraffic: null,
        techStack: "Shopify",
        leadSource: "SHOPIFY_SCRAPER",
        website: store.url,
      });
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          score: scoreResult.score,
          maxScore: scoreResult.maxScore,
          temperature: scoreResult.temperature,
        },
      });
    } catch {
      // Scoring failure should not block scraper import
    }
  }

  await logActivity({
    leadId: lead.id,
    userId,
    action: "LEAD_SCRAPED",
    description: `Lead created via Shopify scraper: ${store.url}`,
    metadata: {
      source: "SHOPIFY_SCRAPER",
      storeUrl: store.url,
      email: store.email,
      abn: store.abn,
      phone: store.phone,
    },
  });
}

// ── Helpers ──────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(range: { min: number; max: number }) {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}
