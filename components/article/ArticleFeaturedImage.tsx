import { cn } from "@/lib/utils";

interface ArticleFeaturedImageProps {
  src: string;
  alt: string;
  /** Above-the-fold hero image */
  priority?: boolean;
  className?: string;
}

/**
 * Featured image for articles — native img for reliable display (avoids Next/Image fill
 * placeholder edge cases where the image can appear missing).
 */
export function ArticleFeaturedImage({
  src,
  alt,
  priority = false,
  className,
}: ArticleFeaturedImageProps) {
  return (
    <figure
      className={cn(
        "mb-8 w-full overflow-hidden rounded-xl border border-gray-200/80 bg-gray-100 shadow-sm",
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        width={1200}
        height={675}
        className="block h-auto w-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </figure>
  );
}
