/** URLs signées GCS ou très longues — éviter l'optimiseur Next.js qui peut les casser. */
export function shouldUseUnoptimizedImage(src: string): boolean {
  if (!src) return false;
  return (
    src.includes("storage.googleapis.com") ||
    src.includes("X-Goog-Signature") ||
    src.includes("Signature=") ||
    src.length > 400
  );
}
