import { useEffect, type ReactNode } from "react";
import { ToastProvider, useToast } from "./context/ToastContext";
import { CompareProvider, useCompare } from "./context/CompareContext";
import { navigate, useHashRoute, type Route } from "./hooks/useHashRoute";
import { decodeShareCode } from "./utils/share";
import { cn } from "./utils/cn";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CompareBar } from "./components/CompareBar";
import { Toaster } from "./components/Toaster";
import { HomePage } from "./pages/HomePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductPage } from "./pages/ProductPage";
import { ComparePage } from "./pages/ComparePage";
import { SavedPage } from "./pages/SavedPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { SearchPage } from "./pages/SearchPage";
import { NotFoundPage } from "./pages/NotFoundPage";

/* ------------------------------------------------------------------ */
/*  Route table (hash based: #/category/laptops, #/product/lumen-pro-9) */
/* ------------------------------------------------------------------ */
function renderRoute(route: Route): ReactNode {
  const [first, second] = route.segments;
  switch (first) {
    case undefined:
      return <HomePage />;
    case "categories":
      return <CategoriesPage />;
    case "category":
      return second ? <CategoryPage categoryId={second} /> : <CategoriesPage />;
    case "product":
      return second ? <ProductPage productId={second} /> : <NotFoundPage />;
    case "compare":
      return <ComparePage />;
    case "saved":
      return <SavedPage />;
    case "reviews":
      return <ReviewsPage />;
    case "search":
      return <SearchPage query={route.query.get("q") ?? ""} />;
    case "c":
      // Shared-link landing — resolved in <Shell>, show the compare page meanwhile
      return <ComparePage />;
    default:
      return <NotFoundPage />;
  }
}

function Shell() {
  const route = useHashRoute();
  const { load, count } = useCompare();
  const { toast } = useToast();

  // Scroll to top whenever the path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.path]);

  // Resolve simulated share links: #/c/<code> → load products → /compare
  useEffect(() => {
    if (route.segments[0] !== "c") return;
    const code = route.segments[1] ?? "";
    const ids = decodeShareCode(code);
    if (ids.length > 0) {
      load(ids, { silent: true });
      toast({ title: "Opened shared comparison", description: `${ids.length} products loaded from code ${code.toUpperCase()}.`, variant: "success" });
    } else {
      toast({ title: "That share code isn't valid", variant: "warning" });
    }
    navigate("/compare", { replace: true });
  }, [route.path, route.segments, load, toast]);

  const barVisible = count > 0 && !route.path.startsWith("/compare");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar path={route.path} />
      <main className={cn("flex-1 transition-[padding] duration-300", barVisible && "pb-24 sm:pb-28")} key={route.path}>
        {renderRoute(route)}
      </main>
      <Footer />
      <CompareBar path={route.path} />
      <Toaster raised={barVisible} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CompareProvider>
        <Shell />
      </CompareProvider>
    </ToastProvider>
  );
}
