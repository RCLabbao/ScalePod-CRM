// ── URL Normalization & Dedup ────────────────────────────

export function normalizeUrl(raw: string): string | null {
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

export function parseUploadedUrls(input: string): string[] {
  return input
    .split(/[\n,]+/)
    .map(normalizeUrl)
    .filter((u): u is string => u !== null);
}

export function deduplicateUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  return urls.filter((url) => {
    const key = url.toLowerCase().replace(/\/+$/, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
