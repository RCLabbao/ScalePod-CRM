import dns from "node:dns/promises";
import axios from "axios";

// ── Shopify DNS Fingerprints ─────────────────────────────
// Shopify stores on custom domains have CNAME records pointing to myshopify.com.

const SHOPIFY_CNAME_SUFFIX = "myshopify.com";

// Shopify's known IP ranges (23.227.38.0/24 is the primary one)
const SHOPIFY_IP_PREFIXES = ["23.227.38."];

// ── Domain List Download ─────────────────────────────────

export type DnsSource = "MAJESTIC";

interface DomainEntry {
  rank: number;
  domain: string;
}

/**
 * Download and parse the Majestic Million CSV.
 * Free, no API key needed. ~80MB download, ~8,600 .com.au domains.
 * CSV format: GlobalRank,TldRank,Domain,TLD,RefSubNets,RefIPs,IDN_Domain,IDN_TLD
 */
export async function downloadMajesticList(): Promise<DomainEntry[]> {
  const url = "https://downloads.majestic.com/majestic_million.csv";

  console.log("[Scraper] Downloading Majestic Million CSV...");
  const res = await axios.get(url, {
    timeout: 120000, // 2 minutes for ~80MB download
    responseType: "text",
  });

  const lines = (res.data as string).split("\n").filter(Boolean);
  const domains: DomainEntry[] = [];

  // Skip header row
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

// ── Australian Domain Filter ─────────────────────────────

const AU_SUFFIXES = [".com.au", ".net.au", ".org.au", ".edu.au", ".au"];

export function filterAustralianDomains(domains: DomainEntry[]): DomainEntry[] {
  return domains.filter((d) => AU_SUFFIXES.some((suffix) => d.domain.endsWith(suffix)));
}

// ── DNS Shopify Check ────────────────────────────────────

export interface DnsCheckResult {
  domain: string;
  isShopify: boolean;
  cname?: string;
  ip?: string;
}

/**
 * Check if a domain is hosted on Shopify by looking at DNS records.
 * 1. Check CNAME for *.myshopify.com (strongest signal)
 * 2. Fallback: Check A records against Shopify IP ranges
 */
export async function checkShopifyDNS(domain: string): Promise<DnsCheckResult> {
  // Try CNAME check first
  try {
    const cnames = await dns.resolveCname(domain);
    for (const cname of cnames) {
      if (cname.toLowerCase().endsWith(SHOPIFY_CNAME_SUFFIX) || cname.toLowerCase().includes("shopify.com")) {
        return { domain, isShopify: true, cname };
      }
    }
  } catch {
    // No CNAME or lookup failed — try A record check
  }

  // Fallback: check A record against Shopify IP ranges
  try {
    const addresses = await dns.resolve4(domain);
    for (const ip of addresses) {
      if (SHOPIFY_IP_PREFIXES.some((prefix) => ip.startsWith(prefix))) {
        return { domain, isShopify: true, ip };
      }
    }
  } catch {
    // DNS lookup failed entirely
  }

  return { domain, isShopify: false };
}

// ── DNS Discovery Pipeline ───────────────────────────────

export type ProgressCallback = (checked: number, total: number, found: number) => void;

export interface DnsDiscoveryResult {
  urls: string[];
  totalScanned: number;
  totalAuDomains: number;
  source: string;
}

/**
 * Main DNS discovery function:
 * 1. Downloads the Majestic Million domain list
 * 2. Filters for Australian domains
 * 3. DNS-checks each for Shopify hosting
 * 4. Returns confirmed Shopify store URLs
 */
export async function discoverFromDNS(
  source: DnsSource = "MAJESTIC",
  onProgress?: ProgressCallback
): Promise<DnsDiscoveryResult> {
  // Step 1: Download domain list
  const allDomains = await downloadMajesticList();

  // Step 2: Filter for Australian domains
  const auDomains = filterAustralianDomains(allDomains);
  console.log(`[Scraper] Found ${auDomains.length} Australian domains to scan`);

  // Step 3: DNS-check each domain for Shopify
  const shopifyDomains: string[] = [];
  const DNS_DELAY_MS = 50; // Fast — DNS lookups are lightweight

  for (let i = 0; i < auDomains.length; i++) {
    const { domain } = auDomains[i];

    try {
      const result = await checkShopifyDNS(domain);
      if (result.isShopify) {
        shopifyDomains.push(`https://${domain}`);
      }
    } catch {
      // Individual DNS failure — skip
    }

    // Report progress every 100 domains
    if ((i + 1) % 100 === 0 && onProgress) {
      onProgress(i + 1, auDomains.length, shopifyDomains.length);
    }

    // Rate limit DNS lookups
    if (i < auDomains.length - 1) {
      await sleep(DNS_DELAY_MS);
    }
  }

  console.log(
    `[Scraper] DNS scan complete: ${shopifyDomains.length} Shopify stores found out of ${auDomains.length} Australian domains`
  );

  return {
    urls: shopifyDomains,
    totalScanned: auDomains.length,
    totalAuDomains: auDomains.length,
    source,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
