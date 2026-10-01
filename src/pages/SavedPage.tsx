import { useState } from "react";
import { useCompare } from "../context/CompareContext";
import { CATEGORY_MAP } from "../data/categories";
import { PRODUCT_MAP } from "../data/products";
import { navigate } from "../hooks/useHashRoute";
import { formatDate, formatPrice, pluralize } from "../utils/format";
import { encodeShareCode, copyToClipboard, shareUrl } from "../utils/share";
import { useToast } from "../context/ToastContext";
import { ArrowRightIcon, BookmarkIcon, CheckIcon, PencilIcon, ShareIcon, TrashIcon, XIcon } from "../components/Icons";
import { Button, ButtonLink, Container, EmptyState } from "../components/ui";

export function SavedPage() {
  const { saved, load, deleteSaved, renameSaved } = useCompare();
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const open = (ids: string[]) => {
    load(ids, { silent: true });
    navigate("/compare");
  };

  const share = async (ids: string[]) => {
    const ok = await copyToClipboard(shareUrl(encodeShareCode(ids)));
    toast(ok ? { title: "Share link copied", variant: "success" } : { title: "Couldn't copy link", variant: "warning" });
  };

  const commitRename = (id: string) => {
    renameSaved(id, draft);
    setEditing(null);
  };

  return (
    <Container className="py-10 sm:py-14 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Your library</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Saved comparisons</h1>
          <p className="mt-2 text-sm text-ink-muted">{saved.length === 0 ? "Nothing saved yet." : pluralize(saved.length, "comparison")} · stored in this browser</p>
        </div>
        <ButtonLink to="/compare" variant="outline" icon={<ArrowRightIcon size={16} />} className="flex-row-reverse">
          Current comparison
        </ButtonLink>
      </div>

      {saved.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon={<BookmarkIcon size={24} />}
          title="No saved comparisons"
          description="Build a comparison, hit Save, give it a name — it'll show up here for next time."
          action={<ButtonLink to="/categories">Browse categories</ButtonLink>}
        />
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {saved.map((s) => {
            const items = s.productIds.map((id) => PRODUCT_MAP[id]).filter(Boolean);
            const cat = CATEGORY_MAP[s.categoryId];
            const cheapest = items.length ? Math.min(...items.map((p) => p.price)) : 0;
            const isEditing = editing === s.id;
            return (
              <li key={s.id} className="flex flex-col rounded-card border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                      {cat?.name} · {formatDate(s.createdAt)}
                    </p>
                    {isEditing ? (
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          autoFocus
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename(s.id);
                            if (e.key === "Escape") setEditing(null);
                          }}
                          className="h-9 w-full rounded-lg border border-brand-300 px-2.5 text-sm font-semibold text-ink outline-none ring-4 ring-brand-500/10"
                        />
                        <button onClick={() => commitRename(s.id)} className="rounded-lg bg-best-600 p-2 text-white hover:bg-best-700" aria-label="Save name">
                          <CheckIcon size={14} strokeWidth={3} />
                        </button>
                        <button onClick={() => setEditing(null)} className="rounded-lg border border-slate-200 p-2 text-ink-muted hover:bg-slate-50" aria-label="Cancel">
                          <XIcon size={14} />
                        </button>
                      </div>
                    ) : (
                      <h2 className="mt-1 truncate font-display text-lg font-bold text-ink">{s.name}</h2>
                    )}
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setEditing(s.id);
                        setDraft(s.name);
                      }}
                      className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-slate-100 hover:text-ink"
                      aria-label="Rename"
                      title="Rename"
                    >
                      <PencilIcon size={16} />
                    </button>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {items.map((p) => (
                      <img key={p.id} src={p.image} alt={p.name} title={p.name} className="h-14 w-14 rounded-xl border-2 border-white object-cover shadow-sm" loading="lazy" />
                    ))}
                  </div>
                  <div className="min-w-0 text-xs text-ink-muted">
                    <p className="truncate font-medium text-ink">{items.map((p) => p.name).join(" vs ")}</p>
                    <p>
                      {pluralize(items.length, "product")} · from {formatPrice(cheapest)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                  <Button size="sm" onClick={() => open(s.productIds)} icon={<ArrowRightIcon size={14} />} className="flex-row-reverse">
                    Open comparison
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => share(s.productIds)} icon={<ShareIcon size={14} />}>
                    Share
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => deleteSaved(s.id)} icon={<TrashIcon size={14} />} className="ml-auto">
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
