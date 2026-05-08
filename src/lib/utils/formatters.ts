export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function isLowStock(stock: number): boolean {
  return stock > 0 && stock <= 5;
}

export function stockLabelFor(stock: number, fallback?: string | null): string | null {
  if (fallback) return fallback;
  if (stock === 0) return "Rupture de stock";
  if (isLowStock(stock)) return "Stock limité";
  return null;
}
