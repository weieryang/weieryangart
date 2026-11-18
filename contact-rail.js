(() => {
  const rail = document.getElementById("wy-contact-rail");
  if (!rail) return;
  const details = rail.querySelector("details");
  const summary = rail.querySelector("summary");
  const inquiry = rail.querySelector('[data-channel="inquiry"]');
  const wechat = rail.querySelector(".wy-wechat");
  const number = wechat?.querySelector("input");
  const copyButton = wechat?.querySelector("[data-wy-copy]");
  const feedback = wechat?.querySelector('[role="status"]');
  const compact = window.matchMedia("(max-width: 860px), (max-height: 540px)");
  const text = {
    en: { nav: "Contact the studio", toggle: "Contact", close: "Close contacts", inquiry: "Project inquiry", email: "Email the studio", phone: "Call the studio", whatsapp: "WhatsApp",
      wechat: "WeChat", find: "Search this number in WeChat", copy: "Copy number", copied: "Number copied.", manual: "Number selected. Copy it manually." },
    zh: { nav: "联系威尔阳", toggle: "联系我们", close: "收起联系方式", inquiry: "提交项目询盘", email: "发送邮件", phone: "拨打电话", whatsapp: "WhatsApp",
      wechat: "微信", find: "在微信「添加朋友」中搜索此手机号", copy: "复制微信号", copied: "微信号已复制", manual: "号码已选中，请手动复制。" },
    fr: { nav: "Contacter le studio", toggle: "Contact", close: "Fermer les contacts", inquiry: "Parler de votre projet", email: "Écrire au studio", phone: "Appeler le studio", whatsapp: "WhatsApp",
      wechat: "WeChat", find: "Recherchez ce numéro dans WeChat", copy: "Copier le numéro", copied: "Numéro copié.", manual: "Numéro sélectionné. Copiez-le manuellement." },
    de: { nav: "Studio kontaktieren", toggle: "Kontakt", close: "Kontakte schließen", inquiry: "Projekt anfragen", email: "E-Mail schreiben", phone: "Studio anrufen", whatsapp: "WhatsApp",
      wechat: "WeChat", find: "Diese Nummer in WeChat suchen", copy: "Nummer kopieren", copied: "Nummer kopiert.", manual: "Nummer ausgewählt. Bitte manuell kopieren." },
    es: { nav: "Contactar con el estudio", toggle: "Contacto", close: "Cerrar contactos", inquiry: "Consultar un proyecto", email: "Enviar un correo", phone: "Llamar al estudio", whatsapp: "WhatsApp",
      wechat: "WeChat", find: "Busca este número en WeChat", copy: "Copiar el número", copied: "Número copiado.", manual: "Número seleccionado. Cópialo manualmente." },
    ar: { nav: "تواصل مع الاستوديو", toggle: "تواصل معنا", close: "إغلاق جهات الاتصال", inquiry: "استفسار عن مشروع", email: "راسل الاستوديو", phone: "اتصل بالاستوديو", whatsapp: "واتساب",
      wechat: "وي تشات", find: "ابحث عن هذا الرقم في وي تشات", copy: "نسخ الرقم", copied: "تم نسخ الرقم.", manual: "تم تحديد الرقم. انسخه يدويًا." },
  };
  function currentText() { return text[document.documentElement.lang.toLowerCase().split("-")[0]] || text.en; }
  function labels() {
    const copy = currentText();
    rail.setAttribute("aria-label", copy.nav);
    for (const node of rail.querySelectorAll("[data-contact-text]")) {
      const key = node.dataset.contactText;
      if (key === "wechat" && !wechat) continue;
      node.textContent = key === "toggle" && details.open ? copy.close : copy[key];
    }
  }
  function closeWechat() { if (wechat) wechat.open = false; }
  function setLayout() { closeWechat(); details.open = !compact.matches; labels(); }
  setLayout();
  compact.addEventListener("change", setLayout);
  details.addEventListener("toggle", () => {
    if (!details.open) closeWechat();
    labels();
  });
  new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  function dismissOutside(target) {
    if (!target || rail.contains(target)) return;
    closeWechat();
    if (compact.matches) details.open = false;
  }
  // Closing the bottom-anchored panel before an inside click moves its target.
  document.addEventListener("pointerdown", event => dismissOutside(event.target));
  rail.addEventListener("focusout", event => dismissOutside(event.relatedTarget));
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (wechat?.open) {
      closeWechat();
      wechat.querySelector("summary").focus({ preventScroll: true });
    } else if (compact.matches && details.open) {
      details.open = false;
      summary.focus({ preventScroll: true });
    }
  });
  if (copyButton) {
    copyButton.hidden = false;
    wechat.addEventListener("toggle", () => { feedback.textContent = ""; });
    copyButton.addEventListener("click", async () => {
      let copied = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(number.value);
          copied = true;
        } catch { /* The number can still be selected and copied by hand. */ }
      }
      if (!wechat.open || !details.open) return;
      if (!copied) {
        number.focus({ preventScroll: true });
        number.select();
        number.setSelectionRange(0, number.value.length);
        try { copied = Boolean(document.execCommand?.("copy")); } catch { /* Keep the selection. */ }
        if (copied) copyButton.focus({ preventScroll: true });
      }
      feedback.textContent = currentText()[copied ? "copied" : "manual"];
    });
  }
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
    closeWechat();
    if (compact.matches) details.open = false;
    const name = link === inquiry && targetId && document.getElementById(targetId)?.querySelector('input[name="name"]');
    if (name) {
      event.preventDefault();
      name.focus({ preventScroll: true });
      name.scrollIntoView({ block: "center", behavior: "instant" });
    }
  });
})();
