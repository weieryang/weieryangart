import { hospitalityService } from "./hospitalityContent.js";
import { studioIdentity } from "./commissionProof.js";

const sharedFaq = [
  [
    "What should I send before requesting a quote?",
    "Send site photos or drawings, approximate dimensions, material direction, destination country, installation access and the required completion date.",
  ],
  [
    "Can WEIERYANG review confidential drawings?",
    "Yes. Project drawings can be reviewed privately, and an NDA can be discussed before detailed technical review.",
  ],
  [
    "Do you support overseas delivery and installation?",
    "The delivery route can include segmentation, trial assembly, export packing, documentation and installation guidance for the local site team.",
  ],
];

export const routeSeoContent = {
  "garden-sculpture": {
    eyebrow: "Garden sculpture",
    title: "Custom garden sculpture planned from site, planting, water and scale",
    intro: "Garden sculpture should be judged from the approach sequence, planting height, seasonal light, water edges, maintenance access and viewing distance. WEIERYANG develops each work as a site-specific commission rather than a catalogue object.",
    groups: [
      ["Garden uses", ["Private estate gardens", "Park walks and planted courts", "Resort gardens and water edges"]],
      ["Material directions", ["Bronze and stone for grounded warmth", "Brushed stainless steel for controlled reflection", "Corten and granite for weathered landscape edges"]],
      ["Custom process", ["Read photos, drawings and access routes", "Resolve scale, base, drainage and finish", "Plan fabrication, packing and installation support"]],
    ],
    related: [["Resort sculpture", "/resort-sculpture/"], ["Water feature sculpture", "/water-feature-sculpture/"], ["Bronze sculpture", "/bronze-sculpture/"]],
    faq: sharedFaq,
  },
  "public-art": {
    eyebrow: "Public art",
    title: "Permanent public art with engineering and material proof",
    intro: "Public sculpture needs more than a strong silhouette. For plazas, parks and cultural districts, durability, structure, segmentation, finish control, packing and the installation sequence must be resolved as part of the visual decision.",
    groups: [
      ["Public settings", ["City parks and civic plazas", "Cultural districts and museum landscapes", "Commercial public-realm projects"]],
      ["Technical concerns", ["Wind, touch, weathering and cleaning", "Internal structure and foundation assumptions", "Export packing and installation access"]],
      ["Review material", ["Site drawings and photographs", "Target dimensions and viewing distance", "Local climate, access and deadline"]],
    ],
    related: [["Stainless steel sculpture", "/stainless-steel-sculpture/"], ["Custom sculpture", "/custom-sculpture/"], ["Project evidence", "/projects/"]],
    faq: sharedFaq,
  },
  "resort-sculpture": hospitalityService,
  "water-feature-sculpture": {
    eyebrow: "Water feature sculpture",
    title: "Water feature sculpture resolved around reflection, splash and maintenance",
    intro: "Water changes the form, base, edge, gap, finish, fastener and drainage decision. WEIERYANG reviews sculpture for pools and fountains as a material and site problem before treating it as decoration.",
    groups: [
      ["Water settings", ["Reflecting pools", "Fountain courts", "Resort water edges and landscape basins"]],
      ["Key checks", ["Splash radius and drainage", "Reflection, glare and night lighting", "Cleaning and maintenance access"]],
      ["Useful first brief", ["Pool or fountain drawings", "Water depth and service access", "Preferred metal or stone route"]],
    ],
    related: [["Resort sculpture", "/resort-sculpture/"], ["316L stainless steel", "/stainless-steel-sculpture/"], ["Materials", "/materials/"]],
    faq: sharedFaq,
  },
  "bronze-sculpture": {
    eyebrow: "Bronze sculpture",
    title: "Bronze sculpture for warmth, patina and touch",
    intro: "Bronze is strongest when its warmth, edge highlights, surface depth and long-term patina are controlled for the site. The material route is developed for gardens, resorts, water features and public landscapes.",
    groups: [
      ["Bronze decisions", ["Patina depth and colour direction", "Touchable areas and wear points", "Lighting and viewing distance"]],
      ["Hybrid routes", ["Bronze with black stone", "Bronze with brushed stainless steel", "Bronze details on water-feature sculpture"]],
      ["Project evidence", ["Finish samples", "Base and structure review", "Packing and export planning"]],
    ],
    related: [["Garden sculpture", "/garden-sculpture/"], ["Stone sculpture", "/stone-sculpture/"], ["Material comparison", "/insights/316l-stainless-steel-vs-bronze-vs-stone/"]],
    faq: sharedFaq,
  },
  "stainless-steel-sculpture": {
    eyebrow: "Stainless steel sculpture",
    title: "Stainless steel sculpture with grade, reflection and structure decided early",
    intro: "Stainless steel can look precise or harsh depending on grade, reflection, weld control and exposure. WEIERYANG develops brushed and controlled-reflection finishes with the internal structure and fabrication route considered from the start.",
    groups: [
      ["Best uses", ["Coastal and resort sites", "Permanent public exterior sculpture", "Modern garden and plaza commissions"]],
      ["Technical checks", ["Stainless grade and exposure", "Welds, panels and internal structure", "Reflection, glare and surface direction"]],
      ["Delivery evidence", ["Segment drawings", "Trial assembly and finish control", "Export-ready packing and lifting points"]],
    ],
    related: [["304 vs 316L grade guide", "/insights/304-vs-316l-stainless-steel-outdoor-sculpture/"], ["Coastal maintenance", "/insights/coastal-stainless-steel-sculpture-maintenance-checklist/"], ["Material comparison", "/insights/316l-stainless-steel-vs-bronze-vs-stone/"]],
    faq: sharedFaq,
  },
  "stone-sculpture": {
    eyebrow: "Stone sculpture",
    title: "Stone sculpture and bases with mass, texture and weathering proof",
    intro: "Stone gives sculpture weight and landscape credibility, but also changes lifting access, foundation logic, drainage and long-term weathering. WEIERYANG develops carved stone and stone-metal combinations for permanent outdoor commissions.",
    groups: [
      ["Stone routes", ["Carved stone sculpture", "Stone bases for bronze or stainless work", "Black stone and bronze hybrid sculpture"]],
      ["Site factors", ["Base condition and foundation", "Water exposure and drainage", "Texture, touch and maintenance"]],
      ["Brief requirements", ["Desired stone tone or texture", "Access for lifting and installation", "Target scale and destination country"]],
    ],
    related: [["Bronze sculpture", "/bronze-sculpture/"], ["Garden sculpture", "/garden-sculpture/"], ["Materials", "/materials/"]],
    faq: sharedFaq,
  },
  "custom-sculpture": {
    eyebrow: "Custom sculpture",
    title: "Custom sculpture fabrication from your drawings or design brief",
    intro: `${studioIdentity.en.body} Share your intended use, approximate scale and destination so we can review the design, material and fabrication scope for your project.`,
    groups: [
      ["Start from drawings or a brief", ["Send client sketches, CAD or drawings for a fabrication review", "For an original design, describe the site, intended use and visual direction", "State an approximate size or explain which dimensions are still undecided"]],
      ["Resolve the sculpture for its site", ["Review viewing distance, climate, water exposure and public access", "Agree the material, finish, structure and base interfaces for this commission", "Confirm drawing approvals and any surface samples before production"]],
      ["Define the delivery scope", ["Review actual fabrication records and agree the checks for your own work", "Plan segmentation, packing and destination requirements", "Confirm shipping, installation guidance and local site responsibilities in writing"]],
    ],
    related: [["Review actual sculpture fabrication records", "/process/#workshop-records"], ["Compare sculpture quotation scope", "/insights/outdoor-sculpture-quotation-scope-checklist/"], ["Prepare a hotel arrival sculpture brief", "/insights/hotel-arrival-sculpture-site-brief/"], ["Send your custom sculpture brief", "/commission/"]],
    faq: [
      ["Can WEIERYANG fabricate a sculpture from my drawings or CAD files?", "Yes. We can review client drawings, CAD, sketches or a model direction for custom fabrication. Identify the dimensions, finish, site and destination, then agree any design development, structural work and approval stages required before production."],
      ["Can I start with an inspiration image and no final dimensions?", "Yes. Describe the intended use and send the available site photographs or plans. Give an approximate size, or say that dimensions are undecided, so the first review can identify the design and site information needed for a reliable quotation."],
      ["What changes the scope of a custom sculpture quotation?", "Scale, material and finish, internal structure, segmentation, base interfaces, samples, packing, destination and installation support all affect the scope. Compare these items and the exclusions before comparing the total price."],
      ["Can I commission an original design rather than supply finished drawings?", "Yes. WEIERYANG can develop an original sculpture direction with the client or project designer. Agree the design-development deliverables and approval stages separately from fabrication, shipping and on-site services."],
    ],
  },
  projects: {
    eyebrow: "Construction records and design references",
    title: "Verified sculpture construction and clearly labeled reference studies",
    intro: "Review the verified flying-bird landmark construction record from a Middle East public site, alongside a separate commercial-atrium design reference for hotel project teams. The reference study is not a WEIERYANG hotel commission, and neither route is presented as a U.S. hotel installation.",
    groups: [
      ["Hotel interior case", ["Atrium scale and guest sightlines", "Mirror stainless steel finish and lighting", "Base, access, installation and handover interfaces"]],
      ["Landmark construction", ["Segmented wing structure", "Repeated stainless steel members", "Crane-assisted lifting and site alignment"]],
      ["Evidence boundary", ["Commercial-atrium reference is not claimed as a WEIERYANG commission", "Landmark images are verified construction-phase records", "Undisclosed client, city and dimensions are not inferred"]],
    ],
    related: [["Large hotel atrium planning guide", "/insights/large-hotel-atrium-sculpture-planning-guide/"], ["Hotel lobby engineering case", "/projects/hotel-lobby-sculpture-engineering-case/"], ["Read the landmark construction guide", "/insights/middle-east-stainless-steel-landmark-sculpture/"], ["Private brief", "/commission/"]],
    faq: sharedFaq,
  },
  process: {
    eyebrow: "Sculpture process",
    title: "Custom sculpture fabrication, from drawing review to export",
    intro: `${studioIdentity.en.body} The process connects the approved design to fabrication, export packing and overseas installation guidance. Our fabrication-stage photographs and Middle East construction record show different parts of that work; the checks and deliverables for your commission are agreed before production.`,
    groups: [
      ["Review the brief and approvals", ["Read client drawings, scale, site photographs and destination requirements", "Resolve the material, finish, structure, base and installation access", "Agree review drawings, samples, approval stages and project responsibilities"]],
      ["Fabricate and review", ["Translate the approved design into the agreed fabrication and assembly route", "Set project-specific finish, fit-up and dimensional checks", "Agree which progress photographs, inspection records or trial assembly checks will be supplied"]],
      ["Pack, export and guide installation", ["Plan segmentation, lifting interfaces and export packing for the route", "Confirm shipping scope and destination documentation before dispatch", "Coordinate installation guidance with the buyer's local engineering and site team"]],
    ],
    related: [["Review the Middle East construction record", "/insights/middle-east-stainless-steel-landmark-sculpture/"], ["Plan sculpture export packing", "/insights/large-sculpture-export-packing-checklist/"], ["Clarify quotation inclusions and exclusions", "/insights/outdoor-sculpture-quotation-scope-checklist/"], ["Discuss your fabrication scope", "/commission/?route=process"]],
    faq: [
      ["What should be approved before sculpture fabrication starts?", "Agree the design and dimensions, material and finish, structure and base interfaces, any samples, approval stages and delivery responsibilities. The review drawings and checks should reflect the actual site and the scope accepted for your commission."],
      ["What do the WEIERYANG fabrication photographs demonstrate?", "The fabrication records show work on reflective sculptural surfaces, hand-form assembly and painted portrait details. They document fabrication-stage work; material grades, dimensions, inspection results and the delivery scope for a new commission must be confirmed separately."],
      ["Which production records will I receive?", "Agree the required progress photographs, surface samples, dimensional checks, inspection records and any trial assembly before production. The published gallery is evidence of fabrication work, rather than a promise that every project includes the same documentation or tests."],
      ["Does export packing include freight and installation at my site?", "These are separate scope items. WEIERYANG can support export packing and overseas installation guidance; confirm freight, destination handling, lifting, local engineering and the on-site team's responsibilities in the quotation and contract."],
    ],
  },
  materials: {
    eyebrow: "Sculpture materials",
    title: "Material decisions for bronze, stainless steel, stone and hybrids",
    intro: "Materials decide whether a sculpture survives its site with dignity. Bronze, stainless steel, stone, corten, patina, reflection, drainage, touch and exposure are project decisions made before final decoration.",
    groups: [
      ["Bronze", ["Warmth, patina and touch", "Garden and water-feature routes", "Stone or stainless pairings"]],
      ["Stainless steel", ["316L options for coastal exposure", "Brushed or controlled reflection", "Structure, welds and public durability"]],
      ["Stone and hybrids", ["Mass, texture and grounding", "Stone bases and plinths", "Drainage and weathering behaviour"]],
    ],
    related: [["304 vs 316L grade guide", "/insights/304-vs-316l-stainless-steel-outdoor-sculpture/"], ["Stainless steel sculpture", "/stainless-steel-sculpture/"], ["Material comparison", "/insights/316l-stainless-steel-vs-bronze-vs-stone/"]],
    faq: sharedFaq,
  },
  faq: {
    eyebrow: "Before commissioning",
    title: "Custom sculpture questions: location, drawings and delivery",
    intro: `${studioIdentity.en.body} These answers explain who we work with, how to prepare an inquiry and which design, export and installation responsibilities need to be agreed for an overseas commission.`,
    groups: [
      ["Identify your project", ["Tell us your role, intended use and destination", "Send available drawings or describe the original design you need", "Share approximate scale, material direction and the desired schedule"]],
      ["Review capability and evidence", ["Look at the actual fabrication-stage records", "Use the Middle East record to review construction-stage assembly and lifting", "Agree the drawings, samples and production checks needed for your own project"]],
      ["Confirm the order scope", ["Separate design development and fabrication from shipping and site services", "Record materials, approvals, inclusions and exclusions in writing", "Confirm the local engineering, lifting and installation responsibilities"]],
    ],
    related: [["Custom sculpture from drawings or a brief", "/custom-sculpture/"], ["Fabrication process and actual records", "/process/"], ["Sculpture quotation scope checklist", "/insights/outdoor-sculpture-quotation-scope-checklist/"], ["Ask about your sculpture project", "/commission/"]],
    faq: [
      ["Where is WEIERYANG based?", "WEIERYANG is a sculpture studio and manufacturer based in China. Our project scope can include custom design, structural development, fabrication, export packing and overseas installation guidance."],
      ["Do you work with private owners as well as professional project teams?", "Yes. We work with designers, contractors, suppliers, developer procurement teams and private owners. Describe your role and project use so the review can address the decisions and information relevant to you."],
      ["How should I share confidential project drawings?", "Start with the project outline and explain any confidentiality requirements. Drawings can be reviewed privately, and an NDA can be discussed before detailed technical review. Agree the review arrangement before sharing restricted files."],
      ["What if I do not know the final material or size?", "State what is known, what is undecided and the site conditions. Photographs or plans, intended use, approximate scale, exposure and destination help identify the next decisions; final material and dimensions are confirmed through project review."],
      ["Is there a standard price or lead time for a custom sculpture?", "Price and programme depend on the approved design, scale, materials, fabrication complexity, reviews and delivery route. Send the project brief and required date for a scope review; a published reference image is not a fixed-price or ready-to-ship product."],
      ["Who handles the overseas installation responsibilities?", "WEIERYANG can provide overseas installation guidance. Confirm who supplies local engineering approvals, foundations, lifting equipment and the installation crew, together with any agreed on-site services, before ordering."],
    ],
  },
};
