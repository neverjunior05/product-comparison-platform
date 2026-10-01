import { useCompare } from "../context/CompareContext";
import type { Product } from "../types";
import { cn } from "../utils/cn";
import { formatPrice } from "../utils/format";
import { CheckIcon, PlusIcon } from "./Icons";
import { Badge, Link, StarRating } from "./ui";

interface ProductCardProps {
  product: Product;
  /** Optional spec chips to show (e.g. first two highlights) */
  compact?: boolean;
  className?: string;
}

export function ProductCard({ product, compact, className }: ProductCardProps) {
  const { isSelected, toggle, isFull } = useCompare();
  const selected = isSelected(product.id);
  const disabled = !selected && isFull;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border bg-white shadow-card transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-card-hover",
        selected ? "border-brand-500 ring-2 ring-brand-500/80" : "border-slate-200/80 hover:border-slate-300",
        className,
      )}
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100" aria-label={`View ${product.name}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
        {product.badge && <Badge label={product.badge} className="absolute left-3 top-3 shadow-sm" />}
        {product.compareAtPrice && (
          <span className="absolute right-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-bold text-brand-600 shadow-sm backdrop-blur">
            Save {formatPrice(product.compareAtPrice - product.price)}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="mt-1 line-clamp-1 font-display text-[15px] font-semibold text-ink hover:text-brand-600">
          {product.name}
        </Link>
        {!compact && <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-muted">{product.tagline}</p>}

        <div className="mt-3 flex items-center justify-between gap-2">
          <StarRating value={product.rating} showValue count={product.reviewCount} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="font-display text-xl font-bold text-ink tabular">{formatPrice(product.price)}</p>
            {product.compareAtPrice && <p className="text-xs text-slate-400 line-through tabular">{formatPrice(product.compareAtPrice)}</p>}
          </div>

          <button
            onClick={() => toggle(product.id)}
            disabled={disabled}
            aria-pressed={selected}
            title={disabled ? "Compare list is full (max 4)" : undefined}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-[9px] border px-3 text-[13px] font-semibold transition-all duration-150",
              selected
                ? "border-brand-500 bg-brand-500 text-white hover:bg-brand-600"
                : "border-slate-200 bg-white text-ink hover:border-brand-400 hover:text-brand-600",
              disabled && "cursor-not-allowed opacity-50 hover:border-slate-200 hover:text-ink",
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors",
                selected ? "border-white bg-white text-brand-600" : "border-slate-300 bg-white",
              )}
              aria-hidden
            >
              {selected ? <CheckIcon size={11} strokeWidth={3.5} /> : <PlusIcon size={11} strokeWidth={3} className="text-slate-400" />}
            </span>
            {selected ? "Added" : "Compare"}
          </button>
        </div>
      </div>
    </article>
  );
}
