import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import type { Product, SavedComparison } from "../types";
import { getProduct, PRODUCT_MAP } from "../data/products";
import { CATEGORY_MAP } from "../data/categories";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS, uid } from "../utils/storage";
import { navigate } from "../hooks/useHashRoute";
import { useToast } from "./ToastContext";

export const MAX_COMPARE = 4;
export const MIN_COMPARE = 2;

interface CompareContextValue {
  /** Selected product ids, in selection order. */
  ids: string[];
  products: Product[];
  count: number;
  isSelected: (id: string) => boolean;
  /** Add (if allowed) or remove. Returns true if the product is selected afterwards. */
  toggle: (id: string) => boolean;
  add: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  /** Replace the whole selection — used by saved + shared comparisons. */
  load: (ids: string[], opts?: { silent?: boolean }) => void;
  canCompare: boolean;
  isFull: boolean;
  // Saved comparisons
  saved: SavedComparison[];
  saveCurrent: (name: string) => SavedComparison | null;
  renameSaved: (id: string, name: string) => void;
  deleteSaved: (id: string) => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [storedIds, setIds] = useLocalStorage<string[]>(STORAGE_KEYS.compare, []);
  const [saved, setSaved] = useLocalStorage<SavedComparison[]>(STORAGE_KEYS.saved, []);

  // Drop ids that no longer resolve to a product (defensive against stale storage).
  const ids = useMemo(() => storedIds.filter((id) => PRODUCT_MAP[id]), [storedIds]);
  const products = useMemo(() => ids.map((id) => PRODUCT_MAP[id]), [ids]);

  const isSelected = useCallback((id: string) => ids.includes(id), [ids]);

  const remove = useCallback((id: string) => setIds((prev) => prev.filter((x) => x !== id)), [setIds]);

  const clear = useCallback(() => setIds([]), [setIds]);

  const add = useCallback(
    (id: string): boolean => {
      const product = getProduct(id);
      if (!product || ids.includes(id)) return ids.includes(id);

      // Rule 1: hard cap
      if (ids.length >= MAX_COMPARE) {
        toast({
          title: `You can compare up to ${MAX_COMPARE} products`,
          description: "Remove one from the compare bar to add another.",
          variant: "warning",
        });
        return false;
      }

      // Rule 2: one category per comparison (spec sheets differ between categories)
      const current = products[0];
      if (current && current.categoryId !== product.categoryId) {
        const from = CATEGORY_MAP[current.categoryId].name;
        const to = CATEGORY_MAP[product.categoryId].name;
        toast({
          title: `Comparisons stay within one category`,
          description: `You're comparing ${from}. Start a new ${to} comparison instead?`,
          variant: "warning",
          duration: 5000,
          action: {
            label: "Start new",
            onClick: () => {
              setIds([id]);
              toast({ title: `Added ${product.name}`, variant: "success" });
            },
          },
        });
        return false;
      }

      setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      return true;
    },
    [ids, products, setIds, toast],
  );

  const toggle = useCallback(
    (id: string): boolean => {
      if (ids.includes(id)) {
        remove(id);
        return false;
      }
      return add(id);
    },
    [ids, add, remove],
  );

  const load = useCallback(
    (next: string[], opts?: { silent?: boolean }) => {
      const valid = next.filter((id) => PRODUCT_MAP[id]).slice(0, MAX_COMPARE);
      setIds(valid);
      if (!opts?.silent) {
        toast({ title: `Loaded ${valid.length} products into compare`, variant: "success" });
      }
    },
    [setIds, toast],
  );

  /* ---------------- saved comparisons ---------------- */
  const saveCurrent = useCallback(
    (name: string): SavedComparison | null => {
      if (products.length < MIN_COMPARE) return null;
      const entry: SavedComparison = {
        id: uid(),
        name: name.trim() || `${CATEGORY_MAP[products[0].categoryId].name} comparison`,
        productIds: ids,
        categoryId: products[0].categoryId,
        createdAt: new Date().toISOString(),
      };
      setSaved((prev) => [entry, ...prev]);
      toast({
        title: "Comparison saved",
        description: entry.name,
        variant: "success",
        action: { label: "View saved", onClick: () => navigate("/saved") },
      });
      return entry;
    },
    [ids, products, setSaved, toast],
  );

  const renameSaved = useCallback(
    (id: string, name: string) => setSaved((prev) => prev.map((s) => (s.id === id ? { ...s, name: name.trim() || s.name } : s))),
    [setSaved],
  );

  const deleteSaved = useCallback(
    (id: string) => {
      setSaved((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Saved comparison deleted" });
    },
    [setSaved, toast],
  );

  const value = useMemo<CompareContextValue>(
    () => ({
      ids,
      products,
      count: ids.length,
      isSelected,
      toggle,
      add,
      remove,
      clear,
      load,
      canCompare: ids.length >= MIN_COMPARE,
      isFull: ids.length >= MAX_COMPARE,
      saved,
      saveCurrent,
      renameSaved,
      deleteSaved,
    }),
    [ids, products, isSelected, toggle, add, remove, clear, load, saved, saveCurrent, renameSaved, deleteSaved],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within <CompareProvider>");
  return ctx;
}
