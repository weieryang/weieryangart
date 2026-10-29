(function () {
  "use strict";
  if (window.wyAdsConsent) return;
  var storageKey = "weieryang-ads-measurement-consent-v1";
  var lifetime = 180 * 24 * 60 * 60 * 1000;
  var choice = null;
  var saved = false;
  var panel;
  var settings;
  var open = false;
  var listeners = [];
  var copy = {
    en: { title: "Advertising measurement is optional", body: "Allow Google Ads to measure visits and confirmed inquiries. Personalized ads stay off. Existing website analytics follows our privacy notice.", allow: "Allow measurement", reject: "Keep Ads off", later: "Later", settings: "Ads privacy settings", settingsOff: "Ads measurement off · Settings", settingsOn: "Ads measurement on · Settings", privacy: "Privacy notice", on: "Ads measurement is allowed.", off: "Ads measurement is off.", unsaved: "This choice could not be saved. It applies to this page only; you may be asked again on your next page." },
    zh: { title: "广告效果测量由你选择", body: "可允许 Google Ads 测量访问与已确认提交的询盘。个性化广告保持关闭，原有网站分析按隐私说明继续使用。", allow: "允许效果测量", reject: "保持广告测量关闭", later: "稍后决定", settings: "广告隐私设置", settingsOff: "广告测量关闭 · 设置", settingsOn: "广告测量开启 · 设置", privacy: "隐私说明", on: "已允许广告效果测量。", off: "广告效果测量已关闭。", unsaved: "此选择无法保存，仅在当前页面生效。进入下一页时可能需要重新选择。" },
    ar: { title: "قياس الإعلانات اختياري", body: "اسمح لـ Google Ads بقياس الزيارات والاستفسارات المؤكدة. تبقى الإعلانات المخصصة معطلة. يستمر تحليل الموقع الحالي وفق إشعار الخصوصية.", allow: "السماح بالقياس", reject: "إبقاء القياس معطلاً", later: "لاحقاً", settings: "خصوصية الإعلانات", settingsOff: "قياس الإعلانات معطل · الإعدادات", settingsOn: "قياس الإعلانات مفعل · الإعدادات", privacy: "إشعار الخصوصية", on: "قياس الإعلانات مسموح.", off: "قياس الإعلانات معطل.", unsaved: "تعذر حفظ هذا الاختيار. يسري على هذه الصفحة فقط، وقد يُطلب منك الاختيار مجدداً في الصفحة التالية." },
    fr: { title: "La mesure publicitaire est facultative", body: "Autorisez Google Ads à mesurer les visites et les demandes confirmées. Les publicités personnalisées restent désactivées. L’analyse actuelle du site suit notre notice de confidentialité.", allow: "Autoriser la mesure", reject: "Garder la mesure désactivée", later: "Plus tard", settings: "Confidentialité publicitaire", settingsOff: "Mesure publicitaire désactivée · Réglages", settingsOn: "Mesure publicitaire activée · Réglages", privacy: "Notice de confidentialité", on: "La mesure publicitaire est autorisée.", off: "La mesure publicitaire est désactivée.", unsaved: "Ce choix n’a pas pu être enregistré. Il vaut uniquement pour cette page ; une nouvelle demande peut apparaître à la page suivante." },
    es: { title: "La medición publicitaria es opcional", body: "Permita que Google Ads mida las visitas y las consultas confirmadas. Los anuncios personalizados siguen desactivados. La analítica actual del sitio sigue nuestro aviso de privacidad.", allow: "Permitir la medición", reject: "Mantener la medición desactivada", later: "Más tarde", settings: "Privacidad publicitaria", settingsOff: "Medición publicitaria desactivada · Ajustes", settingsOn: "Medición publicitaria activada · Ajustes", privacy: "Aviso de privacidad", on: "La medición publicitaria está permitida.", off: "La medición publicitaria está desactivada.", unsaved: "No se pudo guardar esta elección. Solo se aplica a esta página; puede que se le vuelva a preguntar en la siguiente." },
    de: { title: "Werbemessung ist freiwillig", body: "Erlauben Sie Google Ads, Besuche und bestätigte Anfragen zu messen. Personalisierte Werbung bleibt aus. Die bestehende Websiteanalyse folgt unserem Datenschutzhinweis.", allow: "Messung erlauben", reject: "Werbemessung ausgeschaltet lassen", later: "Später", settings: "Werbe-Datenschutzeinstellungen", settingsOff: "Werbemessung aus · Einstellungen", settingsOn: "Werbemessung an · Einstellungen", privacy: "Datenschutzhinweis", on: "Werbemessung ist erlaubt.", off: "Werbemessung ist ausgeschaltet.", unsaved: "Diese Auswahl konnte nicht gespeichert werden. Sie gilt nur für diese Seite; auf der nächsten Seite werden Sie möglicherweise erneut gefragt." }
  };
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  function googleState(allowed) {
    return { ad_storage: allowed ? "granted" : "denied", ad_user_data: allowed ? "granted" : "denied", ad_personalization: "denied" };
  }
  // This synchronous file precedes the GTM loader on every public page.
  window.gtag("consent", "default", googleState(false));
  window.gtag("set", "ads_data_redaction", true);
  window.dataLayer.push({ wy_ads_measurement: false });
  try {
    var record = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    var now = Date.now();
    if (record && record.v === 1 && (record.choice === "granted" || record.choice === "denied") &&
        Number.isFinite(record.savedAt) && Number.isFinite(record.expiresAt) &&
        record.savedAt <= now && record.expiresAt > now && record.expiresAt - record.savedAt === lifetime) {
      choice = record.choice === "granted";
      saved = true;
    }
  } catch (_) { /* Unknown, damaged or inaccessible storage never grants consent. */ }
  function snapshot() { return { allowed: choice === true, choice: choice, saved: saved }; }
  function publish(allowed) {
    if (!allowed) window.dataLayer.push({ wy_ads_measurement: false });
    window.gtag("consent", "update", googleState(allowed));
    if (allowed) window.dataLayer.push({ event: "wy_ads_measurement_ready", wy_ads_measurement: true });
    listeners.slice().forEach(function (listener) {
      try { listener(snapshot()); } catch (_) { /* A subscriber cannot change the visitor's choice. */ }
    });
  }
  if (choice === true) publish(true);
  function language() {
    var lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
    return Object.prototype.hasOwnProperty.call(copy, lang) ? lang : "en";
  }
  function labels() { return copy[language()]; }
  function setOpen(next, restoreFocus) {
    open = next === true;
    if (panel) panel.hidden = !open;
    if (settings) {
      settings.hidden = open;
      settings.setAttribute("aria-expanded", String(open));
      if (restoreFocus && !open) settings.focus();
    }
  }
  function render() {
    if (!panel || !settings) return;
    var text = labels();
    panel.lang = language();
    panel.dir = language() === "ar" ? "rtl" : "ltr";
    settings.lang = panel.lang;
    settings.dir = panel.dir;
    panel.querySelector("[data-wy-ads-title]").textContent = text.title;
    panel.querySelector("[data-wy-ads-body]").textContent = text.body;
    panel.querySelector("[data-wy-ads-allow]").textContent = text.allow;
    panel.querySelector("[data-wy-ads-reject]").textContent = text.reject;
    panel.querySelector("[data-wy-ads-later]").textContent = text.later;
    panel.querySelector("[data-wy-ads-privacy]").textContent = text.privacy;
    var status = panel.querySelector("[data-wy-ads-status]");
    status.textContent = choice === null ? "" : (choice ? text.on : text.off) + (!saved ? " " + text.unsaved : "");
    status.hidden = !status.textContent;
    settings.textContent = choice === true ? text.settingsOn : text.settingsOff;
  }
  function choose(allowed) {
    if (allowed !== true && allowed !== false) return snapshot();
    var changed = choice !== allowed;
    choice = allowed;
    saved = false;
    var time = Date.now();
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ v: 1, choice: allowed ? "granted" : "denied", savedAt: time, expiresAt: time + lifetime }));
      saved = true;
    } catch (_) { /* The genuine choice applies now, but is not represented as saved. */ }
    if (changed) publish(allowed);
    render();
    // Show an honest storage warning when persistence is unavailable.
    if (saved) setOpen(false, true);
    return snapshot();
  }
  function mount() {
    if (settings || !document.body) return;
    panel = document.createElement("aside");
    panel.id = "wy-ads-consent-panel";
    panel.className = "wy-ads-consent";
    panel.setAttribute("aria-labelledby", "wy-ads-consent-title");
    panel.innerHTML = '<h2 id="wy-ads-consent-title" data-wy-ads-title></h2><p data-wy-ads-body></p><p class="wy-ads-consent-status" data-wy-ads-status role="status" hidden></p><div class="wy-ads-consent-actions"><button type="button" data-wy-ads-allow></button><button type="button" data-wy-ads-reject></button><button type="button" class="wy-ads-consent-later" data-wy-ads-later></button></div><a href="/privacy/#advertising-measurement" data-wy-ads-privacy></a>';
    settings = document.createElement("button");
    settings.type = "button";
    settings.className = "wy-ads-settings";
    settings.setAttribute("aria-controls", panel.id);
    settings.setAttribute("aria-expanded", "false");
    settings.addEventListener("click", function () { setOpen(true); render(); });
    panel.querySelector("[data-wy-ads-allow]").addEventListener("click", function () { choose(true); });
    panel.querySelector("[data-wy-ads-reject]").addEventListener("click", function () { choose(false); });
    panel.querySelector("[data-wy-ads-later]").addEventListener("click", function () { setOpen(false, true); });
    document.body.appendChild(panel);
    document.body.appendChild(settings);
    render();
    // Unknown consent remains denied. The full optional panel opens only when
    // requested, so it cannot automatically cover a buyer's project entry.
    setOpen(false);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && open) setOpen(false, true);
    });
    // A buyer can start a brief immediately without answering the optional notice.
    document.addEventListener("focusin", function (event) {
      if (open && event.target && event.target.closest && event.target.closest("form")) setOpen(false);
    });
    if (typeof MutationObserver !== "undefined") new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "dir"] });
  }
  window.wyAdsConsent = Object.freeze({
    getState: snapshot,
    choose: choose,
    openSettings: function () { setOpen(true); render(); },
    onChange: function (listener) {
      if (typeof listener !== "function") return function () {};
      listeners.push(listener);
      return function () { listeners = listeners.filter(function (entry) { return entry !== listener; }); };
    }
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
