import Link from "next/link";
import { LearnItem, learnTypeLabel } from "@/lib/learn-items";
import { VideoPreview } from "@/components/video/VideoPreview";
import { cn } from "@/lib/utils";

interface LearnItemCardProps {
  item: LearnItem;
}

const tagStyles: Record<LearnItem["type"], string> = {
  understanding: "bg-[var(--sky)] text-[var(--royal)]",
  practice: "bg-[var(--cream)] text-[var(--navy)]",
  book: "bg-[var(--navy)]/10 text-[var(--navy)]",
  video: "bg-[var(--gold)]/15 text-[var(--gold)]",
};

function CardBody({ item }: LearnItemCardProps) {
  const tag = learnTypeLabel(item.type);

  return (
    <div className="p-6">
      <span
        className={cn(
          "inline-block font-[family-name:var(--font-label)] text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded mb-4",
          tagStyles[item.type]
        )}
      >
        {tag}
      </span>
      <h2 className="font-medium text-[var(--charcoal)] mb-2 group-hover:text-[var(--royal)] transition-colors">
        {item.title}
      </h2>
      <p className="text-sm text-[var(--mid)] line-clamp-2 mb-4">{item.description}</p>
      {item.readingTime ? (
        <span className="text-xs text-[var(--mid)]">{item.readingTime} min read</span>
      ) : item.type === "book" ? (
        <span className="text-xs text-[var(--mid)]">Mini-book</span>
      ) : item.type === "video" ? (
        <span className="text-xs text-[var(--mid)]">Tap play to watch, or open for the full page</span>
      ) : null}
    </div>
  );
}

export function LearnItemCard({ item }: LearnItemCardProps) {
  if (item.type === "video" && item.embedUrl) {
    return (
      <article className="h-full rounded-2xl border border-[var(--light)] bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md">
        <VideoPreview embedUrl={item.embedUrl} title={item.title} href={item.href} />
        <Link href={item.href} className="group block">
          <CardBody item={item} />
        </Link>
      </article>
    );
  }

  return (
    <Link
      href={item.href}
      className="group block h-full rounded-2xl border border-[var(--light)] bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md"
    >
      {item.cover ? (
        <div
          className={cn(
            "bg-[var(--cream)] overflow-hidden",
            item.type === "book" ? "aspect-[3/4] max-h-48" : "aspect-video"
          )}
        >
          <img
            src={item.cover}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <CardBody item={item} />
    </Link>
  );
}
