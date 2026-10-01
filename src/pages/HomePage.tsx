import { CATEGORIES, CATEGORY_MAP } from "../data/categories";
import { PRODUCTS, PRODUCT_MAP } from "../data/products";
import { useCompare } from "../context/CompareContext";
import { navigate } from "../hooks/useHashRoute";
import { formatPrice } from "../utils/format";
import { CategoryCard } from "../components/CategoryCard";
import { ProductCard } from "../components/ProductCard";
import { SearchBox } from "../components/SearchBox";
import { ArrowRightIcon, BoltIcon, CheckIcon, GridIcon, ScaleIcon, ShieldIcon, SparkleIcon } from "../components/Icons";
import { ButtonLink, Container, Link, SectionHeading } from "../components/ui";

/** Curated head-to-heads shown on the home page. */
const TRENDING: { title: string; ids: string[] }[] = [
  { title: "Flagship phone showdown", ids: ["lumen-pro-9", "vantage-ultra-2", "arc-nova-x"] },
  { title: "Best laptop under $1,200", ids: ["arcline-air-14", "lumen-book-13", "orbit-flex-14"] },
  { title: "ANC headphones: travel vs. audiophile", ids: ["sonar-q1-anc", "kestrel-studio", "vantage-quiet-max"] },
  { title: "First serious camera", ids: ["lumen-l5", "orbit-z30", "arcline-a1-compact"] },
];

export function HomePage() {
  const { load } = useCompare();
  const topRated = [...PRODUCTS].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 4);

  const openTrending = (ids: string[]) => {
    load(ids, { silent: true });
    navigate("/compare");
  };

  return (
    <div className="animate-fade-in">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white">
        <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
        <div className="absolute -top-40 left-1/2 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 right-[-10%] h-72 w-72 rounded-full bg-best-500/10 blur-3xl" aria-hidden />

        <Container className="relative py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <SparkleIcon size={14} />
              {PRODUCTS.length} products · {CATEGORIES.length} categories · best value flagged per spec
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-ink sm:text-6xl">
              Compare before <span className="text-brand-500">you buy.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-ink-muted sm:text-lg">
              Put up to four products side by side. Every spec row flags its winner — cheapest, lightest, longest battery — so the right pick is obvious at a glance.
            </p>

            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBox size="lg" placeholder="Search for a phone, laptop, headphones or camera…" />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-ink-muted">Quick links:</span>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  to={`/category/${c.id}`}
                  className="inline-flex h-8 items-center rounded-full border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-ink transition-all duration-150 hover:border-brand-400 hover:text-brand-600 hover:shadow-sm"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mini preview of the highlight concept */}
          <div className="mx-auto mt-14 max-w-3xl overflow-x-auto rounded-card border border-slate-200 bg-white shadow-card-hover scrollbar-none">
            <div className="grid min-w-[560px] grid-cols-[0.9fr_1fr_1fr_1fr] text-[13px]">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">Spec</div>
              {["lumen-pro-9", "kestrel-edge-5", "orbit-mini"].map((id) => (
                <div key={id} className="truncate border-b border-l border-slate-100 bg-slate-50 px-4 py-2.5 font-semibold text-ink">
                  {PRODUCT_MAP[id].name}
                </div>
              ))}
              {[
                { label: "Price ↓", values: ["$999", "$699", "$599"], best: 2 },
                { label: "Battery ↑", values: ["4,700 mAh", "5,500 mAh", "4,100 mAh"], best: 1 },
                { label: "Weight ↓", values: ["187 g", "205 g", "162 g"], best: 2 },
              ].map((row) => (
                <div key={row.label} className="contents">
                  <div className="border-b border-slate-100 px-4 py-2.5 font-medium text-ink">{row.label}</div>
                  {row.values.map((v, i) => (
                    <div key={i} className={`flex items-center gap-1.5 border-b border-l border-slate-100 px-4 py-2.5 tabular ${i === row.best ? "bg-best-500/10 font-semibold text-best-700" : "text-ink"}`}>
                      {i === row.best && (
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-best-500 text-white">
                          <CheckIcon size={10} strokeWidth={4} />
                        </span>
                      )}
                      {v}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ============================ CATEGORIES ============================ */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Browse"
            title="Pick a category"
            description="Each category has its own spec sheet — phones are scored on cameras and batteries, laptops on displays and ports."
            action={
              <Link to="/categories" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
                All categories <ArrowRightIcon size={16} />
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </Container>
      </section>

      {/* ============================ TRENDING ============================ */}
      <section className="border-y border-slate-200/70 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Trending" title="Popular head-to-heads" description="One click loads the comparison — swap products in or out once you're there." />
          <div className="grid gap-4 md:grid-cols-2">
            {TRENDING.map((t) => {
              const items = t.ids.map((id) => PRODUCT_MAP[id]);
              const cat = CATEGORY_MAP[items[0].categoryId];
              const cheapest = Math.min(...items.map((p) => p.price));
              return (
                <button
                  key={t.title}
                  onClick={() => openTrending(t.ids)}
                  className="group flex items-center gap-4 rounded-card border border-slate-200/80 bg-surface p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover"
                >
                  <div className="flex -space-x-3 shrink-0">
                    {items.map((p) => (
                      <img key={p.id} src={p.image} alt="" className="h-14 w-14 rounded-xl border-2 border-white object-cover shadow-sm" loading="lazy" />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{cat.name}</p>
                    <p className="truncate font-display text-[15px] font-semibold text-ink">{t.title}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {items.map((p) => p.name).join(" vs ")} · from {formatPrice(cheapest)}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink-muted ring-1 ring-slate-200 transition-all group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                    <ScaleIcon size={16} />
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ============================ TOP RATED ============================ */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Top rated" title="Highest-rated picks right now" description="Across all categories, sorted by user rating." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topRated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="border-t border-slate-200/70 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="How it works" title="Three steps to a confident purchase" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: <GridIcon size={22} />, title: "Pick 2–4 products", body: "Browse a category and tick the ones you're torn between. The compare bar tracks your picks as you go." },
              { icon: <BoltIcon size={22} />, title: "Scan the winners", body: "Each spec row highlights its best value in green — lower price, higher rating, bigger battery — using per-field rules." },
              { icon: <ShieldIcon size={22} />, title: "Save & share", body: "Name a comparison to revisit it later, or copy a share code to send the exact line-up to a friend." },
            ].map((s, i) => (
              <div key={s.title} className="relative rounded-card border border-slate-200/80 bg-surface p-6 shadow-card">
                <span className="absolute right-5 top-5 font-display text-4xl font-extrabold text-slate-100">0{i + 1}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm shadow-brand-500/30">{s.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <ButtonLink to="/categories" size="lg" icon={<ArrowRightIcon size={18} />} className="flex-row-reverse">
              Start comparing
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
