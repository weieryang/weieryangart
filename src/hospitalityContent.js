// Shared by the visible service page and its static HTML/structured data.
import { studioIdentity } from "./commissionProof.js";

export const hospitalityService = {
  eyebrow: "Custom sculpture for U.S. hospitality projects",
  title: "Custom hotel and resort sculpture, from design brief to delivery planning",
  intro: `${studioIdentity.en.body} We develop hotel and resort sculptures around your site, dimensions, material direction and installation window. ${studioIdentity.en.capability} ${studioIdentity.en.delivery}`,
  groups: [
    ["Lobby and atrium sculpture", ["Statement pieces planned around guest sightlines and the interior design concept", "Mirror or brushed metal, bronze, stone and mixed-material options", "Floor-supported works reviewed for occupied space, access and maintenance"]],
    ["Hotel entrances and resort landscapes", ["Arrival courts, covered entrances, courtyards and gardens", "Poolside and coastal settings reviewed for water, exposure and cleaning", "Scale coordinated with architecture, vehicle approaches and pedestrian circulation"]],
    ["A coordinated procurement package", ["Design development, finish samples and review drawings", "Fabrication, agreed inspection stages and export packing", "Installation information for the local contractor; scope confirmed in writing"]],
  ],
  related: [["Compare supplier scope", "/custom-outdoor-sculpture-supplier/#us-procurement"], ["Hotel lobby renovation guide", "/insights/hotel-lobby-sculpture-renovation-guide/"], ["Large atrium planning guide", "/insights/large-hotel-atrium-sculpture-planning-guide/"], ["Verified construction records", "/projects/#project-evidence-title"], ["Commercial-atrium reference study", "/projects/hotel-lobby-sculpture-engineering-case/"], ["Send a hotel project brief", "/commission/?route=resort-sculpture"]],
  faq: [
    ["Can WEIERYANG review a custom sculpture for a U.S. hotel?", "Yes. WEIERYANG is a China-based sculpture studio and manufacturer. Send your drawings or design brief, hotel location, approximate dimensions, material direction and target installation date. We review design, structural development, fabrication, export packing and overseas installation guidance. Shipping, import, on-site services, local engineering and installation responsibilities must be confirmed in writing for your project; a U.S. office or locally staffed installation service is not implied."],
    ["Do you work with hotel interior designers and art consultants?", "Yes. The sculpture package can be developed around an approved design brief, artwork schedule and finish direction. Identify who approves the design, sample, budget and site interface. WEIERYANG supplies the sculpture scope, not a complete hotel interior design or art-advisory service."],
    ["Can we send drawings in feet and inches?", "Yes. Label the units on every drawing and dimension. Provide the overall height, width and depth, the base footprint and delivery-route constraints. Before production, agree a coordinated drawing set and the controlling units; do not use rounded conversions as fabrication dimensions."],
    ["How much does a custom hotel sculpture cost?", "Price depends on form, dimensions, material, finish, structure, quantity, inspection requirements, packing and delivery scope. Request an itemized proposal with its currency, exclusions and validity. Freight, import charges, local unloading and installation should not be assumed to be included in the sculpture price."],
    ["How far ahead of a hotel opening should we start?", "Work backward from the installation window through local access planning, shipping, packing, inspection, fabrication and design approval. There is no single verified lead time for every sculpture. Ask for a project-specific schedule and identify the approvals that must happen before fabrication or shipment."],
    ["Who handles the foundation and installation in the United States?", "Agree a responsibility schedule before ordering. WEIERYANG can provide sculpture coordination information and installation guidance within the agreed scope. The hotel team must coordinate the building interface, local engineering review, site approvals, foundations, unloading and installation with its appointed professionals unless a different arrangement is explicitly confirmed."],
    ["Are the images on this page completed U.S. hotel projects?", "No. The landscape and commercial-interior images are supplied design references, not claimed WEIERYANG hotel commissions. The separately linked flying-bird photographs document verified construction work at a Middle East public site, not a U.S. hotel installation. Concept imagery is identified as a study."],
  ],
};

// Existing buyer guides form one hospitality topic cluster, rather than new
// near-duplicate city or service pages. Shared with the static HTML fallback.
export const hospitalityPlanning = {
  id: "hotel-sculpture-planning",
  title: "How do you choose a sculpture for a hotel or resort?",
  answer: "Start with the location and how guests use it. A lobby piece must leave room for circulation; an atrium work needs coordinated views and access across floors; an arrival sculpture needs a clear approach and base zone. Compare those conditions with material, finish, maintenance and installation responsibilities before choosing the form.",
  columns: ["Hotel setting", "Review first", "Coordinate with", "Planning guide"],
  rows: [
    { setting: "Lobby / water feature", review: "Guest circulation, occupied footprint, reflection, water edges and cleaning access.", team: "Interior designer, hotel operations and water-feature team where applicable.", guide: ["Lobby renovation and interfaces", "/insights/hotel-lobby-sculpture-renovation-guide/"] },
    { setting: "Multi-level atrium", review: "Sightlines from each floor, ceiling clearance, support interfaces and the lifting route.", team: "Architect, structural engineer and appointed installation contractor.", guide: ["Large atrium sculpture planning", "/insights/large-hotel-atrium-sculpture-planning-guide/"] },
    { setting: "Hotel arrival / entrance", review: "Vehicle and pedestrian approaches, base footprint, paving and delivery access.", team: "Landscape architect, civil/site team and hotel receiving team.", guide: ["Arrival sculpture site brief", "/insights/hotel-arrival-sculpture-site-brief/"] },
    { setting: "Outdoor resort / poolside", review: "Salt or splash exposure, drainage, guest touch, finish samples and maintenance access.", team: "Landscape designer, pool/water team and hotel maintenance team.", guide: ["Water-feature material checklist", "/insights/water-feature-sculpture-material-checklist/"] },
  ],
  resourcesTitle: "What should your team review before requesting a proposal?",
  resources: [
    ["Material comparison", "Compare 316L stainless steel, bronze and stone against the intended setting.", "/insights/316l-stainless-steel-vs-bronze-vs-stone/"],
    ["Cost and quotation scope", "Separate form, finish and structure from freight and local site work.", "/insights/large-outdoor-sculpture-cost-guide/"],
    ["Resort entrance scale", "Review approach views, architecture, base area and access together.", "/insights/resort-entrance-sculpture-scale-guide/"],
    ["Export packing", "Agree segment identification, protection, handling and receiving information.", "/insights/large-sculpture-export-packing-checklist/"],
    ["Overseas installation", "Define the local team's responsibilities and the sculpture guidance package.", "/insights/overseas-sculpture-installation-checklist/"],
    ["Verified construction record", "See the Middle East flying-bird construction evidence and its disclosed limits.", "/insights/middle-east-stainless-steel-landmark-sculpture/"],
  ],
};

export const hospitalitySections = [
  {
    id: "us-project-team", title: "Who should approve a hotel sculpture package?",
    body: "An owner may approve the investment while an interior designer defines the setting, an art consultant develops the artwork brief and a purchasing team coordinates the order. Name the decision makers early so the approved form, finish and installation scope stay aligned.",
    items: ["Owners and developers: intended guest experience, opening or renovation milestone, and approval route.", "Designers and art consultants: approved viewpoints, artwork dimensions, adjacent finishes and lighting intent.", "Purchasing and site teams: specification, inspection records, delivery address, receiving contact and installation window."],
  },
  {
    id: "hotel-approval-sequence", title: "What should be approved before sculpture fabrication?",
    body: "Use a review sequence that connects the design to the object the hotel will receive. A photograph of a similar finish is a reference; it is not a substitute for an agreed physical sample and project drawings.",
    items: ["Brief review: photographs, plans, intended viewing positions and overall dimensions with explicit units.", "Design and interface review: artwork envelope, base, structure, adjacent services and delivery access.", "Sample approval: material, surface texture, gloss, color and a recorded acceptance reference.", "Fabrication hold points: agree which workshop photographs, measurements, inspections and trial-assembly records are required.", "Release and handover: confirm packing, shipping marks, installation information and maintenance instructions."],
  },
  {
    id: "us-delivery", title: "What does the sculpture price include for a U.S. hotel?",
    body: "A project quotation should identify what is included before the order is approved. WEIERYANG's export-packing and installation-guidance capability is not a promise of duty-paid delivery, local contracting or a fixed transit time.",
    items: ["Record the destination city, state, ZIP code and receiving arrangements, including any off-site receiving warehouse.", "Confirm the shipping terms, named delivery point, insurance scope and who arranges import clearance and charges with the appointed logistics advisers.", "Identify responsibility for storage, unloading, indoor movement, lifting equipment, foundations, anchors and final positioning.", "Plan backward from the hotel access window, allowing for approvals, production, inspection, shipping and local receiving. Obtain a project-specific schedule."],
  },
  {
    id: "hotel-materials", title: "Which materials suit a hotel lobby or outdoor resort?",
    body: "For an interior sculpture, review reflected lighting, guest touch, cleaning and the appearance from nearby seating. For outdoor resort sculpture, review rain, salt exposure, irrigation, pool splash and maintenance access. A material name alone does not define a complete specification.",
    items: ["Stainless steel: specify the proposed grade, finish reference, weld treatment and cleaning assumptions for review.", "Bronze: agree patina direction, expected appearance changes and touch or cleaning zones.", "Stone and mixed materials: coordinate weight, edges, support, drainage and the interfaces between materials."],
  },
  {
    id: "hotel-evidence", title: "Which images document verified sculpture work?",
    body: `${studioIdentity.en.capability} Design references help discuss scale, reflection and spatial relationships. The verified Middle East record documents construction work; it is not a workshop inspection or project drawing record. Agree the drawings, samples and manufacturing checks required for your commission separately.`,
    items: ["Landscape and commercial-atrium references: visual discussion only; no U.S. hotel client, location or WEIERYANG authorship is asserted.", "Flying-bird construction record: documented segmentation, site lifting and alignment at a Middle East public site; not completed-hotel photography.", "For a proposed commission: request the relevant drawings, sample records and agreed production evidence rather than inferring specifications from reference photos."],
  },
];

const hospitalityEntryCopy = {
  en: { eyebrow: "U.S. hotel project teams", title: "Custom sculpture for hotel lobbies, atriums and resort arrivals.", body: "Bring the design brief, site drawings and opening schedule. We help owners, designers, art consultants and purchasing teams coordinate the sculpture, fabrication and delivery scope.", action: "Explore hotel sculpture", brief: "Request a project review" },
  zh: { eyebrow: "美国酒店项目团队", title: "为酒店大堂、中庭与度假村入口定制雕塑。", body: "从设计简报、现场图纸和开业计划出发，协助业主、设计师、艺术顾问与采购团队明确雕塑制作和交付范围。", action: "了解酒店雕塑", brief: "申请项目评估" },
  ar: { eyebrow: "فرق مشاريع الفنادق الأمريكية", title: "منحوتات مخصصة لردهات الفنادق وأفنيتها ومداخل المنتجعات.", body: "شارك موجز التصميم ومخططات الموقع وجدول الافتتاح لتنسيق نطاق المنحوتة والتصنيع والتسليم مع فريق مشروعك.", action: "استكشف منحوتات الفنادق", brief: "اطلب مراجعة المشروع" },
  fr: { eyebrow: "Projets hôteliers aux États-Unis", title: "Sculptures sur mesure pour halls, atriums et entrées de resorts.", body: "Partagez le brief, les plans et la date d'ouverture pour coordonner la sculpture, la fabrication et la livraison avec votre équipe.", action: "Sculptures pour hôtels", brief: "Demander une étude" },
  es: { eyebrow: "Proyectos hoteleros en Estados Unidos", title: "Esculturas a medida para vestíbulos, atrios y accesos de resorts.", body: "Comparta el brief, los planos y la fecha de apertura para coordinar la escultura, la fabricación y la entrega con su equipo.", action: "Esculturas para hoteles", brief: "Solicitar una revisión" },
  de: { eyebrow: "Hotelprojekte in den USA", title: "Individuelle Skulpturen für Hotellobbys, Atrien und Resort-Eingänge.", body: "Teilen Sie Briefing, Pläne und Eröffnungstermin, um Skulptur, Fertigung und Lieferung mit Ihrem Projektteam abzustimmen.", action: "Skulpturen für Hotels", brief: "Projektprüfung anfragen" },
};

export const hospitalityEntry = Object.fromEntries(Object.entries(hospitalityEntryCopy).map(([language, entry]) => [language, {
  ...entry, body: `${studioIdentity[language].body} ${entry.body}`,
}]));

export const privacyCopy = {
  en: { link: "Privacy & project information", note: "Your text draft is saved in this browser. Submitted details and attachments are emailed to the studio. Please send only files you are authorized to share." },
  zh: { link: "隐私与项目资料说明", note: "文字草稿保存在此浏览器中。提交的资料与附件会发送至工作室邮箱，请仅提供有权分享的文件。" },
  ar: { link: "الخصوصية ومعلومات المشروع", note: "تُحفظ المسودة النصية في هذا المتصفح. تُرسل التفاصيل والمرفقات إلى الاستوديو بالبريد الإلكتروني. شارك فقط الملفات المصرح لك بمشاركتها." },
  fr: { link: "Confidentialité et données du projet", note: "Le brouillon texte reste dans ce navigateur. Les données et pièces jointes sont envoyées au studio par email. Partagez uniquement les fichiers autorisés." },
  es: { link: "Privacidad y datos del proyecto", note: "El borrador de texto se guarda en este navegador. Los datos y adjuntos se envían por correo al estudio. Comparta solo archivos autorizados." },
  de: { link: "Datenschutz und Projektdaten", note: "Der Textentwurf wird in diesem Browser gespeichert. Angaben und Anhänge werden per E-Mail an das Studio gesendet. Teilen Sie nur freigegebene Dateien." },
};
