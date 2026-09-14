const attributionKey = "weieryang-attribution-v1";

try {
  if (!window.sessionStorage.getItem(attributionKey)) {
    const url = new URL(window.location.href);
    const referrer = document.referrer ? new URL(document.referrer) : null;
    window.sessionStorage.setItem(attributionKey, JSON.stringify({
      landingPath: url.pathname,
      referrerHost: referrer && referrer.origin !== url.origin ? referrer.hostname : "",
      utmSource: url.searchParams.get("utm_source") || "",
      utmMedium: url.searchParams.get("utm_medium") || "",
      utmCampaign: url.searchParams.get("utm_campaign") || "",
    }));
  }
} catch {
  // The form can still be submitted when session storage is unavailable.
}

if (window.location.pathname === "/commission/") {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "commission_view" });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest?.("a[href]");
  if (!link) return;

  const href = link.getAttribute("href") || "";
  let name;
  let method;
  if (href.startsWith("mailto:")) {
    name = "contact_click";
    method = "email";
  } else if (/^https:\/\/wa\.me\//i.test(href)) {
    name = "contact_click";
    method = "whatsapp";
  } else if (new URL(href, location.href).pathname === "/commission/") {
    name = "commission_open";
  }

  if (!name) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...(method ? { contact_method: method } : {}) });
});
