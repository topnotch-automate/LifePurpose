"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";

interface SectionPanelProps {
  title: string;
  subtitle: string;
  description: string;
  tagline?: string;
  href: string;
  theme: "esoteriment" | "lifeward";
  children?: ReactNode;
}

export function SectionPanel({
  title,
  subtitle,
  description,
  tagline,
  href,
  theme,
  children,
}: SectionPanelProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isEsoteriment = theme === "esoteriment";
  const accentColor = isEsoteriment ? "#7C8A9E" : "#9A7B4F";
  const accentLightColor = isEsoteriment ? "#9BA8BA" : "#B89A6E";
  const bgColor = isEsoteriment ? "#FAFAF9" : "#FFFDF8";
  
  return (
    <Link href={href} className="block group">
      <div
        className="rounded-lg p-8 md:p-12 transition-all duration-300 hover:shadow-xl"
        style={{ backgroundColor: bgColor }}
      >
        {/* Icon */}
        <div className="mb-6 opacity-60 group-hover:opacity-80 transition-opacity" style={{ color: accentColor }}>
          {isEsoteriment ? (
            // Esoteriment icon: Eye/vision representing seeing the unseen
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            // Lifeward icon: Path/journey representing daily practice
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          )}
        </div>
        <div className="mb-4">
          <span
            className="text-sm font-medium uppercase tracking-wide transition-colors"
            style={{ color: accentColor }}
          >
            {subtitle}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 group-hover:opacity-80 transition-opacity">
          {title}
        </h2>
        {tagline && (
          <p className="text-base italic text-gray-600 mb-4 max-w-2xl" style={{ color: accentColor }}>
            {tagline}
          </p>
        )}
        <p className="text-lg text-gray-700 mb-6 max-w-2xl">
          {description}
        </p>
        {children}
        <div className="mt-6">
          <span
            className="text-sm font-medium group-hover:underline inline-flex items-center gap-2 transition-colors"
            style={{ color: isHovered ? accentLightColor : accentColor }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Explore {title}
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

