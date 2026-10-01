import type { SpecField, SpecValue } from "../types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export const formatPrice = (n: number) => currency.format(n);

export const formatCount = (n: number) => number.format(n);

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) {
  return new Date(iso).toLocaleDateString("en-US", opts);
}

/** Human-readable string for any spec value, driven by the field's type + unit. */
export function formatSpec(value: SpecValue, field: SpecField): string {
  if (value === null || value === undefined || value === "") return "—";
  switch (field.type) {
    case "currency":
      return formatPrice(Number(value));
    case "rating":
      return Number(value).toFixed(1);
    case "boolean":
      return value ? "Yes" : "No";
    case "number": {
      const n = Number(value);
      const unit = field.unit ?? "";
      // Inch marks and multipliers hug the number; other units get a space.
      const tight = unit === '"' || unit === "×";
      return `${number.format(n)}${tight ? "" : " "}${unit}`.trim();
    }
    default:
      return String(value);
  }
}

export const pluralize = (n: number, word: string, plural = `${word}s`) => `${n} ${n === 1 ? word : plural}`;
