import type { Metadata } from "next";
import { getLearnItems } from "@/lib/get-learn-items";
import { generatePageMetadata } from "@/lib/metadata";
import { LearnPageClient } from "./LearnPageClient";

export const metadata: Metadata = generatePageMetadata({
  path: "/learn",
  title: "Learn",
  description:
    "Articles, mini-books, and video teachings — a unified library for understanding and practice.",
});

export const dynamic = "force-dynamic";

export default function LearnPage() {
  const items = getLearnItems();
  return <LearnPageClient items={items} />;
}
