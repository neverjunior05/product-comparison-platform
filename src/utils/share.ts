import { PRODUCTS } from "../data/products";

/**
 * SHARE CODES (simulated)
 * -----------------------
 * Each product is encoded as its index in the catalogue, written as two
 * base-36 characters (supports up to 1,296 products). Three products become
 * a six-character code such as `0A0F12`. The code round-trips through
 * `#/c/:code`, so a "shared" link actually opens the same comparison.
 */
const SHARE_HOST = "https://specside.app/c/";

export function encodeShareCode(productIds: string[]): string {
  return productIds
    .map((id) => PRODUCTS.findIndex((p) => p.id === id))
    .filter((i) => i >= 0)
    .map((i) => i.toString(36).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export function decodeShareCode(code: string): string[] {
  const clean = code.trim().toLowerCase().replace(/[^0-9a-z]/g, "");
  if (!clean || clean.length % 2 !== 0) return [];
  const ids: string[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    const index = parseInt(clean.slice(i, i + 2), 36);
    const product = PRODUCTS[index];
    if (product && !ids.includes(product.id)) ids.push(product.id);
  }
  return ids.slice(0, 4);
}

export const shareUrl = (code: string) => `${SHARE_HOST}${code}`;

/** In-app deep link that actually works when pasted into this build. */
export const localShareHash = (code: string) => `#/c/${code}`;

/** Clipboard copy with a textarea fallback for non-secure contexts. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
