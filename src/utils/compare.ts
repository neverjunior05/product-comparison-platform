import type { Product, SpecField, SpecValue } from "../types";
import { SPEC_FIELDS } from "../data/specConfig";

/* ====================================================================
   BEST-VALUE CALCULATION
   ====================================================================
   The comparison table highlights the "winner" of every spec row. But
   "winner" is field-specific:

     price   → LOWER  wins   (cheaper is better)
     weight  → LOWER  wins   (lighter is better)
     battery → HIGHER wins   (more mAh / hours is better)
     rating  → HIGHER wins
     5G/ANC  → HIGHER wins   (booleans: `true` beats `false`)
     CPU name→ no winner     (subjective text — never highlighted)

   Instead of special-casing each spec, every SpecField in
   `data/specConfig.ts` declares `better: "higher" | "lower" | "none"`.
   `findBestIndices()` below is the ONE generic algorithm that reads that
   direction and returns the column index/indices to highlight.
   ==================================================================== */

/** Read a spec value — `price` and `rating` live on the product root, everything else in `specs`. */
export function getSpecValue(product: Product, key: string): SpecValue {
  if (key === "price") return product.price;
  if (key === "rating") return product.rating;
  return product.specs[key];
}

/**
 * Convert a raw spec value into something numerically comparable.
 *   number  → itself
 *   boolean → 1 / 0  (so "higher" makes `true` win)
 *   string / null / undefined → null (excluded from the comparison)
 */
function toComparable(value: SpecValue): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "boolean") return value ? 1 : 0;
  return null;
}

/**
 * Given one row of values (one per compared product) and the field config,
 * return the set of column indices that hold the best value.
 *
 * Rules:
 *  1. `better: "none"` → nothing is highlighted.
 *  2. Fewer than two comparable values → nothing (no contest).
 *  3. All comparable values identical → nothing (a tie across the whole row
 *     isn't useful information; highlighting every column adds noise).
 *  4. Otherwise pick max (higher) or min (lower). Partial ties are kept —
 *     if two of three phones share the top battery, both are highlighted.
 */
export function findBestIndices(values: SpecValue[], field: SpecField): Set<number> {
  const winners = new Set<number>();
  if (field.better === "none") return winners;

  const comparable = values.map(toComparable);
  const present = comparable.filter((n): n is number => n !== null);
  if (present.length < 2) return winners;

  const allEqual = present.every((n) => n === present[0]);
  if (allEqual) return winners;

  const target = field.better === "higher" ? Math.max(...present) : Math.min(...present);
  comparable.forEach((n, i) => {
    if (n === target) winners.add(i);
  });
  return winners;
}

/* ====================================================================
   TABLE CONSTRUCTION
   ==================================================================== */

export interface ComparisonRow {
  field: SpecField;
  values: SpecValue[];
  /** Column indices (into the products array) that win this row. */
  best: Set<number>;
}

export interface ComparisonGroup {
  name: string;
  rows: ComparisonRow[];
}

/**
 * Fields to render = the spec fields shared by every selected product.
 * Products are normally from one category (so this is simply that
 * category's config), but if categories ever mix we gracefully fall back
 * to the intersection — e.g. just Price + Rating.
 * Order follows the first product's category config.
 */
export function getComparisonFields(products: Product[]): SpecField[] {
  if (products.length === 0) return [];
  const [first, ...rest] = products;
  return SPEC_FIELDS[first.categoryId].filter((field) =>
    rest.every((p) => SPEC_FIELDS[p.categoryId].some((f) => f.key === field.key)),
  );
}

/** Build grouped rows (with best-value flags) for the comparison table. */
export function buildComparison(products: Product[]): ComparisonGroup[] {
  const groups: ComparisonGroup[] = [];
  for (const field of getComparisonFields(products)) {
    const values = products.map((p) => getSpecValue(p, field.key));
    // Skip rows where no product has data at all
    if (values.every((v) => v === undefined || v === null || v === "")) continue;
    const row: ComparisonRow = { field, values, best: findBestIndices(values, field) };
    let group = groups.find((g) => g.name === field.group);
    if (!group) {
      group = { name: field.group, rows: [] };
      groups.push(group);
    }
    group.rows.push(row);
  }
  return groups;
}

/**
 * Scorecard: how many scored rows each product wins, out of how many rows
 * actually produced a winner. Used for the "wins X of Y specs" summary.
 */
export function countWins(groups: ComparisonGroup[], productCount: number) {
  const wins = new Array<number>(productCount).fill(0);
  let contested = 0;
  for (const g of groups) {
    for (const row of g.rows) {
      if (row.best.size === 0) continue;
      contested++;
      row.best.forEach((i) => wins[i]++);
    }
  }
  return { wins, contested };
}

/** Products are only comparable within one category (spec sheets differ). */
export function sameCategory(products: Product[]): boolean {
  return products.every((p) => p.categoryId === products[0]?.categoryId);
}
