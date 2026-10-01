/** Namespaced, exception-safe localStorage helpers. */
const PREFIX = "specside:";

export const STORAGE_KEYS = {
  compare: `${PREFIX}compare`,
  saved: `${PREFIX}saved`,
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded / private mode — ignore */
  }
}

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
