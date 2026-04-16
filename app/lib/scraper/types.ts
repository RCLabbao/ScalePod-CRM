// ── Scraper Pipeline Types ─────────────────────────────────

export interface ScraperConfig {
  delay: { min: number; max: number }; // Random delay between requests (ms)
  batchSize: number; // Pause after N stores
  batchPause: number; // Pause duration (ms)
  concurrency: number; // Parallel enrichment tasks (default: 5)
  respectRobots: boolean;
  playwrightEnabled: boolean;
  maxRetries: number;
}

export interface StoreResult {
  url: string;
  isValidShopify: boolean;
  isAustralian: boolean;

  // Extracted data
  storeName: string | null;
  storeDescription: string | null;
  email: string | null;
  emailSource: string | null;
  contactName: string | null;
  phone: string | null;
  address: string | null;
  industry: string | null;
  productCount: number;
  currency: string | null;

  // Social links
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  tiktok: string | null;
  youtube: string | null;
  pinterest: string | null;

  // Australian signals
  abn: string | null;

  // Metadata
  error: string | null;
  phase: "DISCOVERY" | "VALIDATION" | "ENRICHMENT" | "IMPORT" | null;
  usedPlaywright: boolean;
}

export interface ScraperError {
  url: string;
  phase: "DISCOVERY" | "VALIDATION" | "ENRICHMENT" | "IMPORT";
  error: string;
  timestamp: string;
}

export const DEFAULT_SCRAPER_CONFIG: ScraperConfig = {
  delay: { min: 500, max: 1500 },
  batchSize: 30,
  batchPause: 10000,
  concurrency: 5,
  respectRobots: true,
  playwrightEnabled: true,
  maxRetries: 3,
};
