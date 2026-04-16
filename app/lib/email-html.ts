/**
 * Shared email HTML utilities — no server-only imports.
 * Safe to import from both server loaders and client components.
 */

/**
 * Convert plain text to simple HTML, preserving line breaks.
 */
export function plainTextToHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>\n");
}

/**
 * Build an HTML email body from plain text + optional Gmail signature.
 */
export function buildHtmlEmail(body: string, signature?: string): string {
  const bodyHtml = plainTextToHtml(body);
  if (!signature) {
    return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;">${bodyHtml}</body></html>`;
  }
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;">${bodyHtml}<br><br>${signature}</body></html>`;
}
