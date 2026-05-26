"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", cta: false },
  { href: "/about", label: "About", cta: false },
  { href: "/work-with-me", label: "Work With Me", cta: true },
  { href: "/learn", label: "Learn", cta: false },
  { href: "/start-here", label: "Start Here", cta: false },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkBase =
    "text-sm font-medium text-[var(--navy)] hover:underline hover:decoration-[var(--gold)] underline-offset-4 transition-colors";

  // Desktop: gold-bordered primary CTA
  const ctaBase =
    "px-4 py-2 rounded-lg border-2 border-[var(--gold)] text-[var(--navy)] font-medium hover:bg-[var(--gold)] hover:text-white transition-colors";

  // Mobile: make CTA clearly the primary action
  const ctaMobileBase =
    "px-4 py-2 rounded-lg bg-[var(--gold)] text-white hover:bg-[#B08424] transition-colors";

  return (
    <nav className="border-b border-[var(--light)] bg-[rgba(250,248,244,0.86)] backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            aria-label="Lifeward Coaching home"
            className="inline-flex items-center gap-2.5 font-[family-name:var(--font-label)] text-[13px] uppercase tracking-[0.25em] text-[var(--navy)] hover:text-[var(--royal)] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/favicon-32x32.png"
              alt=""
              width={28}
              height={28}
              className="shrink-0 rounded-sm"
              priority
            />
            <span>Lifeward Coaching</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={cn(item.cta ? ctaBase : linkBase)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button
              type="button"
              className="text-[var(--navy)] hover:text-[var(--royal)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-2 rounded-md p-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--light)] py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(item.cta ? ctaMobileBase : linkBase)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

