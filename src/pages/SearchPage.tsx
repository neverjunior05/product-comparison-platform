import { useMemo } from "react";
import { searchProducts } from "../data/products";
import { CATEGORIES } from "../data/categories";
import { ProductCard } from "../components/ProductCard";
import { SearchBox } from "../components/SearchBox";
import { SearchIcon } from "../components/Icons";
import { Container, EmptyState, Link } from "../components/ui";

export function SearchPage({ query }: { query: string }) {
  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <Container className="py-10 sm:py-14 animate-fade-in">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Search</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
          {query ? (
            <>
              Results for <span className="text-brand-500">“{query}”</span>
            </>
          ) : (
            "Search products"
          )}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">{query ? `${results.length} ${results.length === 1 ? "match" : "matches"}` : "Type a product, brand or feature."}</p>
        <div className="mt-6 max-w-xl">
          <SearchBox size="lg" placeholder="Try “OLED”, “ANC”, “Kestrel”…" autoFocus={!query} />
        </div>
      </div>

      <div className="mt-10">
        {results.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<SearchIcon size={24} />}
            title={query ? "Nothing matched" : "Start typing to search"}
            description={query ? "Try a brand name like “Lumen” or a feature like “stylus”." : undefined}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((c) => (
                  <Link key={c.id} to={`/category/${c.id}`} className="inline-flex h-8 items-center rounded-full border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-ink hover:border-brand-400 hover:text-brand-600">
                    {c.name}
                  </Link>
                ))}
              </div>
            }
          />
        )}
      </div>
    </Container>
  );
}
