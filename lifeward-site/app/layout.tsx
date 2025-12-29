import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lifeward | Live the Truth. Experience Life.",
  description:
    "A coaching and teaching platform dedicated to helping individuals understand and live timeless spiritual principles — leading to clarity, discipline, and an abundant, excellent life.",
  keywords: [
    "spiritual coaching",
    "life clarity coaching",
    "spiritual practice",
    "conscious living",
    "spiritual discipline",
  ],
  openGraph: {
    title: "Lifeward | Live the Truth. Experience Life.",
    description:
      "A coaching and teaching platform dedicated to helping individuals understand and live timeless spiritual principles.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lifeward | Live the Truth. Experience Life.",
    description:
      "A coaching and teaching platform dedicated to helping individuals understand and live timeless spiritual principles.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonPro.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

