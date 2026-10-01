import { useEffect, useState } from "react";

export interface Route {
  /** e.g. "/category/laptops" */
  path: string;
  /** e.g. ["category", "laptops"] */
  segments: string[];
  query: URLSearchParams;
}

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart = ""] = raw.split("?");
  const path = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  return {
    path,
    segments: path.split("/").filter(Boolean).map(decodeURIComponent),
    query: new URLSearchParams(queryPart),
  };
}

/** Programmatic navigation — accepts "/compare" or "#/compare". */
export function navigate(to: string, { replace = false } = {}) {
  const hash = to.startsWith("#") ? to : `#${to}`;
  if (replace) {
    const url = `${window.location.pathname}${window.location.search}${hash}`;
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = hash;
  }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
