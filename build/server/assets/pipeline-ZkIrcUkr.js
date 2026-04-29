import { p as prisma, l as logActivity, g as getScoreConfig, s as scoreLeadWithRules } from "./server-build-CY3uMdyj.js";
import dns from "node:dns/promises";
import axios from "axios";
import * as cheerio from "cheerio";
import "react/jsx-runtime";
import "isbot";
import "react-dom/server";
import "react-router";
import "remix-auth";
import "remix-auth-form";
import "bcryptjs";
import "@prisma/client";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "googleapis";
import "crypto";
import "lucide-react";
import "@hello-pangea/dnd";
import "dompurify";
import "zod";
import "node:fs";
import "node:path";
function normalizeUrl(raw) {
  let url = raw.trim();
  if (!url) return null;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}${parsed.pathname.replace(/\/+$/, "")}`;
  } catch {
    return null;
  }
}
function parseUploadedUrls(input) {
  return input.split(/[\n,]+/).map(normalizeUrl).filter((u) => u !== null);
}
function deduplicateUrls(urls) {
  const seen = /* @__PURE__ */ new Set();
  return urls.filter((url) => {
    const key = url.toLowerCase().replace(/\/+$/, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
const SHOPIFY_CNAME_SUFFIX = "myshopify.com";
const SHOPIFY_IP_PREFIXES = ["23.227.38."];
async function downloadMajesticList() {
  const url = "https://downloads.majestic.com/majestic_million.csv";
  console.log("[Scraper] Downloading Majestic Million CSV...");
  const res = await axios.get(url, {
    timeout: 12e4,
    // 2 minutes for ~80MB download
    responseType: "text"
  });
  const lines = res.data.split("\n").filter(Boolean);
  const domains = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length >= 3) {
      const rank = parseInt(cols[0], 10);
      const domain = cols[2].trim().toLowerCase();
      if (domain && rank) {
        domains.push({ rank, domain });
      }
    }
  }
  console.log(`[Scraper] Downloaded ${domains.length} domains from Majestic Million`);
  return domains;
}
const AU_SUFFIXES = [".com.au", ".net.au", ".org.au", ".edu.au", ".au"];
function filterAustralianDomains(domains) {
  return domains.filter((d) => AU_SUFFIXES.some((suffix) => d.domain.endsWith(suffix)));
}
async function checkShopifyDNS(domain) {
  try {
    const cnames = await dns.resolveCname(domain);
    for (const cname of cnames) {
      if (cname.toLowerCase().endsWith(SHOPIFY_CNAME_SUFFIX) || cname.toLowerCase().includes("shopify.com")) {
        return { domain, isShopify: true, cname };
      }
    }
  } catch {
  }
  try {
    const addresses = await dns.resolve4(domain);
    for (const ip of addresses) {
      if (SHOPIFY_IP_PREFIXES.some((prefix) => ip.startsWith(prefix))) {
        return { domain, isShopify: true, ip };
      }
    }
  } catch {
  }
  return { domain, isShopify: false };
}
async function discoverFromDNS(source = "MAJESTIC", onProgress) {
  const allDomains = await downloadMajesticList();
  const auDomains = filterAustralianDomains(allDomains);
  console.log(`[Scraper] Found ${auDomains.length} Australian domains to scan`);
  const shopifyDomains = [];
  const DNS_DELAY_MS = 50;
  for (let i = 0; i < auDomains.length; i++) {
    const { domain } = auDomains[i];
    try {
      const result = await checkShopifyDNS(domain);
      if (result.isShopify) {
        shopifyDomains.push(`https://${domain}`);
      }
    } catch {
    }
    if ((i + 1) % 100 === 0 && onProgress) {
      onProgress(i + 1, auDomains.length, shopifyDomains.length);
    }
    if (i < auDomains.length - 1) {
      await sleep$2(DNS_DELAY_MS);
    }
  }
  console.log(
    `[Scraper] DNS scan complete: ${shopifyDomains.length} Shopify stores found out of ${auDomains.length} Australian domains`
  );
  return {
    urls: shopifyDomains,
    totalScanned: auDomains.length,
    totalAuDomains: auDomains.length,
    source
  };
}
function sleep$2(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function validateShopifyStore(url) {
  var _a, _b, _c, _d, _e, _f;
  const result = {
    isValidShopify: false,
    isAustralian: false,
    storeName: null,
    currency: null,
    productCount: 0
  };
  try {
    const productsRes = await axios.get(`${url}/products.json?limit=1`, {
      timeout: 1e4,
      validateStatus: () => true,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    if (productsRes.status === 200 && Array.isArray((_a = productsRes.data) == null ? void 0 : _a.products)) {
      result.isValidShopify = true;
      const products = productsRes.data.products;
      if (products.length > 0) {
        const vendor = (_b = products[0]) == null ? void 0 : _b.vendor;
        if (vendor && vendor !== "vendor") {
          result.storeName = vendor;
        }
        const prices = (_e = (_d = (_c = products[0]) == null ? void 0 : _c.variants) == null ? void 0 : _d[0]) == null ? void 0 : _e.presentment_prices;
        if (Array.isArray(prices)) {
          const audPrice = prices.find(
            (p) => {
              var _a2;
              return ((_a2 = p == null ? void 0 : p.price) == null ? void 0 : _a2.currency_code) === "AUD";
            }
          );
          if (audPrice) {
            result.isAustralian = true;
            result.currency = "AUD";
          }
        }
      }
      try {
        const countRes = await axios.get(`${url}/products.json?limit=250&page=1`, {
          timeout: 1e4,
          validateStatus: () => true,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        });
        if (countRes.status === 200 && Array.isArray((_f = countRes.data) == null ? void 0 : _f.products)) {
          result.productCount = countRes.data.products.length;
        }
      } catch {
      }
    }
  } catch {
  }
  if (!result.isValidShopify) {
    try {
      const homeRes = await axios.get(url, {
        timeout: 1e4,
        validateStatus: () => true,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      if (homeRes.status === 200) {
        const html = homeRes.data;
        if (html.includes("Powered by Shopify") || html.includes("shopify.com") || html.includes("cdn.shopify.com") || html.includes("Shopify.theme")) {
          result.isValidShopify = true;
        }
        const $ = cheerio.load(html);
        const siteName = $('meta[property="og:site_name"]').attr("content") || $("title").text().split("|")[0].split("-")[0].trim();
        if (siteName && !result.storeName) {
          result.storeName = siteName;
        }
        if (url.includes(".com.au")) {
          result.isAustralian = true;
        }
        if (html.includes("AUD") || html.includes("aud") || html.includes("A$")) {
          result.isAustralian = true;
          if (!result.currency) result.currency = "AUD";
        }
      }
    } catch {
    }
  }
  return result;
}
async function fetchPageHtml(url, maxRetries) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await axios.get(url, {
        timeout: 1e4,
        validateStatus: () => true,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-AU,en;q=0.9"
        }
      });
      if (res.status === 200 && typeof res.data === "string") {
        return res.data;
      }
      if (res.status === 404) return null;
    } catch {
    }
    if (attempt < maxRetries) {
      await sleep$1(Math.min(1e3 * Math.pow(2, attempt), 5e3));
    }
  }
  return null;
}
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
  /\.\w{2,4}@[a-z]/i
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
  "team@"
];
function extractEmails(html) {
  const matches = html.match(EMAIL_REGEX) || [];
  const cleaned = matches.map((e) => e.toLowerCase()).filter((e) => !JUNK_EMAIL_PATTERNS.some((pattern) => pattern.test(e)));
  return [...new Set(cleaned)];
}
function prioritizeEmail(emails) {
  if (emails.length === 0) return null;
  for (const prefix of EMAIL_PRIORITY) {
    const match = emails.find((e) => e.startsWith(prefix));
    if (match) return match;
  }
  return emails[0];
}
function extractSocialLinks(html) {
  const $ = cheerio.load(html);
  const result = {
    facebook: null,
    instagram: null,
    twitter: null,
    linkedin: null,
    tiktok: null,
    youtube: null,
    pinterest: null
  };
  const patterns = {
    facebook: /facebook\.com\/[a-zA-Z0-9._-]+/,
    instagram: /instagram\.com\/[a-zA-Z0-9._-]+/,
    twitter: /(?:twitter\.com|x\.com)\/[a-zA-Z0-9._-]+/,
    linkedin: /linkedin\.com\/(company|in)\/[a-zA-Z0-9._-]+/,
    tiktok: /tiktok\.com\/@?[a-zA-Z0-9._-]+/,
    youtube: /youtube\.com\/(c\/|channel\/|@)?[a-zA-Z0-9._-]+/,
    pinterest: /pinterest\.com\/[a-zA-Z0-9._-]+/
  };
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    for (const [platform, regex] of Object.entries(patterns)) {
      if (!result[platform]) {
        const match = href.match(regex);
        if (match) {
          result[platform] = `https://${match[0]}`;
        }
      }
    }
  });
  const fullHtml = $.html();
  for (const [platform, regex] of Object.entries(patterns)) {
    if (!result[platform]) {
      const match = fullHtml.match(regex);
      if (match) {
        result[platform] = `https://${match[0]}`;
      }
    }
  }
  return result;
}
const PHONE_REGEX = /(?:\+61|0)(?:[ -]?\d){8,9}/g;
const JUNK_PHONE_PATTERNS = [
  /^0400\s?000\s?000/,
  // Placeholder
  /^1300\s?000\s?000/,
  /^1800\s?000\s?000/
];
function extractPhones(html) {
  const matches = html.match(PHONE_REGEX) || [];
  const cleaned = matches.map((p) => p.replace(/\s+/g, " ").trim()).filter((p) => !JUNK_PHONE_PATTERNS.some((pattern) => pattern.test(p)));
  return [...new Set(cleaned)];
}
function extractABN(html) {
  const match = html.match(/ABN[\s:]*(\d{2}\s?\d{3}\s?\d{3}\s?\d{3})/i);
  return match ? match[1].replace(/\s/g, "") : null;
}
function extractAddress(html) {
  const auPatterns = [
    // "123 Street, Suburb NSW 2000" or "123 Street, Suburb VIC 3000"
    /(\d+[\w\s]+(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Way|Circuit|Cct)[\w\s]*,?\s*[\w\s]+(?:NSW|VIC|QLD|SA|WA|TAS|NT|ACT)\s*\d{4})/i,
    // "Located in Suburb, STATE"
    /(?:located in|based in|address:?)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,?\s*(?:NSW|VIC|QLD|SA|WA|TAS|NT|ACT)\s*\d{0,4})/i
  ];
  for (const pattern of auPatterns) {
    const match = html.match(pattern);
    if ((match == null ? void 0 : match[1]) && match[1].length < 200) {
      return match[1].trim();
    }
  }
  return null;
}
function extractContactName(html) {
  const $ = cheerio.load(html);
  const text = $.text();
  const patterns = [
    /(?:owned|operated|run|founded|started|created)\s+(?:and\s+)?(?:operated\s+)?by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i,
    /^(?:about|our\s+story)[\s\S]*?([A-Z][a-z]+\s+[A-Z][a-z]+)/m
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if ((match == null ? void 0 : match[1]) && match[1].length < 60 && !/^(The|Our|We|This|Your)/i.test(match[1])) {
      return match[1].trim();
    }
  }
  return null;
}
function extractStoreDescription(html) {
  const $ = cheerio.load(html);
  const metaDesc = $('meta[name="description"]').attr("content");
  if (metaDesc && metaDesc.length > 20 && metaDesc.length < 500) {
    return metaDesc.trim();
  }
  const ogDesc = $('meta[property="og:description"]').attr("content");
  if (ogDesc && ogDesc.length > 20 && ogDesc.length < 500) {
    return ogDesc.trim();
  }
  return null;
}
function extractIndustry(productsJson) {
  if (!(productsJson == null ? void 0 : productsJson.products)) return null;
  const types = /* @__PURE__ */ new Set();
  for (const product of productsJson.products.slice(0, 50)) {
    if (product.product_type) types.add(product.product_type);
  }
  if (types.size > 0) {
    return [...types].slice(0, 3).join(", ");
  }
  return null;
}
async function scrapeWithPlaywright(url) {
  let browser;
  try {
    const { chromium } = await import("playwright");
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15e3 });
    const text = await page.innerText("body");
    const mailtoLinks = await page.$$eval(
      'a[href^="mailto:"]',
      (els) => els.map((el) => el.href.replace("mailto:", ""))
    );
    const emails = [...extractEmails(text), ...mailtoLinks];
    await browser.close();
    return [...new Set(emails)];
  } catch {
    if (browser) await browser.close();
    return [];
  }
}
const CONTACT_PAGE_PATHS = [
  "/pages/contact",
  "/pages/contact-us",
  "/pages/about",
  "/pages/about-us"
];
const PRIVACY_PAGE_PATHS = [
  "/policies/privacy-policy",
  "/pages/privacy-policy",
  "/pages/privacy"
];
async function enrichStore(url, config, validationData) {
  var _a, _b;
  const result = {
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
    usedPlaywright: false
  };
  result.isAustralian = validationData.currency === "AUD" || url.includes(".com.au");
  const allEmails = [];
  const allPhones = [];
  let combinedHtml = "";
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
    const socials = extractSocialLinks(html);
    for (const [key, val] of Object.entries(socials)) {
      if (!result[key] && val) {
        result[key] = val;
      }
    }
    const name = extractContactName(html);
    if (name && !result.contactName) result.contactName = name;
    const abn = extractABN(html);
    if (abn && !result.abn) result.abn = abn;
    const address = extractAddress(html);
    if (address && !result.address) result.address = address;
  }
  try {
    const productsRes = await axios.get(`${url}/products.json?limit=50`, {
      timeout: 8e3,
      validateStatus: () => true,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    if (productsRes.status === 200 && ((_a = productsRes.data) == null ? void 0 : _a.products)) {
      result.productCount = productsRes.data.products.length;
      const industry = extractIndustry(productsRes.data);
      if (industry) result.industry = industry;
    }
  } catch {
  }
  if (allEmails.length > 0) {
    const uniqueEmails = [...new Set(allEmails.map((e) => e.email))];
    const bestEmail = prioritizeEmail(uniqueEmails);
    if (bestEmail) {
      result.email = bestEmail;
      result.emailSource = ((_b = allEmails.find((e) => e.email === bestEmail)) == null ? void 0 : _b.source) || null;
    }
  }
  if (allPhones.length > 0) {
    const international = allPhones.find((p) => p.startsWith("+61"));
    const mobile = allPhones.find((p) => /^04\d{8}/.test(p.replace(/\s/g, "")));
    result.phone = international || mobile || allPhones[0] || null;
  }
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
    }
  }
  if (!result.storeName && combinedHtml) {
    const $ = cheerio.load(combinedHtml);
    const title = $("title").text().split(/[-|–—]/)[0].trim();
    if (title && title.length < 100) result.storeName = title;
  }
  return result;
}
function sleep$1(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const DEFAULT_SCRAPER_CONFIG = {
  delay: { min: 500, max: 1500 },
  batchSize: 30,
  batchPause: 1e4,
  concurrency: 5,
  respectRobots: true,
  playwrightEnabled: true,
  maxRetries: 3
};
async function runScraperPipeline(jobId) {
  const job = await prisma.scraperJob.findUnique({ where: { id: jobId } });
  if (!job) return;
  const config = job.config ? { ...DEFAULT_SCRAPER_CONFIG, ...job.config } : DEFAULT_SCRAPER_CONFIG;
  const errors = [];
  const updateJob = (data) => prisma.scraperJob.update({ where: { id: jobId }, data });
  const addError = (url, phase, error) => {
    errors.push({ url, phase, error, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  };
  let imported = 0;
  let skipped = 0;
  try {
    await updateJob({ status: "DISCOVERING", startedAt: /* @__PURE__ */ new Date() });
    let discoveredUrls;
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
      status: "ENRICHING"
      // Skip separate VALIDATING status — validate + enrich in one step
    });
    if (discoveredUrls.length === 0) {
      await updateJob({ status: "COMPLETED", completedAt: /* @__PURE__ */ new Date() });
      return;
    }
    const concurrency = config.concurrency || 5;
    for (let batchStart = 0; batchStart < discoveredUrls.length; batchStart += concurrency) {
      const current = await prisma.scraperJob.findUnique({ where: { id: jobId } });
      if ((current == null ? void 0 : current.status) === "CANCELLED") return;
      const batchUrls = discoveredUrls.slice(batchStart, batchStart + concurrency);
      const batchResults = await Promise.allSettled(
        batchUrls.map(async (url) => {
          const validation = await validateShopifyStore(url);
          if (!validation.isValidShopify) {
            return { type: "skipped", url, reason: "not shopify" };
          }
          const store = await enrichStore(url, config, {
            storeName: validation.storeName,
            currency: validation.currency
          });
          return { type: "store", store, productCount: validation.productCount };
        })
      );
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
        try {
          await importStore(store, jobId, job.userId);
          imported++;
        } catch (err) {
          addError(store.url, "IMPORT", String(err));
          skipped++;
        }
      }
      await updateJob({
        totalEnriched: imported + skipped,
        totalImported: imported,
        totalSkipped: skipped,
        totalFailed: errors.length,
        errors
      });
      if (batchStart + concurrency < discoveredUrls.length) {
        await sleep(randomDelay(config.delay));
      }
      if ((batchStart + concurrency) % config.batchSize === 0) {
        await sleep(config.batchPause);
      }
    }
    await updateJob({
      status: "COMPLETED",
      completedAt: /* @__PURE__ */ new Date(),
      totalImported: imported,
      totalSkipped: skipped,
      totalFailed: errors.length,
      errors
    });
  } catch (err) {
    await updateJob({
      status: "FAILED",
      completedAt: /* @__PURE__ */ new Date(),
      totalImported: imported,
      totalSkipped: skipped,
      totalFailed: errors.length,
      errors: [...errors, {
        url: "pipeline",
        phase: "DISCOVERY",
        error: String(err),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }]
    });
  }
}
async function importStore(store, jobId, userId) {
  var _a;
  if (!store.email && !store.storeName) {
    throw new Error("No email or company name");
  }
  if (store.email) {
    const existing = await prisma.lead.findUnique({
      where: { email: store.email }
    });
    if (existing) {
      const updateData = {};
      if (store.storeName && !existing.companyName) updateData.companyName = store.storeName;
      if (store.contactName && !existing.contactName) updateData.contactName = store.contactName;
      if (store.industry && !existing.industry) updateData.industry = store.industry;
      if (store.phone && !((_a = existing.notes) == null ? void 0 : _a.includes(store.phone))) updateData.notes = (existing.notes || "") + `
Phone: ${store.phone}`;
      if (store.facebook && !existing.facebook) updateData.facebook = store.facebook;
      if (store.instagram && !existing.instagram) updateData.instagram = store.instagram;
      if (store.twitter && !existing.twitter) updateData.twitter = store.twitter;
      if (store.linkedin && !existing.linkedin) updateData.linkedin = store.linkedin;
      if (store.tiktok) updateData.notes = (updateData.notes || existing.notes || "") + `
TikTok: ${store.tiktok}`;
      if (store.youtube) updateData.notes = (updateData.notes || existing.notes || "") + `
YouTube: ${store.youtube}`;
      if (store.pinterest) updateData.notes = (updateData.notes || existing.notes || "") + `
Pinterest: ${store.pinterest}`;
      updateData.techStack = "Shopify";
      updateData.scraperJobId = jobId;
      await prisma.lead.update({ where: { id: existing.id }, data: updateData });
      await logActivity({
        leadId: existing.id,
        action: "LEAD_SCRAPED",
        description: `Lead enriched via Shopify scraper: ${store.url}`,
        metadata: { source: "SHOPIFY_SCRAPER", storeUrl: store.url }
      });
      throw new Error("Duplicate — enriched existing lead");
    }
  }
  const domain = new URL(store.url).hostname.replace("www.", "");
  const existingByDomain = await prisma.lead.findFirst({
    where: { website: { contains: domain } }
  });
  if (existingByDomain) {
    throw new Error("Duplicate domain");
  }
  const noteLines = [`Auto-scraped from Shopify store: ${store.url}`];
  if (store.abn) noteLines.push(`ABN: ${store.abn}`);
  if (store.phone) noteLines.push(`Phone: ${store.phone}`);
  if (store.address) noteLines.push(`Address: ${store.address}`);
  if (store.productCount) noteLines.push(`Products: ~${store.productCount}`);
  if (store.tiktok) noteLines.push(`TikTok: ${store.tiktok}`);
  if (store.youtube) noteLines.push(`YouTube: ${store.youtube}`);
  if (store.pinterest) noteLines.push(`Pinterest: ${store.pinterest}`);
  if (store.storeDescription) noteLines.push(`Description: ${store.storeDescription.substring(0, 300)}`);
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
      stage: "SOURCED",
      temperature: "COLD",
      facebook: store.facebook,
      instagram: store.instagram,
      twitter: store.twitter,
      linkedin: store.linkedin,
      notes: store.email ? noteLines.join("\n") : `No email found. ${noteLines.join("\n")}`,
      scraperJobId: jobId,
      createdById: userId
    }
  });
  const scoreConfig = await getScoreConfig();
  if (scoreConfig.autoScore) {
    try {
      const scoreResult = await scoreLeadWithRules(void 0, {
        industry: store.industry,
        estimatedTraffic: null,
        techStack: "Shopify",
        leadSource: "SHOPIFY_SCRAPER",
        website: store.url
      });
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          score: scoreResult.score,
          maxScore: scoreResult.maxScore,
          temperature: scoreResult.temperature
        }
      });
    } catch {
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
      phone: store.phone
    }
  });
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function randomDelay(range) {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}
export {
  runScraperPipeline
};
