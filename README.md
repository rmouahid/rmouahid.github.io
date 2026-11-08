# Rayân Mouahid · Portfolio

Case studies of my AI, LLM, RAG and data projects. GitHub holds the code; this site holds the documentation: the
problem, the architecture, the technical choices, measured results and limitations of each project.

Built with Astro on the [Terminal Noir Astro Theme](https://github.com/nandomoreirame/terminalnoir-astro-theme)
(`nandomoreirame/terminalnoir-astro-theme`, MIT). See `docs/credits.md`.

## Structure

| What                                                       | Where                                                                         |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Name, links, availability, navigation, calls to action     | `src/config/site.ts`                                                          |
| Case studies (one Markdown file per project)               | `src/content/projects/`                                                       |
| Case study frontmatter schema                              | `src/lib/projects.ts`, wired in `src/content.config.ts`                       |
| Pages                                                      | `src/views/` (Home, Projects, ProjectDetail, About), routed from `src/pages/` |
| Resume                                                     | `public/rayan-mouahid-cv.pdf`                                                 |
| Open Graph cards (one PNG per project, generated at build) | `src/pages/og/[slug].png.ts`, `src/lib/og.ts`                                 |

## Writing a case study

Copy `src/content/projects/_template.md` to `<slug>.md`. The frontmatter is validated at build time
(`src/lib/projects.ts`):

| Field               | Type                   | Notes                                           |
| ------------------- | ---------------------- | ----------------------------------------------- |
| `title`             | string                 | as on GitHub                                    |
| `summary`           | string                 | one line, 160 characters max                    |
| `tldr`              | 1–3 strings            | at least one number; drawn as the TL;DR section |
| `tags`              | strings                | catalogue filters (LLM, RAG, MCP, Data, Java…)  |
| `stack`             | strings                |                                                 |
| `featured`          | boolean                | home page, 3 max                                |
| `order`             | integer                | lower first, default 100                        |
| `repo`              | URL                    |                                                 |
| `demo`              | URL                    | optional                                        |
| `cover`, `coverAlt` | image, string          | optional; alt text required with a cover        |
| `status`            | `active` \| `archived` | default `active`                                |
| `date`              | date                   |                                                 |

The body has exactly these sections, in this order: Problem, Architecture (Mermaid diagram or image), Technical choices
& trade-offs, Results (table or chart), Limitations & next steps, Links. `npm test` checks the structure; write `TODO:`
for anything not measured yet.

## Develop

Node.js 22.22 or newer (`.nvmrc`).

```sh
npm ci
npm run dev
npm run build
npm run verify   # unit + contract tests, astro check, Prettier, import scan, browser matrix
```

The browser matrix needs Playwright's Chromium: `npx playwright install chromium`.

`SITE_URL` and `SITE_BASE` set the public origin and the sub-path, for example
`SITE_URL=https://rmouahid.github.io SITE_BASE=/portfolio/ npm run build`.

## Deploy

`.github/workflows/deploy.yml` builds with the official Astro action and publishes to GitHub Pages on every push to
`main`. The repository is `rmouahid/rmouahid.github.io`, served at the root of https://rmouahid.github.io, so
`SITE_BASE` stays unset. In the repository settings, Pages → Source must be **GitHub Actions**.
