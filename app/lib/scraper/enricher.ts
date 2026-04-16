import axios from "axios";
import * as cheerio from "cheerio";
import { chromium } from "playwright";
import type { ScraperConfig, StoreResult } from "./types";

// ── Page Fetching ────────────────────────────────────────

async function fetchPageHtml(
  url: string,
  maxRetries: number
): Promise<string | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await axios.get(url, {
        timeout: 10000,
        validateStatus: () => true,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-AU,en;q=0.9",
        },
      });

      if (res.status === 200 && typeof res.data === "string") {
        return res.data as string;
      }

      if (res.status === 404) return null;
    } catch {
      // Retry on network errors
    }

    if (attempt < maxRetries) {
      await sleep(Math.min(1000 * Math.pow(2, attempt), 5000));
    }
  }
  return null;
}

// ── Email Extraction ─────────────────────────────────────

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const JUNK_EMAIL_PATTERNS = [
  /noreply@/i,
  /no-reply@/i,
  /@shopify\.com/i,
  /@shopifyadmin\.com/i,
  /notifications@/i,
  /@mailer\./i,
  /@email\./i,
  /@delivery\./i,
  /@returns\./i,
  /\.\w{2,4}@[a-z]/i,
];

const EMAIL_PRIORITY = [
  "owner@",
  "founder@",
  "hello@",
  "contact@",
  "info@",
  "support@",
  "admin@",
  "sales@",
  "team@",
];

function extractEmails(html: string): string[] {
  const matches = html.match(EMAIL_REGEX) || [];
  const cleaned = matches
    .map((e) => e.toLowerCase())
    .filter((e) => !JUNK_EMAIL_PATTERNS.some((pattern) => pattern.test(e)));
  return [...new Set(cleaned)];
}

function prioritizeEmail(emails: string[]): string | null {
  if (emails.length === 0) return null;

  for (const prefix of EMAIL_PRIORITY) {
    const match = emails.find((e) => e.startsWith(prefix));
    if (match) return match;
  }

  return emails[0];
}

// ── Social Link Extraction ───────────────────────────────

function extractSocialLinks(html: string): {
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  tiktok: string | null;
  youtube: string | null;
  pinterest: string | null;
} {
  const $ = cheerio.load(html);
  const result = {
    facebook: null as string | null,
    instagram: null as string | null,
    twitter: null as string | null,
    linkedin: null as string | null,
    tiktok: null as string | null,
    youtube: null as string | null,
    pinterest: null as string | null,
  };

  const patterns: Record<string, RegExp> = {
    facebook: /facebook\.com\/[a-zA-Z0-9._-]+/,
    instagram: /instagram\.com\/[a-zA-Z0-9._-]+/,
    twitter: /(?:twitter\.com|x\.com)\/[a-zA-Z0-9._-]+/,
    linkedin: /linkedin\.com\/(company|in)\/[a-zA-Z0-9._-]+/,
    tiktok: /tiktok\.com\/@?[a-zA-Z0-9._-]+/,
    youtube: /youtube\.com\/(c\/|channel\/|@)?[a-zA-Z0-9._-]+/,
    pinterest: /pinterest\.com\/[a-zA-Z0-9._-]+/,
  };

  // Check <a> tags
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    for (const [platform, regex] of Object.entries(patterns)) {
      if (!result[platform as keyof typeof result]) {
        const match = href.match(regex);
        if (match) {
          result[platform as keyof typeof result] = `https://${match[0]}`;
        }
      }
    }
  });

  // Also check meta tags and script content for social URLs
  const fullHtml = $.html();
  for (const [platform, regex] of Object.entries(patterns)) {
    if (!result[platform as keyof typeof result]) {
      const match = fullHtml.match(regex);
      if (match) {
        result[platform as keyof typeof result] = `https://${match[0]}`;
      }
    }
  }

  return result;
}

// ── Phone Extraction ─────────────────────────────────────

const PHONE_REGEX = /(?:\+61|0)(?:[ -]?\d){8,9}/g;

const JUNK_PHONE_PATTERNS = [
  /^0400\s?000\s?000/, // Placeholder
  /^1300\s?000\s?000/,
  /^1800\s?000\s?000/,
];

function extractPhones(html: string): string[] {
  const matches = html.match(PHONE_REGEX) || [];
  const cleaned = matches
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => !JUNK_PHONE_PATTERNS.some((pattern) => pattern.test(p)));
  return [...new Set(cleaned)];
}

// ── ABN Extraction ───────────────────────────────────────

function extractABN(html: string): string | null {
  const match = html.match(/ABN[\s:]*(\d{2}\s?\d{3}\s?\d{3}\s?\d{3})/i);
  return match ? match[1].replace(/\s/g, "") : null;
}

// ── Address Extraction ───────────────────────────────────

function extractAddress(html: string): string | null {
  // Australian address patterns
  const auPatterns = [
    // "123 Street, Suburb NSW 2000" or "123 Street, Suburb VIC 3000"
    /(\d+[\w\s]+(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Way|Circuit|Cct)[\w\s]*,?\s*[\w\s]+(?:NSW|VIC|QLD|SA|WA|TAS|NT|ACT)\s*\d{4})/i,
    // "Located in Suburb, STATE"
    /(?:located in|based in|address:?)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,?\s*(?:NSW|VIC|QLD|SA|WA|TAS|NT|ACT)\s*\d{0,4})/i,
  ];

  for (const pattern of auPatterns) {
    const match = html.match(pattern);
    if (match?.[1] && match[1].length < 200) {
      return match[1].trim();
    }
  }

  return null;
}

// ── Contact Name Extraction ──────────────────────────────

function extractContactName(html: string): string | null {
  const $ = cheerio.load(html);
  const text = $.text();

  const patterns = [
    /(?:owned|operated|run|founded|started|created)\s+(?:and\s+)?(?:operated\s+)?by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i,
    /^(?:about|our\s+story)[\s\S]*?([A-Z][a-z]+\s+[A-Z][a-z]+)/m,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1] && match[1].length < 60 && !/^(The|Our|We|This|Your)/i.test(match[1])) {
      return match[1].trim();
    }
  }

  return null;
}

// ── Store Description Extraction ─────────────────────────

function extractStoreDescription(html: string): string | null {
  const $ = cheerio.load(html);

  // Check meta description
  const metaDesc = $('meta[name="description"]').attr("content");
  if (metaDesc && metaDesc.length > 20 && metaDesc.length < 500) {
    return metaDesc.trim();
  }

  // Check og:description
  const ogDesc = $('meta[property="og:description"]').attr("content");
  if (ogDesc && ogDesc.length > 20 && ogDesc.length < 500) {
    return ogDesc.trim();
  }

  return null;
}

// ── Industry Extraction from Products ────────────────────

function extractIndustry(productsJson: any): string | null {
  if (!productsJson?.products) return null;

  const types = new Set<string>();

  for (const product of productsJson.products.slice(0, 50)) {
    if (product.product_type) types.add(product.product_type);
  }

  if (types.size > 0) {
    return [...types].slice(0, 3).join(", ");
  }

  return null;
}

// ── Playwright Fallback ──────────────────────────────────

async function scrapeWithPlaywright(url: string): Promise<string[]> {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    const text = await page.innerText("body");
    const mailtoLinks = await page.$$eval(
      'a[href^="mailto:"]',
      (els) => els.map((el) => (el as HTMLAnchorElement).href.replace("mailto:", ""))
    );

    const emails = [...extractEmails(text), ...mailtoLinks];
    await browser.close();
    return [...new Set(emails)];
  } catch {
    if (browser) await browser.close();
    return [];
  }
}

// ── Main Enrichment Function ─────────────────────────────

const CONTACT_PAGE_PATHS = [
  "/pages/contact",
  "/pages/contact-us",
  "/pages/about",
  "/pages/about-us",
];

const PRIVACY_PAGE_PATHS = [
  "/policies/privacy-policy",
  "/pages/privacy-policy",
  "/pages/privacy",
];

export async function enrichStore(
  url: string,
  config: ScraperConfig,
  validationData: { storeName: string | null; currency: string | null }
): Promise<StoreResult> {
  const result: StoreResult = {
    url,
    isValidShopify: true,
    isAustralian: false,
    storeName: validationData.storeName,
    storeDescription: null,
    email: null,
    emailSource: null,
    contactName: null,
    phone: null,
    address: null,
    industry: null,
    productCount: 0,
    currency: validationData.currency,
    facebook: null,
    instagram: null,
    twitter: null,
    linkedin: null,
    tiktok: null,
    youtube: null,
    pinterest: null,
    abn: null,
    error: null,
    phase: "ENRICHMENT",
    usedPlaywright: false,
  };

  result.isAustralian = validationData.currency === "AUD" || url.includes(".com.au");

  const allEmails: { email: string; source: string }[] = [];
  const allPhones: string[] = [];
  let combinedHtml = "";

  // ── Fetch homepage ───────────────────────────────────
  const homeHtml = await fetchPageHtml(url, config.maxRetries);
  if (homeHtml) {
    combinedHtml += homeHtml;
    allEmails.push(...extractEmails(homeHtml).map((e) => ({ email: e, source: "homepage" })));
    allPhones.push(...extractPhones(homeHtml));

    const socials = extractSocialLinks(homeHtml);
    Object.assign(result, socials);

    result.storeDescription = extractStoreDescription(homeHtml);

    const name = extractContactName(homeHtml);
    if (name) result.contactName = name;

    const abn = extractABN(homeHtml);
    if (abn) result.abn = abn;

    const address = extractAddress(homeHtml);
    if (address) result.address = address;
  }

  // ── Fetch contact + privacy pages (in parallel) ─────
  const pagePaths = [...CONTACT_PAGE_PATHS, ...PRIVACY_PAGE_PATHS];
  const pageResults = await Promise.allSettled(
    pagePaths.map((path) => fetchPageHtml(`${url}${path}`, config.maxRetries))
  );

  for (let i = 0; i < pageResults.length; i++) {
    const pageResult = pageResults[i];
    if (pageResult.status !== "fulfilled" || !pageResult.value) continue;

    const html = pageResult.value;
    combinedHtml += html;
    allEmails.push(...extractEmails(html).map((e) => ({ email: e, source: pagePaths[i] })));
    allPhones.push(...extractPhones(html));

    // Fill in missing socials
    const socials = extractSocialLinks(html);
    for (const [key, val] of Object.entries(socials)) {
      if (!result[key as keyof typeof socials] && val) {
        (result as any)[key] = val;
      }
    }

    const name = extractContactName(html);
    if (name && !result.contactName) result.contactName = name;

    const abn = extractABN(html);
    if (abn && !result.abn) result.abn = abn;

    const address = extractAddress(html);
    if (address && !result.address) result.address = address;
  }

  // ── Fetch products for industry info ─────────────────
  try {
    const productsRes = await axios.get(`${url}/products.json?limit=50`, {
      timeout: 8000,
      validateStatus: () => true,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (productsRes.status === 200 && productsRes.data?.products) {
      result.productCount = productsRes.data.products.length;
      const industry = extractIndustry(productsRes.data);
      if (industry) result.industry = industry;
    }
  } catch {
    // Best-effort
  }

  // ── Pick best email ──────────────────────────────────
  if (allEmails.length > 0) {
    const uniqueEmails = [...new Set(allEmails.map((e) => e.email))];
    const bestEmail = prioritizeEmail(uniqueEmails);
    if (bestEmail) {
      result.email = bestEmail;
      result.emailSource = allEmails.find((e) => e.email === bestEmail)?.source || null;
    }
  }

  // ── Pick best phone ──────────────────────────────────
  if (allPhones.length > 0) {
    // Prefer +61 format, then 04xx mobiles, then first found
    const international = allPhones.find((p) => p.startsWith("+61"));
    const mobile = allPhones.find((p) => /^04\d{8}/.test(p.replace(/\s/g, "")));
    result.phone = international || mobile || allPhones[0] || null;
  }

  // ── Playwright fallback if no email ──────────────────
  if (!result.email && config.playwrightEnabled) {
    try {
      const pwEmails = await scrapeWithPlaywright(`${url}/pages/contact`);
      if (pwEmails.length > 0) {
        const clean = pwEmails.filter((e) => !JUNK_EMAIL_PATTERNS.some((p) => p.test(e)));
        if (clean.length > 0) {
          result.email = prioritizeEmail(clean);
          result.emailSource = "playwright";
          result.usedPlaywright = true;
        }
      }
    } catch {
      // Best-effort
    }
  }

  // ── Final store name from page title ─────────────────
  if (!result.storeName && combinedHtml) {
    const $ = cheerio.load(combinedHtml);
    const title = $("title").text().split(/[-|–—]/)[0].trim();
    if (title && title.length < 100) result.storeName = title;
  }

  return result;
}

// ── Helpers ──────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(range: { min: number; max: number }) {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}
