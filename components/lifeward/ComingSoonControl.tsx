"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "nav";

const variantStyles: Record<Variant, string> = {
  primary:
    "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-[var(--gold)] text-white hover:bg-[#B08424] transition-colors min-w-[10rem]",
  secondary:
    "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium border-2 border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--sky)] transition-colors min-w-[10rem]",
  nav: "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border-2 border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)] hover:text-white transition-colors",
};

interface ComingSoonControlProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}

/** Placeholder control — label swaps to "Coming soon" on hover; no navigation. */
export function ComingSoonControl({
  children,
  className,
  variant = "primary",
}: ComingSoonControlProps) {
  return (
    <button
      type="button"
      className={cn("group relative cursor-default", variantStyles[variant], className)}
      aria-label={`${typeof children === "string" ? children : "Action"} — coming soon`}
    >
      <span className="transition-opacity duration-200 group-hover:opacity-0">{children}</span>
      <span
        className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden
      >
        Coming soon
      </span>
    </button>
  );
}

interface SmartCtaProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  external?: boolean;
}

/** Renders a real link when href is configured; otherwise ComingSoonControl. */
export function SmartCta({ href, children, className, variant = "primary", external }: SmartCtaProps) {
  const ready = href && href.trim() !== "" && !href.startsWith("[");

  if (!ready) {
    return (
      <ComingSoonControl className={className} variant={variant}>
        {children}
      </ComingSoonControl>
    );
  }

  const classes = cn(variantStyles[variant], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
