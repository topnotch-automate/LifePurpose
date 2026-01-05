import { getAllArticles } from "@/lib/mdx";
import { LifewardPageClient } from "./LifewardPageClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lifeward - Live the Truth",
  description: "Lifeward is devoted to the daily practice of God's timeless principles. Here, faith is not abstract belief, but something lived and expressed through discipline, character, gratitude, prayer, health, and ordinary daily life. The aim is simple: to grow into a life that is more ordered, faithful, and abundant.",
};

export default function LifewardPage() {
  const articles = getAllArticles("lifeward").sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const categories = ["Foundational", "Introductory", "Faith in Action", "Discipline & Character", "Gratitude & Prayer", "Health & Strength", "Daily Living"];

  return <LifewardPageClient articles={articles} categories={categories} />;
}

