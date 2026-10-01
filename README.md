# SpecSide

**Compare before you buy** — a product comparison platform that lines up 2–4 products side by side and highlights the best value on every spec row.

No backend: the catalogue lives in a static TypeScript array, and your compare selection + saved comparisons persist in `localStorage`.

---

## Features

| Area | What it does |
| --- | --- |
| **Navbar** | Logo, nav links (Home · Categories · Compare · Reviews · Saved), live-suggestion search bar, mobile hamburger panel. Compare link shows a live count badge. |
| **Hero / Search** | "Compare before you buy." headline, large search with product suggestions + inline *Compare* buttons, category quick-links, and a mini preview of the best-value highlight concept. |
| **Category browse** | Four categories (Smartphones, Laptops, Headphones, Cameras), each with its own spec sheet. |
| **Product grid** | CSS Grid of product cards — image, brand, name, price, amber star rating, "+ Compare" toggle. Selected cards get an orange ring; cards lift on hover. Sort + brand filters. |
| **Floating compare bar** | Slides up from the bottom when ≥ 1 product is selected, shows thumbnails (removable), "x of 4 selected", *Clear*, and *Compare Now* (disabled until 2 are picked). |
| **Comparison table** | Sticky product header (image · name · price · remove), sticky spec-label column, grouped spec rows, **best value per row highlighted** in emerald with a ✓ badge, win-count scorecard per product, animated column collapse on remove, "Add product" slot, rules legend. |
| **Product detail** | Image gallery, price, rating breakdown, highlights, full grouped spec sheet, mock reviews, similar products, *Add to Compare*. |
| **Saved comparisons** | Name and save any comparison; reopen, rename, share or delete it later from `/saved`. |
| **Share (simulated)** | Generates a mock `specside.app/c/CODE` link + short code. The code encodes the product selection, so `#/c/CODE` really does reopen the same comparison in this build. |
| **Reviews** | Aggregated owner reviews across the catalogue with category filter, sorting, and a top-rated leaderboard. |

---

## Tech stack

- **React 19** + **TypeScript** — UI, hooks, context for compare/toast state
- **Vite 7** — dev server & build (`vite-plugin-singlefile` inlines everything into one `dist/index.html`)
- **Tailwind CSS v4** — utility styling with a custom `@theme` (fonts, colours, shadows, keyframes)
- Tiny **hash router** (`#/category/laptops`, `#/product/lumen-pro-9`, …) — no router dependency
- `localStorage` for persistence; Pexels CDN for product photography
- Zero runtime dependencies beyond React, `clsx` and `tailwind-merge`

---

## Design tokens

### Fonts
| Role | Font | Weights |
| --- | --- | --- |
| Headings (`font-display`) | **Sora** | 500 / 600 / 700 / 800 |
| Body & UI (`font-sans`) | **Inter** | 400 / 500 / 600 / 700 |

Loaded from Google Fonts in `index.html`. Numeric data uses `font-variant-numeric: tabular-nums` (`.tabular`) so columns line up.

### Colour palette
| Token | Hex | Usage |
| --- | --- | --- |
| `surface` | `#FAFAFA` | Page background |
| Card | `#FFFFFF` + `0 1px 3px rgba(0,0,0,0.06)` shadow, 12 px radius | Cards, tables, modals |
| `brand-500` (primary) | `#F97316` | Add to Compare, compare bar CTA, active states, links |
| `brand-600` | `#EA580C` | Primary hover |
| `best-500` / `best-600` | `#10B981` / `#059669` | "Best value" ✓ badge, win-count pill |
| Best-value row tint | `rgba(16,185,129,0.10)` | Winning cell background |
| `star` | `#F59E0B` | Star ratings |
| `ink` | `#1E293B` | Primary text |
| `ink-muted` | `#64748B` | Secondary text |
| Borders | `slate-200` / `slate-100` | Dividers |

All tokens are defined once in `src/index.css` under `@theme` and used as Tailwind utilities (`bg-brand-500`, `text-ink-muted`, `shadow-card`, `rounded-card`, …). No blues or purples anywhere.

### Motion
- 150–200 ms transitions on hover/focus/colour changes
- Compare bar: 300 ms slide with a soft ease-out curve
- Column removal: 240 ms `grid-template-columns` + opacity/scale collapse
- Page/modals/toasts: short fade/pop keyframes (`animate-fade-in`, `animate-pop-in`, `animate-toast-in`)

---

## How "best value" is decided

Every spec declares its own comparison direction in **`src/data/specConfig.ts`**:

```ts
{ key: "price",   label: "Price",   type: "currency", better: "lower"  }   // cheaper wins
{ key: "battery", label: "Battery", type: "number",   better: "higher", unit: "mAh" }
{ key: "fiveG",   label: "5G",      type: "boolean",  better: "higher" }   // true beats false
{ key: "processor", label: "Processor", type: "text", better: "none"  }   // never highlighted
```

`findBestIndices()` in **`src/utils/compare.ts`** is the single generic algorithm:

1. `better: "none"` → no winner.
2. Normalise values (`boolean → 1/0`, non-numeric → ignored).
3. Fewer than two comparable values → no winner.
4. All values identical → no winner (highlighting every cell is noise).
5. Otherwise pick `max` (higher) or `min` (lower). Partial ties are all highlighted.

`buildComparison()` turns the selected products into grouped rows using only the spec fields they share, and `countWins()` produces the per-product scorecard shown in the table header. The rules legend under the table is derived from the same config, so adding a new spec is a one-line change.

---

## Project structure

```
.
├── index.html                  # Fonts, title, favicon
├── README.md
├── src/
│   ├── main.tsx                # React entry
│   ├── App.tsx                 # Providers, hash router, layout shell
│   ├── index.css               # Tailwind + @theme tokens, keyframes, table CSS
│   ├── types.ts                # Product / Category / SpecField / SavedComparison types
│   ├── data/
│   │   ├── specConfig.ts       # ★ per-field comparison rules (higher / lower / none)
│   │   ├── categories.ts       # Category metadata + Pexels image helper
│   │   └── products.ts         # 24 products × full specs, highlights, mock reviews
│   ├── utils/
│   │   ├── compare.ts          # ★ best-value algorithm, row building, win counts
│   │   ├── format.ts           # Currency / unit / date formatting
│   │   ├── share.ts            # Share-code encode/decode + clipboard helper
│   │   ├── storage.ts          # Safe localStorage wrappers
│   │   └── cn.ts               # clsx + tailwind-merge
│   ├── hooks/
│   │   ├── useHashRoute.ts     # Hash router + navigate()
│   │   └── useLocalStorage.ts  # Persisted state hook
│   ├── context/
│   │   ├── CompareContext.tsx  # Selection (max 4, same category), saved comparisons
│   │   └── ToastContext.tsx    # Notification queue
│   ├── components/
│   │   ├── Navbar.tsx · Footer.tsx · SearchBox.tsx
│   │   ├── ProductCard.tsx · CategoryCard.tsx
│   │   ├── CompareBar.tsx      # Floating bottom bar
│   │   ├── ComparisonTable.tsx # ★ sticky header/column, highlights, collapse animation
│   │   ├── Modal.tsx · Toaster.tsx · Icons.tsx
│   │   └── ui.tsx              # Button, Link, StarRating, Badge, EmptyState, …
│   └── pages/
│       ├── HomePage.tsx · CategoriesPage.tsx · CategoryPage.tsx
│       ├── ProductPage.tsx · ComparePage.tsx · SavedPage.tsx
│       ├── ReviewsPage.tsx · SearchPage.tsx · NotFoundPage.tsx
├── vite.config.ts
└── package.json
```

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Production build → dist/index.html (single self-contained file)
npm run build

# 4. Preview the production build
npm run preview
```

Requires Node 18+. No environment variables or API keys needed.

### Routes
| Hash route | Page |
| --- | --- |
| `#/` | Home |
| `#/categories` | All categories |
| `#/category/:id` | Product grid (`smartphones` · `laptops` · `headphones` · `cameras`) |
| `#/product/:id` | Product detail |
| `#/compare` | Comparison table |
| `#/saved` | Saved comparisons |
| `#/reviews` | Reviews |
| `#/search?q=…` | Search results |
| `#/c/:code` | Opens a shared comparison code |

### localStorage keys
- `specside:compare` — current selection (array of product ids)
- `specside:saved` — saved comparisons (`{ id, name, productIds, categoryId, createdAt }[]`)

---

## Screenshots

> Replace the placeholders below with real captures.

### Desktop
| Home | Comparison table |
| --- | --- |
| ![Desktop – home](docs/screenshots/desktop-home.png) | ![Desktop – compare](docs/screenshots/desktop-compare.png) |

### Mobile
| Product grid + compare bar | Comparison table (horizontal scroll, sticky labels) |
| --- | --- |
| ![Mobile – grid](docs/screenshots/mobile-grid.png) | ![Mobile – compare](docs/screenshots/mobile-compare.png) |

---

## Future improvements

- **Price history tracking** — store daily prices and chart them on the product page; flag "lowest in 90 days".
- **User reviews & ratings submission** — let visitors post reviews (with moderation) instead of static mock data.
- **Connect to real product data APIs** — pull catalogue + pricing from retailer/affiliate APIs, with scheduled refreshes.
- **Weighted scoring** — let users set how much they care about price vs. battery vs. camera and compute a personalised overall score.
- **Cross-category "shared spec" mode** — the engine already supports comparing on the intersection of fields; expose it in the UI.
- **Cloud sync + accounts** — move saved comparisons from `localStorage` to a user account so they follow you across devices.
- **Real share links** — back the share code with a short-link service so links work outside this build.
- **Accessibility pass** — full keyboard navigation audit of the table, reduced-motion preferences, and screen-reader summaries of row winners.
- **Spec diff mode** — a toggle to hide rows where every product is identical and only show differences.
