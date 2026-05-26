# Lifeward Website — Implementation Strategy

**Sources:** `Lifeward_Website_Implementation_Prompt.docx`, `lifeward_style_guide.html`  
**Target codebase:** `Purpose` (Next.js 16, App Router, MDX)  
**Companion:** `REDESIGN_BASELINE.md` (current production parity)  
**Status:** Ready to execute when Pro upgrade begins — strategy only, no code changes yet.

---

## What is being asked (plain summary)

The site shifts from a **dual-path writing platform** (Esoteriment vs Lifeward) to a **unified Lifeward Coaching Inc. brand** aimed at Ghanaian professionals and spiritual seekers.

The business promise: help people discover **true identity** and live from it through the **LIAM framework** (Lifeward · Identity · Alignment · Method).

Design must match the style guide: **Deep Navy + Covenant Gold + Parchment**, typography **Cormorant Garamond / Cinzel / DM Sans**, calm authoritative voice, note-card patterns for short-form content.

Navigation simplifies from 7 items to **5**. Two net-new pages are priority: **`/work-with-me`** (primary revenue CTA) and **`/start-here`** (onboarding). **`/learn`** replaces Esoteriment/Lifeward in the nav as a unified library with Understanding / Practice filters.

Individual article URLs at `/esoteriment/*` and `/lifeward/*` **stay unchanged** for SEO; only global chrome (nav, footer, tokens) updates on those pages.

---

## Style guide → code mapping

| Style guide token | Hex | Code target |
|-----------------|-----|-------------|
| Deep Navy | `#1A3260` | `--navy` — nav, footer, dark sections, headings |
| Royal Blue | `#2050A0` | `--royal` — links, hover, accents |
| Covenant Gold | `#C8952A` | `--gold` — CTAs, dividers, accent borders |
| Light Gold | `#E8B84B` | `--gold-lt` — italic emphasis, hover glow |
| Parchment | `#FAF8F4` | `--cream` — default page background |
| Morning Sky | `#D6E6F7` | `--sky` — callouts, rule examples |
| Charcoal | `#2C2C2C` | `--charcoal` — body text |
| Mid Grey | `#6B6B6B` | `--mid` — captions, metadata |
| Pale Linen | `#E8E4DC` | `--light` — dividers |

| Typography role | Font | Replace in codebase |
|-----------------|------|---------------------|
| Display / hero / article titles | Cormorant Garamond 300 | `Playfair_Display` in `app/layout.tsx` |
| Section labels / nav / badges | Cinzel 400–600, uppercase + tracking | New — not in repo today |
| Body / UI | DM Sans 300–500 | `Inter` in `app/layout.tsx` |

**Reusable UI patterns from `lifeward_style_guide.html` to componentize:**

- Navy gradient hero with gold radial accents (cover block)
- LIAM letter row (L / I / A / M with labels)
- Light + dark **note cards** (gold top border or navy gradient)
- Pull-quote band (navy bg, large italic Cormorant, gold emphasis)
- Section label pattern (Cinzel 10px, gold, letter-spacing 4px)

---

## Gap analysis: prompt vs current repo

| Prompt requirement | Current state | Action |
|--------------------|---------------|--------|
| 5-item nav | 7 items in `Navigation.tsx` | Replace nav model |
| `/work-with-me` | Does not exist | **Create** (Priority #1) |
| `/start-here` | Partially on homepage `#start-here` | **Create** dedicated page; homepage hero CTAs point here |
| `/learn` unified library | Separate `/esoteriment`, `/lifeward` hubs | **Create**; keep old routes, depromote in nav |
| Homepage 6 sections | Different structure + Owwlish course embed | **Rebuild** `app/page.tsx` |
| About: reader-first copy | Author-first mission copy | **Rewrite** structure; keep contact form |
| Footer: 3 columns + LIAM tagline | Minimal single-row footer | **Rebuild** `Footer.tsx` |
| LIAM block on home | Not present | **Add** |
| Newsletter strip → Substack | Footer link only | **Add** homepage section |
| Article pages unchanged | Full article UI exists | Nav/footer/tokens only |
| Brand CSS globally | Gray/tan Esoteriment/Lifeward themes in `lib/theme.ts` | Replace/extend with Lifeward tokens |
| Fonts | Inter + Playfair | Swap to DM Sans + Cormorant + Cinzel |

### Not specified in prompt — decide before or during build

| Feature | Recommendation |
|---------|----------------|
| **Books** (5 mini-books) | Link from Start Here free-resource block and/or footer “Writing” column; optional `/books` kept off main nav |
| **Videos** (empty) | Omit from nav (per prompt); keep route or redirect to `/learn` |
| **Course / Owwlish** | Omit from new homepage (per prompt); keep embed on a secondary URL or retire |
| **Daily Practice** (`/lifeward/practice`) | Promote from Start Here or Learn as “Practice” content, or defer |
| **Search** | Not in new nav — remove from header or tuck into Learn page |
| **Comments / likes / admin** | Leave backend; hide or keep on articles without redesign scope creep |
| **Checkout / monetization** | Out of prompt scope — books can stay download/purchase via existing flows |

---

## Content mapping for `/learn`

Filter logic (no MDX migration required initially):

| MDX `section` | Display tag | Filter key |
|---------------|-------------|------------|
| `esoteriment` | Understanding | `understanding` |
| `lifeward` | Practice | `practice` |

Use existing `getAllArticles()` sorted by date. Reuse `ArticleCard` patterns with new badge styling (Cinzel navy/royal badges).

Category filters inside Esoteriment/Lifeward (Law, Consciousness, etc.) can remain on legacy hub pages or be added to Learn as a phase-2 enhancement — **not required in prompt**.

---

## Start Here reading path (specified URLs)

Preserve these slugs exactly:

1. `/esoteriment/understanding-esoteriment`
2. `/esoteriment/identity-the-foundation-of-all-seeking`
3. `/esoteriment/spirit-creation-and-consciousness`
4. `/lifeward/living-lifeward`
5. `/esoteriment/thought-belief-and-feeling`

Free resource block: email capture — wire to existing `POST /api/email/subscribe` or Substack; placeholder copy until Albert names the offer.

---

## Placeholders Albert must fill before launch

| Location | Placeholder |
|----------|-------------|
| About | `[Albert's personal turning point story here]` |
| Work With Me | Programme name, price, Calendly/booking URL |
| Work With Me | 3 testimonial slots |
| Start Here | Free resource title, description, download/link |
| Work With Me headline | Refine six-week transformation promise in own voice |

---

## Phased execution plan

Execute in order. Each phase ends with `npm run build` and a visual check at 375 / 768 / 1200px.

### Phase 0 — Design foundation (half day)

**Goal:** One source of truth for brand tokens; no page restructure yet.

1. Add CSS variables to `app/globals.css` (`:root` block from prompt).
2. Replace fonts in `app/layout.tsx` (next/font/google: Cormorant_Garamond, DM_Sans, Cinzel).
3. Refactor `lib/theme.ts` → Lifeward palette; map legacy `esoteriment`/`lifeward` section accents to navy/gold where articles still use section themes.
4. Create shared primitives (minimal set):
   - `SectionLabel` (Cinzel gold uppercase)
   - `DisplayHeading` (Cormorant)
   - `ButtonPrimary` / `ButtonSecondary` (gold fill / navy outline)
   - `NoteCard` (light + dark variants from style guide)
   - `LiamFramework` (four-column block + mobile stack)

**Exit criteria:** Tokens and fonts load globally; one test page or Storybook-style scratch renders correctly.

### Phase 1 — Global chrome (half day)

**Goal:** New nav and footer everywhere.

1. Rebuild `components/layout/Navigation.tsx`:
   - Items: Home, About, Work With Me (gold border button), Learn, Start Here
   - Mobile hamburger; Work With Me keeps button styling in drawer
   - Remove Search from nav (or confirm with Albert)
2. Rebuild `components/layout/Footer.tsx`:
   - Navy bg, LIAM tagline, 3 columns (Navigation / Writing / Connect)
   - Preserve X, RSS, Substack, copyright line
3. Update `app/sitemap.ts`: add `/work-with-me`, `/start-here`, `/learn`

**Exit criteria:** Every existing page shows new nav/footer; old nav labels gone.

### Phase 2 — New pages (1–1.5 days)

**Goal:** Three new routes with placeholder-aware copy.

1. **`app/work-with-me/page.tsx`** — all 6 sections from Task 4 (headline, who for, the work, journey steps, offer, testimonials placeholder, discovery CTA).
2. **`app/start-here/page.tsx`** — welcome, philosophy line, reading path, free resource + email, Work With Me CTA.
3. **`app/learn/page.tsx`** + **`LearnPageClient.tsx`** — filter bar (All / Understanding / Practice), article grid, tags from `article.section`.

**Exit criteria:** All three routes render; filters work client-side; all 12 articles appear.

### Phase 3 — Homepage + About (1 day)

**Goal:** Core marketing funnel matches prompt Tasks 2–3.

1. Rebuild `app/page.tsx` — 6 sections in order: Hero → Philosophy Bridge → Three Pillars → LIAM → Latest Writing (3 cards) → Newsletter strip.
2. Rewrite `app/about/page.tsx` — reader pain opening, story placeholders, LIAM summary, dual CTA; **retain** `ContactForm` below CTAs.

**Exit criteria:** Homepage answers who / what / next in ~10 seconds; About leads with reader struggle.

### Phase 4 — Article & legacy hub touch (half day)

**Goal:** Preserve content; align chrome only (Task 7).

1. Article templates (`ArticleContent`, reading progress, share): apply cream background, charcoal body, Cormorant titles, new nav/footer only — **no body rewrite**.
2. `/esoteriment` and `/lifeward` hub pages: optional minimal banner (“Browse all writing on Learn →”) or leave as SEO landing pages with new chrome.
3. Fix P0 from baseline: `/lifeward/practice` → link to `/about` not `/contact`; decide Practice promotion separately.

**Exit criteria:** Sample article from each section unchanged in content; new nav/footer visible.

### Phase 5 — SEO, metadata, polish (half day)

1. Update `lib/metadata.ts` and layout metadata for Lifeward Coaching positioning.
2. Add `public/og-image.png` (navy/gold branded).
3. Fix RSS author email; unify `@TheAlbertBlibo` handle.
4. Verify `NEXT_PUBLIC_SITE_URL` canonical domain.
5. WCAG contrast pass on gold-on-cream and white-on-navy.
6. Update `REDESIGN_BASELINE.md` audit log post-deploy.

**Exit criteria:** Build green; sitemap includes new routes; social preview asset exists.

### Phase 6 — Content & funnel decisions (parallel / post-launch)

- Wire Start Here email to Resend or Substack.
- Add real Calendly URL to Work With Me.
- Fill testimonials, programme name, pricing.
- Decide fate of Books, Videos, Course, Daily Practice in footer or Start Here.
- Optional: redirect `/` old anchors; analytics (GA4) from `POST_LAUNCH_OPTIMIZATIONS.md`.

---

## File change forecast

| Action | Files |
|--------|-------|
| **Create** | `app/work-with-me/page.tsx`, `app/start-here/page.tsx`, `app/learn/page.tsx`, `app/learn/LearnPageClient.tsx`, `components/lifeward/*` (primitives) |
| **Major edit** | `app/page.tsx`, `app/about/page.tsx`, `components/layout/Navigation.tsx`, `components/layout/Footer.tsx`, `app/globals.css`, `app/layout.tsx`, `lib/theme.ts` |
| **Light edit** | Article layout components, `app/sitemap.ts`, `lib/metadata.ts`, `.cursor/rules/redesign-baseline.mdc` |
| **Preserve** | `content/**/*.mdx`, `app/esoteriment/[slug]`, `app/lifeward/[slug]`, API routes, admin |
| **Depromote** | Homepage Owwlish block, dual SectionPanel Esoteriment/Lifeward split, 7-item nav |

---

## Quality gates (from prompt Section 4 checklist)

Before calling the rebuild done:

- [ ] 5-item nav on every page including articles
- [ ] Work With Me = gold button in nav (desktop + mobile)
- [ ] `/work-with-me`, `/start-here`, `/learn` complete
- [ ] Homepage 6 sections in correct order
- [ ] About leads with reader pain
- [ ] Footer 3-column navy layout + LIAM tagline
- [ ] CSS variables + 3 fonts globally
- [ ] Responsive 375 / 768 / 1200+
- [ ] Keyboard nav + WCAG AA contrast
- [ ] Placeholder inventory delivered to Albert
- [ ] No unrequested pages/features added

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Coaching repositioning drops Esoteriment brand equity | Keep URLs; Understanding tag preserves semantics in Learn |
| Prompt omits Books/Videos/Course | Explicit phase-6 decisions; don’t delete routes without redirect |
| Placeholder copy ships to production | Bracket placeholders in UI until Albert replaces; flag in delivery notes |
| Font load performance (3 families) | `next/font` with `display: swap`; subset latin only |
| Article pages look disjointed if only chrome changes | Phase 4 optional light typography pass on `.article-content` prose |

---

## Execution order when Pro work begins

**Day 1:** Phase 0 → Phase 1 → Phase 2 (Work With Me first)  
**Day 2:** Phase 2 (Learn + Start Here) → Phase 3  
**Day 3:** Phase 4 → Phase 5 → placeholder handoff  

Start each Claude/Cursor session with: read `LIFEWARD_IMPLEMENTATION_STRATEGY.md`, `REDESIGN_BASELINE.md`, and the scoped `.cursor/rules/redesign-baseline.mdc`.

---

*Strategy authored from full review of implementation prompt (334 paragraphs) and style guide HTML. Ready for implementation.*
