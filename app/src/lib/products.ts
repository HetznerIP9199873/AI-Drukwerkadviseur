export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  productCount: number;
};

export type Product = {
  slug: string;
  category: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  basePrice: number; // per m² (excl BTW)
  finishes: { value: string; label: string }[];
  thicknesses: { value: number; label: string; multiplier: number }[];
  applications: string[];
  specs: { label: string; value: string }[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "plaatmateriaal",
    name: "Plaatmateriaal",
    tagline: "Stevig, blijvend, indrukwekkend",
    description:
      "Van Dibond tot Trespa, stevige platen die binnen én buiten generaties meegaan.",
    productCount: 6,
  },
  {
    slug: "zelfklevend",
    name: "Zelfklevend",
    tagline: "Plak het op echt álles",
    description:
      "Vinyl, raamfolie, vloerstickers, autobelettering. Premium klever, eindeloze toepassingen.",
    productCount: 9,
  },
  {
    slug: "print-media",
    name: "Print Media",
    tagline: "Banners, posters, doek",
    description:
      "Frontlit, backlit, mesh, posterpapier, vloerzeil, voor elke locatie het juiste medium.",
    productCount: 10,
  },
  {
    slug: "displays",
    name: "Displays",
    tagline: "Sta op met je merk",
    description:
      "Roll-ups, beachflags, pop-up walls. Indrukwekkende displays voor beurzen en events.",
    productCount: 8,
  },
  {
    slug: "accessoires",
    name: "Accessoires",
    tagline: "De finishing touch",
    description:
      "Ophangsystemen, ringen, koorden, lijmen. Alles om je print perfect te plaatsen.",
    productCount: 12,
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "dibond",
    category: "plaatmateriaal",
    name: "Dibond",
    shortDescription:
      "Aluminium sandwichplaat met polyethyleen kern. Vlak, stevig, weersbestendig.",
    longDescription:
      "Dibond is dé referentie voor hoogwaardige buitencommunicatie. Twee aluminium platen rond een polyethyleen kern: extreem vlak, krasbestendig en jarenlang kleurvast. Geschikt voor gevelreclame, bewegwijzering, retail signage en kunsttoepassingen.",
    tags: ["Aluminium", "Buiten", "Weersbestendig", "Vlak"],
    basePrice: 47.5,
    finishes: [
      { value: "mat", label: "Mat" },
      { value: "glans", label: "Glans" },
      { value: "geborsteld", label: "Geborsteld" },
    ],
    thicknesses: [
      { value: 2, label: "2 mm", multiplier: 1.0 },
      { value: 3, label: "3 mm", multiplier: 1.25 },
      { value: 4, label: "4 mm", multiplier: 1.55 },
      { value: 6, label: "6 mm", multiplier: 2.1 },
    ],
    applications: ["Gevelreclame", "Bewegwijzering", "Retail signage", "Kunst"],
    specs: [
      { label: "Materiaal", value: "Aluminium + PE-kern" },
      { label: "Levensduur buiten", value: "10+ jaar" },
      { label: "Max. formaat", value: "150 × 305 cm" },
      { label: "Productietijd", value: "2–3 werkdagen" },
    ],
  },
  {
    slug: "forex",
    category: "plaatmateriaal",
    name: "Forex",
    shortDescription: "Lichtgewicht hardschuim PVC. Perfect voor binnen.",
    longDescription:
      "Forex is een geëxpandeerde hardschuim PVC-plaat. Licht, makkelijk te bewerken en met een prachtig matwit oppervlak. Ideaal voor binnentoepassingen, beurzen en korte termijn buitenreclame.",
    tags: ["PVC-schuim", "Licht", "Binnen"],
    basePrice: 32.0,
    finishes: [
      { value: "mat", label: "Mat" },
      { value: "satijn", label: "Satijn" },
    ],
    thicknesses: [
      { value: 3, label: "3 mm", multiplier: 1.0 },
      { value: 5, label: "5 mm", multiplier: 1.3 },
      { value: 10, label: "10 mm", multiplier: 1.9 },
      { value: 19, label: "19 mm", multiplier: 3.2 },
    ],
    applications: ["Beurzen", "Binnen signage", "POS materiaal"],
    specs: [
      { label: "Materiaal", value: "Geëxpandeerd hardschuim PVC" },
      { label: "Levensduur binnen", value: "Onbeperkt" },
      { label: "Max. formaat", value: "150 × 305 cm" },
      { label: "Productietijd", value: "1–2 werkdagen" },
    ],
  },
  {
    slug: "papier-en-karton",
    category: "plaatmateriaal",
    name: "Papier en Karton",
    shortDescription:
      "Honingraatkarton en massief karton. Duurzaam en volledig recyclebaar.",
    longDescription:
      "Sterk, licht en 100% recyclebaar. Honingraatkarton biedt verrassende stevigheid voor displays en grote vlakken zonder de milieubelasting van kunststof.",
    tags: ["Karton", "Recyclebaar", "Licht", "Duurzaam"],
    basePrice: 24.0,
    finishes: [
      { value: "wit", label: "Wit gecoat" },
      { value: "naturel", label: "Naturel" },
    ],
    thicknesses: [
      { value: 10, label: "10 mm", multiplier: 1.0 },
      { value: 16, label: "16 mm", multiplier: 1.4 },
      { value: 25, label: "25 mm", multiplier: 2.0 },
    ],
    applications: ["Pop-up displays", "Event decoratie", "Tijdelijke signage"],
    specs: [
      { label: "Materiaal", value: "Honingraatkarton" },
      { label: "Recyclebaar", value: "100%" },
      { label: "Max. formaat", value: "120 × 240 cm" },
      { label: "Productietijd", value: "2 werkdagen" },
    ],
  },
  {
    slug: "polypropyleen",
    category: "plaatmateriaal",
    name: "Polypropyleen",
    shortDescription: "Holle kunststofplaat. Licht, waterdicht, betaalbaar.",
    longDescription:
      "Akylux / Correx — holle PP-plaat die waterdicht en flexibel is. Veel gebruikt voor verkiezingsborden, bouwhekdoeken en tijdelijke signing.",
    tags: ["PP", "Waterdicht", "Buiten", "Tijdelijk"],
    basePrice: 18.0,
    finishes: [
      { value: "mat", label: "Mat" },
    ],
    thicknesses: [
      { value: 3, label: "3 mm", multiplier: 1.0 },
      { value: 5, label: "5 mm", multiplier: 1.25 },
      { value: 10, label: "10 mm", multiplier: 1.7 },
    ],
    applications: ["Verkiezingsborden", "Bouwhekdoek", "Tijdelijke buitenreclame"],
    specs: [
      { label: "Materiaal", value: "Polypropyleen (hol)" },
      { label: "Levensduur buiten", value: "1–2 jaar" },
      { label: "Max. formaat", value: "200 × 300 cm" },
      { label: "Productietijd", value: "1 werkdag" },
    ],
  },
  {
    slug: "stadur",
    category: "plaatmateriaal",
    name: "Stadur",
    shortDescription: "Aluminium-PU sandwich. Ultra vlak, ultra stevig.",
    longDescription:
      "Stadur combineert aluminium dekplaten met een polyurethaan-schuim kern. Lichter dan Dibond, extreem vormvast, premium afwerking voor exclusieve toepassingen.",
    tags: ["Aluminium", "PU-kern", "Vlak", "Premium"],
    basePrice: 68.0,
    finishes: [
      { value: "mat", label: "Mat" },
      { value: "glans", label: "Glans" },
    ],
    thicknesses: [
      { value: 10, label: "10 mm", multiplier: 1.0 },
      { value: 16, label: "16 mm", multiplier: 1.35 },
      { value: 19, label: "19 mm", multiplier: 1.6 },
    ],
    applications: ["Exclusieve signage", "Tentoonstellingen", "Premium retail"],
    specs: [
      { label: "Materiaal", value: "Aluminium + PU-kern" },
      { label: "Levensduur buiten", value: "15+ jaar" },
      { label: "Max. formaat", value: "150 × 305 cm" },
      { label: "Productietijd", value: "3–5 werkdagen" },
    ],
  },
  {
    slug: "trespa",
    category: "plaatmateriaal",
    name: "Trespa",
    shortDescription: "HPL-plaat. Onverwoestbaar, voor de eeuwigheid buiten.",
    longDescription:
      "Trespa is een hoogwaardige HPL-plaat die compleet weersbestendig, krasvast en kleurvast is. De referentie voor permanente gevelbekleding en buitenmeubilair.",
    tags: ["HPL", "Buiten", "Permanent", "Krasvast"],
    basePrice: 89.0,
    finishes: [
      { value: "mat", label: "Mat" },
      { value: "satijn", label: "Satijn" },
    ],
    thicknesses: [
      { value: 6, label: "6 mm", multiplier: 1.0 },
      { value: 8, label: "8 mm", multiplier: 1.2 },
      { value: 10, label: "10 mm", multiplier: 1.45 },
    ],
    applications: ["Gevelbekleding", "Buitenmeubilair", "Permanente signage"],
    specs: [
      { label: "Materiaal", value: "HPL (high-pressure laminate)" },
      { label: "Levensduur buiten", value: "20+ jaar" },
      { label: "Max. formaat", value: "153 × 305 cm" },
      { label: "Productietijd", value: "5–7 werkdagen" },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategoryProducts(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === categorySlug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
