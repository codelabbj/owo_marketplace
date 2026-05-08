export type CurrencyCode = "XOF" | "EUR" | "USD" | string;

export type ShopSummary = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  coverUrl: string | null;
  shortDescription: string | null;
  productsCount: number;
  category?: string | null;
  city?: string | null;
};

export type ShopDetail = ShopSummary & {
  description: string | null;
  contactPhone: string | null;
  address: string | null;
  whatsappPhoneE164: string | null;
  whatsappUrl: string | null;
};

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  price: number;
  promoPrice?: number | null;
  currency: CurrencyCode;
  inStock: boolean;
  stockLabel?: string | null;
};

export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  stock: number;
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  promoPrice?: number | null;
  currency: CurrencyCode;
  stock: number;
  variants: ProductVariant[];
  shop: {
    id: string;
    slug: string;
    name: string;
    whatsappPhoneE164: string | null;
    whatsappUrl: string | null;
  };
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
