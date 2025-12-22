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

