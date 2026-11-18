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
const phone = "tel:+8613317178019";
const phoneLabel = "+86 133 1717 8019";
const cssTag = '<link rel="stylesheet" href="/contact-rail.css" data-wy-rail-asset>';
const scriptTag = '<script defer src="/contact-rail.js" data-wy-rail-asset></script>';

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

function action(key, href, label, detail = "", extra = "") {
  return '<a class="wy-contact-action" data-channel="' + key + '" href="' + href + '"' + extra + '>' +
    '<span class="wy-contact-icon">' + icons[key] + '</span>' +
    '<span class="wy-contact-label"><span data-contact-text="' + key + '">' + label + '</span>' +
    (detail ? '<small>' + detail + '</small>' : '') + '</span></a>';
}

export function withContactRail(html) {
  if (html.includes('id="wy-contact-rail"')) return html;
  const canonical = html.match(/<link\b[^>]*\brel="canonical"[^>]*\bhref="(https:\/\/weieryangart\.com\/[^"?#]*)"/i);
  if (!canonical || !html.includes("</body>")) return html;
  const pathname = new URL(canonical[1]).pathname;
  const target = pathname === "/commission/" ? "project-details" : analyticsProductSlug(pathname) ? "product-inquiry" : "";
  const localForm = target ? ' data-form-target="' + target + '"' : "";
  const links = [
    action("inquiry", inquiryDestination(html, pathname), "Project inquiry", "", localForm),
    action("email", email, "Email the studio", businessContact.email),
    action("phone", phone, "Call the studio", phoneLabel),
    action("whatsapp", projectWhatsappHref(pathname), "WhatsApp", "", ' target="_blank" rel="noopener noreferrer"'),
    action("wechat", email + "?subject=WeChat%20contact%20request", "Ask for WeChat by email"),
  ];
  const rail = '<nav id="wy-contact-rail" aria-label="Contact the studio"><details open>' +
    '<summary><span class="wy-contact-toggle-icon">' + icons.inquiry + icons.close + '</span>' +
    '<span data-contact-text="toggle">Contact</span></summary>' +
    '<div class="wy-contact-list">' + links.join("") + '</div></details></nav>';
  return html.replace("</head>", cssTag + "\n</head>")
    .replace("</body>", rail + "\n" + scriptTag + "\n</body>");
}
