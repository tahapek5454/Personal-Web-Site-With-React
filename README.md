# Taha Pek - Personal Site

Bilingual (TR/EN) portfolio and blog built with Next.js (App Router), Tailwind CSS v4, deployed on Netlify.

## Development

```bash
npm install
npm run dev     # next dev --turbopack (drafts are visible)
npm run build   # production build (drafts are excluded)
npm run lint
```

## Structure

- `app/(tr)` and `app/(en)/en`: two root layouts, one per language (`/` and `/en`).
- `content/dictionary.ts`, `content/projects.ts`: UI strings and projects.
- `config/site.ts`: site identity. Bump `contentUpdatedAt` when non-blog content changes (sitemap `lastmod`).
- `lib/`: i18n paths, SEO metadata, JSON-LD, markdown/llms output, blog loader (`lib/blog.ts`).
- Agent-friendly output: `/llms.txt`, `/llms-full.txt`, and a markdown twin of every page (`/blog/<slug>.md`, `/index.md`, ...).

## Writing a blog post

Add one folder per post with one file per language, then deploy. Sitemap, topic pages, search index, RSS, markdown twins and `llms*.txt` update automatically.

```
content/blog/<slug>/tr.md
content/blog/<slug>/en.md
```

```markdown
---
title: "Post title"
description: "One or two sentences used for SEO and cards."
date: 2026-11-02
updated: 2026-11-10        # optional
topic: ai                  # one topic per post, same key in both languages
tags: [langchain, agents]  # free-form, used for filtering and search
cover: /images/blog/<slug>/cover.webp   # optional, must exist under public/
draft: true                # optional, excluded from production
---

Start with `##` headings; the page title is the `title` above.
```

Rules enforced at build time:

- Both `tr.md` and `en.md` must exist and share the same `topic`.
- The folder name is the URL slug for both languages (lowercase letters, digits, hyphens). `konu`, `topic`, `sayfa`, `page` are reserved.
- Images go in `public/images/blog/<slug>/` and are referenced relatively (`![alt](diagram.png)`). External images and raw HTML are not supported.
- Topic labels live in `content/blog/topics.ts`; unlisted topics fall back to the humanized key.
- Set `BLOG_INCLUDE_DRAFTS=1` to include drafts in a production build.

## Routes

| | Turkish | English |
| --- | --- | --- |
| Blog | `/blog`, `/blog/sayfa/2` | `/en/blog`, `/en/blog/page/2` |
| Post | `/blog/<slug>` | `/en/blog/<slug>` |
| Topic | `/blog/konu/<topic>` | `/en/blog/topic/<topic>` |
| RSS | `/blog/rss.xml` | `/en/blog/rss.xml` |
