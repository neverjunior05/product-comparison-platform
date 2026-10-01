import { CATEGORIES } from "../data/categories";
import { Logo } from "./Icons";
import { Container, Link } from "./ui";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="font-display text-lg font-bold text-ink">
                Spec<span className="text-brand-500">Side</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              Side-by-side spec comparisons with the best value highlighted on every row. No sponsored rankings — just the numbers.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">Categories</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link to={`/category/${c.id}`} className="text-ink-muted transition-colors hover:text-brand-600">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">Tools</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/compare" className="text-ink-muted hover:text-brand-600">Compare</Link></li>
              <li><Link to="/saved" className="text-ink-muted hover:text-brand-600">Saved comparisons</Link></li>
              <li><Link to="/reviews" className="text-ink-muted hover:text-brand-600">Reviews</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">How we score</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li><span className="inline-block h-2 w-2 rounded-full bg-best-500 mr-2" />Best value per row is highlighted</li>
              <li><span className="inline-block h-2 w-2 rounded-full bg-brand-500 mr-2" />Lower price &amp; weight win</li>
              <li><span className="inline-block h-2 w-2 rounded-full bg-star mr-2" />Higher rating, battery, RAM win</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-ink-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SpecSide. Demo data — products are fictional. Photos via Pexels.</p>
          <p>Built with React, Vite &amp; Tailwind CSS.</p>
        </div>
      </Container>
    </footer>
  );
}
