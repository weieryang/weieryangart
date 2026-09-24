import type { Metadata } from "next";
import { SiteClient } from "../site-client";

type RouteMeta = { title: string; description: string; heading: string };

const routeMetadata: Record<string, RouteMeta> = {
  "": { title: "WEIERYANG | Sculpture, Engineered for Place", description: "Custom sculpture for Middle East hotels, developments, landscapes and public sites, with engineering, fabrication, export packing and installation guidance.", heading: "Sculpture, engineered for place" },
  commission: { title: "Private Sculpture Commission Brief | WEIERYANG", description: "Submit site facts, drawings, scale, material direction, destination and installation requirements for a private sculpture review.", heading: "Private sculpture commission brief" },
  "garden-sculpture": { title: "Custom Garden Sculpture | WEIERYANG", description: "Site-specific garden sculpture coordinated with landscape, water, planting, viewing distance, materials and installation.", heading: "Custom garden sculpture" },
  "public-art": { title: "Public Art Sculpture | WEIERYANG", description: "Permanent public art sculpture with structural review, durable materials, fabrication control, export packing and installation planning.", heading: "Public art sculpture" },
  "resort-sculpture": { title: "Resort and Hotel Sculpture | WEIERYANG", description: "Landmark custom sculpture for hotel arrivals, resort landscapes, lobby thresholds and hospitality destinations.", heading: "Resort and hotel sculpture" },
  "water-feature-sculpture": { title: "Water Feature Sculpture | WEIERYANG", description: "Custom water feature sculpture reviewed for reflection, splash, drainage, cleaning access, structure and outdoor exposure.", heading: "Water feature sculpture" },
  "bronze-sculpture": { title: "Custom Bronze Sculpture | WEIERYANG", description: "Bronze sculpture and hybrid material routes for hotels, gardens, landscapes, water features and public sites.", heading: "Custom bronze sculpture" },
  "stainless-steel-sculpture": { title: "Stainless Steel Sculpture | WEIERYANG", description: "316L stainless steel sculpture for coastal resorts, developments, landscapes and permanent public installations.", heading: "Stainless steel sculpture" },
  "stone-sculpture": { title: "Custom Stone Sculpture | WEIERYANG", description: "Stone sculpture and stone-metal routes for permanent landscapes, hotels, gardens and public sites.", heading: "Custom stone sculpture" },
  "custom-sculpture": { title: "Custom Sculpture Studio | WEIERYANG", description: "Art-led custom sculpture supported by engineering, fabrication, export packing and overseas installation guidance.", heading: "Custom sculpture studio" },
  projects: { title: "Sculpture Project Routes | WEIERYANG", description: "Sculpture routes for hotel arrivals, landscapes, public art, water features and custom architectural installations.", heading: "Sculpture project routes" },
  process: { title: "Sculpture Design and Fabrication Process | WEIERYANG", description: "A disciplined sculpture process from site review and material decisions to engineering, fabrication, packing and installation support.", heading: "Sculpture design and fabrication process" },
  materials: { title: "Sculpture Materials | WEIERYANG", description: "Bronze, 316L stainless steel, stone, corten and hybrid sculpture material routes for outdoor and hospitality sites.", heading: "Sculpture materials" },
  faq: { title: "Sculpture Commission Questions | WEIERYANG", description: "Practical answers about drawings, material selection, quotation, confidentiality, fabrication, export packing and installation.", heading: "Questions before commissioning" },
};

function routeKey(path: string[] | undefined) {
  return (path || []).join("/");
}

function metadataFor(key: string) {
  return routeMetadata[key] || routeMetadata[""];
}

export async function generateMetadata({ params }: { params: Promise<{ path?: string[] }> }): Promise<Metadata> {
  const resolved = await params;
  const key = routeKey(resolved.path);
  const page = metadataFor(key);
  const canonical = key ? `/${key}/` : "/";
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: { title: page.title, description: page.description, url: canonical, siteName: "WEIERYANG", type: "website", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "WEIERYANG sculpture material and design study" }] },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: ["/og-image.jpg"] },
    robots: { index: true, follow: true },
  };
}

export default async function RoutePage({ params }: { params: Promise<{ path?: string[] }> }) {
  const resolved = await params;
  const key = routeKey(resolved.path);
  const page = metadataFor(key);
  const url = key ? `https://weieryangart.com/${key}/` : "https://weieryangart.com/";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://weieryangart.com/#organization", name: "WEIERYANG", url: "https://weieryangart.com/", logo: "https://weieryangart.com/favicon.svg", email: "tangkelian@weieryang.com", telephone: "+86 133 1717 8019", description: "Art-led custom sculpture studio with engineering and international delivery capability." },
      { "@type": key === "" ? "WebSite" : "WebPage", "@id": `${url}#page`, name: page.title, headline: page.heading, description: page.description, url, isPartOf: { "@id": "https://weieryangart.com/#website" }, about: { "@id": "https://weieryangart.com/#organization" }, inLanguage: "en" },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://weieryangart.com/" },
          ...(key ? [{ "@type": "ListItem", position: 2, name: page.heading, item: url }] : []),
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteClient initialRoute={key} />
    </>
  );
}
