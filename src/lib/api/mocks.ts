import type {
  PaginatedShopsDTO,
  ShopDetailDTO,
} from "@/schemas/shop.schema";
import type {
  ProductDetailDTO,
  ShopWithProductsDTO,
} from "@/schemas/product.schema";

const COVER_PLACEHOLDER =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80";
const LOGO_PLACEHOLDER =
  "https://images.unsplash.com/photo-1567361808960-dec9cb578182?auto=format&fit=crop&w=400&q=80";
const SHOP_BASE = [
  {
    id: "shop_didier",
    slug: "didier-shop",
    name: "Didier Shop",
    logo_url: LOGO_PLACEHOLDER,
    cover_url: COVER_PLACEHOLDER,
    short_description: "Mode urbaine, accessoires & sneakers à Cotonou.",
    products_count: 14,
    city: "Cotonou",
    description:
      "Bienvenue chez Didier Shop. Nous proposons une sélection pointue de pièces streetwear, sneakers et accessoires, livrés rapidement à Cotonou et alentours.",
    contact_phone: "+229 60 00 00 00",
    address: "Cotonou, Bénin",
    whatsapp_phone_e164: "22960000000",
    whatsapp_url: null,
  },
  {
    id: "shop_amina",
    slug: "amina-bijoux",
    name: "Amina Bijoux",
    logo_url:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
    short_description: "Bijoux artisanaux faits main, matières précieuses.",
    products_count: 22,
    city: "Porto-Novo",
    description:
      "Amina Bijoux propose des créations artisanales uniques en argent, laiton et perles naturelles. Chaque pièce est faite main avec amour.",
    contact_phone: "+229 61 00 00 00",
    address: "Porto-Novo, Bénin",
    whatsapp_phone_e164: "22961000000",
    whatsapp_url: null,
  },
  {
    id: "shop_eko",
    slug: "eko-tech",
    name: "Eko Tech",
    logo_url:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=400&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    short_description: "Smartphones, accessoires et gadgets reconditionnés.",
    products_count: 34,
    city: "Cotonou",
    description:
      "Eko Tech, votre boutique tech de confiance. Smartphones reconditionnés, accessoires et services de réparation.",
    contact_phone: "+229 62 00 00 00",
    address: "Cotonou, Bénin",
    whatsapp_phone_e164: "22962000000",
    whatsapp_url: null,
  },
  {
    id: "shop_kola",
    slug: "kola-deco",
    name: "Kola Déco",
    logo_url:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    short_description: "Décoration intérieure, mobilier artisanal du Bénin.",
    products_count: 9,
    city: "Cotonou",
    description: "Pièces de décoration et mobilier conçus par des artisans locaux.",
    contact_phone: null,
    address: "Cotonou, Bénin",
    whatsapp_phone_e164: null,
    whatsapp_url: null,
  },
  {
    id: "shop_zaza",
    slug: "zaza-beauty",
    name: "Zaza Beauty",
    logo_url:
      "https://images.unsplash.com/photo-1522335789203-aaa14a4f7c70?auto=format&fit=crop&w=400&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1522335789203-aaa14a4f7c70?auto=format&fit=crop&w=1600&q=80",
    short_description: "Cosmétiques naturels, beurres et huiles d'Afrique.",
    products_count: 17,
    city: "Abomey-Calavi",
    description:
      "Zaza Beauty propose des soins naturels, beurres de karité, huiles essentielles, et accessoires beauté.",
    contact_phone: "+229 63 00 00 00",
    address: "Abomey-Calavi, Bénin",
    whatsapp_phone_e164: "22963000000",
    whatsapp_url: null,
  },
  {
    id: "shop_marche",
    slug: "marche-frais",
    name: "Marché Frais",
    logo_url:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=80",
    short_description: "Produits frais locaux livrés en 24h.",
    products_count: 41,
    city: "Cotonou",
    description: "Le marché du quartier livré chez vous. Frais, local, simple.",
    contact_phone: "+229 64 00 00 00",
    address: "Cotonou, Bénin",
    whatsapp_phone_e164: "22964000000",
    whatsapp_url: null,
  },
];

function imgFor(seed: string, w = 800): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${w}`;
}

const PRODUCTS_BY_SHOP: Record<string, ProductDetailDTO[]> = {
  "didier-shop": [
    {
      id: "p1",
      slug: "t-shirt-noir",
      name: "T-shirt premium noir",
      description:
        "T-shirt en coton bio 220 g/m². Coupe droite, col rond. Disponible en plusieurs tailles.",
      images: [imgFor("tshirt-noir-1"), imgFor("tshirt-noir-2"), imgFor("tshirt-noir-3")],
      price: 7500,
      promo_price: null,
      currency: "XOF",
      stock: 18,
      variants: [
        { id: "v_s", label: "S", price: 7500, stock: 4 },
        { id: "v_m", label: "M", price: 7500, stock: 6 },
        { id: "v_l", label: "L", price: 7500, stock: 0 },
        { id: "v_xl", label: "XL", price: 8000, stock: 8 },
      ],
      shop: {
        id: "shop_didier",
        slug: "didier-shop",
        name: "Didier Shop",
        whatsapp_phone_e164: "22960000000",
        whatsapp_url: null,
      },
    },
    {
      id: "p2",
      slug: "casquette-classique",
      name: "Casquette classique brodée",
      description: "Casquette ajustable, broderie premium, taille unique.",
      images: [imgFor("casquette-1"), imgFor("casquette-2")],
      price: 5000,
      promo_price: 3990,
      currency: "XOF",
      stock: 4,
      variants: [],
      shop: {
        id: "shop_didier",
        slug: "didier-shop",
        name: "Didier Shop",
        whatsapp_phone_e164: "22960000000",
        whatsapp_url: null,
      },
    },
    {
      id: "p3",
      slug: "sneakers-low",
      name: "Sneakers Low blanches",
      description: "Sneakers en cuir lisse, semelle EVA, légères.",
      images: [imgFor("sneakers-1"), imgFor("sneakers-2"), imgFor("sneakers-3")],
      price: 32000,
      promo_price: null,
      currency: "XOF",
      stock: 12,
      variants: [
        { id: "v_40", label: "40", price: 32000, stock: 2 },
        { id: "v_41", label: "41", price: 32000, stock: 3 },
        { id: "v_42", label: "42", price: 32000, stock: 4 },
        { id: "v_43", label: "43", price: 32000, stock: 3 },
      ],
      shop: {
        id: "shop_didier",
        slug: "didier-shop",
        name: "Didier Shop",
        whatsapp_phone_e164: "22960000000",
        whatsapp_url: null,
      },
    },
    {
      id: "p4",
      slug: "tote-bag",
      name: "Tote bag urbain",
      description: "Sac coton recyclé, anses renforcées.",
      images: [imgFor("tote-1"), imgFor("tote-2")],
      price: 4500,
      promo_price: null,
      currency: "XOF",
      stock: 0,
      variants: [],
      shop: {
        id: "shop_didier",
        slug: "didier-shop",
        name: "Didier Shop",
        whatsapp_phone_e164: "22960000000",
        whatsapp_url: null,
      },
    },
  ],
  "amina-bijoux": [
    {
      id: "p5",
      slug: "bracelet-perles",
      name: "Bracelet perles naturelles",
      description: "Bracelet ajustable en perles naturelles. Fait main.",
      images: [imgFor("bracelet-1"), imgFor("bracelet-2")],
      price: 12000,
      promo_price: null,
      currency: "XOF",
      stock: 7,
      variants: [],
      shop: {
        id: "shop_amina",
        slug: "amina-bijoux",
        name: "Amina Bijoux",
        whatsapp_phone_e164: "22961000000",
        whatsapp_url: null,
      },
    },
    {
      id: "p6",
      slug: "collier-argent",
      name: "Collier argent gravé",
      description: "Collier en argent 925, gravure personnalisable sur demande.",
      images: [imgFor("collier-1")],
      price: 28000,
      promo_price: 24000,
      currency: "XOF",
      stock: 3,
      variants: [],
      shop: {
        id: "shop_amina",
        slug: "amina-bijoux",
        name: "Amina Bijoux",
        whatsapp_phone_e164: "22961000000",
        whatsapp_url: null,
      },
    },
  ],
  "eko-tech": [
    {
      id: "p7",
      slug: "smartphone-reconditionne",
      name: "Smartphone reconditionné A+",
      description:
        "Modèle reconditionné grade A+, batterie >85%, garantie 6 mois.",
      images: [imgFor("phone-1"), imgFor("phone-2")],
      price: 145000,
      promo_price: 129000,
      currency: "XOF",
      stock: 5,
      variants: [
        { id: "v_64", label: "64 Go", price: 129000, stock: 2 },
        { id: "v_128", label: "128 Go", price: 145000, stock: 3 },
      ],
      shop: {
        id: "shop_eko",
        slug: "eko-tech",
        name: "Eko Tech",
        whatsapp_phone_e164: "22962000000",
        whatsapp_url: null,
      },
    },
    {
      id: "p8",
      slug: "ecouteurs-bluetooth",
      name: "Écouteurs Bluetooth",
      description: "Autonomie 24h avec boîtier, antibruit basique.",
      images: [imgFor("buds-1")],
      price: 18000,
      promo_price: null,
      currency: "XOF",
      stock: 22,
      variants: [],
      shop: {
        id: "shop_eko",
        slug: "eko-tech",
        name: "Eko Tech",
        whatsapp_phone_e164: "22962000000",
        whatsapp_url: null,
      },
    },
  ],
  "kola-deco": [
    {
      id: "p9",
      slug: "tabouret-bois",
      name: "Tabouret bois sculpté",
      description: "Tabouret artisanal en bois massif, pièce unique.",
      images: [imgFor("stool-1")],
      price: 35000,
      promo_price: null,
      currency: "XOF",
      stock: 2,
      variants: [],
      shop: {
        id: "shop_kola",
        slug: "kola-deco",
        name: "Kola Déco",
        whatsapp_phone_e164: null,
        whatsapp_url: null,
      },
    },
  ],
  "zaza-beauty": [
    {
      id: "p10",
      slug: "beurre-karite",
      name: "Beurre de karité brut 250g",
      description: "Karité brut non raffiné, hydratation longue durée.",
      images: [imgFor("karite-1"), imgFor("karite-2")],
      price: 3500,
      promo_price: null,
      currency: "XOF",
      stock: 50,
      variants: [
        { id: "v_250", label: "250 g", price: 3500, stock: 30 },
        { id: "v_500", label: "500 g", price: 6500, stock: 20 },
      ],
      shop: {
        id: "shop_zaza",
        slug: "zaza-beauty",
        name: "Zaza Beauty",
        whatsapp_phone_e164: "22963000000",
        whatsapp_url: null,
      },
    },
  ],
  "marche-frais": [
    {
      id: "p11",
      slug: "panier-legumes",
      name: "Panier de légumes frais",
      description: "Panier varié 5kg, livré le lendemain.",
      images: [imgFor("legumes-1")],
      price: 6500,
      promo_price: null,
      currency: "XOF",
      stock: 40,
      variants: [],
      shop: {
        id: "shop_marche",
        slug: "marche-frais",
        name: "Marché Frais",
        whatsapp_phone_e164: "22964000000",
        whatsapp_url: null,
      },
    },
  ],
};

export function listShopsMock(params: {
  query?: string;
  page?: number;
}): PaginatedShopsDTO {
  const { query = "", page = 1 } = params;
  const q = query.trim().toLowerCase();

  const filtered = SHOP_BASE.filter((shop) => {
    return (
      !q ||
      shop.name.toLowerCase().includes(q) ||
      (shop.short_description ?? "").toLowerCase().includes(q)
    );
  });

  const PAGE_SIZE = 12;
  const total = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const slice = filtered.slice(start, start + PAGE_SIZE);

  return {
    count: total,
    next: start + PAGE_SIZE < total ? `?page=${page + 1}` : null,
    previous: page > 1 ? `?page=${page - 1}` : null,
    results: slice.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      logo_url: s.logo_url,
      cover_url: s.cover_url,
      short_description: s.short_description,
      products_count: s.products_count,
      city: s.city,
    })),
  };
}

export function getShopDetailMock(slug: string): ShopWithProductsDTO | null {
  const shop = SHOP_BASE.find((s) => s.slug === slug);
  if (!shop) return null;
  const products = PRODUCTS_BY_SHOP[slug] ?? [];
  return {
    shop: {
      id: shop.id,
      slug: shop.slug,
      name: shop.name,
      logo_url: shop.logo_url,
      cover_url: shop.cover_url,
      description: shop.description,
      short_description: shop.short_description,
      contact_phone: shop.contact_phone,
      address: shop.address,
      whatsapp_phone_e164: shop.whatsapp_phone_e164,
      whatsapp_url: shop.whatsapp_url,
      products_count: shop.products_count,
    },
    products: {
      count: products.length,
      results: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        image_url: p.images[0] ?? null,
        price: p.price,
        promo_price: p.promo_price ?? null,
        currency: p.currency,
        in_stock: p.stock > 0 || p.variants.some((v) => v.stock > 0),
        stock_label:
          p.stock === 0 && p.variants.every((v) => v.stock === 0)
            ? "Rupture de stock"
            : p.stock <= 5 && p.variants.length === 0
              ? "Stock limité"
              : null,
      })),
    },
  };
}

export function getProductDetailMock(
  shopSlug: string,
  productSlug: string,
): ProductDetailDTO | null {
  const products = PRODUCTS_BY_SHOP[shopSlug];
  if (!products) return null;
  const found = products.find((p) => p.slug === productSlug);
  return found ?? null;
}

export function getFeaturedShopsMock(): ShopDetailDTO[] {
  return SHOP_BASE.slice(0, 4).map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    logo_url: s.logo_url,
    cover_url: s.cover_url,
    short_description: s.short_description,
    products_count: s.products_count,
    city: s.city,
    description: s.description,
    contact_phone: s.contact_phone,
    address: s.address,
    whatsapp_phone_e164: s.whatsapp_phone_e164,
    whatsapp_url: s.whatsapp_url,
  }));
}

export function getTrendingProductsMock(): Array<{
  shopSlug: string;
  shopName: string;
  product: ProductDetailDTO;
}> {
  const items: Array<{ shopSlug: string; shopName: string; product: ProductDetailDTO }> = [];
  for (const [slug, products] of Object.entries(PRODUCTS_BY_SHOP)) {
    const shop = SHOP_BASE.find((s) => s.slug === slug);
    if (!shop) continue;
    for (const product of products.slice(0, 2)) {
      items.push({ shopSlug: slug, shopName: shop.name, product });
    }
  }
  return items.slice(0, 8);
}

/** Tuiles d'accueil uniquement : ne correspondent pas aux slugs API. Les liens ouvrent `/shops?query=…`. Remplacer par `GET /api/marketplace/categories/` quand branché. */
export const MOCK_CATEGORIES = [
  { slug: "mode", label: "Mode" },
  { slug: "bijoux", label: "Bijoux" },
  { slug: "tech", label: "Tech" },
  { slug: "maison", label: "Maison & Déco" },
  { slug: "beaute", label: "Beauté" },
  { slug: "alimentaire", label: "Alimentaire" },
] as const;
