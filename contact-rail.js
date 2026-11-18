(() => {
  const rail = document.getElementById("wy-contact-rail");
  if (!rail) return;
  const details = rail.querySelector("details");
  const summary = rail.querySelector("summary");
  const inquiry = rail.querySelector('[data-channel="inquiry"]');
  const compact = window.matchMedia("(max-width: 860px), (max-height: 540px)");
  const text = {
    en: { nav: "Contact the studio", toggle: "Contact", close: "Close contacts", inquiry: "Project inquiry", email: "Email the studio", phone: "Call the studio", whatsapp: "WhatsApp", wechat: "Ask for WeChat by email" },
    zh: { nav: "联系威尔阳", toggle: "联系我们", close: "收起联系方式", inquiry: "提交项目询盘", email: "发送邮件", phone: "拨打电话", whatsapp: "WhatsApp", wechat: "发邮件索取微信号" },
    fr: { nav: "Contacter le studio", toggle: "Contact", close: "Fermer les contacts", inquiry: "Parler de votre projet", email: "Écrire au studio", phone: "Appeler le studio", whatsapp: "WhatsApp", wechat: "Demander le contact WeChat par e-mail" },
    de: { nav: "Studio kontaktieren", toggle: "Kontakt", close: "Kontakte schließen", inquiry: "Projekt anfragen", email: "E-Mail schreiben", phone: "Studio anrufen", whatsapp: "WhatsApp", wechat: "WeChat-Kontakt per E-Mail erfragen" },
    es: { nav: "Contactar con el estudio", toggle: "Contacto", close: "Cerrar contactos", inquiry: "Consultar un proyecto", email: "Enviar un correo", phone: "Llamar al estudio", whatsapp: "WhatsApp", wechat: "Pedir el contacto de WeChat por correo" },
    ar: { nav: "تواصل مع الاستوديو", toggle: "تواصل معنا", close: "إغلاق جهات الاتصال", inquiry: "استفسار عن مشروع", email: "راسل الاستوديو", phone: "اتصل بالاستوديو", whatsapp: "واتساب", wechat: "اطلب حساب وي تشات بالبريد" },
  };
  function labels() {
    const copy = text[document.documentElement.lang.toLowerCase().split("-")[0]] || text.en;
    rail.setAttribute("aria-label", copy.nav);
    for (const node of rail.querySelectorAll("[data-contact-text]")) {
      const key = node.dataset.contactText;
      node.textContent = key === "toggle" && details.open ? copy.close : copy[key];
    }
  }
  function setLayout() { details.open = !compact.matches; labels(); }
  setLayout();
  compact.addEventListener("change", setLayout);
  details.addEventListener("toggle", labels);
  new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  document.addEventListener("pointerdown", (event) => {
    if (compact.matches && details.open && !rail.contains(event.target)) details.open = false;
  });
  rail.addEventListener("focusout", (event) => {
    if (compact.matches && details.open && event.relatedTarget && !rail.contains(event.relatedTarget)) details.open = false;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && compact.matches && details.open) {
      details.open = false;
      summary.focus({ preventScroll: true });
    }
  });
  const targetId = inquiry.dataset.formTarget;
  function linkLocalForm() {
    if (!document.getElementById(targetId)) return false;
    inquiry.setAttribute("href", "#" + targetId);
    return true;
  }
  if (targetId && !linkLocalForm()) {
    const root = document.getElementById("root");
    if (root) {
      const observer = new MutationObserver(() => { if (linkLocalForm()) observer.disconnect(); });
      observer.observe(root, { childList: true, subtree: true });
    }
  }
  rail.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    if (compact.matches) details.open = false;
    const name = link === inquiry && targetId && document.getElementById(targetId)?.querySelector('input[name="name"]');
    if (name) {
      event.preventDefault();
      name.focus({ preventScroll: true });
      name.scrollIntoView({ block: "center", behavior: "instant" });
    }
  });
})();
