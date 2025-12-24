import { getAllArticles } from "@/lib/mdx";
import { EsoterimentPageClient } from "./EsoterimentPageClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Esoteriment - Understand the Unseen",
  description: "Esoteriment exists to bring clarity to what is often hidden or misunderstood. Here I simplify esoteric, metaphysical, and mystical ideas so they can be understood, tested, and lived. This work explores consciousness, mind, energy, symbolism, and the universal laws that quietly shape experience and reality.",
};

export default function EsoterimentPage() {
  const articles = getAllArticles("esoteriment").sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const categories = ["Foundational", "Introductory", "Consciousness", "Mind", "Energy", "Symbolism", "Law"];

  return <EsoterimentPageClient articles={articles} categories={categories} />;
}

