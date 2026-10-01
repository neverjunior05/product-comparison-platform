import { useMemo, useState } from "react";
import { MAX_COMPARE, MIN_COMPARE, useCompare } from "../context/CompareContext";
import { useToast } from "../context/ToastContext";
import { CATEGORIES, CATEGORY_MAP } from "../data/categories";
import { getProductsByCategory, PRODUCT_MAP } from "../data/products";
import { SPEC_FIELDS } from "../data/specConfig";
import { navigate } from "../hooks/useHashRoute";
import { copyToClipboard, encodeShareCode, localShareHash, shareUrl } from "../utils/share";
import { formatPrice } from "../utils/format";
import { cn } from "../utils/cn";
import { ComparisonTable } from "../components/ComparisonTable";
import { Modal } from "../components/Modal";
import { BookmarkIcon, CheckIcon, ChevronRightIcon, CopyIcon, LinkIcon, PlusIcon, ScaleIcon, ShareIcon, TrashIcon } from "../components/Icons";
import { Button, ButtonLink, Container, EmptyState, Link, StarRating } from "../components/ui";

const QUICK_STARTS = [
  { label: "Flagship phones", ids: ["lumen-pro-9", "vantage-ultra-2", "arc-nova-x"] },
  { label: "Laptops under $1,200", ids: ["arcline-air-14", "lumen-book-13", "orbit-flex-14"] },
  { label: "ANC headphones", ids: ["sonar-q1-anc", "kestrel-studio", "lumen-buds-pro"] },
];

export function ComparePage() {
  const { products, remove, clear, add, load, saveCurrent, canCompare } = useCompare();
  const { toast } = useToast();
  const [modal, setModal] = useState<null | "save" | "share" | "add">(null);
  const [saveName, setSaveName] = useState("");
  const [copied, setCopied] = useState<"url" | "code" | null>(null);
  const [pickerQuery, setPickerQuery] = useState("");

  const category = products[0] ? CATEGORY_MAP[products[0].categoryId] : null;
  const fieldCount = category ? SPEC_FIELDS[category.id].length : 0;
  const shareCode = useMemo(() => encodeShareCode(products.map((p) => p.id)), [products]);

  const pickerProducts = useMemo(() => {
    if (!category) return [];
    const q = pickerQuery.trim().toLowerCase();
    return getProductsByCategory(category.id)
      .filter((p) => !products.some((s) => s.id === p.id))
      .filter((p) => !q || `${p.brand} ${p.name}`.toLowerCase().includes(q));
  }, [category, products, pickerQuery]);

  /* ---------- rules legend (derived from the config, not hard-coded) ---------- */
  const rules = useMemo(() => {
    if (!category) return null;
    const fields = SPEC_FIELDS[category.id];
    return {
      lower: fields.filter((f) => f.better === "lower").map((f) => f.label),
      higher: fields.filter((f) => f.better === "higher").map((f) => f.label),
      none: fields.filter((f) => f.better === "none").map((f) => f.label),
    };
  }, [category]);

  const openSave = () => {
    const suggestion = category ? `${category.name}: ${products.map((p) => p.name).join(" vs ")}` : "";
    setSaveName(suggestion);
    setModal("save");
  };

  const doSave = () => {
    const entry = saveCurrent(saveName);
    if (entry) setModal(null);
  };

  const copy = async (what: "url" | "code") => {
    const ok = await copyToClipboard(what === "url" ? shareUrl(shareCode) : shareCode);
    if (ok) {
      setCopied(what);
      window.setTimeout(() => setCopied(null), 1800);
    } else {
      toast({ title: "Couldn't copy automatically", description: "Select the text and copy it manually.", variant: "warning" });
    }
  };

  /* ======================= EMPTY STATE ======================= */
  if (products.length === 0) {
    return (
      <Container className="py-12 sm:py-16 animate-fade-in">
        <div className="mx-auto max-w-3xl">
          <EmptyState
            icon={<ScaleIcon size={26} />}
            title="Nothing to compare yet"
            description="Add two to four products from any category and they'll line up here, spec by spec, with the best value flagged on every row."
            action={<ButtonLink to="/categories">Browse categories</ButtonLink>}
          />
          <div className="mt-8">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Or try a quick start</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {QUICK_STARTS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => load(q.ids, { silent: true })}
                  className="group flex items-center gap-3 rounded-card border border-slate-200 bg-white p-3 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover"
                >
                  <div className="flex -space-x-2">
                    {q.ids.map((id) => (
                      <img key={id} src={PRODUCT_MAP[id].image} alt="" className="h-9 w-9 rounded-lg border-2 border-white object-cover" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-ink group-hover:text-brand-700">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  /* ======================= COMPARISON ======================= */
  return (
    <div className="animate-fade-in">
      <Container className="py-6 sm:py-8">
        <nav className="flex items-center gap-1.5 text-xs text-ink-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-ink">Home</Link>
          <ChevronRightIcon size={12} />
          {category && (
            <>
              <Link to={`/category/${category.id}`} className="hover:text-ink">{category.name}</Link>
              <ChevronRightIcon size={12} />
            </>
          )}
          <span className="font-medium text-ink">Compare</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
              Compare {category?.name.toLowerCase()}
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              {products.length} of {MAX_COMPARE} products · {fieldCount} specs · best value per row highlighted in{" "}
              <span className="rounded bg-best-500/10 px-1 font-semibold text-best-700">green</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {products.length < MAX_COMPARE && (
              <Button variant="outline" icon={<PlusIcon size={16} />} onClick={() => setModal("add")}>
                Add product
              </Button>
            )}
            <Button variant="outline" icon={<BookmarkIcon size={16} />} onClick={openSave} disabled={!canCompare} title={!canCompare ? `Select at least ${MIN_COMPARE} products` : undefined}>
              Save
            </Button>
            <Button variant="outline" icon={<ShareIcon size={16} />} onClick={() => setModal("share")} disabled={!canCompare}>
              Share
            </Button>
            <Button variant="danger" icon={<TrashIcon size={16} />} onClick={clear}>
              Clear all
            </Button>
          </div>
        </div>

        {!canCompare && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
            <p>
              <strong>Add at least one more {category?.singular.toLowerCase()}</strong> to unlock best-value highlighting, saving and sharing.
            </p>
            <Button size="sm" onClick={() => setModal("add")} icon={<PlusIcon size={14} />}>
              Add product
            </Button>
          </div>
        )}

        <div className="mt-6">
          <ComparisonTable products={products} onRemove={remove} onAdd={() => setModal("add")} />
        </div>

        {/* Rules legend */}
        {rules && (
          <section className="mt-8 grid gap-4 rounded-card border border-slate-200 bg-white p-5 shadow-card md:grid-cols-3">
            <RuleColumn tone="brand" title="Lower wins ↓" items={rules.lower} note="Cheaper, lighter, thinner." />
            <RuleColumn tone="best" title="Higher wins ↑" items={rules.higher} note="More battery, RAM, pixels — and “Yes” beats “No”." />
            <RuleColumn tone="muted" title="Not scored" items={rules.none} note="Subjective or descriptive — shown for reference only." />
          </section>
        )}

        {/* Other categories CTA */}
        <div className="mt-10 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <span>Start a different comparison:</span>
          {CATEGORIES.filter((c) => c.id !== category?.id).map((c) => (
            <Link key={c.id} to={`/category/${c.id}`} className="inline-flex h-8 items-center rounded-full border border-slate-200 bg-white px-3 text-[13px] font-medium text-ink hover:border-brand-400 hover:text-brand-600">
              {c.name}
            </Link>
          ))}
        </div>
      </Container>

      {/* ======================= SAVE MODAL ======================= */}
      <Modal
        open={modal === "save"}
        onClose={() => setModal(null)}
        title="Save this comparison"
        description="Give it a name so you can find it later under Saved."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={doSave} icon={<BookmarkIcon size={16} />}>Save comparison</Button>
          </>
        }
      >
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted" htmlFor="save-name">
          Name
        </label>
        <input
          id="save-name"
          autoFocus
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSave()}
          maxLength={80}
          className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
          placeholder="e.g. Phones for mom"
        />
        <div className="mt-4 flex -space-x-2">
          {products.map((p) => (
            <img key={p.id} src={p.image} alt={p.name} title={p.name} className="h-12 w-12 rounded-xl border-2 border-white object-cover shadow-sm" />
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted">Saved to this browser (localStorage). {products.map((p) => p.name).join(", ")}.</p>
      </Modal>

      {/* ======================= SHARE MODAL ======================= */}
      <Modal
        open={modal === "share"}
        onClose={() => setModal(null)}
        title="Share this comparison"
        description="Anyone with the link sees the exact same line-up."
        size="sm"
        footer={<Button variant="ghost" onClick={() => setModal(null)}>Done</Button>}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Shareable link</p>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1.5 pl-3">
              <LinkIcon size={16} className="shrink-0 text-ink-muted" />
              <code className="min-w-0 flex-1 truncate text-[13px] text-ink">{shareUrl(shareCode)}</code>
              <Button size="sm" variant={copied === "url" ? "best" : "secondary"} onClick={() => copy("url")} icon={copied === "url" ? <CheckIcon size={14} strokeWidth={3} /> : <CopyIcon size={14} />}>
                {copied === "url" ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Short code</p>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1.5 pl-3">
              <code className="min-w-0 flex-1 font-display text-lg font-bold tracking-[0.2em] text-ink">{shareCode}</code>
              <Button size="sm" variant={copied === "code" ? "best" : "outline"} onClick={() => copy("code")} icon={copied === "code" ? <CheckIcon size={14} strokeWidth={3} /> : <CopyIcon size={14} />}>
                {copied === "code" ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-slate-200 p-3 text-xs text-ink-muted">
            <p>
              <strong className="text-ink">Simulated sharing.</strong> The code encodes your product selection, so it round-trips in this demo:{" "}
              <button onClick={() => { setModal(null); navigate(localShareHash(shareCode)); }} className="font-semibold text-brand-600 hover:text-brand-700">
                open {localShareHash(shareCode)} →
              </button>
            </p>
          </div>
        </div>
      </Modal>

      {/* ======================= ADD PRODUCT MODAL ======================= */}
      <Modal
        open={modal === "add"}
        onClose={() => { setModal(null); setPickerQuery(""); }}
        title={`Add a ${category?.singular.toLowerCase() ?? "product"}`}
        description={`${products.length} of ${MAX_COMPARE} slots used · same category only`}
        size="md"
      >
        <input
          value={pickerQuery}
          onChange={(e) => setPickerQuery(e.target.value)}
          placeholder="Filter by name or brand…"
          autoFocus
          className="mb-3 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
        />
        {pickerProducts.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">
            {pickerQuery ? "No matches." : "Every product in this category is already in your comparison."}
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pickerProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                <img src={p.image} alt="" className="h-14 w-[72px] shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                  <div className="flex items-center gap-2 text-xs text-ink-muted">
                    <span className="font-semibold text-ink tabular">{formatPrice(p.price)}</span>
                    <StarRating value={p.rating} size={11} showValue />
                  </div>
                </div>
                <Button
                  size="sm"
                  icon={<PlusIcon size={14} strokeWidth={2.5} />}
                  disabled={products.length >= MAX_COMPARE}
                  onClick={() => {
                    const ok = add(p.id);
                    if (ok && products.length + 1 >= MAX_COMPARE) setModal(null);
                  }}
                >
                  Add
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}

function RuleColumn({ tone, title, items, note }: { tone: "brand" | "best" | "muted"; title: string; items: string[]; note: string }) {
  return (
    <div>
      <p
        className={cn(
          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold",
          tone === "brand" && "bg-brand-50 text-brand-700",
          tone === "best" && "bg-best-50 text-best-700",
          tone === "muted" && "bg-slate-100 text-ink-muted",
        )}
      >
        {title}
      </p>
      <p className="mt-2 text-xs text-ink-muted">{note}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-ink">{items.join(" · ")}</p>
    </div>
  );
}
