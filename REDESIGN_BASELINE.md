# Redesign Baseline

**Site:** [albertblibo.com](https://www.albertblibo.com/)  
**Repo:** `Purpose` (Next.js 16, App Router, MDX content)  
**Audit date:** May 25, 2026  
**Branch at audit:** `main` (clean, matches `origin/main`)  
**Build:** `npm run build` passes

Use this document as the source of truth before a major redesign. It records what production matches today, what is built but hidden, and what should be fixed or decided first.

---

## Executive summary

The public marketing site and this codebase are **largely aligned**. Homepage copy, navigation, 12 articles, 5 books, section hubs, About/contact, footer links, and the Owwlish course embed on the home page all match what visitors see live.

The highest-impact gaps are **not missing pages** but **wiring and configuration**: Daily Practice is implemented but marked “Coming Soon,” `/contact` is a dead link, videos have no content, SEO images are missing, and canonical URL / RSS / Twitter settings are inconsistent.

Prioritize **decisions** (what stays in the new IA) then **P0 fixes** (broken links, canonical URL, sitemap) before visual redesign work.

---

## What matches production (keep or evolve intentionally)

| Area | Live | Code |
|------|------|------|
| Homepage | Hero, Start Here, Esoteriment/Lifeward panels, Latest Writings (6), bottom CTAs, Online Course (Owwlish) | `app/page.tsx` |
| Nav | Home, Esoteriment, Lifeward, Books, Videos, Course, About | `components/layout/Navigation.tsx` |
| Esoteriment hub | 9 articles + category filters | `content/esoteriment/*.mdx`, `EsoterimentPageClient.tsx` |
| Lifeward hub | 3 articles + category filters | `content/lifeward/*.mdx`, `LifewardPageClient.tsx` |
| Books | 5 mini-books | `content/books/*.mdx`, covers in `public/images/books/` |
| Foundational CTAs | Intro articles for each path | `getFirstFoundationalMessage()` → `understanding-esoteriment`, `living-lifeward` |
| About | Mission + contact form | `app/about/page.tsx`, `POST /api/contact` |
| Footer | X, RSS, Newsletter (Substack), copyright | `components/layout/Footer.tsx` |
| RSS | 12 article items | `app/rss/route.ts` |

### Homepage → section CTAs (verified)

- **Begin with Esoteriment** → `/esoteriment/understanding-esoteriment`
- **Begin with Lifeward** → `/lifeward/living-lifeward`
- **Read a foundational Esoteriment article** → same slug as above
- **Start your Lifeward journey** → `living-lifeward`
- **Browse Mini-Books** → `/books`

Multiple articles have `foundational: true` in frontmatter; CTAs use the **newest by date** per section. Document any change to that rule when adding foundational content.

---

## Content inventory (deployed from repo)

| Type | Count | Location |
|------|-------|----------|
| Articles (Esoteriment + Lifeward) | 12 | `content/esoteriment/`, `content/lifeward/` |
| Books | 5 | `content/books/` |
| Videos | 0 | `content/videos/` (directory absent) |
| Lifeward practices (MDX) | 17 files | `content/lifeward/practices/` |
| Practices shown on daily page | 15 | Filtered by `doesSourceArticleExist()` in `lib/mdx.ts` |

### Esoteriment articles (9)

| Slug | Category |
|------|----------|
| `thought-belief-and-feeling` | Law |
| `the-god-concept` | Law |
| `in-christ-freedom-through-true-identity` | Symbolism |
| `essential-nature-and-incidental-form` | Consciousness |
| `spirit-creation-and-consciousness` | Consciousness |
| `identity-the-foundation-of-all-seeking` | Consciousness |
| `understanding-esoteriment` | Introductory (foundational) |
| `the-rich-premises` | Foundational |
| `esoteriment-foundation` | Foundational |

### Lifeward articles (3)

| Slug | Category |
|------|----------|
| `practice-living-from-understanding` | Daily Living |
| `living-lifeward` | Introductory (foundational) |
| `lifeward-foundation` | Foundational |

### Books (5)

| Slug |
|------|
| `love-and-a-sound-mind` |
| `remain-faithful-unto-death` |
| `the-prayerful-farmer` |
| `the-promise-of-purpose` |
| `how-to-befriend-your-ego` |

---

## Architecture snapshot (for redesign planning)

```
content/          → MDX (articles, books; videos folder missing)
lib/mdx.ts        → load, sort, foundational helpers, practices
app/              → Next.js routes (see route list from build output)
components/       → UI, layout, article, video, course
data/ or /tmp     → likes, comments (file or DB via lib/storage.ts)
```

**Dynamic at runtime:** homepage, section hubs, article pages, books, RSS, search API, admin (auth-gated).

**Static / mostly static:** `about`, `course` (page shell), `robots.txt`, `sitemap.xml` (generated).

**Not in public IA but present:** `/admin`, `/checkout/[slug]`, comment/like APIs, email subscribe API.

---

## Prioritized work

### P0 — Fix before or during redesign launch

These affect trust, SEO, or broken user paths.

| # | Item | Detail | Action |
|---|------|--------|--------|
| 1 | **Broken `/contact` link** | `app/lifeward/practice/page.tsx` links to `/contact`; no route exists. Contact is on `/about`. | Link to `/about#contact` or add `/contact` redirect. |
| 2 | **Daily Practice not linked** | `/lifeward/practice` works (15 practices); Lifeward hub button shows “Coming Soon.” | Replace button with `Link` to `/lifeward/practice`, or remove feature from new IA. |
| 3 | **Canonical site URL** | Defaults: `https://albertblibo.com` (no `www`). Visitors may use `www.albertblibo.com`. | Set `NEXT_PUBLIC_SITE_URL` to canonical host; enforce redirect apex ↔ www in hosting. |
| 4 | **Sitemap health** | Production `sitemap.xml` returned 500 during audit. | Check Railway/host logs; verify `getAllArticles()` / env at runtime; retest after deploy. |
| 5 | **OG / social images** | `og-image.png`, `logo.png` referenced in metadata but missing from `public/`. | Add assets or update metadata to real paths. |

### P1 — Decide in redesign IA (then implement once)

| # | Item | Current state | Decision needed |
|---|------|---------------|-----------------|
| 6 | **Videos** | Nav + `/videos`; zero MDX; homepage carousel hidden. | Keep nav and add content, or drop from IA until ready. |
| 7 | **Course** | Home: Owwlish embed. `/course`: env-based embed, often unconfigured. Nav Course → `/#start-here-course`. | Single course entry (home vs dedicated page vs external). |
| 8 | **Lifeward practices** | 17 MDX files; daily page only; not in nav or sitemap. | Promote in Lifeward hub, archive, or merge into new content model. |
| 9 | **Foundational articles** | 3 Esoteriment + 2 Lifeward flagged `foundational: true`; CTAs use newest only. | Curate one entry per path; document rule in content workflow. |
| 10 | **Monetization / checkout** | `/checkout/[slug]` exists. | Include in new site or remove routes and book purchase fields. |
| 11 | **Comments / likes / admin** | Full stack in repo. | Keep, simplify, or remove for static/marketing-only redesign. |

### P2 — Polish and ops (can trail launch)

| # | Item | Detail |
|---|------|--------|
| 12 | RSS placeholder email | `albert@example.com` in `app/rss/route.ts` — use `AUTHOR_EMAIL` or env. |
| 13 | Twitter handle mismatch | `layout.tsx` `@thealbertblibo`, `metadata.ts` `@albertblibo`, footer `@TheAlbertBlibo`. |
| 14 | Sitemap completeness | Add `/course`, `/lifeward/practice` if they remain public. |
| 15 | Duplicate RSS routes | `app/rss/route.ts` and `app/rss.xml/route.ts` — consolidate if both exposed. |
| 16 | Stale docs | `IMPROVEMENTS_TO_ADD.md` contradicts `FEATURE_STATUS.md`. Archive or delete misleading docs. |
| 17 | Analytics | Not integrated; noted in `POST_LAUNCH_OPTIMIZATIONS.md`. |
| 18 | Contact form email | Requires `RESEND_API_KEY`, `CONTACT_EMAIL` in production (`CONTACT_FORM_SETUP.md`). |

---

## Redesign decision checklist

Answer these before locking visual design or URL structure.

- [ ] **Primary paths:** Still Esoteriment + Lifeward dual hub, or single unified feed?
- [ ] **Entry points:** Keep “Start Here” + foundational CTAs as-is or simplify to one onboarding flow?
- [ ] **Course:** Owwlish on home only, dedicated `/course`, or external funnel?
- [ ] **Daily Practice:** Ship `/lifeward/practice`, integrate into Lifeward hub, or defer?
- [ ] **Videos:** Placeholder nav vs hidden until catalog exists?
- [ ] **Books:** Library page + per-book pages unchanged, or new product/checkout flow?
- [ ] **Engagement:** Comments, likes, admin dashboard — in scope for v2?
- [ ] **Content source:** Stay MDX-in-repo, CMS, or hybrid?
- [ ] **Domain:** `www` vs apex canonical; update all env and RSS/sitemap links.

---

## Routes reference (from production build)

| Route | Role |
|-------|------|
| `/` | Homepage |
| `/esoteriment`, `/esoteriment/[slug]` | Esoteriment hub + articles |
| `/lifeward`, `/lifeward/[slug]` | Lifeward hub + articles |
| `/lifeward/practice` | Daily practice (built, underlinked) |
| `/books`, `/books/[slug]` | Mini-books library |
| `/videos`, `/videos/[slug]` | Videos (empty catalog) |
| `/course` | Alternate course embed (env-dependent) |
| `/about` | About + contact form |
| `/rss`, `/rss.xml` | RSS feeds |
| `/sitemap.xml`, `/robots.txt` | SEO |
| `/admin`, `/admin/dashboard` | Admin (not public marketing) |
| `/checkout/[slug]` | Checkout (monetization) |
| `/api/*` | contact, comments, likes, search, admin, email |

---

## Environment variables (verify in Railway / host)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for RSS, OG, sitemap, share links |
| `NEXT_PUBLIC_TWITTER_HANDLE` | Twitter cards (align with real handle) |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Search Console |
| `RESEND_API_KEY`, `CONTACT_EMAIL` | Contact form delivery |
| `NEXT_PUBLIC_COURSE_*` | Optional `/course` page embed + CTA |
| DB vars (if used) | Comments/likes persistence (`lib/storage.ts`) |

---

## Suggested sequence for the massive change

1. **Lock IA** — Use the decision checklist above; mark what is removed vs kept.
2. **P0 fixes** — Contact link, Practice wiring, canonical URL, sitemap, OG image (quick wins even if UI changes later).
3. **Content model** — MDX schema, foundational flags, practice files, book fields.
4. **Design system** — Typography, colors (`lib/theme.ts`, `COLOR_PALETTE.md`), components to keep vs replace.
5. **Page build** — New templates against frozen slugs or planned redirects.
6. **SEO migration** — Redirect map for any slug/URL changes; resubmit sitemap.
7. **Deprecate** — Remove unused routes (checkout, admin, duplicate RSS) if out of scope.

---

## Related docs (reference only)

| Doc | Note |
|-----|------|
| `FEATURE_STATUS.md` | Claims 100% feature completion; trustworthy for implemented UI features |
| `IMPROVEMENTS_TO_ADD.md` | **Stale** — lists Start Here as missing; ignore for baseline |
| `FOUNDATIONAL_MESSAGES.md` | How `foundational: true` affects CTAs |
| `POST_LAUNCH_OPTIMIZATIONS.md` | Analytics, Search Console, env setup |
| `PRODUCTION_READY.md` | OG image, logo checklist |
| `CONTENT_MANAGEMENT.md` | Authoring workflow |

---

## Audit log

| Check | Result |
|-------|--------|
| `npm run build` | Pass |
| Git `main` vs `origin/main` | In sync |
| Live homepage vs `app/page.tsx` | Match |
| Live Esoteriment (9) / Lifeward (3) / Books (5) | Match repo |
| `content/videos/` | Missing (0 videos) |
| `getFirstFoundationalMessage` | `understanding-esoteriment`, `living-lifeward` |
| Production `sitemap.xml` | 500 at audit time — re-verify |
| `public/og-image.png` | Missing |

*Update the Audit log section after the next deploy or crawl.*
