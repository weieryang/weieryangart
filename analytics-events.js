import { readAttribution, safePagePath, isCommissionPath, safeInterestRoute, analyticsProductSlug } from "./attribution.js";

// ES modules run once per URL; this guard also covers duplicate script tags
// with different cache keys without double-counting views or clicks.
if (!window.__weieryangAnalyticsReady) {
  window.__weieryangAnalyticsReady = true;
  try {
    readAttribution(window.location.href, document.referrer, window.sessionStorage);
  } catch { /* Contact events also work when access to storage is blocked. */ }

  const track = details => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ...details, page_path: safePagePath(window.location.pathname) });
  };

  if (isCommissionPath(window.location.pathname)) {
    track({ event: "commission_view", form_name: "private_commission_brief" });
  }
  const productSlug = analyticsProductSlug(window.location.pathname);
  if (productSlug) {
    track({ event: "product_view", product_slug: productSlug, form_name: "product_inquiry" });
  }

  document.addEventListener("click", event => {
    const link = event.target?.closest?.("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    let target;
    try { target = new URL(href, window.location.href); } catch { return; }

    if (target.protocol === "mailto:") {
      track({ event: "contact_click", contact_method: "email" });
    } else if (target.protocol === "tel:") {
      track({ event: "contact_click", contact_method: "phone" });
    } else if (target.protocol === "https:" && target.hostname === "wa.me") {
      track({ event: "contact_click", contact_method: "whatsapp" });
    } else if (target.origin === window.location.origin && isCommissionPath(target.pathname)) {
      track({ event: "commission_open", interest_route: safeInterestRoute(target.searchParams.get("route")) });
    } else if (target.origin === window.location.origin && target.hash === "#product-inquiry" && analyticsProductSlug(target.pathname)) {
      track({ event: "product_inquiry_open", form_name: "product_inquiry", product_slug: analyticsProductSlug(target.pathname) });
    }
  });
}
