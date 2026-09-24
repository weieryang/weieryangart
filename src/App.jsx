import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import heroPlazaNightAsset from "./assets/hero-plaza-night-v3.webp";
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
import { routeSeoContent } from "./seoContent.js";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

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
const heroPlazaNight = assetUrl(heroPlazaNightAsset);
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
const attributionSessionKey = "weieryang-attribution-v2";
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
  try {
    return { landingPath: window.location.pathname, ...JSON.parse(window.sessionStorage.getItem(attributionSessionKey) || "{}") };
  } catch {
    return { landingPath: window.location.pathname };
  }
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
  const closeMenu = () => setMenuOpen(false);
  const nav = [
    { label: text.nav.projects, id: "projects" },
    { label: text.nav.capabilities, id: "capabilities" },
    { label: text.nav.materials, id: "materials" },
    { label: text.nav.process, id: "process" },
    { label: text.nav.studio, id: "studio" },
    { label: text.nav.insights || "Insights", href: "/insights/" },
  ];

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (!menuOpen) return () => document.body.classList.remove("menu-open");
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
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
          : <button key={item.id} type="button" onClick={() => homeAnchor(item.id)}>{item.label}</button>)}
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
      <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="mobile-menu">
        <List size={25} aria-hidden="true" />
        <span>{text.nav.menu}</span>
      </button>
      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} id="mobile-menu" aria-hidden={!menuOpen}>
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
            : <button key={item.id} type="button" onClick={() => { closeMenu(); homeAnchor(item.id); }}>{item.label}<ArrowUpRight size={18} /></button>)}
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

function HeroAtmosphere({ heroTime }) {
  const rainCanvasRef = useRef(null);
  const [lightningActive, setLightningActive] = useState(false);
  const stormActive = heroTime === "night";

  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!context || reducedMotion || !stormActive) {
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
  }, [stormActive]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactViewport = window.matchMedia("(max-width: 767px)").matches;
    if (!stormActive || reducedMotion || compactViewport) {
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
  }, [stormActive]);

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

function Hero({ text }) {
  const [heroTime, setHeroTime] = useState("night");
  const [heroPhase, setHeroPhase] = useState("night");
  const [heroTransitioning, setHeroTransitioning] = useState(false);
  const transitionTimers = useRef([]);

  useEffect(() => () => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const toggleHeroTime = () => {
    if (heroTransitioning) return;
    const nextTime = heroTime === "night" ? "day" : "night";
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    setHeroTransitioning(true);
    setHeroPhase("dusk");
    transitionTimers.current = [
      window.setTimeout(() => {
        setHeroTime(nextTime);
        setHeroPhase(nextTime);
      }, 760),
      window.setTimeout(() => setHeroTransitioning(false), 1560),
    ];
  };

  return (
    <section
      className={`atelier-hero is-${heroTime} phase-${heroPhase}${heroTransitioning ? " is-time-transitioning" : ""}`}
      aria-labelledby="hero-title"
      data-time={heroTime}
      data-phase={heroPhase}
    >
      <div className="hero-plaza-media" aria-hidden="true">
        <img className="hero-plaza-frame hero-plaza-day" src={heroPlazaDay} alt="" width="1672" height="941" loading="eager" decoding="async" />
        <img className="hero-plaza-frame hero-plaza-blue-hour" src={heroPlazaDusk} alt="" width="1672" height="941" loading="eager" decoding="async" />
        <img className="hero-plaza-frame hero-plaza-night" src={heroPlazaNight} alt="" width="1672" height="941" fetchPriority="high" loading="eager" decoding="async" />
      </div>
      <HeroAtmosphere heroTime={heroPhase} />
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
            aria-pressed={heroTime === "day"}
            aria-label={heroTime === "night" ? text.hero.viewDay : text.hero.viewNight}
          >
            <span className="hero-time-icons" aria-hidden="true">
              <Moon size={17} weight="fill" />
              <Sun size={17} weight="fill" />
            </span>
            <span className="hero-time-copy" aria-live="polite">
              {heroTime === "night" ? text.hero.viewDay : text.hero.viewNight}
            </span>
          </button>
        </div>
      </div>
      <nav className="hero-route-dock" aria-label="Project routes">
        {text.hero.routes.map((route, index) => (
          <button key={route} type="button" onClick={() => homeAnchor("projects")}>
            <span>0{index + 1}</span>{route}
          </button>
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

function CaseStudies({ text }) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const root = sectionRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.utils.toArray(".case-study", root).forEach((card) => {
      const image = card.querySelector("img");
      const copyBlock = card.querySelector(".case-study-copy");
      gsap.fromTo(image, { scale: 1.025 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: card, start: "top 88%", end: "bottom 24%", scrub: 0.7 },
      });
      gsap.fromTo(copyBlock, { y: 28, opacity: 0.62 }, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 76%", toggleActions: "play none none reverse" },
      });
    });
  }, { scope: sectionRef, dependencies: [text], revertOnUpdate: true });

  return (
    <section className="case-studies" id="cases" ref={sectionRef} aria-labelledby="case-studies-title">
      <div className="case-studies-intro section-shell">
        <p className="hero-eyebrow">{text.cases.eyebrow}</p>
        <div>
          <h2 id="case-studies-title">{text.cases.title}</h2>
          <p>{text.cases.body}</p>
        </div>
      </div>
      <div className="case-study-stack section-shell">
        <article className="case-study case-study-primary">
          <div className="case-study-topline">
            <span>01</span>
            <span>{text.cases.verified}</span>
            <span>{text.cases.phase}</span>
          </div>
          <figure className="case-study-hero-figure">
            <img src={middleEastInstallation} alt="Large stainless-steel wing sculpture being installed at an overseas public site" width="2000" height="1398" loading="lazy" decoding="async" />
          </figure>
          <div className="case-study-copy">
            <p className="case-study-kicker">{text.cases.items[0].meta}</p>
            <h3>{text.cases.items[0].title}</h3>
            <p>{text.cases.items[0].body}</p>
            <div className="case-study-proof">
              <span>{text.cases.proof}</span>
              <p>{text.cases.items[0].note}</p>
            </div>
          </div>
          <figure className="case-study-detail-figure">
            <img src={wingSlatInstallation} alt="Close view of stainless-steel wing slats during crane-assisted installation" width="2000" height="1164" loading="lazy" decoding="async" />
            <figcaption>{text.cases.detail}</figcaption>
          </figure>
        </article>
        <article className="case-study case-study-secondary">
          <div className="case-study-topline">
            <span>02</span>
            <span>{text.cases.verified}</span>
            <span>{text.cases.phase}</span>
          </div>
          <figure className="case-study-hero-figure">
            <img src={structuralAssembly} alt="Large-span metal sculpture structure under workshop and crane assembly" width="2000" height="1500" loading="lazy" decoding="async" />
          </figure>
          <div className="case-study-copy">
            <p className="case-study-kicker">{text.cases.items[1].meta}</p>
            <h3>{text.cases.items[1].title}</h3>
            <p>{text.cases.items[1].body}</p>
            <div className="case-study-proof">
              <span>{text.cases.proof}</span>
              <p>{text.cases.items[1].note}</p>
            </div>
            <a className="text-link" href="/commission/">{text.cases.brief}<ArrowRight size={18} /></a>
          </div>
        </article>
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

function HomePage({ text }) {
  return (
    <>
      <Hero text={text} />
      <AssuranceStrip items={text.assurance} />
      <ProjectRoutes text={text} />
      <CaseStudies text={text} />
      <StudioMethod text={text} />
      <InsightsPreview text={text} />
      <QualificationBand text={text} />
    </>
  );
}

function SecondaryPage({ route, text, language }) {
  const seo = language === "en" ? routeSeoContent[route] : null;
  const title = seo?.title || text.routeNames[route] || text.routeNames.projects;
  const image = routeImages[route] || studioDesk;
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
          <img src={image} alt={route === "projects" ? "Verified construction-phase photograph of a flying-bird stainless steel landmark being lifted at a Middle East public site" : `${text.routeNames[route] || "Sculpture"} material, concept or engineering study`} width={route === "projects" ? "2000" : "1536"} height={route === "projects" ? "1398" : "1024"} fetchPriority="high" decoding="async" />
          <figcaption>{route === "projects" ? text.cases.verified : text.secondary.imageLabel}</figcaption>
        </figure>
      </section>
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

function readDraft() {
  const empty = { name: "", company: "", email: "", phone: "", projectType: "", location: "", material: "", scale: "", timeline: "", installation: "", message: "", website: "" };
  if (typeof window === "undefined") return empty;
  try {
    return { ...empty, ...JSON.parse(window.localStorage.getItem(draftStorageKey) || "{}") };
  } catch {
    return empty;
  }
}

function CommissionForm({ text, language }) {
  const [form, setForm] = useState(readDraft);
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileContainer = useRef(null);
  const turnstileWidgetId = useRef(null);
  const formStartTracked = useRef(false);
  const [status, setStatus] = useState({ type: "idle", message: "", reference: "" });
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const emailText = { ...(emailBriefCopy[language] || emailBriefCopy.en), ...(emailBriefActions[language] || emailBriefActions.en) };
  const hasInquiryEndpoint = Boolean(inquiryEndpoint);
  const emailBrief = useMemo(() => createInquiryEmail(form, text.commission.fields, businessContact.email), [form, text]);

  const trackFormStart = () => {
    if (formStartTracked.current) return;
    formStartTracked.current = true;
    const attribution = inquiryAttribution();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "commission_form_start",
      form_name: "private_commission_brief",
      lead_source: attribution.utmSource || (attribution.fbclid ? "facebook" : "website"),
      campaign_name: attribution.utmCampaign || "",
      language,
    });
  };

  useEffect(() => {
    if (!hasInquiryEndpoint) return undefined;
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
    trackFormStart();
    setForm((current) => {
      const next = { ...current, [name]: value };
      try { window.localStorage.setItem(draftStorageKey, JSON.stringify(next)); } catch { /* Draft persistence is optional. */ }
      return next;
    });
    if (status.type !== "idle") setStatus({ type: "idle", message: "", reference: "" });
    if (copied) setCopied(false);
  };

  const handleFiles = (event) => {
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
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.company.trim() || !form.email.trim() || !form.projectType || !form.location.trim() || !form.message.trim()) {
      setStatus({ type: "error", message: text.commission.required, reference: "" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({ type: "error", message: emailText.invalidEmail, reference: "" });
      return;
    }
    if (!hasInquiryEndpoint) {
      setStatus({ type: "prepared", message: "", reference: "" });
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "contact_click", contact_method: "email", contact_source: "commission_form" });
      window.location.href = emailBrief.href;
      return;
    }
    if (fileError) return;
    if (!turnstileToken) {
      setStatus({ type: "error", message: text.commission.errorBody, reference: "" });
      return;
    }
    setStatus({ type: "loading", message: "", reference: "" });
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    payload.append("language", language);
    payload.append("source", typeof window === "undefined" ? "/commission/" : window.location.href);
    const attribution = inquiryAttribution();
    for (const key of ["landingPath", "referrerHost", "utmSource", "utmMedium", "utmCampaign", "utmId", "utmContent", "utmTerm", "fbclid"]) {
      payload.append(key, attribution[key] || "");
    }
    payload.append("interestRoute", new URL(window.location.href).searchParams.get("route") || "");
    payload.append("cf-turnstile-response", turnstileToken);
    files.forEach((file) => payload.append("files", file, file.name));

    try {
      const response = await fetch(inquiryEndpoint, { method: "POST", body: payload, headers: { Accept: "application/json" } });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || text.commission.errorBody);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "generate_lead",
        event_id: result.reference || "",
        form_name: "private_commission_brief",
        lead_source: attribution.utmSource || (attribution.fbclid ? "facebook" : "website"),
        campaign_name: attribution.utmCampaign || "",
        project_type: form.projectType,
        has_attachments: files.length > 0,
        language,
      });
      setStatus({ type: "success", message: "", reference: result.reference || "" });
      try { window.localStorage.removeItem(draftStorageKey); } catch { /* The submitted record is already stored by the server. */ }
    } catch {
      setStatus({ type: "error", message: text.commission.errorBody, reference: "" });
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

  const renderSelect = (name, label, items, required = false) => (
    <label className="field">
      <span>{label}{required ? " *" : ""}</span>
      <select name={name} value={form[name]} required={required} onChange={(event) => setValue(name, event.target.value)}>
        <option value="">{selectPrompts[language] || selectPrompts.en}</option>
        {items.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );

  return (
    <form className="commission-form" onSubmit={submit} noValidate>
      <div className="form-heading"><h2>{text.commission.formTitle}</h2><p>{hasInquiryEndpoint ? text.commission.formBody : emailText.body}</p></div>
      <div className="form-grid">
        <label className="field"><span>{text.commission.fields.name} *</span><input name="name" autoComplete="name" value={form.name} onChange={(event) => setValue("name", event.target.value)} placeholder={text.commission.placeholders.name} required /></label>
        <label className="field"><span>{text.commission.fields.company} *</span><input name="company" autoComplete="organization" value={form.company} onChange={(event) => setValue("company", event.target.value)} placeholder={text.commission.placeholders.company} required /></label>
        <label className="field"><span>{text.commission.fields.email} *</span><input type="email" name="email" autoComplete="email" value={form.email} onChange={(event) => setValue("email", event.target.value)} placeholder={text.commission.placeholders.email} required /></label>
        <label className="field"><span>{text.commission.fields.phone}</span><input name="phone" autoComplete="tel" value={form.phone} onChange={(event) => setValue("phone", event.target.value)} placeholder={text.commission.placeholders.phone} /></label>
        {renderSelect("projectType", text.commission.fields.projectType, text.commission.options.projectTypes, true)}
        <label className="field"><span>{text.commission.fields.location} *</span><input name="location" value={form.location} onChange={(event) => setValue("location", event.target.value)} placeholder={text.commission.placeholders.location} required /></label>
        {renderSelect("material", text.commission.fields.material, text.commission.options.materials)}
        {renderSelect("scale", text.commission.fields.scale, text.commission.options.scales)}
        <label className="field"><span>{text.commission.fields.timeline}</span><input name="timeline" value={form.timeline} onChange={(event) => setValue("timeline", event.target.value)} placeholder={text.commission.placeholders.timeline} /></label>
        {renderSelect("installation", text.commission.fields.installation, text.commission.options.installation)}
        <label className="field field-wide"><span>{text.commission.fields.message} *</span><textarea name="message" rows="6" value={form.message} onChange={(event) => setValue("message", event.target.value)} placeholder={text.commission.placeholders.message} required /></label>
        {hasInquiryEndpoint ? (
          <label className="field field-wide file-field">
            <span>{text.commission.fields.files}</span>
            <input type="file" name="files" accept=".pdf,.jpg,.jpeg,.png,.webp,.dwg" multiple onChange={handleFiles} />
            <span className="file-control"><FileArrowUp size={22} aria-hidden="true" /><strong>{text.commission.upload}</strong><small>{files.length ? files.map((file) => file.name).join(", ") : `${text.commission.uploadHint} ${deliveryCopy[language]?.total || deliveryCopy.en.total}`}</small></span>
            {fileError ? <small className="field-error">{fileError}</small> : null}
          </label>
        ) : (
          <div className="field field-wide file-field"><span>{text.commission.fields.files}</span><div className="file-control is-email"><EnvelopeSimple size={22} aria-hidden="true" /><strong>{businessContact.email}</strong><small>{emailText.files}</small></div></div>
        )}
        <label className="honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex="-1" autoComplete="off" value={form.website} onChange={(event) => setValue("website", event.target.value)} /></label>
      </div>
      {hasInquiryEndpoint ? <div className="commission-turnstile" ref={turnstileContainer} /> : null}
      <button className="form-submit" type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? <SpinnerGap className="spin" size={21} /> : <ArrowRight size={21} />}
        {status.type === "loading" ? text.commission.submitting : hasInquiryEndpoint ? text.commission.submit : emailText.submit}
      </button>
      {status.type === "prepared" ? (
        <div className="form-status is-prepared" role="status"><EnvelopeSimple size={24} /><div><strong>{emailText.preparedTitle}</strong><p>{emailText.preparedBody}</p><a href={emailBrief.href}>{emailText.reopen}</a><button type="button" onClick={copyBrief}>{copied ? emailText.copied : emailText.copy}</button>{copyFailed ? <textarea readOnly value={emailBrief.body} aria-label={emailText.manualCopy} /> : null}</div></div>
      ) : null}
      {status.type === "error" ? (
        <div className="form-status is-error" role="alert"><WarningCircle size={24} /><div><strong>{text.commission.errorTitle}</strong><p>{status.message || text.commission.errorBody}</p><a href={emailBrief.href}>{emailText.reopen}</a><a href={whatsappHref(followupMessage)} target="_blank" rel="noreferrer">{text.commission.whatsapp}</a></div></div>
      ) : null}
      {status.type === "success" ? (
        <div className="form-status is-success" role="status"><Check size={24} weight="bold" /><div><strong>{text.commission.successTitle}</strong><p>{deliveryCopy[language]?.success || deliveryCopy.en.success}</p>{status.reference ? <p>{text.commission.reference}: {status.reference}</p> : null}<div><a href={whatsappHref(followupMessage)} target="_blank" rel="noreferrer"><WhatsappLogo size={18} weight="fill" />{text.commission.whatsapp}</a><a href={`mailto:${businessContact.email}`}><EnvelopeSimple size={18} />{text.commission.email}</a></div></div></div>
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
          <div><p>{text.evidence.cards[0][1]}</p><a href={`mailto:${businessContact.email}`}>{businessContact.email}</a></div>
        </aside>
      </section>
    </>
  );
}

function SiteFooter({ text }) {
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
        <div><h3>{text.footer.routes}</h3>{routeLinks.map((route) => <a key={route} href={`/${route}/`}>{text.routeNames[route]}</a>)}</div>
        <div><h3>{text.footer.materials}</h3>{materialLinks.map((route) => <a key={route} href={`/${route}/`}>{text.routeNames[route]}</a>)}</div>
        <div><h3>{text.footer.studio}</h3><a href="/custom-outdoor-sculpture-supplier/">Supplier route</a><a href="/process/">{text.nav.process}</a><a href="/projects/">{text.nav.projects}</a><a href="/faq/">{text.routeNames.faq}</a><a href="/insights/">Insights</a></div>
        <div><h3>{text.footer.contact}</h3><a href={`mailto:${businessContact.email}`}>{text.nav.contact}</a><a href={whatsappHref("Hello WEIERYANG, I would like to discuss a sculpture project.")} target="_blank" rel="noreferrer">WhatsApp</a><a href="/commission/">{text.footer.private}</a><span>weieryangart.com</span></div>
      </div>
      <div className="footer-base"><span>© {new Date().getFullYear()} {text.footer.rights}</span><span>{businessContact.email}</span></div>
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
    if (route || !window.location.hash) return undefined;
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    const scrollTimer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    }, 180);
    return () => window.clearTimeout(scrollTimer);
  }, [route]);

  const page = route === "commission"
    ? <CommissionPage text={text} language={language} />
    : routeKeys.includes(route)
      ? <SecondaryPage route={route} text={text} language={language} />
      : <HomePage text={text} />;

  return (
    <main className="site-shell" id="top">
      <SiteHeader language={language} setLanguage={setLanguage} text={text} />
      {page}
      <SiteFooter text={text} />
    </main>
  );
}
