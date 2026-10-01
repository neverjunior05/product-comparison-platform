import { Fragment, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Product, SpecField, SpecValue } from "../types";
import { buildComparison, countWins } from "../utils/compare";
import { formatPrice, formatSpec } from "../utils/format";
import { cn } from "../utils/cn";
import { MAX_COMPARE } from "../context/CompareContext";
import { CheckIcon, MinusIcon, PlusIcon, TrophyIcon, XIcon } from "./Icons";
import { Link, StarRating } from "./ui";

interface ComparisonTableProps {
  products: Product[];
  /** Called after the collapse animation finishes. Omit to hide remove buttons. */
  onRemove?: (id: string) => void;
  /** Opens a product picker. When provided (and < MAX products) an "Add" column is shown. */
  onAdd?: () => void;
  /** Pixel offset for the sticky header (height of the navbar). */
  stickyTop?: number;
}

const REMOVE_ANIMATION_MS = 240;

export function ComparisonTable({ products, onRemove, onAdd, stickyTop = 64 }: ComparisonTableProps) {
  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrolledX, setScrolledX] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  /* ---------- grouped rows + per-row winners (config driven) ---------- */
  const groups = useMemo(() => buildComparison(products), [products]);
  const { wins, contested } = useMemo(() => countWins(groups, products.length), [groups, products.length]);
  const topScore = Math.max(0, ...wins);
  const topIsUnique = wins.filter((w) => w === topScore).length === 1;

  /* ---------- measure container so every column is a concrete px width ----
     Concrete lengths (rather than `fr`) let `grid-template-columns` interpolate
     smoothly when one track animates to 0px during removal.                 */
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const hasAddSlot = Boolean(onAdd) && products.length < MAX_COMPARE;
  const compact = containerWidth > 0 && containerWidth < 640;
  const labelW = compact ? 124 : 184;
  const addW = hasAddSlot ? (compact ? 112 : 150) : 0;
  const minColW = compact ? 168 : 220;
  const activeCount = products.filter((p) => p.id !== removingId).length;
  const available = containerWidth - labelW - addW;
  // Fractional px are fine for grid tracks — when the table fits, the columns sum
  // to exactly the container width; otherwise they clamp to a minimum and scroll.
  const fitted = available / Math.max(1, activeCount);
  const colW = fitted >= minColW ? fitted : minColW;

  const template = [
    `${labelW}px`,
    ...products.map((p) => (p.id === removingId ? "0px" : `${colW}px`)),
    ...(hasAddSlot ? [`${addW}px`] : []),
  ].join(" ");
  const totalWidth = labelW + activeCount * colW + addW;
  const gridStyle = { gridTemplateColumns: template, width: totalWidth };

  /* ---------- keep the sticky header horizontally in sync with the body ---------- */
  const onBodyScroll = useCallback(() => {
    const body = bodyRef.current;
    const head = headRef.current;
    if (!body || !head) return;
    head.scrollLeft = body.scrollLeft;
    setScrolledX(body.scrollLeft > 2);
  }, []);

  /* ---------- remove with collapse animation ---------- */
  const handleRemove = (id: string) => {
    if (!onRemove || removingId) return;
    setRemovingId(id);
    window.setTimeout(() => {
      onRemove(id);
      setRemovingId(null);
    }, REMOVE_ANIMATION_MS);
  };

  const labelShadow = scrolledX ? "shadow-[6px_0_10px_-6px_rgba(15,23,42,0.18)]" : "";

  return (
    <div className="rounded-card border border-slate-200 bg-white shadow-card">
      {/* ======================= STICKY HEADER ======================= */}
      <div
        ref={headRef}
        className="sticky z-30 overflow-hidden rounded-t-card border-b border-slate-200 bg-white"
        style={{ top: stickyTop }}
      >
        <div className="compare-grid" style={gridStyle}>
          {/* Corner cell */}
          <div className={cn("sticky left-0 z-20 flex flex-col justify-end border-r border-slate-100 bg-white p-3 sm:p-4 transition-shadow", labelShadow)}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">Comparing</p>
            <p className="font-display text-lg font-bold text-ink tabular">
              {products.length} <span className="text-sm font-semibold text-ink-muted">of {MAX_COMPARE}</span>
            </p>
            <p className="mt-2 hidden items-center gap-1.5 text-[11px] text-ink-muted sm:flex">
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-best-500 text-white">
                <CheckIcon size={8} strokeWidth={4} />
              </span>
              Best in row
            </p>
          </div>

          {/* Product header cells */}
          {products.map((p, i) => {
            const removing = p.id === removingId;
            const isTop = contested > 0 && topIsUnique && wins[i] === topScore;
            return (
              <div
                key={p.id}
                className={cn("compare-cell relative flex flex-col gap-2 border-l border-slate-100 p-3 sm:p-4", removing && "is-removing")}
              >
                {onRemove && (
                  <button
                    onClick={() => handleRemove(p.id)}
                    className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-ink-muted shadow-sm transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remove ${p.name} from comparison`}
                    title="Remove"
                  >
                    <XIcon size={14} strokeWidth={2.5} />
                  </button>
                )}
                <Link to={`/product/${p.id}`} className="block overflow-hidden rounded-lg bg-slate-100">
                  <img src={p.image} alt={p.name} className="h-16 w-full object-cover sm:h-24" />
                </Link>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{p.brand}</p>
                  <Link to={`/product/${p.id}`} className="line-clamp-2 font-display text-[13px] font-semibold leading-snug text-ink hover:text-brand-600 sm:text-sm">
                    {p.name}
                  </Link>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-1.5">
                  <span className="font-display text-base font-bold text-ink tabular sm:text-lg">{formatPrice(p.price)}</span>
                  {contested > 0 && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular",
                        isTop ? "bg-best-600 text-white" : "bg-slate-100 text-ink-muted",
                      )}
                      title={`Wins ${wins[i]} of ${contested} scored specs`}
                    >
                      {isTop && <TrophyIcon size={11} strokeWidth={2.5} />}
                      {wins[i]}/{contested}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add-product slot */}
          {hasAddSlot && (
            <button
              onClick={onAdd}
              className="group flex flex-col items-center justify-center gap-2 border-l border-dashed border-slate-200 bg-slate-50/60 p-3 text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-slate-300 transition-colors group-hover:border-brand-400 group-hover:bg-white">
                <PlusIcon size={18} />
              </span>
              <span className="text-center text-xs font-semibold leading-tight">Add product</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================= SCROLLABLE BODY ======================= */}
      <div ref={bodyRef} onScroll={onBodyScroll} className="overflow-x-auto overscroll-x-contain rounded-b-card scrollbar-thin">
        <div className="compare-grid" style={gridStyle}>
          {groups.map((group) => (
            <Fragment key={group.name}>
              {/* Group heading spans every column; its label stays pinned left */}
              <div className="col-span-full border-b border-slate-100 bg-slate-50/80">
                <span className="sticky left-0 inline-block px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted sm:px-4">
                  {group.name}
                </span>
              </div>

              {group.rows.map((row) => (
                <div key={row.field.key} className="group contents">
                  {/* Spec label — sticky on the left so it's always readable while scrolling */}
                  <div
                    className={cn(
                      "sticky left-0 z-10 flex items-center gap-1.5 border-b border-r border-slate-100 bg-white px-3 py-3 text-[13px] font-medium text-ink transition-[background-color,box-shadow] duration-150 group-hover:bg-slate-50 sm:px-4",
                      labelShadow,
                    )}
                    title={row.field.hint}
                  >
                    <span className="leading-tight">{row.field.label}</span>
                    <DirectionHint field={row.field} />
                  </div>

                  {row.values.map((value, i) => {
                    const best = row.best.has(i);
                    const removing = products[i].id === removingId;
                    return (
                      <div
                        key={products[i].id}
                        className={cn(
                          "compare-cell flex items-center gap-2 border-b border-l border-slate-100 px-3 py-3 text-sm sm:px-4",
                          best ? "bg-best-500/10" : "group-hover:bg-slate-50",
                          removing && "is-removing",
                        )}
                      >
                        {best && row.field.type !== "boolean" && <BestBadge />}
                        <SpecCellValue value={value} field={row.field} best={best} />
                      </div>
                    );
                  })}

                  {hasAddSlot && <div className="border-b border-l border-dashed border-slate-200 bg-slate-50/40" />}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cell pieces                                                        */
/* ------------------------------------------------------------------ */

function BestBadge() {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-best-500 text-white" title="Best value in this row" aria-label="Best value">
      <CheckIcon size={10} strokeWidth={4} />
    </span>
  );
}

/** Small ↑/↓ hint next to the row label indicating the comparison rule. */
function DirectionHint({ field }: { field: SpecField }) {
  if (field.better === "none") return null;
  const higher = field.better === "higher";
  return (
    <span
      className="hidden shrink-0 items-center rounded px-1 text-[10px] font-semibold leading-4 text-slate-400 sm:inline-flex"
      title={field.hint ?? (higher ? "Higher is better" : "Lower is better")}
      aria-label={higher ? "Higher is better" : "Lower is better"}
    >
      {higher ? "↑" : "↓"}
    </span>
  );
}

export function SpecCellValue({ value, field, best }: { value: SpecValue; field: SpecField; best?: boolean }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-300">—</span>;
  }

  switch (field.type) {
    case "rating":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          <StarRating value={Number(value)} size={12} />
          <span className={cn("font-semibold tabular", best ? "text-best-700" : "text-ink")}>{Number(value).toFixed(1)}</span>
        </span>
      );

    case "boolean": {
      const yes = Boolean(value);
      return (
        <span className={cn("inline-flex items-center gap-1.5 font-medium", yes ? "text-ink" : "text-slate-400")}>
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full",
              yes ? (best ? "bg-best-500 text-white" : "bg-best-100 text-best-700") : "bg-slate-100 text-slate-400",
            )}
          >
            {yes ? <CheckIcon size={11} strokeWidth={3.5} /> : <MinusIcon size={11} strokeWidth={3} />}
          </span>
          {yes ? "Yes" : "No"}
        </span>
      );
    }

    case "currency":
      return <span className={cn("font-semibold tabular", best ? "text-best-700" : "text-ink")}>{formatSpec(value, field)}</span>;

    case "number":
      return <span className={cn("tabular", best ? "font-semibold text-best-700" : "text-ink")}>{formatSpec(value, field)}</span>;

    default:
      return <span className="text-ink">{formatSpec(value, field)}</span>;
  }
}
