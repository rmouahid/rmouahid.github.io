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
