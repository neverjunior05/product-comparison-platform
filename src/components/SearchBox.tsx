import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { searchProducts } from "../data/products";
import { CATEGORY_MAP } from "../data/categories";
import { navigate } from "../hooks/useHashRoute";
import { useCompare } from "../context/CompareContext";
import { cn } from "../utils/cn";
import { formatPrice } from "../utils/format";
import { CheckIcon, PlusIcon, SearchIcon, XIcon } from "./Icons";

interface SearchBoxProps {
  size?: "md" | "lg";
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export function SearchBox({ size = "md", placeholder = "Search products…", autoFocus, className, onNavigate }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSelected, toggle } = useCompare();

  const results = useMemo(() => searchProducts(query, 6), [query]);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    onNavigate?.();
    navigate(to);
  };

  const submit = () => {
    if (!query.trim()) return;
    if (active >= 0 && results[active]) go(`/product/${results[active].id}`);
    else go(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(-1, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const lg = size === "lg";

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border bg-white transition-all duration-150",
          lg ? "h-14 pl-4 pr-2 shadow-lg shadow-slate-900/5" : "h-10 pl-3 pr-1.5",
          open && query ? "border-brand-400 ring-4 ring-brand-500/10" : "border-slate-200 hover:border-slate-300",
        )}
      >
        <SearchIcon size={lg ? 20 : 17} className="shrink-0 text-ink-muted" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search products"
          aria-expanded={open && results.length > 0}
          className={cn("w-full min-w-0 bg-transparent text-ink outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden", lg ? "text-base" : "text-sm")}
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="rounded-md p-1 text-slate-400 hover:text-ink" aria-label="Clear search">
            <XIcon size={16} />
          </button>
        )}
        {lg && (
          <button
            onClick={submit}
            className="hidden h-10 shrink-0 items-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600 sm:inline-flex"
          >
            Search
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 animate-pop-in">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-ink-muted">
              No products match “{query}”.
            </div>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-1.5">
              {results.map((p, i) => {
                const selected = isSelected(p.id);
                return (
                  <li key={p.id}>
                    <div
                      className={cn("flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors", i === active ? "bg-slate-50" : "hover:bg-slate-50")}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(`/product/${p.id}`)}
                    >
                      <img src={p.image} alt="" className="h-11 w-14 shrink-0 rounded-md object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                        <p className="truncate text-xs text-ink-muted">
                          {CATEGORY_MAP[p.categoryId].name} · {formatPrice(p.price)} · ★ {p.rating.toFixed(1)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(p.id);
                        }}
                        className={cn(
                          "inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold transition-colors",
                          selected ? "border-brand-500 bg-brand-500 text-white" : "border-slate-200 text-ink hover:border-brand-400 hover:text-brand-600",
                        )}
                        aria-label={selected ? "Remove from compare" : "Add to compare"}
                      >
                        {selected ? <CheckIcon size={13} strokeWidth={3} /> : <PlusIcon size={13} strokeWidth={2.5} />}
                        <span className="hidden sm:inline">{selected ? "Added" : "Compare"}</span>
                      </button>
                    </div>
                  </li>
                );
              })}
              <li className="border-t border-slate-100 mt-1 pt-1">
                <button onClick={submit} className="flex w-full items-center justify-between px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-slate-50">
                  See all results for “{query}” <span aria-hidden>→</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
