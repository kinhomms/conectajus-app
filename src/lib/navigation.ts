"use client";

import { routes } from "@/lib/routes";

const AUTH_ROUTES = new Set([routes.login, routes.register, routes.resetPassword]);
const SAFE_ROUTE_HISTORY_KEY = "conectajus:safe-route-history";
const SAFE_ROUTE_HISTORY_LIMIT = 12;

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.has(pathname);
}

function readSafeRouteHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(SAFE_ROUTE_HISTORY_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((path): path is string => typeof path === "string") : [];
  } catch {
    return [];
  }
}

function writeSafeRouteHistory(history: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SAFE_ROUTE_HISTORY_KEY, JSON.stringify(history.slice(-SAFE_ROUTE_HISTORY_LIMIT)));
}

export function recordSafeRoute(pathname: string) {
  if (typeof window === "undefined" || isAuthRoute(pathname)) {
    return;
  }

  const history = readSafeRouteHistory();
  const lastPath = history.at(-1);

  if (lastPath === pathname) {
    return;
  }

  writeSafeRouteHistory([...history, pathname]);
}

export function navigateBackSafely(fallbackHref = routes.dashboard) {
  if (typeof window === "undefined") {
    return;
  }

  const currentPath = window.location.pathname;
  const safeRouteHistory = readSafeRouteHistory();
  const previousSafePath = [...safeRouteHistory].reverse().find((path) => path !== currentPath && !isAuthRoute(path));

  window.location.assign(previousSafePath ?? fallbackHref);
}
