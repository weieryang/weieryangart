import { useEffect, useMemo, useRef, useState } from "react";
import { useHeroPlayer } from "./useHeroPlayer.js";
import { HotelEngineeringCases } from "./HotelEngineeringCases.jsx";
import { SculptureCollection, SculptureCollectionPreview, SculptureDetail } from "./SculptureCatalog.jsx";
import { catalogUi } from "./sculptureCatalogCopy.js";
import { heroStatus } from "./hotelCases.js";
import {
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  Check,
  EnvelopeSimple,
  FileArrowUp,
  GlobeHemisphereWest,
  List,
  Moon,
  SpinnerGap,
  Sun,
  WarningCircle,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import logoPrimaryAsset from "./assets/weieryang-w-logo.webp";
import studioDeskAsset from "./assets/studio-material-desk.webp";
import heroPlazaDayAsset from "./assets/hero-plaza-day-v3.webp";
import heroPlazaDuskAsset from "./assets/hero-plaza-dusk-v3.webp";
import conceptSketchAsset from "./assets/concept-sketch.webp";
import materialSamplesAsset from "./assets/material-samples-dark.webp";
import structuralStudyAsset from "./assets/structural-engineering.webp";
import fabricationWorkshopAsset from "./assets/fabrication-workshop.webp";
import designDevelopmentAsset from "./assets/design-development.webp";
import middleEastInstallationAsset from "./assets/cases/middle-east-site-installation.webp";
import structuralAssemblyAsset from "./assets/cases/structural-assembly.webp";
import wingSlatInstallationAsset from "./assets/cases/wing-slat-installation.webp";
import { businessContact, copy, emailBriefActions, emailBriefCopy, languageOptions, routeKeys } from "./content.js";
import { createInquiryEmail } from "./inquiryEmail.js";
import { fieldLimits, restoreInquiryDraft, validateInquiryField, validateInquiry, sendInquiry } from "./inquiryForm.js";
import { inquiryFormCopy } from "./inquiryFormCopy.js";
import { readAttribution, inquirySource, safeInterestRoute, analyticsAttribution, analyticsProjectType } from "./attribution.js";
import { routeSeoContent } from "./seoContent.js";
import { hospitalityEntry, hospitalityPlanning, hospitalitySections, privacyCopy } from "./hospitalityContent.js";
import { commissionEvidenceImage, commissionProof } from "./commissionProof.js";
import { productInquiryContext, productInquiryDraftKey, productInquiryDraft, productInquiryForm, inquiryEventContext } from "./productInquiry.js";
import { productInquiryCopy } from "./productInquiryCopy.js";


function assetUrl(asset) {
  if (typeof asset === "string") return asset;
  if (typeof asset?.src === "string") return asset.src;
  if (typeof asset?.default === "string") return asset.default;
  if (typeof asset?.default?.src === "string") return asset.default.src;
  return "";
}

const logoPrimary = assetUrl(logoPrimaryAsset);
const studioDesk = assetUrl(studioDeskAsset);
const heroPlazaDay = assetUrl(heroPlazaDayAsset);
const heroPlazaDusk = assetUrl(heroPlazaDuskAsset);
// Same approved v3 file as the HTML preload; do not download a second hashed URL.
const heroPlazaNight = "/seo-media/hero-plaza-night-v3.webp";
const heroSources = { day: heroPlazaDay, dusk: heroPlazaDusk, night: heroPlazaNight };
const conceptSketch = assetUrl(conceptSketchAsset);
const materialSamples = assetUrl(materialSamplesAsset);
const structuralStudy = assetUrl(structuralStudyAsset);
const fabricationWorkshop = assetUrl(fabricationWorkshopAsset);
const designDevelopment = assetUrl(designDevelopmentAsset);
const middleEastInstallation = assetUrl(middleEastInstallationAsset);
const structuralAssembly = assetUrl(structuralAssemblyAsset);
const wingSlatInstallation = assetUrl(wingSlatInstallationAsset);

const languageSessionKey = "weieryang-session-language-v3";
const draftStorageKey = "weieryang-private-brief-v2";
const fileLimit = 5;
const fileSizeLimit = 10 * 1024 * 1024;
const totalFileSizeLimit = 15 * 1024 * 1024;
const allowedExtensions = ["pdf", "jpg", "jpeg", "png", "webp", "dwg"];
const selectPrompts = { en: "Select", ar: "اختر", zh: "请选择", fr: "Sélectionner", es: "Seleccionar", de: "Auswählen" };
const deliveryCopy = {
  en: { success: "Your project facts and attached files were emailed to the studio for private review.", total: "15 MB total." },
  ar: { success: "أُرسلت تفاصيل المشروع والملفات المرفقة إلى الاستوديو للمراجعة الخاصة.", total: "15 ميغابايت إجمالاً." },
  zh: { success: "项目资料及附件已发送至工作室邮箱，供私下评估。", total: "总计不超过 15 MB。" },
  fr: { success: "Votre dossier et ses pièces jointes ont été envoyés au studio pour une revue privée.", total: "15 Mo au total." },
  es: { success: "Los datos y archivos adjuntos se enviaron al estudio para una revisión privada.", total: "15 MB en total." },
  de: { success: "Ihre Projektdaten und Anhänge wurden zur vertraulichen Prüfung an das Studio gesendet.", total: "Insgesamt 15 MB." },
};
const inquiryEndpoint = "https://weieryang-inquiries.tangkelian.workers.dev/inquiries";
const turnstileSiteKey = "0x4AAAAAAEzYccCqGEUTAOhH";

const routeImages = {
  "garden-sculpture": conceptSketch,
  "public-art": structuralStudy,
  "resort-sculpture": studioDesk,
  "water-feature-sculpture": materialSamples,
  "bronze-sculpture": materialSamples,
  "stainless-steel-sculpture": structuralStudy,
  "stone-sculpture": conceptSketch,
  "custom-sculpture": designDevelopment,
  projects: middleEastInstallation,
  process: fabricationWorkshop,
  materials: materialSamples,
  faq: studioDesk,
};

const routeHeroMedia = {
  "resort-sculpture": {
    src: "/seo-media/resort-entrance-canopy-sculpture-reference.webp",
    width: 1600,
    height: 900,
    alt: "Two supplied landscape canopy sculpture references showing planting, building and construction context",
    caption: "Supplied landscape references for scale and site review; they are not presented as completed WEIERYANG resort commissions.",
  },
};

function responsiveMedia(src, width) {
  if (!src.startsWith("/seo-media/") || !src.endsWith(".webp")) return {};
  const candidates = [640, 960].filter(size => size < width).map(size => `${src.replace(/\.webp$/, `-${size}w.webp`)} ${size}w`);
  return { srcSet: [...candidates, `${src} ${width}w`].join(", "), sizes: "(max-width: 820px) calc(100vw - 36px), 60vw" };
}

function currentPath() {
  if (typeof window === "undefined") return "";
  return window.location.pathname.replace(/\/index\.html$/, "").replace(/^\/+|\/+$/g, "");
}

function initialLanguage() {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.sessionStorage.getItem(languageSessionKey);
    if (copy[stored]) return stored;
  } catch {
    return "en";
  }
  return "en";
}

function inquiryAttribution() {
  if (typeof window === "undefined") return {};
  let storage;
  try { storage = window.sessionStorage; } catch { /* Storage is optional. */ }
  return readAttribution(window.location.href, document.referrer, storage);
}

function navigate(path) {
  if (typeof window !== "undefined") window.location.href = path;
}

function homeAnchor(id) {
  const path = currentPath();
  if (!path) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  navigate(`/#${id}`);
}

function whatsappHref(message) {
  return `https://wa.me/${businessContact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function LanguageSelect({ language, setLanguage, compact = false }) {
  return (
    <label className={`language-select${compact ? " is-compact" : ""}`}>
      <GlobeHemisphereWest size={17} aria-hidden="true" />
      <span className="sr-only">Language</span>
      <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Language">
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {compact ? option.short : option.label}
          </option>
        ))}
      </select>
      <CaretDown size={14} aria-hidden="true" />
    </label>
  );
}

function SiteHeader({ language, setLanguage, text }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeMenu = () => setMenuOpen(false);
  const nav = [
    { label: text.nav.projects, id: "projects" },
    { label: (catalogUi[language] || catalogUi.en).nav, href: "/sculptures/" },
    { label: text.hero.routes[0], href: "/resort-sculpture/" },
    { label: text.nav.materials, id: "materials" },
    { label: text.nav.process, id: "process" },
    { label: text.nav.studio, id: "studio" },
    { label: text.nav.insights || "Insights", href: "/insights/" },
  ];

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (!menuOpen) return () => document.body.classList.remove("menu-open");
    const menu = menuRef.current;
    const header = menu.closest("header");
    const background = [...header.children, ...header.parentElement.children]
      .filter(element => element !== menu && element !== header);
    const previousInert = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    const focusable = () => [...menu.querySelectorAll('a[href], button, select')].filter(element => !element.disabled);
    const focusMenu = () => {
      if (menu.contains(document.activeElement)) return;
      menu.getBoundingClientRect();
      menu.querySelector(".mobile-menu-top > button")?.focus();
    };
    const focusFrame = window.requestAnimationFrame(focusMenu);
    // Some engines defer visibility until the entrance transition has begun.
    const onEntrance = event => { if (event.target === menu) focusMenu(); };
    menu.addEventListener("transitionend", onEntrance);
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0], last = elements.at(-1);
      if (!menu.contains(document.activeElement)) {
        event.preventDefault(); (event.shiftKey ? last : first)?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1081px)");
    const onResize = () => { if (desktop.matches) closeMenu(); };
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      window.cancelAnimationFrame(focusFrame);
      menu.removeEventListener("transitionend", onEntrance);
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="brand-lockup" href="/" aria-label="WEIERYANG home">
        <img src={logoPrimary} alt="" width="66" height="70" />
        <span>WEIERYANG</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {nav.map((item) => item.href
          ? <a key={item.href} href={item.href}>{item.label}</a>
          : <a key={item.id} href={`/#${item.id}`}>{item.label}</a>)}
      </nav>
      <div className="header-actions">
        <LanguageSelect language={language} setLanguage={setLanguage} compact />
        <a className="header-contact" href={`mailto:${businessContact.email}`}>
          {text.nav.contact}
        </a>
        <a className="whatsapp-button" href={whatsappHref("Hello WEIERYANG, I would like to discuss a sculpture project.")} target="_blank" rel="noreferrer">
          <WhatsappLogo size={19} weight="fill" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
        <a className="brief-button" href="/commission/">
          {text.nav.brief}
        </a>
      </div>
      <button ref={menuButtonRef} className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="mobile-menu">
        <List size={25} aria-hidden="true" />
        <span>{text.nav.menu}</span>
      </button>
      <div ref={menuRef} className={`mobile-menu${menuOpen ? " is-open" : ""}`} id="mobile-menu" role="dialog" aria-label={text.nav.menu} aria-modal={menuOpen ? true : undefined} aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="mobile-menu-top">
          <a className="brand-lockup" href="/" onClick={closeMenu}>
            <img src={logoPrimary} alt="" width="56" height="59" />
            <span>WEIERYANG</span>
          </a>
          <button type="button" onClick={closeMenu} aria-label={text.nav.close}>
            <X size={25} />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {nav.map((item) => item.href
            ? <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}<ArrowUpRight size={18} /></a>
            : <a key={item.id} href={`/#${item.id}`} onClick={closeMenu}>{item.label}<ArrowUpRight size={18} /></a>)}
        </nav>
        <div className="mobile-menu-actions">
          <LanguageSelect language={language} setLanguage={setLanguage} />
          <a href={`mailto:${businessContact.email}`}>{text.nav.contact}</a>
          <a href={whatsappHref("Hello WEIERYANG, I would like to discuss a sculpture project.")} target="_blank" rel="noreferrer">WhatsApp</a>
          <a className="brief-button" href="/commission/">{text.nav.brief}</a>
        </div>
      </div>
    </header>
  );
}

function HeroAtmosphere({ heroTime, active }) {
  const rainCanvasRef = useRef(null);
  const [lightningActive, setLightningActive] = useState(false);
  const stormActive = heroTime === "night";

  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!context || !active || reducedMotion || !stormActive) {
      context?.clearRect(0, 0, canvas.width, canvas.height);
      return undefined;
    }

    let frameId = 0;
    let lastFrame = 0;
    let width = 0;
    let height = 0;
    let drops = [];

    const seedDrops = () => {
      const count = width < 720 ? 34 : 76;
      drops = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        depth: 0.42 + Math.random() * 0.72,
        speed: 6 + Math.random() * 8,
        length: 9 + Math.random() * 18,
      }));
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      seedDrops();
    };

    const draw = (time) => {
      frameId = window.requestAnimationFrame(draw);
      if (time - lastFrame < 32) return;
      const delta = Math.min(2.2, Math.max(0.65, (time - lastFrame) / 16.67));
      lastFrame = time;
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";

      drops.forEach((drop) => {
        const alpha = 0.055 + drop.depth * 0.11;
        context.beginPath();
        context.moveTo(drop.x, drop.y);
        context.lineTo(drop.x - drop.length * 0.24, drop.y + drop.length);
        context.strokeStyle = `rgba(204, 222, 232, ${alpha})`;
        context.lineWidth = 0.55 + drop.depth * 0.65;
        context.stroke();

        drop.x -= drop.speed * 0.22 * delta;
        drop.y += drop.speed * delta;
        if (drop.y > height + 24 || drop.x < -24) {
          drop.x = Math.random() * width + width * 0.08;
          drop.y = -30 - Math.random() * height * 0.35;
        }
      });
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [stormActive, active]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactViewport = window.matchMedia("(max-width: 767px)").matches;
    if (!active || !stormActive || reducedMotion || compactViewport) {
      setLightningActive(false);
      return undefined;
    }

    let flashTimer = 0;
    let releaseTimer = 0;
    let firstFlash = true;
    const scheduleFlash = () => {
      const delay = firstFlash
        ? 4200 + Math.random() * 2400
        : 9000 + Math.random() * 9000;
      firstFlash = false;
      flashTimer = window.setTimeout(() => {
        setLightningActive(true);
        releaseTimer = window.setTimeout(() => {
          setLightningActive(false);
          scheduleFlash();
        }, 760);
      }, delay);
    };

    scheduleFlash();
    return () => {
      window.clearTimeout(flashTimer);
      window.clearTimeout(releaseTimer);
      setLightningActive(false);
    };
  }, [stormActive, active]);

  return (
    <div className={`hero-atmosphere${lightningActive ? " has-lightning" : ""}`} aria-hidden="true">
      <div className="hero-day-atmosphere">
        <div className="hero-mist hero-mist--far" />
        <div className="hero-cloud-shadow" />
        <div className="hero-sunlight-sweep" />
        <div className="hero-water-shimmer" />
      </div>
      <div className="hero-night-atmosphere">
        <canvas className="hero-rain" ref={rainCanvasRef} />
        <div className="hero-storm-haze" />
        <div className="hero-lightning" />
        <div className="hero-lightning-reflection" />
      </div>
    </div>
  );
}

function Hero({ text, language }) {
  const { current: heroTime, phase: heroPhase, busy: heroTransitioning, error, ambient, sectionRef, frames, toggle: toggleHeroTime } = useHeroPlayer(heroSources);
  const status = heroStatus[language] || heroStatus.en;

  return (
    <section
      className={`atelier-hero is-${heroTime} phase-${heroPhase}${heroTransitioning ? " is-time-transitioning" : ""}`}
      aria-labelledby="hero-title"
      ref={sectionRef}
      data-ambient={ambient}
      data-time={heroTime}
      data-phase={heroPhase}
    >
      <div className="hero-plaza-media" aria-hidden="true">
        <img className="hero-plaza-frame hero-plaza-day" ref={node => { frames.current.day = node; }} alt="" width="1672" height="941" fetchPriority="low" loading="eager" decoding="async" />
        <img className="hero-plaza-frame hero-plaza-blue-hour" ref={node => { frames.current.dusk = node; }} alt="" width="1672" height="941" fetchPriority="low" loading="eager" decoding="async" />
        <img className="hero-plaza-frame hero-plaza-night" ref={node => { frames.current.night = node; }} src={heroPlazaNight} alt="" width="1672" height="941" fetchPriority="high" loading="eager" decoding="async" />
      </div>
      <HeroAtmosphere heroTime={heroPhase} active={ambient} />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-bottom-blur" aria-hidden="true" />
      <aside className="hero-rail" aria-hidden="true">
        {text.hero.rail.map((item) => <span key={item}>{item}</span>)}
      </aside>
      <div className="hero-content">
        <p className="hero-eyebrow">{text.hero.eyebrow}</p>
        <h1 id="hero-title">{text.hero.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
        <p className="hero-body">{text.hero.body}</p>
        <div className="hero-actions">
          <a className="hero-cta" href="/commission/">
            {text.hero.brief}<ArrowRight size={23} aria-hidden="true" />
          </a>
          <button className="hero-glass-cta" type="button" onClick={() => homeAnchor("materials")}>
            {text.nav.materials}<ArrowRight size={22} aria-hidden="true" />
          </button>
          <button
            className={`hero-time-toggle is-${heroTime}`}
            type="button"
            onClick={toggleHeroTime}
            disabled={heroTransitioning}
            aria-busy={heroTransitioning}
            aria-pressed={heroTime === "day"}
            aria-label={heroTime === "night" ? text.hero.viewDay : text.hero.viewNight}
          >
            <span className="hero-time-icons" aria-hidden="true">
              <Moon size={17} weight="fill" />
              <Sun size={17} weight="fill" />
            </span>
            <span className="hero-time-copy" aria-live="polite">
              {heroTransitioning ? status[0] : heroTime === "night" ? text.hero.viewDay : text.hero.viewNight}
            </span>
          </button>
        </div>
      </div>
      {error ? <p className="hero-load-error" role="status">{status[1]}</p> : null}
      <nav className="hero-route-dock" aria-label="Project routes">
        {text.hero.routes.map((route, index) => (
          <a key={route} href={["/resort-sculpture/", "/garden-sculpture/", "/public-art/", "/commission/"][index]}>
            <span>0{index + 1}</span>{route}
          </a>
        ))}
      </nav>
    </section>
  );
}

function AssuranceStrip({ items }) {
  return (
    <section className="assurance-strip" aria-label="Commission standards">
      {items.map((item) => (
        <p key={item}><Check size={18} weight="bold" aria-hidden="true" />{item}</p>
      ))}
    </section>
  );
}

function ProjectRoutes({ text }) {
  return (
    <section className="project-routes section-shell" id="projects">
      <div className="section-heading">
        <h2>{text.routes.title}</h2>
        <p>{text.routes.body}</p>
      </div>
      <div className="route-ledger">
        {text.routes.items.map(([title, body], index) => (
          <article className={`route-card route-card-${index + 1}`} key={title}>
            <span className="route-card-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="route-card-copy">
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
            <a href={`/commission/?route=${index + 1}`} aria-label={`${text.routes.action}: ${title}`}>
              <span>{text.routes.action}</span><ArrowUpRight size={22} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function StudioMethod({ text }) {
  return (
    <section className="studio-method section-shell" id="capabilities">
      <span className="studio-method-anchor" id="materials" aria-hidden="true" />
      <span className="studio-method-anchor" id="process" aria-hidden="true" />
      <span className="studio-method-anchor" id="studio" aria-hidden="true" />
      <div className="studio-method-heading">
        <p className="hero-eyebrow">WEIERYANG / METHOD</p>
        <h2>{text.process.title}</h2>
        <p>{text.evidence.body}</p>
      </div>
      <div className="studio-method-ledger">
        {text.process.items.map(([title, body], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function MaterialsSection({ text }) {
  return (
    <section className="materials-ledger section-shell" id="materials">
      <div className="material-visual">
        <figure>
          <img src={materialSamples} alt="Bronze, brushed steel, polished steel and dark stone material samples" width="1536" height="1024" loading="lazy" decoding="async" />
          <figcaption>{text.materials.imageLabel}</figcaption>
        </figure>
      </div>
      <div className="material-copy">
        <h2>{text.materials.title}</h2>
        <p>{text.materials.body}</p>
        <div className="material-options">
          {text.materials.items.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <a href="/materials/">{text.materials.action}<ArrowRight size={18} /></a>
      </div>
    </section>
  );
}

function ProcessSection({ text }) {
  return (
    <section className="process-section section-shell" id="process">
      <h2>{text.process.title}</h2>
      <div className="process-steps">
        {text.process.items.map(([title, body], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvidenceSection({ text }) {
  const images = [designDevelopment, structuralStudy, fabricationWorkshop];
  return (
    <section className="evidence-section section-shell" id="capabilities">
      <div className="evidence-intro">
        <h2>{text.evidence.title}</h2>
        <p>{text.evidence.body}</p>
      </div>
      <div className="evidence-grid" id="studio">
        {text.evidence.cards.map(([title, body], index) => (
          <figure key={title}>
            <img src={images[index]} alt="" width="1122" height="1402" loading="lazy" decoding="async" />
            <figcaption><span>{text.evidence.label}</span><strong>{title}</strong><p>{body}</p></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function QualificationBand({ text }) {
  return (
    <section className="qualification-band section-shell">
      <div>
        <h2>{text.qualify.title}</h2>
        <p>{text.qualify.body}</p>
      </div>
      <div>
        <a className="hero-cta" href="/commission/">{text.qualify.brief}<ArrowRight size={21} /></a>
        <a className="text-link" href={`mailto:${businessContact.email}`}>{text.qualify.contact}</a>
      </div>
    </section>
  );
}

function InsightsPreview({ text }) {
  const insights = text.insights || copy.en.insights;
  return (
    <section className="insights-preview section-shell" id="insights">
      <div className="insights-visual">
        <figure>
          <img src={studioDesk} alt="Sculpture material desk with drawings and finish samples prepared for project review" width="1536" height="1024" loading="lazy" decoding="async" />
          <figcaption>Material, site and delivery notes</figcaption>
        </figure>
        <p className="hero-eyebrow">{insights.eyebrow}</p>
        <h2>{insights.title}</h2>
        <p>{insights.body}</p>
        <a className="text-link" href="/insights/">{insights.action}<ArrowRight size={18} /></a>
      </div>
      <div className="insights-index" aria-label={insights.eyebrow}>
        {insights.articles.map(([category, title, body, href], index) => (
          <a href={href} className="insight-row" key={href}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><small>{category}</small><h3>{title}</h3><p>{body}</p></div>
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

function HospitalityEntry({ language }) {
  const entry = hospitalityEntry[language] || hospitalityEntry.en;
  return <section className="hospitality-entry section-shell" aria-labelledby="hospitality-entry-title">
    <div><p className="hero-eyebrow">{entry.eyebrow}</p><h2 id="hospitality-entry-title">{entry.title}</h2></div>
    <div><p>{entry.body}</p><nav aria-label={entry.eyebrow}><a className="text-link" href="/resort-sculpture/">{entry.action}<ArrowRight size={18} /></a><a className="text-link" href="/commission/?route=resort-sculpture">{entry.brief}<ArrowUpRight size={18} /></a></nav></div>
  </section>;
}

function HospitalityDetails() {
  return <section className="hospitality-details section-shell" aria-label="U.S. hotel procurement and delivery">
    <nav className="hospitality-jump" aria-label="Hotel project review sections">{hospitalitySections.map(section => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>
    {hospitalitySections.map(section => <article id={section.id} key={section.id}><h2>{section.title}</h2><p>{section.body}</p><ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}
    <p><a className="text-link" href="/custom-outdoor-sculpture-supplier/#us-procurement">Review the U.S. procurement checklist<ArrowRight size={18} /></a></p>
  </section>;
}

function HospitalityPlanning() {
  const planning = hospitalityPlanning;
  return <section className="hospitality-planning section-shell" aria-labelledby={planning.id}>
    <header><p className="hero-eyebrow">Plan around the site</p><h2 id={planning.id}>{planning.title}</h2><p>{planning.answer}</p></header>
    <table className="hospitality-matrix">
      <caption className="sr-only">Hotel sculpture site and coordination comparison</caption>
      <thead><tr>{planning.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
      <tbody>{planning.rows.map(row => <tr key={row.setting}>
        <th scope="row">{row.setting}</th>
        <td data-label={planning.columns[1]}>{row.review}</td>
        <td data-label={planning.columns[2]}>{row.team}</td>
        <td data-label={planning.columns[3]}><a href={row.guide[1]}>{row.guide[0]}<ArrowUpRight size={16} aria-hidden="true" /></a></td>
      </tr>)}</tbody>
    </table>
    <div className="hospitality-resources"><h3>{planning.resourcesTitle}</h3><nav aria-label="Hotel sculpture planning resources">{planning.resources.map(([label, description, href]) => <a key={href} href={href}><strong>{label}<ArrowUpRight size={18} aria-hidden="true" /></strong><span>{description}</span></a>)}</nav></div>
  </section>;
}

function CommissionEvidence({ language }) {
  const proof = commissionProof[language] || commissionProof.en;
  const image = commissionEvidenceImage;
  const src = `/seo-media/${image.file}`;
  return <aside className="commission-evidence" aria-labelledby="commission-evidence-title">
    <a href="/projects/#project-evidence-title" aria-label={proof.action} tabIndex={-1}><img src={src} {...responsiveMedia(src, image.width)} sizes="(max-width: 600px) calc(100vw - 72px), 180px" width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" /></a>
    <div><p className="hero-eyebrow">{proof.eyebrow}</p><h3 id="commission-evidence-title">{proof.title}</h3><p>{proof.body}</p><a className="text-link" href="/projects/#project-evidence-title">{proof.action}<ArrowUpRight size={16} aria-hidden="true" /></a></div>
  </aside>;
}

function HomePage({ text, language }) {
  return (
    <>
      <Hero text={text} language={language} />
      <AssuranceStrip items={text.assurance} />
      <HospitalityEntry language={language} />
      <HotelEngineeringCases language={language} />
      <SculptureCollectionPreview language={language} />
      <ProjectRoutes text={text} />
      <StudioMethod text={text} />
      <InsightsPreview text={text} />
      <QualificationBand text={text} />
    </>
  );
}

function SecondaryPage({ route, text, language }) {
  const seo = language === "en" ? routeSeoContent[route] : null;
  const title = seo?.title || text.routeNames[route] || text.routeNames.projects;
  const media = routeHeroMedia[route];
  const image = media?.src || routeImages[route] || studioDesk;
  const groups = seo?.groups || text.secondary.checks.map(([itemTitle, body]) => [itemTitle, [body]]);
  return (
    <>
      <section className="secondary-hero section-shell">
        <div>
          <p className="secondary-breadcrumb"><a href="/">Home</a><span>/</span>{text.routeNames[route] || text.routeNames.projects}</p>
          <p className="hero-eyebrow">{seo?.eyebrow || text.secondary.eyebrow}</p>
          <h1>{title}</h1>
          <p>{seo?.intro || text.secondary.intro}</p>
          <a className="hero-cta" href={`/commission/?route=${encodeURIComponent(route)}`}>{text.secondary.brief}<ArrowRight size={21} /></a>
        </div>
        <figure>
          <img src={image} {...responsiveMedia(image, media?.width || 1536)} alt={media?.alt || (route === "projects" ? "Verified construction-phase photograph of a flying-bird stainless steel landmark being lifted at a Middle East public site" : `${text.routeNames[route] || "Sculpture"} material, concept or engineering study`)} width={media?.width || (route === "projects" ? "2000" : "1536")} height={media?.height || (route === "projects" ? "1398" : "1024")} fetchPriority="high" decoding="async" />
          <figcaption>{media?.caption || (route === "projects" ? text.cases.verified : text.secondary.imageLabel)}</figcaption>
        </figure>
      </section>
      {route === "resort-sculpture" && language === "en" ? <HospitalityPlanning /> : null}
      <section className="seo-route-content section-shell">
        <header>
          <p className="hero-eyebrow">{route === "projects" ? "Verified project record" : "Decision guide"}</p>
          <h2>{route === "projects" ? "What the construction photographs document" : seo ? "Site, material and delivery decisions" : text.secondary.checksTitle}</h2>
        </header>
        <div className="seo-route-groups">
          {groups.map(([itemTitle, items], index) => (
            <article key={itemTitle}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{itemTitle}</h3>
              <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      {route === "resort-sculpture" && language === "en" ? <HospitalityDetails /> : null}
      {route === "projects" ? (
        <section className="project-case-feature section-shell" aria-labelledby="hotel-case-title">
          <figure>
            <img src="/seo-media/hotel-engineering-case-overview.webp" {...responsiveMedia("/seo-media/hotel-engineering-case-overview.webp", 1600)} alt="Three supplied views of a large mirror stainless steel sculpture inside a commercial atrium" width="1600" height="900" loading="lazy" decoding="async" />
          </figure>
          <div>
            <p className="hero-eyebrow">Commercial-interior reference study — not a portfolio commission</p>
            <h2 id="hotel-case-title">Hotel lobby sculpture: atrium scale, mirror finish and installation</h2>
            <p>A practical engineering review for hotel owners, designers and contractors covering guest sightlines, building interfaces, access, finish approval and handover. The supplied commercial-atrium photographs are clearly separated from WEIERYANG portfolio claims.</p>
            <a className="text-link" href="/projects/hotel-lobby-sculpture-engineering-case/">Read the reference study<ArrowRight size={18} /></a>
          </div>
        </section>
      ) : null}
      {route === "projects" ? (
        <section className="project-evidence section-shell" aria-labelledby="project-evidence-title">
          <header>
            <p className="hero-eyebrow">{text.cases.verified} / {text.cases.phase}</p>
            <h2 id="project-evidence-title">{text.cases.items[0].title}</h2>
            <p>{text.cases.body}</p>
          </header>
          <div className="project-evidence-grid">
            <figure>
              <img src={structuralAssembly} alt="Structural core and segmented wings of the flying-bird landmark during construction" width="2000" height="1219" loading="lazy" decoding="async" />
              <figcaption>{text.cases.items[1].note}</figcaption>
            </figure>
            <figure>
              <img src={wingSlatInstallation} alt="Repeated stainless steel wing members being aligned during site installation" width="2000" height="1290" loading="lazy" decoding="async" />
              <figcaption>{text.cases.detail}</figcaption>
            </figure>
          </div>
          <a className="text-link" href="/insights/middle-east-stainless-steel-landmark-sculpture/">{text.cases.items[0].title}<ArrowRight size={18} /></a>
        </section>
      ) : null}
      <section className="secondary-scope section-shell">
        <figure><img src={materialSamples} alt="Sculpture material samples" width="1536" height="1024" loading="lazy" decoding="async" /></figure>
        <div><h2>{text.secondary.scopeTitle}</h2><p>{text.secondary.scopeBody}</p><a className="text-link" href="/process/">{text.nav.process}<ArrowRight size={18} /></a></div>
      </section>
      {seo ? (
        <section className="seo-route-footer section-shell">
          <div className="seo-related">
            <p className="hero-eyebrow">Related routes</p>
            <h2>Continue the project review</h2>
            <nav aria-label="Related sculpture routes">
              {seo.related.map(([label, href]) => <a key={href} href={href}>{label}<ArrowUpRight size={18} /></a>)}
            </nav>
          </div>
          <div className="seo-faq-visible">
            <p className="hero-eyebrow">Frequently asked</p>
            <dl>{seo.faq.map(([question, answer]) => <div key={question}><dt>{question}</dt><dd>{answer}</dd></div>)}</dl>
          </div>
        </section>
      ) : null}
      <QualificationBand text={text} />
    </>
  );
}

function readDraft(storageKey = draftStorageKey, product = null, projectTypes = []) {
  const empty = product ? productInquiryForm(null, product, projectTypes) : restoreInquiryDraft(null);
  if (typeof window === "undefined" || !storageKey) return empty;
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
    return product ? productInquiryForm(saved, product, projectTypes) : restoreInquiryDraft(saved);
  } catch {
    return empty;
  }
}

function CommissionForm({ text, language, mode = "full", product }) {
  const isProduct = mode === "product";
  const context = isProduct ? productInquiryContext(product) : null;
  const storageKey = isProduct ? productInquiryDraftKey(context) : draftStorageKey;
  const eventContext = inquiryEventContext(mode, context);
  const shortText = productInquiryCopy[language] || productInquiryCopy.en;
  const projectTypes = text.commission.options.projectTypes;
  const proof = commissionProof[language] || commissionProof.en;
  const [form, setForm] = useState(() => readDraft(storageKey, context, projectTypes));
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);
  const invalidFieldToFocus = useRef("");
  const submitting = useRef(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileContainer = useRef(null);
  const turnstileWidgetId = useRef(null);
  const formStartTracked = useRef(false);
  const [status, setStatus] = useState({ type: "idle", message: "", reference: "" });
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const emailText = { ...(emailBriefCopy[language] || emailBriefCopy.en), ...(emailBriefActions[language] || emailBriefActions.en) };
  const feedback = inquiryFormCopy[language] || inquiryFormCopy.en;
  const hasInquiryEndpoint = Boolean(inquiryEndpoint) && (!isProduct || Boolean(context));
  // Rebuild the category from the registry on every render/submit so neither a
  // stale language nor a modified draft can override this product's category.
  const submissionForm = isProduct && context ? productInquiryForm(form, context, projectTypes, { submitting: true }) : form;
  const emailProduct = context || (!isProduct && typeof window !== "undefined" ? productInquiryContext(new URL(window.location.href).searchParams.get("route")) : null);
  const emailBrief = useMemo(() => createInquiryEmail(submissionForm, text.commission.fields, businessContact.email, { product: emailProduct, language }), [submissionForm, text, emailProduct, language]);

  useEffect(() => {
    if (!invalidFieldToFocus.current) return;
    // Wait for inline messages to render before focusing, so scroll anchoring
    // cannot move the first invalid field behind the sticky header.
    const field = formRef.current?.elements.namedItem(invalidFieldToFocus.current);
    invalidFieldToFocus.current = "";
    field?.focus();
    field?.scrollIntoView({ block: "center", behavior: "instant" });
  }, [fieldErrors]);

  const trackFormStart = () => {
    if (formStartTracked.current || !eventContext) return;
    formStartTracked.current = true;
    const attribution = inquiryAttribution();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "commission_form_start",
      ...eventContext,
      lead_source: attribution.utmSource || (attribution.fbclid ? "facebook" : "website"),
      campaign_name: attribution.utmCampaign || "",
      language,
    });
  };

  useEffect(() => {
    if (!hasInquiryEndpoint) return undefined;
    setTurnstileToken("");
    let active = true;
    const renderWidget = () => {
      if (!active || !turnstileContainer.current || !window.turnstile || turnstileWidgetId.current != null) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileContainer.current, {
        sitekey: turnstileSiteKey,
        action: "commission",
        language: language === "zh" ? "zh-CN" : language,
        theme: "dark",
        size: window.matchMedia("(max-width: 380px)").matches ? "compact" : "flexible",
        callback: setTurnstileToken,
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };
    const scriptId = "weieryang-turnstile-script";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", renderWidget);
    renderWidget();
    return () => {
      active = false;
      script.removeEventListener("load", renderWidget);
      if (turnstileWidgetId.current != null && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [hasInquiryEndpoint, language]);

  const setValue = (name, value) => {
    if (submitting.current) return;
    trackFormStart();
    setForm((current) => {
      const next = { ...current, [name]: value };
      try { if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify(isProduct ? productInquiryDraft(next) : next)); } catch { /* Draft persistence is optional. */ }
      return next;
    });
    setFieldErrors(current => current[name] ? { ...current, [name]: validateInquiryField(name, value) } : current);
    if (status.type !== "idle") setStatus({ type: "idle", message: "", reference: "" });
    if (copied) setCopied(false);
  };

  const handleFiles = (event) => {
    if (submitting.current || isProduct) return;
    trackFormStart();
    const nextFiles = Array.from(event.target.files || []);
    const invalid = nextFiles.length > fileLimit || nextFiles.reduce((total, file) => total + file.size, 0) > totalFileSizeLimit || nextFiles.some((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      return !allowedExtensions.includes(extension) || file.size > fileSizeLimit;
    });
    if (invalid) {
      setFiles([]);
      setFileError(text.commission.fileError);
      event.target.value = "";
      return;
    }
    setFiles(nextFiles);
    setFileError("");
    if (status.type !== "idle") setStatus({ type: "idle", message: "", reference: "" });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current || status.type === "success" || !eventContext) return;
    const errors = validateInquiry(submissionForm);
    invalidFieldToFocus.current = Object.keys(errors)[0] || "";
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setStatus({ type: "idle", message: "", reference: "" });
      return;
    }
    if (!hasInquiryEndpoint) {
      setStatus({ type: "prepared", message: "", reference: "" });
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "contact_click", contact_method: "email", contact_source: "commission_form" });
      window.location.href = emailBrief.href;
      return;
    }
    if (!isProduct && fileError) { formRef.current.elements.namedItem("files")?.focus(); return; }
    if (!turnstileToken) {
      setStatus({ type: "error", message: "security", reference: "" });
      return;
    }
    submitting.current = true;
    setStatus({ type: "loading", message: "", reference: "" });
    const payload = new FormData();
    Object.entries(submissionForm).forEach(([key, value]) => payload.append(key, value));
    payload.append("language", language);
    payload.append("source", inquirySource(window.location.href, isProduct ? context.path : undefined));
    const attribution = inquiryAttribution();
    for (const key of ["landingPath", "referrerHost", "utmSource", "utmMedium", "utmCampaign", "utmId", "utmContent", "utmTerm", "fbclid"]) {
      payload.append(key, attribution[key] || "");
    }
    payload.append("interestRoute", isProduct ? context.inquiryId : safeInterestRoute(new URL(window.location.href).searchParams.get("route")));
    payload.append("cf-turnstile-response", turnstileToken);
    if (!isProduct) files.forEach((file) => payload.append("files", file, file.name));

    try {
      const result = await sendInquiry(inquiryEndpoint, payload);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "generate_lead",
        event_id: result.reference || "",
        ...eventContext,
        ...analyticsAttribution(attribution),
        project_type: analyticsProjectType(submissionForm.projectType, Object.values(copy).map(entry => entry.commission.options.projectTypes)),
        has_attachments: !isProduct && files.length > 0,
        language,
      });
      setStatus({ type: "success", message: "", reference: result.reference || "" });
      try { window.localStorage.removeItem(storageKey); } catch { /* Email delivery succeeded; local draft removal is best-effort. */ }
    } catch {
      setStatus({ type: "error", message: "uncertain", reference: "" });
    } finally {
      submitting.current = false;
      setTurnstileToken("");
      if (turnstileWidgetId.current != null && window.turnstile) window.turnstile.reset(turnstileWidgetId.current);
    }
  };

  const followupMessage = useMemo(() => {
    const reference = status.reference ? ` Reference: ${status.reference}.` : "";
    return status.type === "success"
      ? `Hello WEIERYANG, I submitted a private sculpture brief for ${form.company || "our project"}.${reference}`
      : `Hello WEIERYANG, I would like to discuss a sculpture project for ${form.company || "our team"}.`;
  }, [form.company, status.reference, status.type]);

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(emailBrief.body);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  };

  const fieldAttributes = name => ({
    maxLength: fieldLimits[name],
    "aria-invalid": fieldErrors[name] ? true : undefined,
    "aria-describedby": fieldErrors[name] ? `brief-${name}-error` : undefined,
  });
  const renderFieldError = name => fieldErrors[name] ? (
    <small className="field-error" id={`brief-${name}-error`}>
      {fieldErrors[name] === "email" ? emailText.invalidEmail : fieldErrors[name] === "length"
        ? feedback.length.replace("{limit}", fieldLimits[name]) : feedback.required}
    </small>
  ) : null;

  const renderSelect = (name, label, items, required = false) => (
    <label className="field">
      <span>{label}{required ? " *" : ""}</span>
      <select name={name} {...fieldAttributes(name)} value={form[name]} required={required} onChange={(event) => setValue(name, event.target.value)}>
        <option value="">{selectPrompts[language] || selectPrompts.en}</option>
        {form[name] && !items.includes(form[name]) ? <option value={form[name]}>{form[name]}</option> : null}
        {items.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      {renderFieldError(name)}
    </label>
  );

  if (isProduct && !context) return null;

  return (
    <form ref={formRef} className={`commission-form${isProduct ? " product-inquiry-form" : ""}`} onSubmit={submit} noValidate aria-busy={status.type === "loading"}>
      <div className="form-heading"><h2>{isProduct ? shortText.title : text.commission.formTitle}</h2><p>{isProduct ? shortText.body : hasInquiryEndpoint ? text.commission.formBody : emailText.body}</p>{isProduct ? <p>{shortText.selected}: <strong>{product?.title || context.title}</strong></p> : null}</div>
      {!isProduct ? <CommissionEvidence language={language} /> : null}
      <fieldset className="form-grid" disabled={status.type === "loading"}>
        <legend className="sr-only">{isProduct ? shortText.title : text.commission.formTitle}</legend>
        <label className="field"><span>{text.commission.fields.name} *</span><input name="name" {...fieldAttributes("name")} autoComplete="name" value={form.name} onChange={(event) => setValue("name", event.target.value)} placeholder={text.commission.placeholders.name} required />{renderFieldError("name")}</label>
        <label className="field"><span>{text.commission.fields.company} *</span><input name="company" {...fieldAttributes("company")} autoComplete="organization" value={form.company} onChange={(event) => setValue("company", event.target.value)} placeholder={text.commission.placeholders.company} required />{renderFieldError("company")}</label>
        <label className="field"><span>{text.commission.fields.email} *</span><input type="email" name="email" {...fieldAttributes("email")} autoComplete="email" value={form.email} onChange={(event) => setValue("email", event.target.value)} placeholder={text.commission.placeholders.email} required />{renderFieldError("email")}</label>
        {!isProduct ? <><label className="field"><span>{text.commission.fields.phone}</span><input type="tel" name="phone" {...fieldAttributes("phone")} autoComplete="tel" value={form.phone} onChange={(event) => setValue("phone", event.target.value)} placeholder={text.commission.placeholders.phone} />{renderFieldError("phone")}</label>
        {renderSelect("projectType", text.commission.fields.projectType, text.commission.options.projectTypes, true)}</> : null}
        <label className="field"><span>{text.commission.fields.location} *</span><input name="location" {...fieldAttributes("location")} value={form.location} onChange={(event) => setValue("location", event.target.value)} placeholder={text.commission.placeholders.location} required />{renderFieldError("location")}</label>
        {!isProduct ? <>{renderSelect("material", text.commission.fields.material, text.commission.options.materials)}
        {renderSelect("scale", text.commission.fields.scale, text.commission.options.scales)}
        <label className="field"><span>{text.commission.fields.timeline}</span><input name="timeline" {...fieldAttributes("timeline")} value={form.timeline} onChange={(event) => setValue("timeline", event.target.value)} placeholder={text.commission.placeholders.timeline} />{renderFieldError("timeline")}</label>
        {renderSelect("installation", text.commission.fields.installation, text.commission.options.installation)}</> : null}
        <label className="field field-wide"><span>{isProduct ? shortText.message : text.commission.fields.message} *</span><textarea name="message" {...fieldAttributes("message")} rows={isProduct ? 3 : 6} value={form.message} onChange={(event) => setValue("message", event.target.value)} placeholder={isProduct ? shortText.placeholder : text.commission.placeholders.message} required />{renderFieldError("message")}</label>
        {!isProduct ? hasInquiryEndpoint ? (
          <label className="field field-wide file-field">
            <span>{text.commission.fields.files}</span>
            <input type="file" name="files" aria-label={text.commission.fields.files} accept=".pdf,.jpg,.jpeg,.png,.webp,.dwg" multiple onChange={handleFiles} aria-invalid={fileError ? true : undefined} aria-describedby={fileError ? "brief-files-error" : "brief-files-hint"} />
            <span className="file-control"><FileArrowUp size={22} aria-hidden="true" /><strong>{text.commission.upload}</strong><small>{files.length ? files.map((file) => file.name).join(", ") : `${text.commission.uploadHint} ${deliveryCopy[language]?.total || deliveryCopy.en.total}`}</small></span>
            <small id="brief-files-hint" className="sr-only">{feedback.files}</small>
            {fileError ? <small id="brief-files-error" className="field-error" role="alert">{feedback.files}</small> : null}
          </label>
        ) : (
          <div className="field field-wide file-field"><span>{text.commission.fields.files}</span><div className="file-control is-email"><EnvelopeSimple size={22} aria-hidden="true" /><strong>{businessContact.email}</strong><small>{emailText.files}</small></div></div>
        ) : null}
        <label className="honeypot" aria-hidden="true" inert><span>Website</span><input name="website" tabIndex="-1" autoComplete="off" value={form.website} onChange={(event) => setValue("website", event.target.value)} /></label>
      </fieldset>
      {hasInquiryEndpoint ? <div className="commission-turnstile" ref={turnstileContainer} /> : null}
      <p className="commission-privacy">{(privacyCopy[language] || privacyCopy.en).note} <a href="/privacy/" target="_blank" rel="noreferrer" hrefLang="en">{(privacyCopy[language] || privacyCopy.en).link} (EN)</a></p>
      <p className="commission-review-scope">{isProduct ? shortText.scope : proof.scope}</p>
      <button className="form-submit" type="submit" disabled={status.type === "loading" || status.type === "success"}>
        {status.type === "loading" ? <SpinnerGap className="spin" size={21} /> : <ArrowRight size={21} />}
        {status.type === "loading" ? text.commission.submitting : status.type === "success" ? feedback.sent : hasInquiryEndpoint ? isProduct ? shortText.submit : text.commission.submit : emailText.submit}
      </button>
      {isProduct ? <p className="commission-full-link"><a href={`/commission/?route=${context.inquiryId}`}>{shortText.full}<ArrowUpRight size={18} aria-hidden="true" /></a></p> : null}
      {status.type === "prepared" ? (
        <div className="form-status is-prepared" role="status"><EnvelopeSimple size={24} /><div><strong>{emailText.preparedTitle}</strong><p>{emailText.preparedBody}</p><a href={emailBrief.href}>{emailText.reopen}</a><button type="button" onClick={copyBrief}>{copied ? emailText.copied : emailText.copy}</button>{copyFailed ? <textarea readOnly value={emailBrief.body} aria-label={emailText.manualCopy} /> : null}</div></div>
      ) : null}
      {status.type === "error" ? (
        <div className="form-status is-error" role="alert"><WarningCircle size={24} /><div><strong>{text.commission.errorTitle}</strong><p>{feedback[status.message] || text.commission.errorBody}</p><a href={emailBrief.href}>{emailText.reopen}</a><a href={whatsappHref(followupMessage)} target="_blank" rel="noreferrer">{text.commission.whatsapp}</a></div></div>
      ) : null}
      {status.type === "success" ? (
        <div className="form-status is-success" role="status"><Check size={24} weight="bold" /><div><strong>{text.commission.successTitle}</strong><p>{isProduct ? shortText.success : deliveryCopy[language]?.success || deliveryCopy.en.success}</p>{status.reference ? <p>{text.commission.reference}: {status.reference}</p> : null}<div><a href={whatsappHref(followupMessage)} target="_blank" rel="noreferrer"><WhatsappLogo size={18} weight="fill" />{text.commission.whatsapp}</a><a href={`mailto:${businessContact.email}`}><EnvelopeSimple size={18} />{text.commission.email}</a><a href="/projects/#project-evidence-title">{proof.next}<ArrowUpRight size={18} aria-hidden="true" /></a></div></div></div>
      ) : null}
    </form>
  );
}

function CommissionPage({ text, language }) {
  return (
    <>
      <section className="commission-hero section-shell">
        <div>
          <p className="hero-eyebrow">{text.commission.eyebrow}</p>
          <h1>{text.commission.title}</h1>
          <p>{text.commission.body}</p>
          <ul>{text.commission.points.map((point) => <li key={point}><Check size={18} weight="bold" />{point}</li>)}</ul>
        </div>
        <figure><img src={studioDesk} alt="Sculpture material desk prepared for project review" width="1536" height="1024" fetchPriority="high" decoding="async" /></figure>
      </section>
      <section className="commission-form-section section-shell">
        <CommissionForm text={text} language={language} />
        <aside className="brief-aside">
          <figure><img src={conceptSketch} alt="Complete sculpture concept drawing with scale and landscape context" width="1448" height="1086" loading="lazy" decoding="async" /></figure>
          <div><p>{text.commission.formBody}</p><a href={`mailto:${businessContact.email}`}>{businessContact.email}</a></div>
        </aside>
      </section>
    </>
  );
}

function SiteFooter({ text, language }) {
  const routeLinks = ["garden-sculpture", "resort-sculpture", "public-art", "custom-sculpture"];
  const materialLinks = ["bronze-sculpture", "stainless-steel-sculpture", "stone-sculpture", "materials"];
  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <a className="brand-lockup" href="/"><img src={logoPrimary} alt="" width="68" height="72" /><span>WEIERYANG</span></a>
        <h2>{text.footer.statement}</h2>
        <p>{text.footer.body}</p>
      </div>
      <div className="footer-links">
        <div><h3>{text.footer.routes}</h3><a href="/sculptures/">{(catalogUi[language] || catalogUi.en).nav}</a>{routeLinks.map((route) => <a key={route} href={`/${route}/`}>{text.routeNames[route]}</a>)}</div>
        <div><h3>{text.footer.materials}</h3>{materialLinks.map((route) => <a key={route} href={`/${route}/`}>{text.routeNames[route]}</a>)}</div>
        <div><h3>{text.footer.studio}</h3><a href="/custom-outdoor-sculpture-supplier/">Supplier route</a><a href="/process/">{text.nav.process}</a><a href="/projects/">{text.nav.projects}</a><a href="/faq/">{text.routeNames.faq}</a><a href="/insights/">Insights</a></div>
        <div><h3>{text.footer.contact}</h3><a href={`mailto:${businessContact.email}`}>{text.nav.contact}</a><a href={whatsappHref("Hello WEIERYANG, I would like to discuss a sculpture project.")} target="_blank" rel="noreferrer">WhatsApp</a><a href="/commission/">{text.footer.private}</a><span>weieryangart.com</span></div>
      </div>
      <div className="footer-base"><span>© {new Date().getFullYear()} {text.footer.rights}</span><a href="/privacy/" hrefLang="en">Privacy &amp; project information (EN)</a><span>{businessContact.email}</span></div>
    </footer>
  );
}

export function App({ initialRoute }) {
  const [language, setLanguageState] = useState(initialLanguage);
  const [route] = useState(() => initialRoute ?? currentPath());
  const text = copy[language] || copy.en;
  const option = languageOptions.find((item) => item.code === language) || languageOptions[0];

  const setLanguage = (next) => {
    const normalized = copy[next] ? next : "en";
    setLanguageState(normalized);
    try { window.sessionStorage.setItem(languageSessionKey, normalized); } catch { /* The current session still updates. */ }
  };

  useEffect(() => {
    document.documentElement.lang = option.htmlLang;
    document.documentElement.dir = option.dir;
    document.body.dataset.language = language;
  }, [language, option.dir, option.htmlLang]);

  useEffect(() => {
    if (!window.location.hash) return undefined;
    let targetId;
    try { targetId = decodeURIComponent(window.location.hash.slice(1)); } catch { return undefined; }
    // Native hash navigation can run while the static backup is hidden and
    // before React adds the destination. Locate it after this render commits.
    const scrollFrame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(scrollFrame);
  }, [route, language]);

  const page = route === "commission"
    ? <CommissionPage text={text} language={language} />
    : route === "sculptures"
      ? <SculptureCollection language={language} />
    : route.startsWith("sculptures/")
      ? <SculptureDetail slug={route.slice("sculptures/".length)} language={language} renderInquiry={product => <CommissionForm key={`product:${product.slug}`} mode="product" product={product} text={text} language={language} />} />
    : routeKeys.includes(route)
      ? <SecondaryPage route={route} text={text} language={language} />
      : <HomePage text={text} language={language} />;

  return (
    <main className="site-shell" id="top">
      <SiteHeader language={language} setLanguage={setLanguage} text={text} />
      {page}
      <SiteFooter text={text} language={language} />
    </main>
  );
}
