import { useMemo, useState } from "react";
import { getCategory } from "../data/categories";
import { getProductsByCategory } from "../data/products";
import { useCompare } from "../context/CompareContext";
import { ProductCard } from "../components/ProductCard";
import { ChevronRightIcon, ScaleIcon } from "../components/Icons";
import { Button, Container, EmptyState, Link } from "../components/ui";
import { cn } from "../utils/cn";
import { NotFoundPage } from "./NotFoundPage";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "rating", label: "Top rated" },
  { key: "price-asc", label: "Price: low → high" },
  { key: "price-desc", label: "Price: high → low" },
];

export function CategoryPage({ categoryId }: { categoryId: string }) {
  const category = getCategory(categoryId);
  const all = useMemo(() => getProductsByCategory(categoryId), [categoryId]);
  const [sort, setSort] = useState<SortKey>("featured");
  const [brand, setBrand] = useState<string | null>(null);
  const { products: selected, load } = useCompare();

  const brands = useMemo(() => Array.from(new Set(all.map((p) => p.brand))).sort(), [all]);

  const products = useMemo(() => {
    const list = all.filter((p) => !brand || p.brand === brand);
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      default:
        return list;
    }
  }, [all, brand, sort]);

  if (!category) return <NotFoundPage />;

  const inThisCategory = selected.filter((p) => p.categoryId === category.id).length;

  return (
    <div className="animate-fade-in">
      {/* Category header */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white">
        <div className={cn("absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l opacity-[0.08]", category.accent)} aria-hidden />
        <Container className="relative py-10 sm:py-12">
          <nav className="flex items-center gap-1.5 text-xs text-ink-muted" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink">Home</Link>
            <ChevronRightIcon size={12} />
            <Link to="/categories" className="hover:text-ink">Categories</Link>
            <ChevronRightIcon size={12} />
            <span className="font-medium text-ink">{category.name}</span>
          </nav>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">{category.name}</h1>
              <p className="mt-2 text-[15px] text-ink-muted">{category.description}</p>
              <p className="mt-3 text-sm text-ink-muted">
                <span className="font-semibold text-ink">{all.length} products</span> · compared across{" "}
                <span className="font-semibold text-ink">{category.fields.length} specs</span> · select 2–4 to compare
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => load([...all].sort((a, b) => b.rating - a.rating).slice(0, 3).map((p) => p.id))}
                icon={<ScaleIcon size={16} />}
              >
                Compare top 3
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">Brand</span>
            <FilterChip active={brand === null} onClick={() => setBrand(null)}>
              All
            </FilterChip>
            {brands.map((b) => (
              <FilterChip key={b} active={brand === b} onClick={() => setBrand(brand === b ? null : b)}>
                {b}
              </FilterChip>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Sort
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm font-medium text-ink outline-none transition-colors hover:border-slate-300 focus:border-brand-400"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronRightIcon size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-ink-muted" />
            </div>
          </div>
        </div>

        {inThisCategory > 0 && inThisCategory < 2 && (
          <p className="mb-5 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-800">
            <strong>1 product selected.</strong> Pick at least one more to unlock the comparison.
          </p>
        )}

        {products.length === 0 ? (
          <EmptyState title="No products match" description="Try another brand filter." action={<Button variant="outline" onClick={() => setBrand(null)}>Clear filter</Button>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center rounded-full border px-3.5 text-[13px] font-medium transition-all duration-150",
        active ? "border-ink bg-ink text-white" : "border-slate-200 bg-white text-ink hover:border-slate-300 hover:bg-slate-50",
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
