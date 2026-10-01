import { MAX_COMPARE, MIN_COMPARE, useCompare } from "../context/CompareContext";
import { CATEGORY_MAP } from "../data/categories";
import { cn } from "../utils/cn";
import { ArrowRightIcon, PlusIcon, XIcon } from "./Icons";
import { Button, ButtonLink, Link } from "./ui";

/**
 * Persistent bottom bar. Always mounted so it can slide in/out smoothly;
 * hidden via translate-y when nothing is selected or when already on /compare.
 */
export function CompareBar({ path }: { path: string }) {
  const { products, count, remove, clear, canCompare } = useCompare();
  const onComparePage = path.startsWith("/compare");
  const visible = count > 0 && !onComparePage;
  const category = products[0] ? CATEGORY_MAP[products[0].categoryId] : null;
  const slots = Array.from({ length: MAX_COMPARE });

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[70] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        visible ? "translate-y-0" : "translate-y-[110%]",
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-7xl px-3 pb-3 sm:px-6 sm:pb-4 lg:px-8">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-float backdrop-blur-md sm:gap-5 sm:p-3.5">
          {/* Slots */}
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-none">
            {slots.map((_, i) => {
              const p = products[i];
              if (!p) {
                return (
                  <div
                    key={`empty-${i}`}
                    className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-300 sm:flex"
                    aria-hidden
                  >
                    <PlusIcon size={16} />
                  </div>
                );
              }
              return (
                <div key={p.id} className="group relative shrink-0 animate-pop-in" title={p.name}>
                  <Link to={`/product/${p.id}`} className="block h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-12 sm:w-16">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  </Link>
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-muted shadow-sm transition-colors hover:bg-ink hover:text-white hover:border-ink"
                    aria-label={`Remove ${p.name} from compare`}
                  >
                    <XIcon size={11} strokeWidth={3} />
                  </button>
                </div>
              );
            })}
            <div className="ml-1 hidden min-w-0 md:block">
              <p className="text-sm font-semibold text-ink">
                {count} of {MAX_COMPARE} selected
                {category && <span className="font-normal text-ink-muted"> · {category.name}</span>}
              </p>
              <p className="truncate text-xs text-ink-muted">
                {canCompare ? "Ready to compare side by side." : `Add ${MIN_COMPARE - count} more to compare.`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <p className="text-xs font-semibold text-ink md:hidden tabular">{count}/{MAX_COMPARE}</p>
            <Button variant="ghost" size="sm" onClick={clear} className="hidden sm:inline-flex">
              Clear
            </Button>
            {canCompare ? (
              <ButtonLink to="/compare" size="md" icon={<ArrowRightIcon size={16} />} className="flex-row-reverse">
                Compare Now
              </ButtonLink>
            ) : (
              <Button size="md" disabled title={`Select at least ${MIN_COMPARE} products`}>
                Compare Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
