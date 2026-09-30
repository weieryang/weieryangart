import fs from "node:fs";
import path from "node:path";
import { hospitalityService, hospitalitySections, hospitalityEntry } from "../src/hospitalityContent.js";
import { routeSeoContent } from "../src/seoContent.js";

const site = "https://weieryangart.com";
const script = "/src/main.jsx";
const today = "2026-09-30";
const ogImage = `${site}/og-image.jpg`;
const imageBase = `${site}/seo-media`;

const evidenceImages = {
  middleEastLandmarkInstallation: {
    file: "middle-east-stainless-steel-landmark-installation.webp",
    width: 2000,
    height: 1398,
    alt: "Large stainless steel flying-bird landmark sculpture being lifted into position by cranes at a Middle East public plaza",
    caption: "Verified construction-phase record showing crane coordination, segment handling, and site installation for a large Middle East landmark sculpture.",
  },
  largeStructuralAssembly: {
    file: "large-sculpture-structural-assembly.webp",
    width: 2000,
    height: 1219,
    alt: "Large metal landmark sculpture core and segmented wings under construction with temporary access and cranes",
    caption: "Verified work-in-progress record showing the structural core, segmented form, temporary access, and crane coordination.",
  },
  stainlessWingSlatInstallation: {
    file: "stainless-steel-wing-slat-installation.webp",
    width: 2000,
    height: 1290,
    alt: "Parallel stainless steel wing slats being aligned during construction of a large flying-bird landmark sculpture",
    caption: "Verified construction-phase record showing controlled alignment of repeated stainless steel wing members.",
  },
  birdSculpture: {
    file: "hero-plaza-night-v3.webp",
    width: 1672,
    height: 941,
    alt: "WEIERYANG brushed stainless steel flying-bird sculpture study with disciplined parallel wing slats in a modern reflecting plaza",
    caption: "Concept-stage plaza study based on verified construction geometry; shown for form, site integration, finish, reflection, and structural review.",
  },
  studioDesk: {
    file: "studio-material-desk.webp",
    width: 1536,
    height: 1024,
    alt: "WEIERYANG sculpture material desk with stone, bronze, finish samples, and project drawings",
    caption: "Material desk evidence for sculpture route, finish, and site review.",
  },
  conceptSketch: {
    file: "concept-sketch.webp",
    width: 1448,
    height: 1086,
    alt: "Full concept sketch for a site-specific garden sculpture with scale and landscape context",
    caption: "Full sketch evidence preserves scale, base, people, and landscape context.",
  },
  materialSamples: {
    file: "material-samples-dark.webp",
    width: 1536,
    height: 1024,
    alt: "Dark material samples for bronze, stainless steel, black stone, and textured sculpture finishes",
    caption: "Material samples show finish direction before final sculpture quotation.",
  },
  structuralStudy: {
    file: "structural-engineering.webp",
    width: 1122,
    height: 1402,
    alt: "Engineering screen for sculpture structure, segmentation, and technical review",
    caption: "Engineering review supports structure, segmentation, and installation planning.",
  },
  fabricationWorkshop: {
    file: "fabrication-workshop.webp",
    width: 1122,
    height: 1402,
    alt: "Sculpture fabrication workshop evidence with material handling and production review",
    caption: "Workshop evidence connects concept decisions to fabrication and quality control.",
  },
  installedProject: {
    file: "installed-project.webp",
    width: 1448,
    height: 1086,
    alt: "Installed outdoor sculpture project evidence with site scale and landscape placement",
    caption: "Installed project evidence shows scale, setting, and viewing distance.",
  },
  materialSwatchStrip: {
    file: "material-swatch-strip.webp",
    width: 1600,
    height: 711,
    alt: "Sculpture material swatch strip with bronze, stone, stainless, and textured surface samples",
    caption: "Material swatches make finish decisions concrete before production.",
  },
  designDevelopment: {
    file: "design-development.webp",
    width: 1122,
    height: 1402,
    alt: "Design development evidence for custom sculpture scale, form, and material decisions",
    caption: "Design development evidence links site reading to fabrication decisions.",
  },
  sourceEngineeringAtelier: {
    file: "source-engineering-atelier.webp",
    width: 941,
    height: 1672,
    alt: "Atelier engineering evidence for sculpture material review and custom production planning",
    caption: "Atelier evidence supports serious review before price and production.",
  },
  hotelLobbyWhaleInstallation: {
    file: "hotel-lobby-stainless-steel-whale-installation.webp",
    width: 1600,
    height: 900,
    alt: "Two views of a mirror stainless steel whale sculpture with suspended spheres in a glazed commercial lobby",
    caption: "Commercial-interior reference for sculpture footprint, suspended elements, water-feature edges, daylight, and reflection review.",
  },
  commercialAtriumMirrorSculpture: {
    file: "commercial-atrium-mirror-stainless-steel-sculpture.webp",
    width: 1200,
    height: 1600,
    alt: "Large mirror stainless steel sculpture in a tall commercial interior showing scale and ceiling clearance",
    caption: "Commercial-interior reference for scale, ceiling clearance, occupied envelope, and reflected surroundings.",
  },
  mirrorFinishDetail: {
    file: "mirror-stainless-steel-sculpture-finish-detail.webp",
    width: 1067,
    height: 1600,
    alt: "Mirror polished stainless steel sculpture with bronze toned inset lines during workshop finish review",
    caption: "Workshop finish reference for polish, seam alignment, inset colour, reflection, and protection review.",
  },
  largeWorkshopFabrication: {
    file: "large-sculpture-workshop-fabrication.webp",
    width: 1080,
    height: 1440,
    alt: "Large sculptural form under fabrication with scaffold access and temporary workshop support",
    caption: "Workshop fabrication reference showing production scale, temporary support, access, and surface work.",
  },
  hotelLobbyMirrorFinish: {
    file: "hotel-lobby-mirror-stainless-steel-finish.webp",
    width: 1600,
    height: 900,
    alt: "Two close views of a large mirror-polished stainless steel sculpture in a tall commercial interior",
    caption: "Commercial-interior reference for mirror finish, reflected architecture, viewing angles, and lighting review.",
  },
  mirrorReflectionLighting: {
    file: "mirror-stainless-steel-reflection-lighting.webp",
    width: 1200,
    height: 1600,
    alt: "Front view of mirror polished stainless steel sculpture reflecting ceiling lights and interior architecture",
    caption: "Front finish view for reflection continuity, highlight concentration, and local distortion review.",
  },
  mirrorPanelInlayWorkshop: {
    file: "mirror-stainless-steel-panel-inlay-workshop.webp",
    width: 1067,
    height: 1600,
    alt: "Workshop view of mirror polished stainless steel sculpture with bronze toned panel inlays",
    caption: "Workshop reference for panel polish, seam alignment, inset boundaries, and protection review.",
  },
  mirrorRearFinishInspection: {
    file: "mirror-stainless-steel-rear-finish-inspection.webp",
    width: 1067,
    height: 1600,
    alt: "Rear workshop view of mirror polished stainless steel sculpture with bronze toned inset lines",
    caption: "Rear finish reference for less prominent faces, inlay continuity, and base-transition inspection.",
  },
  hotelArrivalSiteContext: {
    file: "hotel-arrival-sculpture-site-context.webp",
    width: 1600,
    height: 900,
    alt: "Two supplied commercial landscape references showing sculpture against building and plaza scale",
    caption: "Commercial-landscape references for facade, paving, approach distance, and arrival-context review; project identity and supplier relationship are not asserted.",
  },
  hotelArrivalPedestrianFlow: {
    file: "hotel-arrival-sculpture-pedestrian-flow.webp",
    width: 1064,
    height: 1600,
    alt: "Commercial plaza sculpture viewed within active pedestrian circulation and seating zones",
    caption: "Commercial-plaza reference for pedestrian routes, pause zones, sightlines, and touch-distance review.",
  },
  resortEntranceCanopyReference: {
    file: "resort-entrance-canopy-sculpture-reference.webp",
    width: 1600,
    height: 900,
    alt: "Two supplied landscape canopy sculpture references showing scale planting and construction context",
    caption: "Landscape references for canopy diameter, clear height, planting, paving, and project-programme review; project identity and supplier relationship are not asserted.",
  },
  resortCanopyHumanScale: {
    file: "resort-sculpture-canopy-human-scale.webp",
    width: 959,
    height: 1279,
    alt: "Reflective canopy sculpture in a construction setting with workers and access scaffold for scale reference",
    caption: "Construction-setting reference for overall height, occupied envelope, underside, and installation-access review.",
  },
  hotelEngineeringOverview: {
    file: "hotel-engineering-case-overview.webp",
    width: 1600,
    height: 900,
    alt: "Three supplied views of a large mirror stainless steel sculpture inside a commercial atrium",
    caption: "Commercial-atrium reference for hotel-scale sightlines, mirror finish, building interfaces, and installation review; project attribution is not asserted.",
  },
  hotelEngineeringAtriumScale: {
    file: "hotel-engineering-case-atrium-scale.webp",
    width: 1200,
    height: 1600,
    alt: "Full-height view of a large mirror stainless steel sculpture against skylight walls and lobby floor",
    caption: "Full-height commercial-atrium reference for mass, vertical clearance, guest approach, and floor-interface review.",
  },
  hotelEngineeringReflection: {
    file: "hotel-engineering-case-reflection-detail.webp",
    width: 900,
    height: 1200,
    alt: "Front close view of mirror stainless steel sculpture reflecting atrium walls ceiling lines and visitors",
    caption: "Reflection reference showing ceiling, wall, and visitor images moving across compound mirror-polished geometry.",
  },
  hotelEngineeringCloseView: {
    file: "hotel-engineering-case-close-view.webp",
    width: 1200,
    height: 1600,
    alt: "Close upward view of large mirror stainless steel atrium sculpture showing panels highlights and skylight relationship",
    caption: "Close-view reference for panel boundaries, highlight control, guest proximity, and finish inspection.",
  },
  hotelAtriumPlanningOverview: {
    file: "hotel-atrium-sculpture-planning-overview.webp",
    width: 1600,
    height: 900,
    alt: "Three commercial atrium sculpture references showing artwork across several viewing levels",
    caption: "Commercial-atrium references for multi-level scale, lower-level approach, upper-level views, and building-interface review; project attribution is not asserted.",
  },
  hotelAtriumMultilevelReference: {
    file: "hotel-atrium-sculpture-multilevel-reference.webp",
    width: 1200,
    height: 1600,
    alt: "Colourful large sculpture extending across several levels of a commercial atrium",
    caption: "Commercial-atrium reference for cross-level composition, guest circulation, balustrade relationships, and occupied-envelope review.",
  },
  hotelAtriumUpperLevelView: {
    file: "hotel-atrium-sculpture-upper-level-view.webp",
    width: 1200,
    height: 1600,
    alt: "Commercial atrium sculpture seen beside an upper terrace and roof opening",
    caption: "Upper-level reference for silhouette, roof opening, terrace approach, and balustrade coordination.",
  },
  hotelAtriumBaseClearance: {
    file: "hotel-atrium-sculpture-base-clearance.webp",
    width: 1200,
    height: 1600,
    alt: "Oversized sculptural form beside planting and lower-level guest circulation",
    caption: "Lower-level reference for base treatment, projections, planting, guest proximity, and cleaning access.",
  },
  hotelAtriumCrossLevelSightline: {
    file: "hotel-atrium-sculpture-cross-level-sightline.webp",
    width: 1200,
    height: 1600,
    alt: "Tall commercial atrium artwork viewed across an upper terrace and lower floor",
    caption: "Cross-level reference for section-based sightline, terrace access, and installation-route review.",
  },
};

const routeImageKeys = {
  "": ["birdSculpture", "conceptSketch", "materialSamples", "structuralStudy"],
  commission: ["materialSamples", "structuralStudy", "fabricationWorkshop"],
  "garden-sculpture": ["conceptSketch", "materialSamples", "installedProject"],
  "public-art": ["middleEastLandmarkInstallation", "largeStructuralAssembly", "stainlessWingSlatInstallation"],
  "resort-sculpture": ["resortEntranceCanopyReference", "resortCanopyHumanScale", "hotelArrivalSiteContext", "materialSamples"],
  "water-feature-sculpture": ["materialSamples", "structuralStudy", "materialSwatchStrip"],
  "bronze-sculpture": ["materialSamples", "materialSwatchStrip", "sourceEngineeringAtelier"],
  "stainless-steel-sculpture": ["middleEastLandmarkInstallation", "stainlessWingSlatInstallation", "materialSamples"],
  "stone-sculpture": ["conceptSketch", "materialSwatchStrip", "materialSamples"],
  "custom-sculpture": ["studioDesk", "conceptSketch", "fabricationWorkshop"],
  projects: ["middleEastLandmarkInstallation", "hotelEngineeringOverview", "largeStructuralAssembly", "stainlessWingSlatInstallation"],
  process: ["designDevelopment", "structuralStudy", "fabricationWorkshop"],
  materials: ["materialSamples", "materialSwatchStrip", "studioDesk"],
  faq: ["studioDesk", "materialSamples", "structuralStudy"],
};

const preservedRoutes = [
  { url: `${site}/insights/large-hotel-atrium-sculpture-planning-guide/`, lastmod: "2026-09-30", priority: "0.91", imageKeys: ["hotelAtriumPlanningOverview", "hotelAtriumMultilevelReference", "hotelAtriumUpperLevelView", "hotelAtriumBaseClearance", "hotelAtriumCrossLevelSightline"] },
  { url: `${site}/projects/hotel-lobby-sculpture-engineering-case/`, lastmod: "2026-09-30", priority: "0.92", imageKeys: ["hotelEngineeringOverview", "hotelEngineeringAtriumScale", "hotelEngineeringReflection", "hotelEngineeringCloseView"] },
  { url: `${site}/custom-outdoor-sculpture-supplier/`, lastmod: "2026-09-30", priority: "0.91", imageKeys: ["hotelEngineeringOverview", "middleEastLandmarkInstallation", "largeStructuralAssembly", "stainlessWingSlatInstallation", "materialSamples", "studioDesk"] },
  { url: `${site}/insights/`, lastmod: "2026-09-30", priority: "0.87", imageKeys: ["hotelAtriumPlanningOverview", "hotelEngineeringOverview", "hotelLobbyMirrorFinish", "hotelArrivalSiteContext", "resortEntranceCanopyReference"] },
  { url: `${site}/insights/hotel-lobby-mirror-stainless-steel-sculpture/`, lastmod: "2026-09-30", priority: "0.89", imageKeys: ["hotelLobbyMirrorFinish", "mirrorReflectionLighting", "mirrorPanelInlayWorkshop", "mirrorRearFinishInspection"] },
  { url: `${site}/insights/hotel-lobby-sculpture-renovation-guide/`, lastmod: "2026-09-30", priority: "0.89", imageKeys: ["hotelLobbyWhaleInstallation", "commercialAtriumMirrorSculpture", "mirrorFinishDetail", "largeWorkshopFabrication"] },
  { url: `${site}/insights/large-outdoor-sculpture-cost-guide/`, lastmod: "2026-09-19", priority: "0.9", imageKeys: ["studioDesk", "materialSamples", "structuralStudy", "largeStructuralAssembly", "middleEastLandmarkInstallation", "fabricationWorkshop"] },
  { url: `${site}/insights/304-vs-316l-stainless-steel-outdoor-sculpture/`, lastmod: "2026-09-15", priority: "0.89", imageKeys: ["materialSamples", "stainlessWingSlatInstallation", "largeStructuralAssembly", "middleEastLandmarkInstallation"] },
  { url: `${site}/insights/coastal-stainless-steel-sculpture-maintenance-checklist/`, lastmod: today, priority: "0.88", imageKeys: ["materialSamples", "stainlessWingSlatInstallation", "middleEastLandmarkInstallation", "largeStructuralAssembly", "studioDesk", "structuralStudy"] },
  { url: `${site}/insights/large-outdoor-sculpture-foundation-anchor-checklist/`, lastmod: "2026-09-14", priority: "0.88", imageKeys: ["structuralStudy", "largeStructuralAssembly", "middleEastLandmarkInstallation", "stainlessWingSlatInstallation", "studioDesk", "materialSamples"] },
  { url: `${site}/insights/outdoor-sculpture-quotation-scope-checklist/`, lastmod: "2026-09-14", priority: "0.88", imageKeys: ["studioDesk", "materialSamples", "structuralStudy", "fabricationWorkshop", "largeStructuralAssembly", "middleEastLandmarkInstallation"] },
  { url: `${site}/insights/resort-entrance-sculpture-scale-guide/`, lastmod: "2026-09-27", priority: "0.87", imageKeys: ["resortEntranceCanopyReference", "resortCanopyHumanScale", "materialSamples", "structuralStudy", "middleEastLandmarkInstallation", "installedProject"] },
  { url: `${site}/insights/large-sculpture-export-packing-checklist/`, lastmod: today, priority: "0.87", imageKeys: ["largeStructuralAssembly", "fabricationWorkshop", "structuralStudy", "middleEastLandmarkInstallation", "stainlessWingSlatInstallation"] },
  { url: `${site}/insights/large-stainless-steel-sculpture-fabrication-checklist/`, lastmod: today, priority: "0.88", imageKeys: ["largeStructuralAssembly", "middleEastLandmarkInstallation", "stainlessWingSlatInstallation", "materialSamples", "structuralStudy"] },
  { url: `${site}/insights/water-feature-sculpture-material-checklist/`, lastmod: today, priority: "0.86", imageKeys: ["birdSculpture", "materialSamples", "materialSwatchStrip", "structuralStudy", "studioDesk"] },
  { url: `${site}/insights/overseas-sculpture-installation-checklist/`, lastmod: today, priority: "0.86", imageKeys: ["largeStructuralAssembly", "studioDesk", "materialSamples", "middleEastLandmarkInstallation", "stainlessWingSlatInstallation"] },
  { url: `${site}/insights/hotel-arrival-sculpture-site-brief/`, lastmod: "2026-09-27", priority: "0.86", imageKeys: ["hotelArrivalSiteContext", "hotelArrivalPedestrianFlow", "middleEastLandmarkInstallation", "materialSamples", "stainlessWingSlatInstallation"] },
  { url: `${site}/insights/middle-east-stainless-steel-landmark-sculpture/`, lastmod: today, priority: "0.88", imageKeys: ["middleEastLandmarkInstallation", "largeStructuralAssembly", "stainlessWingSlatInstallation", "birdSculpture"] },
  { url: `${site}/insights/material-led-sculpture-review-2026/`, lastmod: today, priority: "0.8", imageKeys: ["designDevelopment", "materialSamples", "fabricationWorkshop"] },
  { url: `${site}/insights/how-to-commission-custom-outdoor-sculpture/`, lastmod: "2026-07-01", priority: "0.78", imageKeys: ["conceptSketch", "materialSamples"] },
  { url: `${site}/insights/316l-stainless-steel-vs-bronze-vs-stone/`, lastmod: "2026-07-01", priority: "0.78", imageKeys: ["materialSamples", "materialSwatchStrip"] },
  { url: `${site}/insights/landscape-sculpture-quote-brief/`, lastmod: "2026-07-01", priority: "0.78", imageKeys: ["studioDesk", "structuralStudy"] },
];

const sharedFaq = [
  ["What should I send before requesting a quote?", "Send site photos, plan dimensions, desired scale, material direction, destination country, deadline, and any installation constraints."],
  ["Can WEIERYANG review confidential drawings?", "Yes. Confidential drawings can be reviewed privately, and an NDA can be discussed before deeper technical review."],
  ["Which materials are common for outdoor sculpture?", "Common routes include bronze, 316L stainless steel, stone, corten steel, and hybrid combinations selected for exposure, touch, and maintenance."],
  ["Do you support overseas delivery?", "The commission route can include segmentation, trial assembly, export packing, documents, and installation guidance for overseas projects."],
];

const pages = [
  {
    slug: "",
    file: "index.html",
    title: "Custom Hotel & Resort Sculpture | WEIERYANG Studio",
    description: "Custom sculpture for U.S. hotels and resorts: lobby, atrium and entrance pieces with design, fabrication, export packing and installation guidance.",
    type: "WebSite",
    h1: "SCULPTURE, ENGINEERED FOR PLACE.",
    intro: "Custom sculpture for hotels and resorts. Sculpture design, fabrication and delivery planning for U.S. hotel teams and international projects.",
    lastmod: "2026-09-30",
    sections: [
      ["Sculpture routes", ["Garden sculpture for private landscapes and parks", "Public art for civic plazas and cultural districts", "Resort and water feature sculpture for hospitality projects"]],
      ["Material proof", ["Bronze for warmth, patina, and touch", "316L stainless steel for public and coastal exposure", "Stone and hybrid routes for grounded outdoor work"]],
      ["Commission path", ["Site review before style", "Material and scale decision before quotation", "Engineering, fabrication, packing, and installation guidance before delivery"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "commission",
    file: "commission/index.html",
    title: "Request a Hotel Sculpture Project Review | WEIERYANG",
    description: "Send your hotel sculpture brief, site drawings, dimensions and installation schedule. Project review for U.S. hotel teams and international buyers.",
    type: "ContactPage",
    h1: "Private sculpture commission brief",
    intro: "For hotel owners, designers, art consultants and project buyers in the United States and worldwide. Send site drawings, dimensions in feet/inches or metric, destination city and state, finish direction and opening or renovation schedule. Submitted details and files are emailed to the studio for review.",
    lastmod: "2026-09-30",
    sections: [
      ["What to prepare", ["Site photos or drawings", "Target height and viewing distance", "Preferred material route", "Destination country and deadline"]],
      ["What WEIERYANG reviews", ["Site condition and approach sequence", "Material exposure and finish samples", "Structure, segmentation, packing, and installation logic"]],
      ["Best-fit inquiries", ["Garden and estate sculpture", "Resort arrival and water feature sculpture", "Permanent public landscape art"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "garden-sculpture",
    file: "garden-sculpture/index.html",
    title: "Custom Garden Sculpture | WEIERYANG Sculpture Studio",
    description: "Garden sculpture commissions for private landscapes, parks, water gardens, resorts, and estate sites by WEIERYANG.",
    type: "Service",
    h1: "Custom garden sculpture planned from site, planting, water, and scale",
    intro: "Garden sculpture should be judged from approach sequence, planting height, seasonal light, water edges, maintenance access, and viewing distance. WEIERYANG develops garden sculpture as a site-specific commission rather than a catalog object, with material decisions made around outdoor exposure and landscape context.",
    sections: [
      ["Garden uses", ["Private estate gardens", "Park walks and planted courts", "Resort gardens and water edges"]],
      ["Material directions", ["Bronze and stone for grounded warmth", "Brushed stainless steel for controlled reflection", "Corten and granite for weathered landscape edges"]],
      ["Custom process", ["Read photos, drawings, and access routes", "Resolve scale, base, drainage, and finish", "Plan fabrication, packing, export, and installation support"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "public-art",
    file: "public-art/index.html",
    title: "Public Art Sculpture | WEIERYANG Sculpture Studio",
    description: "Permanent public art and outdoor sculpture commissions with material, engineering, export, and installation proof.",
    type: "Service",
    h1: "Permanent public art with engineering and material proof",
    intro: "Public sculpture needs more than a strong silhouette. For plazas, parks, cultural districts, and municipal landscapes, WEIERYANG treats durability, structure, segmentation, finish control, packing, and installation sequence as part of the visual decision.",
    sections: [
      ["Public settings", ["City parks and civic plazas", "Cultural districts and museum landscapes", "Commercial public realm projects"]],
      ["Technical concerns", ["Wind, touch, weathering, and cleaning", "Internal structure and foundation assumptions", "Export packing and installation access"]],
      ["Review materials", ["Site drawings and photos", "Target dimensions and viewing distance", "Local climate and deadline"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "resort-sculpture",
    file: "resort-sculpture/index.html",
    title: "Custom Sculpture for U.S. Hotels & Resorts | WEIERYANG",
    description: "Custom hotel lobby, atrium and resort sculpture for U.S. project teams. Review design, samples, fabrication, export packing and local installation scope.",
    type: "Service",
    h1: "Custom resort and hotel sculpture for arrival courts and destination landscapes",
    intro: "WEIERYANG develops custom resort and hotel sculpture for entrance courts, porte-cocheres, water gardens, lobby-adjacent landscapes, villas, and clubs. The scope can include site and scale review, material development, structural coordination, sculpture fabrication, export packing, and overseas installation guidance.",
    lastmod: "2026-09-30",
    usePrimarySocialImage: true,
    keywords: ["custom resort sculpture", "custom hotel sculpture", "hotel entrance sculpture", "resort entrance sculpture", "hospitality sculpture supplier", "hotel landscape sculpture", "outdoor sculpture for hotels", "custom sculpture fabrication"],
    serviceTypes: ["Custom resort sculpture", "Custom hotel sculpture", "Hotel entrance sculpture", "Hospitality landscape sculpture"],
    audience: "Hotel owners, resort developers, architects, landscape designers and hospitality procurement teams",
    sections: [
      ["Hotel and resort locations", ["Hotel entrance sculpture and arrival-court landmarks", "Porte-cochere and lobby-adjacent landscape art", "Water gardens, pool edges and destination landscape sculpture"]],
      ["Design and material decisions", ["Approach distance, facade mass and guest circulation", "Mirror or brushed stainless steel, bronze, stone and hybrid routes", "Lighting, water exposure, touch, cleaning and maintenance access"]],
      ["Fabrication and delivery scope", ["Design development, approved samples and structural coordination", "Workshop fabrication, trial assembly, finish review and export packing", "Overseas installation guidance coordinated with the local project team", "For quotation: site plans, approach photos, target scale, destination and installation date"]],
    ],
    faq: [
      ["What is included in a custom resort or hotel sculpture scope?", "Depending on the commission, the scope can include site and scale review, concept development, material and finish samples, structural coordination, sculpture fabrication, trial assembly, export packing and overseas installation guidance. Final responsibilities are agreed with the local project team."],
      ["What should a hotel developer send before requesting a sculpture quote?", "Send a site plan, photographs from vehicle and pedestrian approaches, target dimensions, material direction, destination country, opening or installation date, foundation information and access constraints."],
      ["Which materials work for hotel entrance and resort landscape sculpture?", "Common routes include brushed or mirror stainless steel, bronze, stone and hybrid systems. The correct choice depends on climate, salt or water exposure, touch, lighting, cleaning, maintenance and the intended visual weight."],
      ["Can WEIERYANG support overseas resort sculpture installation?", "The delivery route can include segmentation, trial assembly, export packing, lifting information and installation guidance for the local contractor. Site engineering and statutory approval remain coordinated with qualified local professionals."],
    ],
  },
  {
    slug: "water-feature-sculpture",
    file: "water-feature-sculpture/index.html",
    title: "Water Feature Sculpture | WEIERYANG Sculpture Studio",
    description: "Water feature sculpture for fountains, reflecting pools, water courts, resorts, and outdoor landscape projects.",
    type: "Service",
    h1: "Water feature sculpture resolved around reflection, splash, and maintenance",
    intro: "Water changes the sculpture decision. The form, base, edge, gap, finish, fastener, and drainage route must work with splash, reflection, cleaning access, lighting, and filtration systems. WEIERYANG reviews water feature sculpture as a material and site problem before style.",
    sections: [
      ["Water settings", ["Reflecting pools", "Fountain courts", "Resort water edges and landscape basins"]],
      ["Key checks", ["Splash radius and drainage", "Reflection, glare, and night lighting", "Cleaning and maintenance access"]],
      ["Useful first brief", ["Pool or fountain drawings", "Water depth and service access", "Preferred metal or stone route"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "bronze-sculpture",
    file: "bronze-sculpture/index.html",
    title: "Bronze Sculpture | WEIERYANG Sculpture Studio",
    description: "Bronze sculpture and bronze hybrid material routes for gardens, resorts, water features, and outdoor commissions.",
    type: "Service",
    h1: "Bronze sculpture for warmth, patina, and touch",
    intro: "Bronze is strongest when its warmth, edge highlights, surface depth, and long-term patina are controlled for the site. WEIERYANG uses bronze as an architectural material route for gardens, resorts, water features, and public landscapes rather than a generic luxury finish.",
    sections: [
      ["Bronze decisions", ["Patina depth and color direction", "Touchable areas and wear points", "Lighting and viewing distance"]],
      ["Hybrid routes", ["Bronze with black stone", "Bronze with brushed stainless steel", "Bronze details on water feature sculpture"]],
      ["Project evidence", ["Finish samples", "Base and structure review", "Packing and export planning"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "stainless-steel-sculpture",
    file: "stainless-steel-sculpture/index.html",
    title: "Stainless Steel Sculpture | WEIERYANG Sculpture Studio",
    description: "Stainless steel sculpture with controlled reflection, 316L options, structure planning, and export-ready fabrication.",
    type: "Service",
    h1: "Stainless steel sculpture with grade, reflection, and structure decided early",
    intro: "Stainless steel can look precise or harsh depending on grade, reflection, weld control, and site exposure. WEIERYANG develops stainless steel sculpture for public, coastal, garden, and resort projects with attention to brushed direction, 316L options, segmentation, and export-ready fabrication.",
    sections: [
      ["Best uses", ["Coastal and resort sites", "Permanent public exterior sculpture", "Modern garden and plaza commissions"]],
      ["Technical checks", ["Stainless grade and exposure", "Welds, panels, and internal structure", "Reflection, glare, and surface direction"]],
      ["Related products", ["Outdoor mirror stainless sculpture", "Stainless water feature sculpture", "Animal and abstract stainless forms"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "stone-sculpture",
    file: "stone-sculpture/index.html",
    title: "Stone Sculpture | WEIERYANG Sculpture Studio",
    description: "Stone sculpture, stone bases, and stone-metal sculpture routes for permanent outdoor landscape projects.",
    type: "Service",
    h1: "Stone sculpture and stone bases with mass, texture, and weathering proof",
    intro: "Stone gives a sculpture weight, grounding, and landscape credibility, but it also changes lifting access, foundation logic, surface texture, drainage, and long-term weathering. WEIERYANG develops stone sculpture and stone-metal combinations for outdoor commissions.",
    sections: [
      ["Stone routes", ["Carved stone sculpture", "Stone bases for bronze or stainless pieces", "Black stone and bronze hybrid sculpture"]],
      ["Site factors", ["Base condition and foundation", "Water exposure and drainage", "Texture, touch, and maintenance"]],
      ["Brief requirements", ["Desired stone tone or texture", "Access for lifting and installation", "Target scale and destination country"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "custom-sculpture",
    file: "custom-sculpture/index.html",
    title: "Custom Sculpture | WEIERYANG Sculpture Studio",
    description: "Custom sculpture commissions for architects, landscape designers, hospitality developers, and public art teams.",
    type: "Service",
    h1: "Custom sculpture starts with site facts, not a catalog shape",
    intro: "A serious custom sculpture commission starts with site use, viewing distance, climate, material exposure, installation access, and delivery route. WEIERYANG supports architects, landscape designers, hospitality developers, and public art teams who need project-specific sculpture rather than standard product selection.",
    sections: [
      ["Project types", ["Garden and estate commissions", "Public landscape sculpture", "Resort, hotel, and water feature projects"]],
      ["Design inputs", ["Sketches, drawings, CAD, or site photos", "Material and finish direction", "Country, deadline, and installation context"]],
      ["Execution path", ["Concept and material route", "Engineering and workshop proof", "Packing, export, and installation guidance"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "projects",
    file: "projects/index.html",
    title: "Sculpture Construction & Reference Studies | WEIERYANG",
    description: "Verified landmark construction records and separately labeled commercial-interior references for hotel sculpture planning. Review the evidence behind each image.",
    type: "CollectionPage",
    h1: "Sculpture engineering cases for hotel interiors and landmark sites",
    intro: "Review two evidence-led project routes: a hotel-lobby engineering case based on supplied commercial-atrium references, and a verified construction record for a large stainless steel flying-bird landmark at a Middle East public site. Each route states what the images prove and what remains undisclosed.",
    lastmod: "2026-09-30",
    keywords: ["sculpture engineering case study", "hotel lobby sculpture project", "hotel sculpture engineering", "large sculpture construction", "stainless steel sculpture installation"],
    sections: [
      ["Hotel interior case", ["Atrium scale and guest sightlines", "Mirror stainless steel finish and lighting", "Base, access, installation and handover interfaces"]],
      ["Landmark construction", ["Segmented wing structure", "Repeated stainless steel members", "Crane-assisted lifting and site alignment"]],
      ["Evidence boundary", ["Commercial-atrium reference is not claimed as a WEIERYANG commission", "Landmark images are verified construction-phase records", "Undisclosed client, city and dimensions are not inferred"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "process",
    file: "process/index.html",
    title: "Sculpture Process | WEIERYANG Sculpture Studio",
    description: "WEIERYANG sculpture process from site review and material route to engineering, fabrication, packing, and installation support.",
    type: "HowTo",
    h1: "A custom sculpture process built to reduce risk before production",
    intro: "WEIERYANG's process begins with site reading and material judgment, then moves through scale testing, engineering review, surface samples, fabrication control, export packing, and installation guidance. The aim is to make the quote feel engineered, not guessed.",
    sections: [
      ["Read", ["Site photos, plans, climate, water, planting, and access", "Viewing distance and pedestrian approach", "Maintenance and installation constraints"]],
      ["Resolve", ["Material route and scale", "Structure, base, segmentation, and finish", "Surface samples and review drawings"]],
      ["Deliver", ["Workshop quality control", "Trial assembly and packing method", "Export documents and installation guidance"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "materials",
    file: "materials/index.html",
    title: "Sculpture Materials | WEIERYANG Sculpture Studio",
    description: "Sculpture material routes for bronze, stainless steel, stone, corten, patina, reflection, drainage, and outdoor exposure.",
    type: "CollectionPage",
    h1: "Sculpture material decisions for bronze, stainless steel, stone, and hybrids",
    intro: "Materials decide whether a sculpture survives the site with dignity. WEIERYANG reviews bronze, stainless steel, stone, corten, patina, reflection, drainage, touch, and outdoor exposure as project decisions before final decoration.",
    sections: [
      ["Bronze", ["Warmth, patina, and touch", "Garden and water feature routes", "Stone or stainless pairings"]],
      ["Stainless steel", ["316L options for coastal exposure", "Brushed or controlled reflection", "Structure, welds, and public durability"]],
      ["Stone and hybrids", ["Mass, texture, and grounding", "Stone bases and plinths", "Drainage and weathering behavior"]],
    ],
    faq: sharedFaq,
  },
  {
    slug: "faq",
    file: "faq/index.html",
    title: "Sculpture FAQ | WEIERYANG Sculpture Studio",
    description: "WEIERYANG sculpture FAQ for custom quotes, drawings, NDA, material samples, overseas delivery, and installation support.",
    type: "FAQPage",
    h1: "Sculpture commission FAQ",
    intro: "These questions help overseas buyers understand what makes a custom sculpture quote reliable: drawings, site facts, material route, confidentiality, samples, packing, export, and installation support.",
    sections: [
      ["Before inquiry", ["Prepare site photos or drawings", "Define approximate scale and material direction", "Share country, schedule, and installation context"]],
      ["During review", ["The studio checks site, material, structure, packing, and maintenance", "Confidential drawings can be handled privately", "Material samples can be discussed for serious projects"]],
      ["After quotation", ["Fabrication route and finish control are confirmed", "Packing and export details are planned", "Installation guidance is prepared for local teams"]],
    ],
    faq: [
      ...sharedFaq,
      ["Can I ask for sculpture similar to products on the MIC site?", "Yes. Product references such as stainless steel water features, bronze garden sculpture, stone sculpture, animal sculpture, and abstract forms can guide the route, but the final work should be adapted to the site."],
      ["Is one inspiration image enough for a quotation?", "It is enough for a first conversation, but a reliable quotation needs scale, site condition, material direction, destination country, and installation context."],
    ],
  },
];

// One content source for the hospitality page, visible FAQ and JSON-LD.
const hotelPage = pages.find(page => page.slug === "resort-sculpture");
Object.assign(hotelPage, {
  h1: hospitalityService.title, intro: hospitalityService.intro,
  sections: hospitalityService.groups, faq: hospitalityService.faq,
  audience: "U.S. hotel owners, resort developers, interior designers, art consultants and hospitality procurement teams",
});
const projectPage = pages.find(page => page.slug === "projects");
Object.assign(projectPage, { h1: routeSeoContent.projects.title, intro: routeSeoContent.projects.intro });
// These pages do not display a FAQ in the React UI.
for (const page of pages.filter(page => ["", "commission"].includes(page.slug))) page.faq = [];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function urlFor(page) {
  return page.slug ? `${site}/${page.slug}/` : `${site}/`;
}

function imageUrl(image) {
  return `${imageBase}/${image.file}`;
}

function imagesFor(page) {
  const keys = routeImageKeys[page.slug] || routeImageKeys[""];
  return keys.map((key) => evidenceImages[key]);
}

function priorityFor(page) {
  if (!page.slug) return "1.0";
  if (page.slug === "commission") return "0.85";
  if (page.slug === "faq") return "0.84";
  if (page.slug === "materials") return "0.82";
  if (page.slug === "projects") return "0.8";
  return "0.72";
}

function breadcrumb(page) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
  ];
  if (page.slug) {
    items.push({ "@type": "ListItem", position: 2, name: page.h1, item: urlFor(page) });
  }
  return { "@type": "BreadcrumbList", itemListElement: items };
}

function pageSchema(page) {
  const images = imagesFor(page);
  const imageObjects = images.map((image, index) => ({
    "@type": "ImageObject",
    "@id": `${imageUrl(image)}#image`,
    url: imageUrl(image),
    contentUrl: imageUrl(image),
    width: image.width,
    height: image.height,
    name: image.alt,
    caption: image.caption,
    representativeOfPage: index === 0,
  }));

  const graph = [
    {
      "@type": "Organization",
      "@id": `${site}/#organization`,
      name: "WEIERYANG",
      url: `${site}/`,
      logo: `${site}/weieryang-logo.webp`,
      description: "Custom sculpture studio for hotel, resort and public-space projects, with design, fabrication, export packing and overseas installation guidance.",
      email: "tangkelian@weieryang.com",
      telephone: "+86 133 1717 8019",
      areaServed: "Worldwide",
      knowsAbout: [
        "Custom outdoor sculpture",
        "Stainless steel sculpture fabrication",
        "Structural coordination",
        "Export packing",
        "Overseas installation guidance",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "project inquiries",
        email: "tangkelian@weieryang.com",
        telephone: "+86 133 1717 8019",
        availableLanguage: ["English", "Arabic", "Chinese", "French", "Spanish", "German"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site}/#website`,
      url: `${site}/`,
      name: "WEIERYANG",
      publisher: { "@id": `${site}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": page.type === "Service" ? "WebPage" : page.type,
      "@id": `${urlFor(page)}#page`,
      name: page.title,
      headline: page.h1,
      description: page.description,
      url: urlFor(page),
      isPartOf: { "@id": `${site}/#website` },
      about: { "@id": `${site}/#organization` },
      image: images.map((image) => imageUrl(image)),
      primaryImageOfPage: { "@id": `${imageUrl(images[0])}#image` },
      inLanguage: "en",
      ...(page.lastmod ? { dateModified: page.lastmod } : {}),
      ...(page.keywords?.length ? { keywords: page.keywords } : {}),
      ...(page.audience
        ? { audience: { "@type": "Audience", audienceType: page.audience } }
        : {}),
    },
    breadcrumb(page),
    ...imageObjects,
  ];

  if (page.slug === "projects") {
    graph[2].about = {
      "@type": "Thing",
      name: "Large stainless steel flying-bird landmark sculpture",
      description: "A large flying-bird landmark documented during structural assembly and crane-assisted installation at a Middle East public site.",
    };
    graph[2].mainEntity = { "@id": `${urlFor(page)}#construction-record` };
    graph[2].hasPart = [
      { "@id": `${site}/projects/hotel-lobby-sculpture-engineering-case/#article` },
      { "@id": `${urlFor(page)}#construction-record` },
    ];
    graph.push({
      "@type": "Report",
      "@id": `${urlFor(page)}#construction-record`,
      headline: "Flying-bird landmark sculpture: verified construction record",
      description: "Three verified construction-phase photographs document the structural core, segmented wings, repeated stainless steel members and crane-assisted installation at a Middle East public site.",
      url: urlFor(page),
      mainEntityOfPage: { "@id": `${urlFor(page)}#page` },
      datePublished: "2026-09-14",
      dateModified: page.lastmod,
      author: { "@id": `${site}/#organization` },
      publisher: { "@id": `${site}/#organization` },
      spatialCoverage: { "@type": "Place", name: "Middle East" },
      about: { "@type": "Thing", name: "Large stainless steel flying-bird landmark sculpture" },
      image: images.map((image) => ({ "@id": `${imageUrl(image)}#image` })),
      inLanguage: "en",
    });
  }

  if (page.type === "Service") {
    graph[2].mainEntity = { "@id": `${urlFor(page)}#service` };
    graph.push({
      "@type": "Service",
      "@id": `${urlFor(page)}#service`,
      name: page.h1,
      provider: { "@id": `${site}/#organization` },
      areaServed: "Worldwide",
      serviceType: page.serviceTypes || page.h1,
      description: page.description,
      ...(page.keywords?.length ? { category: page.keywords } : {}),
      ...(page.audience
        ? { audience: { "@type": "Audience", audienceType: page.audience } }
        : {}),
    });
  }

  if (page.type === "HowTo") {
    let stepPosition = 0;
    graph[2].step = page.sections.flatMap(([heading, items]) =>
      items.map((item) => {
        stepPosition += 1;
        return {
          "@type": "HowToStep",
          position: stepPosition,
          name: `${heading}: ${item}`,
          text: item,
        };
      }),
    );
  }

  if (page.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${urlFor(page)}#faq`,
      mainEntity: page.faq.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

function fallback(page) {
  const images = imagesFor(page);
  const projectGuide = page.slug === "projects"
    ? '<p><a href="/insights/large-hotel-atrium-sculpture-planning-guide/">Plan a large sculpture across a multi-level hotel atrium</a></p><p><a href="/projects/hotel-lobby-sculpture-engineering-case/">Review the hotel lobby sculpture engineering case</a></p><p><a href="/insights/middle-east-stainless-steel-landmark-sculpture/">Read the Middle East landmark construction guide</a></p>'
    : "";
  const stainlessGradeGuide = ["stainless-steel-sculpture", "materials", "water-feature-sculpture"].includes(page.slug)
    ? '<p><a href="/insights/304-vs-316l-stainless-steel-outdoor-sculpture/">Compare 304 vs 316L stainless steel for outdoor sculpture</a></p>'
    : "";
  const hotelRenovationGuide = ["", "resort-sculpture"].includes(page.slug)
    ? '<p><a href="/insights/large-hotel-atrium-sculpture-planning-guide/">Plan a large sculpture across a multi-level hotel atrium</a></p><p><a href="/projects/hotel-lobby-sculpture-engineering-case/">Review the hotel lobby sculpture engineering case</a></p><p><a href="/insights/hotel-lobby-sculpture-renovation-guide/">Read the hotel lobby sculpture renovation coordination guide</a></p><p><a href="/insights/hotel-lobby-mirror-stainless-steel-sculpture/">Specify mirror stainless steel finish for hotel lobby sculpture</a></p>'
    : "";
  const resortPlanningGuides = page.slug === "resort-sculpture"
    ? '<p><a href="/insights/large-hotel-atrium-sculpture-planning-guide/">Plan a large sculpture across a multi-level hotel atrium</a></p><p><a href="/projects/hotel-lobby-sculpture-engineering-case/">Review the hotel lobby sculpture engineering case</a></p><p><a href="/insights/hotel-arrival-sculpture-site-brief/">Prepare the hotel arrival sculpture site brief</a></p><p><a href="/insights/resort-entrance-sculpture-scale-guide/">Review the resort entrance sculpture scale guide</a></p>'
    : "";
  const evidence = `<section class="seo-evidence-images" aria-label="Sculpture material and process evidence">
        <h2>Material and process evidence</h2>
        <div class="seo-evidence-grid">
          ${images.map((image, index) => `<figure>
            <img src="/seo-media/${esc(image.file)}" alt="${esc(image.alt)}" width="${image.width}" height="${image.height}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ""} />
            <figcaption>${esc(image.caption)}</figcaption>
          </figure>`).join("")}
        </div>
      </section>`;

  const sections = page.sections
    .map(([heading, items]) => `
      <section>
        <h2>${esc(heading)}</h2>
        <ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      </section>`)
    .join("");

  const faq = page.faq?.length
    ? `<section>
        <h2>FAQ</h2>
        ${page.faq.map(([q, a]) => `<article><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join("")}
      </section>`
    : "";

  return `<main class="seo-fallback" data-seo-fallback="true">
      <nav aria-label="Breadcrumb"><a href="/">Home</a>${page.slug ? ` / <span>${esc(page.h1)}</span>` : ""}</nav>
      <h1>${esc(page.h1)}</h1>
      <p>${esc(page.intro)}</p>
      ${evidence}
      ${sections}
      ${projectGuide}
      ${stainlessGradeGuide}
      ${resortPlanningGuides}
      ${hotelRenovationGuide}
      ${page.slug === "" ? `<section><h2>${esc(hospitalityEntry.en.title)}</h2><p>${esc(hospitalityEntry.en.body)}</p><a href="/resort-sculpture/">Explore hotel sculpture</a></section>` : ""}
      ${page.slug === "resort-sculpture" ? hospitalitySections.map(section => `<section id="${section.id}"><h2>${esc(section.title)}</h2><p>${esc(section.body)}</p><ul>${section.items.map(item => `<li>${esc(item)}</li>`).join("")}</ul></section>`).join("") + `<nav aria-label="Hotel project resources">${hospitalityService.related.map(([label, href]) => `<p><a href="${esc(href)}">${esc(label)}</a></p>`).join("")}</nav>` : ""}
      ${faq}
      <section>
        <h2>Start a private sculpture brief</h2>
        <p>Send drawings, site photos, scale, material direction, destination country, and schedule to begin a serious review.</p>
        <p><a href="/commission/">Open the commission brief</a></p>
      </section>
    </main>`;
}

function fallbackCss() {
  return `<style>
      html.js .seo-fallback {
        display: none;
      }

      html.js #root {
        opacity: 1;
      }

      .seo-fallback {
        width: min(1120px, calc(100% - 40px));
        margin: 0 auto;
        padding: 96px 0 72px;
        color: #f0eee8;
        font-family: Arial, "Microsoft YaHei", sans-serif;
      }

      .seo-fallback nav,
      .seo-fallback p,
      .seo-fallback li,
      .seo-fallback figcaption {
        color: #b7b3aa;
        line-height: 1.7;
      }

      .seo-fallback h1 {
        max-width: 920px;
        margin: 18px 0;
        color: #f0eee8;
        font-family: "Arial Narrow", Impact, sans-serif;
        font-size: clamp(48px, 8vw, 92px);
        font-weight: 400;
        line-height: 0.92;
      }

      .seo-fallback h2 {
        margin-top: 30px;
        color: #f0eee8;
        font-size: 24px;
        line-height: 1.25;
      }

      .seo-fallback section {
        margin-top: 26px;
      }

      .seo-evidence-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-top: 14px;
      }

      .seo-evidence-grid figure {
        margin: 0;
        border: 1px solid #34332d;
        background: #11110f;
      }

      .seo-evidence-grid img {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
      }

      .seo-evidence-grid figcaption {
        padding: 12px;
        font-size: 13px;
        font-weight: 700;
      }

      .seo-fallback a {
        color: #e39a7e;
        font-weight: 800;
      }

      @media (max-width: 760px) {
        .seo-evidence-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>`;
}

function head(page) {
  const canonical = urlFor(page);
  const primaryImage = imagesFor(page)[0];
  const usePrimarySocialImage = page.slug === "projects" || page.usePrimarySocialImage;
  const socialImage = usePrimarySocialImage ? imageUrl(primaryImage) : ogImage;
  const socialImageWidth = usePrimarySocialImage ? primaryImage.width : 1200;
  const socialImageHeight = usePrimarySocialImage ? primaryImage.height : 630;
  const heroPreload = page.slug
    ? ""
    : '<link rel="preload" as="image" href="/seo-media/hero-plaza-night-v3.webp" fetchpriority="high" />';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script>document.documentElement.classList.add("js","app-ready")</script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="description" content="${esc(page.description)}" />
    <meta name="theme-color" content="#0b0b09" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    ${heroPreload}
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="WEIERYANG" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${socialImage}" />
    <meta property="og:image:alt" content="${esc(primaryImage.alt)}" />
    <meta property="og:image:width" content="${socialImageWidth}" />
    <meta property="og:image:height" content="${socialImageHeight}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${socialImage}" />
    <meta name="twitter:image:alt" content="${esc(primaryImage.alt)}" />
    ${fallbackCss()}
    <script type="application/ld+json">
${pageSchema(page).split("\n").map((line) => `      ${line}`).join("\n")}
    </script>
    <title>${esc(page.title)}</title>
  </head>`;
}

for (const page of pages) {
  const target = path.join(process.cwd(), page.file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(
    target,
    `${head(page)}
  <body style="margin:0;background:#0b0b09;color:#f0eee8">
    <div id="root">
      ${fallback(page)}
    </div>
    <script type="module" src="${script}"></script>
  </body>
</html>
`.replace(/[\t ]+$/gm, ""),
  );
}

const sitemapEntries = [
  ...pages.map((page) => ({
    url: urlFor(page),
    lastmod: page.lastmod || today,
    priority: priorityFor(page),
  })),
  ...preservedRoutes,
  { url: `${site}/privacy/`, lastmod: "2026-09-30", priority: "0.2" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map((entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <priority>${entry.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

const imageSitemapEntries = [
  ...pages.map((page) => ({
    url: urlFor(page),
    images: imagesFor(page),
  })),
  ...preservedRoutes
    .filter((route) => route.imageKeys?.length)
    .map((route) => ({
      url: route.url,
      images: route.imageKeys.map((key) => evidenceImages[key]),
    })),
];

const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageSitemapEntries.map((entry) => `  <url>
    <loc>${entry.url}</loc>
${entry.images.map((image) => `    <image:image>
      <image:loc>${imageUrl(image)}</image:loc>
      <image:caption>${esc(image.caption)}</image:caption>
      <image:title>${esc(image.alt)}</image:title>
    </image:image>`).join("\n")}
  </url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${site}/sitemap.xml
Sitemap: ${site}/image-sitemap.xml
# AI discovery file: ${site}/llms.txt
`;

fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(process.cwd(), "public", "image-sitemap.xml"), imageSitemap);
fs.writeFileSync(path.join(process.cwd(), "public", "robots.txt"), robots);
