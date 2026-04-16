import axios from "axios";
import * as cheerio from "cheerio";

interface ValidationResult {
  isValidShopify: boolean;
  isAustralian: boolean;
  storeName: string | null;
  currency: string | null;
  productCount: number;
}

// ── Shopify Store Validation ─────────────────────────────

export async function validateShopifyStore(
  url: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValidShopify: false,
    isAustralian: false,
    storeName: null,
    currency: null,
    productCount: 0,
  };

  // Strategy 1: Check /products.json (most reliable Shopify signal)
  try {
    const productsRes = await axios.get(`${url}/products.json?limit=1`, {
      timeout: 10000,
      validateStatus: () => true,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (productsRes.status === 200 && Array.isArray(productsRes.data?.products)) {
      result.isValidShopify = true;

      // Extract product count from pagination if available
      const products = productsRes.data.products;
      if (products.length > 0) {
        // Store name often appears as vendor field
        const vendor = products[0]?.vendor;
        if (vendor && vendor !== "vendor") {
          result.storeName = vendor;
        }

        // Check for AUD currency in price fields
        const prices = products[0]?.variants?.[0]?.presentment_prices;
        if (Array.isArray(prices)) {
          const audPrice = prices.find(
            (p: any) => p?.price?.currency_code === "AUD"
          );
          if (audPrice) {
            result.isAustralian = true;
            result.currency = "AUD";
          }
        }
      }

      // Estimate product count by trying a larger page
      try {
        const countRes = await axios.get(`${url}/products.json?limit=250&page=1`, {
          timeout: 10000,
          validateStatus: () => true,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
        if (countRes.status === 200 && Array.isArray(countRes.data?.products)) {
          result.productCount = countRes.data.products.length;
        }
      } catch {
        // Product count is best-effort
      }
    }
  } catch {
    // /products.json failed, try homepage
  }

  // Strategy 2: Check homepage for Shopify signals
  if (!result.isValidShopify) {
    try {
      const homeRes = await axios.get(url, {
        timeout: 10000,
        validateStatus: () => true,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (homeRes.status === 200) {
        const html = homeRes.data as string;

        // "Powered by Shopify" is the universal Shopify footer signal
        if (
          html.includes("Powered by Shopify") ||
          html.includes("shopify.com") ||
          html.includes("cdn.shopify.com") ||
          html.includes("Shopify.theme")
        ) {
          result.isValidShopify = true;
        }

        // Extract store name from meta tags
        const $ = cheerio.load(html);
        const siteName =
          $('meta[property="og:site_name"]').attr("content") ||
          $("title").text().split("|")[0].split("-")[0].trim();
        if (siteName && !result.storeName) {
          result.storeName = siteName;
        }

        // Check for .com.au domain (strong Australian signal)
        if (url.includes(".com.au")) {
          result.isAustralian = true;
        }

        // Check for AUD in page content
        if (html.includes("AUD") || html.includes("aud") || html.includes("A$")) {
          result.isAustralian = true;
          if (!result.currency) result.currency = "AUD";
        }
      }
    } catch {
      // Homepage also failed
    }
  }

  return result;
}
