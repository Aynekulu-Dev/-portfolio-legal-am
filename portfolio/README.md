# PortfolioTemplate — Frontend (Legal / Public Prosecutor edition)

Self-hosted, high-performance portfolio frontend for a legal professional
(ዐቃቤ ሕግ / public prosecutor), in Amharic. Built with **Next.js 14 (App
Router)**, **TypeScript**, and **Tailwind CSS**. This package is the
**frontend only** — it ships with local JSON config so it runs and looks
complete on its own, and is ready to point at a NestJS + PostgreSQL backend
once you build one.

## Sections

Home · About (ስለ እኔ) · Services / Practice areas (አገልግሎቶች) · Cases & Research
(መዝገቦች) · Blog (ብሎግ) · Contact (አግኙኝ) — each its own route under `/app`.

## Design

A "case-file / legal registry" identity: a circular seal mark in the nav,
section headers styled as proclamation articles (አንቀጽ ፩, ፪, ...), and case
cards carry a registry number (መዝ.ቁ.) instead of a generic list index. Parchment
and charcoal tones with maroon/brass accents; dark mode is the default, light
mode is available via the toggle in the nav. Fonts are Noto Serif/Sans
Ethiopic for full Amharic (Ge'ez script) support.

## Stack

- **Next.js 14** App Router, React Server Components for data-heavy pages
- **Tailwind CSS**, dark/light theme via `next-themes` (`class` strategy)
- **next/font** — Noto Serif Ethiopic (display), Noto Sans Ethiopic (body),
  JetBrains Mono (numeric labels only)
- **react-markdown** for the blog reader
- **lucide-react** icons

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — see below
npm run dev
```

Visit `http://localhost:3000`.

## Configuring your content

All content lives in `/data` as JSON:

| File                  | Contains                                         |
| ---------------------- | ------------------------------------------------- |
| `data/profile.json`    | Name, title, bio, contact links                   |
| `data/services.json`   | Practice areas (አገልግሎቶች)                          |
| `data/projects.json`   | Case files & research entries (መዝገቦች)             |
| `data/blog.json`       | Blog posts (ብሎግ), Markdown content                |

Edit these files directly — no database required for the static template.
Replace `public/resume/resume.pdf` with a real CV (same filename, or update
`resume_url` in `profile.json`).

A case entry (`data/projects.json`) looks like this:

```json
{
  "case_no": "መዝ.ቁ. 1247/2016",
  "title": "...",
  "description": "...",
  "category": "criminal",       // or "research"
  "statutes": ["..."],
  "court": "...",
  "outcome": "...",
  "created_at": "2026-05-14"
}
```

**Note on confidentiality:** case details published here should already be a
matter of public record or otherwise cleared for publication — don't put
anything under active investigation or subject to a confidentiality
obligation into this file.

## Connecting a backend

1. Set `NEXT_PUBLIC_API_URL` in `.env.local` to your deployed API.
2. In `lib/data.ts`, swap the JSON-backed functions (`getProfile`,
   `getServices`, `getCases`, `getBlogPosts`) for `fetch()` calls against your
   NestJS endpoints. Return shapes can stay the same, so no page or component
   needs to change.
3. The contact form already posts to `${NEXT_PUBLIC_API_URL}/contact` — set
   `NEXT_PUBLIC_API_URL` to start sending through your real backend (rate
   limiting and sanitization stay the backend's job).

## Deployment

Deploy the frontend to **Vercel**:

```bash
vercel
```

Set `NEXT_PUBLIC_API_URL` as an environment variable once your backend is
live. Pair with **Render/Railway** for the NestJS API and **Neon/Supabase**
for PostgreSQL.

## Project structure

```
app/
  layout.tsx          Root layout: fonts, theme, nav, footer
  page.tsx             Home
  about/page.tsx        About
  services/page.tsx     Practice areas
  projects/             Cases & research (with category filter)
  blog/                 Blog directory + /blog/[slug] reader
  contact/page.tsx      Contact form
components/            Reusable UI (cards, nav, footer, contact form)
data/                  Content as JSON (swap for API calls when ready)
lib/data.ts             Data access layer
```
