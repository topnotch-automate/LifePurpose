"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  accentColor: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  accentColor,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          selectedCategory === null
            ? "bg-gray-900 text-white"
            : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
        )}
        style={selectedCategory === null ? {} : { borderColor: selectedCategory === null ? undefined : accentColor + "40" }}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            selectedCategory === category
              ? "text-white"
              : "bg-white border text-gray-700 hover:border-opacity-60"
          )}
          style={
            selectedCategory === category
              ? { backgroundColor: accentColor }
              : { borderColor: accentColor + "40", borderWidth: "1px" }
          }
        >
          {category}
        </button>
      ))}
    </div>
  );
}

