"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/start-here", label: "Start Here" },
    { href: "/coaching", label: "Coaching" },
    { href: "/events", label: "Events" },
    { href: "/library", label: "Library" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl md:text-3xl font-serif font-semibold text-foreground hover:text-accent transition-colors"
          >
            LIFEWARD
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-accent"
                    : "text-secondary hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/sessions"
              className="px-4 py-2 text-sm font-medium text-accent border border-accent rounded hover:bg-accent hover:text-background transition-colors"
            >
              Book Session
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "text-accent"
                    : "text-secondary hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/sessions"
              className="block px-4 py-2 text-base font-medium text-accent border border-accent rounded hover:bg-accent hover:text-background transition-colors text-center"
              onClick={() => setIsOpen(false)}
            >
              Book Session
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

