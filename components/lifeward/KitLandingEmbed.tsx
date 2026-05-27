import Link from "next/link";
import { cn } from "@/lib/utils";
import { getKitLandingUrl } from "@/lib/kit";

interface KitLandingEmbedProps {
  className?: string;
  title?: string;
  description?: string;
  /** Taller iframe for landing pages with more content */
  height?: number;
  finePrint?: string;
}

/**
 * Embeds a Kit (ConvertKit) hosted landing page.
 * Kit Forms can use inline HTML/JS embeds; landing pages are iframe-friendly via their hosted URL.
 * @see https://help.kit.com/en/articles/4009572-form-embedding-basics
 */
export function KitLandingEmbed({
  className,
  title,
  description,
  height = 680,
  finePrint = "I respect your privacy. Unsubscribe anytime.",
}: KitLandingEmbedProps) {
  const landingUrl = getKitLandingUrl();

  return (
    <div className={className}>
      {title ? (
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-light text-[var(--navy)] mb-3">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="text-[var(--charcoal)]/90 mb-6 leading-relaxed">{description}</p>
      ) : null}

      <div className="rounded-xl overflow-hidden border border-[var(--light)] bg-white shadow-sm">
        <iframe
          src={landingUrl}
          title="Join the Lifeward Coaching email list"
          width="100%"
          height={height}
          className="w-full border-0"
          loading="lazy"
        />
      </div>

      <p className={cn("mt-4 text-xs leading-relaxed text-[var(--mid)]")}>
        {finePrint}{" "}
        <Link
          href={landingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--royal)] underline underline-offset-2 hover:text-[var(--navy)]"
        >
          Open signup page →
        </Link>
      </p>
    </div>
  );
}

/** Dark wrapper variant for navy sections (Start Here) */
export function KitLandingEmbedDark({
  className,
  title,
  description,
  height = 680,
  finePrint = "I respect your privacy. Unsubscribe anytime.",
}: KitLandingEmbedProps) {
  const landingUrl = getKitLandingUrl();

  return (
    <div className={className}>
      {title ? (
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-light text-white mb-3">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="text-white/85 mb-6 leading-relaxed">{description}</p>
      ) : null}

      <div className="rounded-xl overflow-hidden bg-white shadow-sm">
        <iframe
          src={landingUrl}
          title="Join the Lifeward Coaching email list"
          width="100%"
          height={height}
          className="w-full border-0"
          loading="lazy"
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-white/60">
        {finePrint}{" "}
        <Link
          href={landingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--gold-lt)] underline underline-offset-2 hover:text-white"
        >
          Open signup page →
        </Link>
      </p>
    </div>
  );
}
