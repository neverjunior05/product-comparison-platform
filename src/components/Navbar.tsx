import { useEffect, useState } from "react";
import { useCompare } from "../context/CompareContext";
import { cn } from "../utils/cn";
import { Link } from "./ui";
import { BookmarkIcon, Logo, MenuIcon, XIcon } from "./Icons";
import { SearchBox } from "./SearchBox";

const NAV_LINKS = [
  { label: "Home", to: "/", match: (p: string) => p === "/" },
  { label: "Categories", to: "/categories", match: (p: string) => p.startsWith("/categor") || p.startsWith("/product") },
  { label: "Compare", to: "/compare", match: (p: string) => p.startsWith("/compare") },
  { label: "Reviews", to: "/reviews", match: (p: string) => p.startsWith("/reviews") },
];

export function Navbar({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const { count, saved } = useCompare();

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [path]);

  return (
    <header className="sticky top-0 z-[60] border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="SpecSide home">
          <Logo size={32} />
          <span className="font-display text-[19px] font-bold tracking-tight text-ink">
            Spec<span className="text-brand-500">Side</span>
          </span>
        </Link>

        <ul className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => {
            const active = l.match(path);
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={cn(
                    "relative inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors duration-150",
                    active ? "text-ink bg-slate-100" : "text-ink-muted hover:text-ink hover:bg-slate-50",
                  )}
                >
                  {l.label}
                  {l.to === "/compare" && count > 0 && (
                    <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white tabular">
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto hidden w-full max-w-xs md:block lg:max-w-sm">
          <SearchBox placeholder="Search phones, laptops, cameras…" />
        </div>

        <Link
          to="/saved"
          className={cn(
            "hidden h-10 items-center gap-1.5 rounded-[10px] border px-3 text-sm font-medium transition-colors md:inline-flex",
            path.startsWith("/saved") ? "border-brand-200 bg-brand-50 text-brand-700" : "border-slate-200 text-ink hover:bg-slate-50",
          )}
        >
          <BookmarkIcon size={16} filled={saved.length > 0} className={saved.length > 0 ? "text-brand-500" : undefined} />
          Saved
          {saved.length > 0 && <span className="text-xs text-ink-muted tabular">({saved.length})</span>}
        </Link>

        <button
          onClick={() => setOpen((o) => !o)}
          className="relative ml-auto inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-slate-200 text-ink transition-colors hover:bg-slate-50 lg:hidden md:ml-0"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <XIcon size={20} /> : <MenuIcon size={20} />}
          {!open && count > 0 && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white" aria-hidden />}
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        className={cn(
          "grid overflow-hidden border-t border-slate-100 bg-white transition-[grid-template-rows,opacity] duration-200 ease-out lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 border-t-0",
        )}
      >
        <div className="min-h-0">
          <div className="space-y-3 px-4 py-4 sm:px-6">
            <div className="md:hidden">
              <SearchBox placeholder="Search products…" onNavigate={() => setOpen(false)} />
            </div>
            <ul className="grid gap-1">
              {[...NAV_LINKS, { label: "Saved comparisons", to: "/saved", match: (p: string) => p.startsWith("/saved") }].map((l) => {
                const active = l.match(path);
                return (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors",
                        active ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-slate-50",
                      )}
                    >
                      {l.label}
                      {l.to === "/compare" && count > 0 && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white">{count}</span>
                      )}
                      {l.to === "/saved" && saved.length > 0 && <span className="text-xs text-ink-muted">{saved.length}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
