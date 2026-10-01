import { useEffect, useMemo, useState } from "react";
import { getProduct, getProductsByCategory } from "../data/products";
import { CATEGORY_MAP } from "../data/categories";
import { SPEC_FIELDS } from "../data/specConfig";
import { useCompare } from "../context/CompareContext";
import { getSpecValue } from "../utils/compare";
import { formatDate, formatPrice } from "../utils/format";
import { cn } from "../utils/cn";
import { ProductCard } from "../components/ProductCard";
import { SpecCellValue } from "../components/ComparisonTable";
import { ArrowRightIcon, CheckIcon, ChevronRightIcon, PlusIcon, ScaleIcon, ShieldIcon } from "../components/Icons";
import { Badge, Button, ButtonLink, Container, Link, StarRating } from "../components/ui";
import { NotFoundPage } from "./NotFoundPage";

export function ProductPage({ productId }: { productId: string }) {
  const product = getProduct(productId);
  const [activeImage, setActiveImage] = useState(0);
  const { isSelected, toggle, products: selected, canCompare, isFull } = useCompare();

  useEffect(() => setActiveImage(0), [productId]);

  const similar = useMemo(() => {
    if (!product) return [];
    return getProductsByCategory(product.categoryId)
      .filter((p) => p.id !== product.id)
      .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
      .slice(0, 3);
  }, [product]);

  if (!product) return <NotFoundPage />;

  const category = CATEGORY_MAP[product.categoryId];
  const fields = SPEC_FIELDS[product.categoryId];
  const groups = fields.reduce<{ name: string; fields: typeof fields }[]>((acc, f) => {
    const g = acc.find((x) => x.name === f.group);
    if (g) g.fields.push(f);
    else acc.push({ name: f.group, fields: [f] });
    return acc;
  }, []);
  const selectedHere = isSelected(product.id);
  const disabled = !selectedHere && isFull;
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const n = product.reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, pct: product.reviews.length ? (n / product.reviews.length) * 100 : 0 };
  });

  return (
    <div className="animate-fade-in">
      <Container className="py-6 sm:py-8">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-ink">Home</Link>
          <ChevronRightIcon size={12} />
          <Link to={`/category/${category.id}`} className="hover:text-ink">{category.name}</Link>
          <ChevronRightIcon size={12} />
          <span className="font-medium text-ink">{product.name}</span>
        </nav>

        {/* ======================= TOP: gallery + buy box ======================= */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div>
            <div className="relative overflow-hidden rounded-card border border-slate-200 bg-slate-100 shadow-card">
              <img key={activeImage} src={product.gallery[activeImage]} alt={product.name} className="aspect-[4/3] w-full object-cover animate-fade-in" />
              {product.badge && <Badge label={product.badge} className="absolute left-4 top-4 shadow-sm" />}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {product.gallery.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "overflow-hidden rounded-lg border-2 bg-slate-100 transition-all duration-150",
                    i === activeImage ? "border-brand-500 ring-2 ring-brand-500/20" : "border-transparent opacity-70 hover:opacity-100",
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">{product.brand}</p>
            <h1 className="mt-1.5 text-3xl font-extrabold text-ink sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-[15px] text-ink-muted">{product.tagline}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StarRating value={product.rating} size={16} showValue />
              <button
                onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline"
              >
                {product.reviewCount.toLocaleString()} reviews
              </button>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-4xl font-extrabold text-ink tabular">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className="mb-1.5 text-lg text-slate-400 line-through tabular">{formatPrice(product.compareAtPrice)}</span>
                  <span className="mb-2 rounded-md bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                    Save {formatPrice(product.compareAtPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{product.description}</p>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-ink">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-best-100 text-best-700">
                    <CheckIcon size={10} strokeWidth={4} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                variant={selectedHere ? "best" : "primary"}
                onClick={() => toggle(product.id)}
                disabled={disabled}
                icon={selectedHere ? <CheckIcon size={18} strokeWidth={3} /> : <PlusIcon size={18} strokeWidth={2.5} />}
                className="flex-1"
              >
                {selectedHere ? "Added to compare" : "Add to Compare"}
              </Button>
              {canCompare && (
                <ButtonLink to="/compare" size="lg" variant="outline" icon={<ScaleIcon size={18} />}>
                  Compare {selected.length}
                </ButtonLink>
              )}
            </div>
            {disabled && <p className="mt-2 text-xs text-ink-muted">Your compare list is full (4 max). Remove one to add this product.</p>}

            <div className="mt-6 flex items-center gap-2 text-xs text-ink-muted">
              <ShieldIcon size={14} />
              {getSpecValue(product, "warranty")}-year manufacturer warranty · Free returns within 30 days (demo)
            </div>
          </div>
        </div>

        {/* ======================= SPECS + REVIEWS ======================= */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <section>
            <h2 className="text-2xl font-bold text-ink">Full specifications</h2>
            <div className="mt-5 overflow-hidden rounded-card border border-slate-200 bg-white shadow-card">
              {groups.map((g) => (
                <div key={g.name}>
                  <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{g.name}</div>
                  <dl>
                    {g.fields.map((f) => (
                      <div key={f.key} className="grid grid-cols-[1fr_1.2fr] gap-4 border-b border-slate-100 px-4 py-2.5 text-sm last:border-b-0 hover:bg-slate-50/60">
                        <dt className="font-medium text-ink-muted">{f.label}</dt>
                        <dd className="text-ink">
                          <SpecCellValue value={getSpecValue(product, f.key)} field={f} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>

          <section id="reviews">
            <h2 className="text-2xl font-bold text-ink">Reviews</h2>
            <div className="mt-5 rounded-card border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="font-display text-5xl font-extrabold text-ink tabular">{product.rating.toFixed(1)}</p>
                  <StarRating value={product.rating} size={16} className="mt-1" />
                  <p className="mt-1 text-xs text-ink-muted">{product.reviewCount.toLocaleString()} ratings</p>
                </div>
                <div className="min-w-[180px] flex-1 space-y-1.5">
                  {ratingBreakdown.map((b) => (
                    <div key={b.star} className="flex items-center gap-2 text-xs text-ink-muted">
                      <span className="w-3 text-right tabular">{b.star}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-star transition-all duration-500" style={{ width: `${b.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ul className="mt-4 space-y-4">
              {product.reviews.map((rv) => (
                <li key={rv.id} className="rounded-card border border-slate-200 bg-white p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                        {rv.author.slice(0, 1)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {rv.author}
                          {rv.verified && <span className="ml-2 rounded bg-best-50 px-1.5 py-0.5 text-[10px] font-semibold text-best-700">Verified</span>}
                        </p>
                        <p className="text-xs text-ink-muted">{formatDate(rv.date)}</p>
                      </div>
                    </div>
                    <StarRating value={rv.rating} size={13} />
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold text-ink">{rv.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{rv.body}</p>
                  {rv.helpful ? <p className="mt-3 text-xs text-ink-muted">{rv.helpful} people found this helpful</p> : null}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ======================= SIMILAR ======================= */}
        {similar.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Compare against</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">Similar {category.name.toLowerCase()}</h2>
              </div>
              <Link to={`/category/${category.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
                All {category.name.toLowerCase()} <ArrowRightIcon size={16} />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
