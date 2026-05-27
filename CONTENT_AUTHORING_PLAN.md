# Frontend Content Authoring — Plan

**Goal:** Create and edit articles, books, and videos from the browser (no IDE required), while keeping the public site reliable.

**Status:** Planning only — not implemented yet.  
**Today:** Content lives in `content/**/*.mdx`, created via `npm run content:new` and edited in the IDE, then git push → deploy.

---

## How content works today

| Layer | What it does |
|-------|----------------|
| `content/esoteriment/`, `content/lifeward/`, `content/books/`, `content/videos/` | MDX files + YAML frontmatter |
| `lib/mdx.ts` | Reads files from disk at runtime/build |
| `scripts/content-manager.ts` | CLI: create, validate, sync frontmatter |
| `/admin` | Password login — **comments only** (no content editing) |
| Learn / RSS / sitemap | All driven by `getAllArticles()` etc. from MDX |

---

## The main constraint (production)

On **Vercel** (and most serverless hosts), the app **cannot write** to the repo’s `content/` folder at runtime. The filesystem is read-only except `/tmp` (ephemeral).

So “save from the browser” must use one of:

1. **GitHub API** — commit MDX to the repo → deploy hook rebuilds the site  
2. **Database** — store body + frontmatter in Postgres → change `lib/mdx.ts` to read DB (and optionally keep MDX as export)  
3. **External CMS** — Sanity, Tina, Decap, etc. → API at build or request time  

**Recommendation for this project:** **GitHub-backed admin editor** first. You keep MDX-in-git, git history, and the current `lib/mdx.ts` pipeline with minimal change.

---

## Recommended approach: Admin content studio + GitHub

Extend the existing `/admin` area (same password session you use for comments).

### User flow

1. Go to `/admin` → log in  
2. Open **Content** tab → list articles / books  
3. **New article** → pick section (Understanding → `esoteriment`, Practice → `lifeward`), title, category, tags  
4. Write body in a markdown editor (preview optional)  
5. **Save draft** or **Publish** → API writes/updates `content/{section}/{slug}.mdx` via GitHub  
6. Vercel redeploys (~1–2 min) → live on site  

### Why this fits

- Reuses `scripts/content-manager.ts` logic (frontmatter, slugify, description extraction) — extract to shared `lib/content-files.ts`  
- Reuses existing admin auth (`lib/auth.ts`)  
- No rewrite of Learn, RSS, search, or article pages  
- Content stays in git (backup, diff, optional IDE edits still work)  

### What you’ll need (env)

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | Fine-grained PAT: repo Contents read/write |
| `GITHUB_REPO` | e.g. `topnotch-automate/LifePurpose` |
| `GITHUB_BRANCH` | Usually `main` |
| `ADMIN_PASSWORD` | Already used for `/admin` |

Optional: `GITHUB_CONTENT_PATH_PREFIX=content` if structure changes.

### Publish delay

Each publish triggers a **new deploy**. Acceptable for articles; for typo fixes you may want “Save to GitHub” without redeploy (still commits; deploy is automatic on Vercel).

---

## Alternative options (if you change your mind)

| Option | Pros | Cons |
|--------|------|------|
| **Decap CMS** (`/admin/cms` + `config.yml`) | Very little custom code; edits MDX in GitHub | Less control over Lifeward UI; OAuth setup |
| **TinaCMS** | Nice MDX editing; git-backed | Extra service/config; learning curve |
| **Postgres-only content** | Instant publish; no redeploy | Large refactor; content no longer in repo by default |
| **Substack / external for longform** | Already using for newsletter | Doesn’t replace on-site articles/SEO |

---

## Phased implementation

### Phase 1 — Articles only (MVP)

**Scope:** Create + edit **articles** in `esoteriment` and `lifeward`.

- [ ] Extract from `content-manager.ts`: `slugify`, `generateFrontmatter`, `extractDescription`, validate  
- [ ] `POST /api/admin/content` — create MDX via GitHub API  
- [ ] `PUT /api/admin/content/[section]/[slug]` — update  
- [ ] `GET /api/admin/content` — list files (GitHub tree or local in dev)  
- [ ] `/admin/content` UI: list, new, edit (markdown textarea + frontmatter fields)  
- [ ] Dev mode: optional **local filesystem** write when `NODE_ENV=development` (faster iteration without GitHub)  

**Exit criteria:** You can publish a new article from the browser; it appears on Learn after deploy.

### Phase 2 — Books + polish

- [ ] Book editor (longer form, cover URL, price, status)  
- [ ] Live preview (render MDX like article page)  
- [ ] “Validate” button calling same rules as `npm run content:validate`  

### Phase 3 — Videos + drafts (optional)

- [ ] Video MDX (embed URL, thumbnail)  
- [ ] Draft flag in frontmatter (`draft: true`) — filter out of Learn/sitemap until published  

---

## IA mapping (keep consistent with Learn)

| Learn filter | MDX location | Frontmatter `section` |
|--------------|--------------|------------------------|
| Understanding | `content/esoteriment/` | `Esoteriment` |
| Practice | `content/lifeward/` | `Lifeward` |
| Books | `content/books/` | — |
| Videos | `content/videos/` | — |

Admin UI should say **Understanding / Practice**, not Esoteriment/Lifeward, to match the public site.

---

## What stays the same

- Public URLs: `/esoteriment/[slug]`, `/lifeward/[slug]` (SEO)  
- CLI `npm run content:new` can remain for power users  
- IDE editing still works — last write wins; avoid editing same file in two places at once  

---

## Security checklist

- All content APIs require admin session (same as comment admin)  
- GitHub token **server-only** — never `NEXT_PUBLIC_*`  
- Validate section + slug (no path traversal, e.g. `../`)  
- Rate-limit publish endpoint  

---

## When you’re ready to build

Start with **Phase 1** only. First PR:

1. `lib/content-files.ts` — shared helpers extracted from CLI  
2. `lib/github-content.ts` — create/update file via GitHub Contents API  
3. `/admin/content` + one API route  
4. Test locally with filesystem fallback, then GitHub on staging  

Say the word and we can implement Phase 1 in the repo.

---

## Related files today

| File | Role |
|------|------|
| `scripts/content-manager.ts` | CLI to reuse |
| `lib/mdx.ts` | Reader (unchanged in Phase 1) |
| `lib/auth.ts` | Admin session |
| `app/admin/` | Extend with content routes |
| `CONTENT_MANAGEMENT.md` | Current CLI docs |
