import Link from "next/link";
import { headers } from "next/headers";
import { siteConfig } from "@/lib/site-config";
import {
  getMainSiteHomeUrl,
  resolveSiteHref,
} from "@/lib/site-links";
import { isLifewardCoachingHost } from "@/lib/site-url";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const headersList = await headers();
  const host = headersList.get("host")?.split(":")[0] ?? "";
  const onCoachingSubdomain = isLifewardCoachingHost(host);

  function href(path: string): string {
    return resolveSiteHref(path, { onCoachingSubdomain });
  }

  return (
    <footer className="bg-[var(--navy)] text-white mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center md:text-left mb-10">
          <div className="font-[family-name:var(--font-label)] text-[18px] tracking-[0.25em] uppercase mb-2">
            LIFEWARD COACHING
          </div>
          <div className="font-[family-name:var(--font-body)] text-[12px] tracking-[0.2em] uppercase text-[var(--gold)]">
            Lifeward Identity Alignment Method
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-10 max-w-2xl">
          <div>
            <h3 className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-white/80 mb-4">
              Site
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={onCoachingSubdomain ? getMainSiteHomeUrl() : "/"}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link href={href("/about")} className="text-white/80 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href={href("/work-with-me")} className="text-white/80 hover:text-white transition-colors">
                  Work With Me
                </Link>
              </li>
              <li>
                <Link href={href("/learn")} className="text-white/80 hover:text-white transition-colors">
                  Learn
                </Link>
              </li>
              <li>
                <Link href={href("/start-here")} className="text-white/80 hover:text-white transition-colors">
                  Start Here
                </Link>
              </li>
              <li>
                <Link href={href("/course")} className="text-white/80 hover:text-white transition-colors">
                  Online Course
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.25em] text-white/80 mb-4">
              Connect
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={href("/about#contact")}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href={href("/#newsletter")}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Newsletter
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.substackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Read on Substack
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <Link href={href("/rss")} className="text-white/80 hover:text-white transition-colors">
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row md:items-center gap-3">
          <div className="text-sm text-white/70">
            © {currentYear} Albert Blibo. All rights reserved.
          </div>
          <div className="text-sm text-white/70 md:ml-auto">
            Built with clarity, discipline, and purpose.
          </div>
        </div>
      </div>
    </footer>
  );
}
