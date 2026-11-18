import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ChatCircleDots } from "@phosphor-icons/react/dist/ssr/ChatCircleDots";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { WechatLogo } from "@phosphor-icons/react/dist/ssr/WechatLogo";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { businessContact } from "../src/content.js";
import { analyticsProductSlug, safeInterestRoute } from "../src/attribution.js";
import { projectWhatsappHref } from "../src/projectContact.js";

const icons = Object.fromEntries(Object.entries({
  inquiry: ChatCircleDots, email: EnvelopeSimple, phone: Phone,
  whatsapp: WhatsappLogo, wechat: WechatLogo, close: X,
}).map(([key, Icon]) => [key, renderToStaticMarkup(createElement(Icon, {
  size: 24, weight: "regular", "aria-hidden": true, focusable: "false",
}))]));

const email = "mailto:" + businessContact.email;
const studioMobile = "13317178019";
const phone = "tel:+86" + studioMobile;
const phoneLabel = "+86 " + studioMobile.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1 $2 $3");
const cssTag = '<link rel="stylesheet" href="/contact-rail.css?v=2" data-wy-rail-asset>';
const scriptTag = '<script defer src="/contact-rail.js?v=2" data-wy-rail-asset></script>';

function inquiryDestination(html, pathname) {
  // Use the buyer-facing brief in the page body, before the generic site footer.
  if (pathname === "/commission/") return email + "?subject=Sculpture%20project%20inquiry";
  const body = html.split(/<body\b[^>]*>/i).pop()
    .replace(/<(header|footer)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  for (const match of body.matchAll(/<a\b[^>]*\bhref=["']\/commission\/\?route=([a-z0-9-]+)["']/gi)) {
    if (safeInterestRoute(match[1])) return "/commission/?route=" + match[1];
  }
  return "/commission/";
}

function iconLabel(key, label, detail = "") {
  return '<span class="wy-contact-icon">' + icons[key] + '</span>' +
    '<span class="wy-contact-label"><span data-contact-text="' + key + '">' + label + '</span>' +
    (detail ? '<small>' + detail + '</small>' : '') + '</span>';
}

function action(key, href, label, detail = "", extra = "") {
  return '<a class="wy-contact-action" data-channel="' + key + '" href="' + href + '"' + extra + '>' +
    iconLabel(key, label, detail) + '</a>';
}

const wechat = '<details class="wy-wechat"><summary class="wy-contact-action" data-channel="wechat">' +
  iconLabel("wechat", "WeChat") + '</summary><div class="wy-wechat-panel">' +
  '<label for="wy-wechat-number" data-contact-text="find">Search this number in WeChat</label>' +
  '<input id="wy-wechat-number" type="text" dir="ltr" readonly inputmode="none" value="' + studioMobile + '">' +
  '<button type="button" data-wy-copy hidden data-contact-text="copy">Copy number</button>' +
  '<span role="status" class="wy-wechat-status"></span></div></details>';

export function withContactRail(html) {
  const canonical = html.match(/<link\b[^>]*\brel="canonical"[^>]*\bhref="(https:\/\/weieryangart\.com\/[^"?#]*)"/i);
  if (!canonical || !html.includes("</body>")) return html;
  // Refresh a previously generated rail without changing the site's other markup.
  html = html.replace(/<nav id="wy-contact-rail"[^>]*>[\s\S]*?<\/nav>\n?/, "")
    .replace(/<link\b[^>]*\bdata-wy-rail-asset>\n?/, "")
    .replace(/<script\b[^>]*\bdata-wy-rail-asset><\/script>\n?/, "");
  const pathname = new URL(canonical[1]).pathname;
  const target = pathname === "/commission/" ? "project-details" : analyticsProductSlug(pathname) ? "product-inquiry" : "";
  const localForm = target ? ' data-form-target="' + target + '"' : "";
  const links = [
    action("inquiry", inquiryDestination(html, pathname), "Project inquiry", "", localForm),
    action("email", email, "Email the studio", businessContact.email),
    action("phone", phone, "Call the studio", phoneLabel),
    action("whatsapp", projectWhatsappHref(pathname), "WhatsApp", "", ' target="_blank" rel="noopener noreferrer"'),
    wechat,
  ];
  const rail = '<nav id="wy-contact-rail" aria-label="Contact the studio"><details open>' +
    '<summary><span class="wy-contact-toggle-icon">' + icons.inquiry + icons.close + '</span>' +
    '<span data-contact-text="toggle">Contact</span></summary>' +
    '<div class="wy-contact-list">' + links.join("") + '</div></details></nav>';
  return html.replace("</head>", cssTag + "\n</head>")
    .replace("</body>", rail + "\n" + scriptTag + "\n</body>");
}
