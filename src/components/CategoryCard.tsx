import type { Category } from "../types";
import { getProductsByCategory } from "../data/products";
import { cn } from "../utils/cn";
import { formatPrice } from "../utils/format";
import { ArrowRightIcon } from "./Icons";
import { Link } from "./ui";

export function CategoryCard({ category, className }: { category: Category; className?: string }) {
  const products = getProductsByCategory(category.id);
  const min = Math.min(...products.map((p) => p.price));
  const max = Math.max(...products.map((p) => p.price));

  return (
    <Link
      to={`/category/${category.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-slate-200/80 bg-white shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img src={category.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
        <div className={cn("absolute inset-0 bg-gradient-to-t opacity-60 mix-blend-multiply", category.accent)} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{category.name}</h3>
            <p className="text-xs font-medium text-white/80">{products.length} products · {formatPrice(min)}–{formatPrice(max)}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-200 group-hover:bg-brand-500 group-hover:translate-x-0.5">
            <ArrowRightIcon size={18} />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="line-clamp-2 text-[13px] leading-snug text-ink-muted">{category.description}</p>
        <div className="flex -space-x-2 shrink-0">
          {products.slice(0, 3).map((p) => (
            <img key={p.id} src={p.image} alt="" className="h-8 w-8 rounded-full border-2 border-white object-cover" loading="lazy" />
          ))}
        </div>
      </div>
    </Link>
  );
}
