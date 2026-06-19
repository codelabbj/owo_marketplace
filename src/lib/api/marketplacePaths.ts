/** Chemins publics marketplace — alignés sur `apps.marketplace.urls` (ERP). */

export const marketplacePaths = {
  shops: "/api/marketplace/shops/",
  shop: (slug: string) => `/api/marketplace/shops/${encodeURIComponent(slug)}/`,
  product: (shopSlug: string, productSlug: string) =>
    `/api/marketplace/shops/${encodeURIComponent(shopSlug)}/products/${encodeURIComponent(productSlug)}/`,
  contactIntents: "/api/marketplace/contact-intents",
  categories: "/api/marketplace/categories/",
} as const;
