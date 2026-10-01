import { useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_MAP } from "../data/categories";
import { PRODUCTS } from "../data/products";
import type { CategoryId } from "../types";
import { formatDate, formatPrice } from "../utils/format";
import { cn } from "../utils/cn";
import { useCompare } from "../context/CompareContext";
import { CheckIcon, PlusIcon } from "../components/Icons";
import { Container, Link, StarRating } from "../components/ui";

type Sort = "recent" | "helpful" | "highest" | "lowest";

export function ReviewsPage() {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [sort, setSort] = useState<Sort>("recent");
  const { isSelected, toggle } = useCompare();

  const reviews = useMemo(() => {
    const list = PRODUCTS.filter((p) => cat === "all" || p.categoryId === cat).flatMap((p) => p.reviews.map((r) => ({ ...r, product: p })));
    switch (sort) {
      case "helpful":
        return list.sort((a, b) => (b.helpful ?? 0) - (a.helpful ?? 0));
      case "highest":
        return list.sort((a, b) => b.rating - a.rating || (b.helpful ?? 0) - (a.helpful ?? 0));
      case "lowest":
        return list.sort((a, b) => a.rating - b.rating || (b.helpful ?? 0) - (a.helpful ?? 0));
      default:
        return list.sort((a, b) => b.date.localeCompare(a.date));
    }
  }, [cat, sort]);

  const leaderboard = useMemo(
    () => PRODUCTS.filter((p) => cat === "all" || p.categoryId === cat).sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 5),
    [cat],
  );

  return (
    <Container className="py-10 sm:py-14 animate-fade-in">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Community</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Reviews</h1>
        <p className="mt-3 text-[15px] text-ink-muted">What owners say after living with these products. Filter by category, then add anything interesting straight to your comparison.</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[{ id: "all" as const, name: "All" }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id as CategoryId | "all")}
              className={cn(
                "inline-flex h-8 items-center rounded-full border px-3.5 text-[13px] font-medium transition-all duration-150",
                cat === c.id ? "border-ink bg-ink text-white" : "border-slate-200 bg-white text-ink hover:border-slate-300",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-[13px]">
          {([
            ["recent", "Most recent"],
            ["helpful", "Most helpful"],
            ["highest", "Highest"],
            ["lowest", "Lowest"],
          ] as [Sort, string][]).map(([k, label]) => (
            <button key={k} onClick={() => setSort(k)} className={cn("rounded-md px-2.5 py-1.5 font-medium transition-colors", sort === k ? "bg-ink text-white" : "text-ink-muted hover:text-ink")}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-4">
          {reviews.map((rv) => {
            const selected = isSelected(rv.product.id);
            return (
              <li key={rv.id} className="rounded-card border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{rv.author.slice(0, 1)}</span>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {rv.author}
                        {rv.verified && <span className="ml-2 rounded bg-best-50 px-1.5 py-0.5 text-[10px] font-semibold text-best-700">Verified</span>}
                      </p>
                      <p className="text-xs text-ink-muted">{formatDate(rv.date)}</p>
                    </div>
                  </div>
                  <StarRating value={rv.rating} size={14} showValue />
                </div>
                <h3 className="mt-3 text-[15px] font-semibold text-ink">{rv.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{rv.body}</p>

                <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-2 pr-3">
                  <Link to={`/product/${rv.product.id}`} className="shrink-0">
                    <img src={rv.product.image} alt="" className="h-11 w-14 rounded-md object-cover" loading="lazy" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${rv.product.id}`} className="block truncate text-sm font-semibold text-ink hover:text-brand-600">
                      {rv.product.name}
                    </Link>
                    <p className="text-xs text-ink-muted">
                      {CATEGORY_MAP[rv.product.categoryId].name} · {formatPrice(rv.product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => toggle(rv.product.id)}
                    className={cn(
                      "inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold transition-colors",
                      selected ? "border-brand-500 bg-brand-500 text-white" : "border-slate-200 bg-white text-ink hover:border-brand-400 hover:text-brand-600",
                    )}
                  >
                    {selected ? <CheckIcon size={13} strokeWidth={3} /> : <PlusIcon size={13} strokeWidth={2.5} />}
                    {selected ? "Added" : "Compare"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Top rated {cat !== "all" ? CATEGORY_MAP[cat].name.toLowerCase() : "overall"}</h2>
            <ol className="mt-4 space-y-3">
              {leaderboard.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="w-5 text-center font-display text-sm font-bold text-ink-muted tabular">{i + 1}</span>
                  <img src={p.image} alt="" className="h-10 w-12 rounded-md object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${p.id}`} className="block truncate text-sm font-semibold text-ink hover:text-brand-600">
                      {p.name}
                    </Link>
                    <StarRating value={p.rating} size={11} showValue count={p.reviewCount} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </Container>
  );
}
