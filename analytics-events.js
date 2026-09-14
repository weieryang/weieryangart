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
