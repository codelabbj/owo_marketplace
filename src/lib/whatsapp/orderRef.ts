/** Référence de commande lisible / recherchable côté ERP. Ex. OWO-260803-OWO-A7K2 */
export function generateOrderRef(shopSlug?: string | null): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const shopPart = (shopSlug ?? "owo")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 4)
    .toUpperCase()
    .padEnd(3, "X");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OWO-${yy}${mm}${dd}-${shopPart}-${rand}`;
}

export function orderRefLine(orderRef: string): string {
  return `Référence commande : ${orderRef}`;
}
