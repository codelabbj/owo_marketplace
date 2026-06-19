import Image from "next/image";
import { shouldUseUnoptimizedImage } from "@/lib/utils/images";

type ProductImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function ProductImage({
  src,
  alt,
  fill = false,
  sizes,
  className,
  priority,
}: ProductImageProps) {
  const unoptimized = shouldUseUnoptimizedImage(src);

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
        unoptimized={unoptimized}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={1200}
      sizes={sizes}
      className={className}
      priority={priority}
      unoptimized={unoptimized}
    />
  );
}
