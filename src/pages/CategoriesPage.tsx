import { CATEGORIES } from "../data/categories";
import { getProductsByCategory } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { ArrowRightIcon } from "../components/Icons";
import { Container, Link } from "../components/ui";
import { formatPrice } from "../utils/format";

export function CategoriesPage() {
  return (
    <Container className="py-10 sm:py-14 animate-fade-in">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Categories</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Browse by category</h1>
        <p className="mt-3 text-[15px] text-ink-muted">
          Comparisons stay within a category so every product shares the same spec sheet. Pick one to see the full line-up, or jump straight into a top pick below.
        </p>
      </div>

      <div className="mt-12 space-y-16">
        {CATEGORIES.map((c) => {
          const products = getProductsByCategory(c.id);
          const top = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
          const min = Math.min(...products.map((p) => p.price));
          return (
            <section key={c.id} id={c.id}>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={c.image} alt="" className="h-16 w-20 rounded-xl object-cover shadow-card" loading="lazy" />
                  <div>
                    <h2 className="text-2xl font-bold text-ink">{c.name}</h2>
                    <p className="text-sm text-ink-muted">
                      {products.length} products · from {formatPrice(min)} · {c.fields.length} comparable specs
                    </p>
                  </div>
                </div>
                <Link to={`/category/${c.id}`} className="inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-slate-200 bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-brand-400 hover:text-brand-600">
                  View all {c.name.toLowerCase()} <ArrowRightIcon size={16} />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {top.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
