"use client";

import { routes } from "@/lib/routes";

const AUTH_ROUTES = new Set([routes.login, routes.register]);

export function navigateBackSafely(fallbackHref = routes.dashboard) {
  if (typeof window === "undefined") {
    return;
  }

  const referrer = document.referrer ? new URL(document.referrer, window.location.origin) : null;
  const sameOriginReferrer = referrer?.origin === window.location.origin ? referrer : null;

  if (!sameOriginReferrer || AUTH_ROUTES.has(sameOriginReferrer.pathname) || window.history.length <= 1) {
    window.location.assign(fallbackHref);
    return;
  }

  window.history.back();
}
