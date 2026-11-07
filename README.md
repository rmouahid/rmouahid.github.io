# Terminal Noir Astro Theme

A static Astro starter for developer tools and open-source projects. It ships with Noir and Paper modes, bilingual
pages, an integration showcase and local content you can replace.

The packaged example is a fictional product called Noir CLI. Nothing in the example installs or runs a real program.

## Pending demo assets

Desktop, mobile, Noir and Paper screenshots of a deployed demo are pending. `public/og-image.svg` is a self-authored
placeholder. Replace it with a 1200 by 630 PNG before you publish. SVG is not accepted by every social platform.

## Features

- Noir (dark) and Paper (light) modes, remembered in the browser
- English and Brazilian Portuguese, with a shared dictionary
- Integration catalogue validated from `src/data/integrations.json`
- Install commands shown as text, with keyboard tabs and copy feedback
- Base-aware links for a site root or a GitHub Pages-style prefix

## Node.js

Use Node.js 22.22.0 or newer. `.nvmrc` selects the 22 line, and `package.json` sets `engines.node` to `>=22.22.0`.

## Install

After the public repository exists, start a project from the template:

```sh
npm create astro@latest -- --template nandomoreirame/terminalnoir-astro-theme
```

Until that repository exists, use this candidate directory and install from the lockfile:

```sh
npm ci
```

`private` stays `true`. Share the starter as a GitHub template repository. Do not publish this package to npm.

## Scripts

```sh
npm run dev
npm run build
npm run preview
npm run verify
```

`npm run verify` runs the contract tests, unit tests, `astro check`, Prettier, the import scan, and the browser matrix
for `/` and `/toolkit/`.

## Customize

Change the name, domain, navigation and install commands in `src/config/site.ts`. The rest of the map is in
`docs/customization.md`. Deployment for any static host is in `docs/deployment.md`.
