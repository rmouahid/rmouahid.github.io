import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import { site } from './src/config/site.ts';
import terminalNoir from './src/data/shiki/terminal-noir.json' with { type: 'json' };

const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site: site.url,
  base,
  output: 'static',
  integrations: [icon(), sitemap()],
  markdown: {
    // Code blocks use the vendored Terminal Noir theme; Mermaid blocks are left as text and drawn in the browser.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid', 'math'] },
    shikiConfig: { theme: terminalNoir },
  },
  // GitHub Pages serves folders with a trailing slash; links match it so no click goes through a redirect.
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  preview: {
    host: '127.0.0.1',
    port: Number(process.env.PREVIEW_PORT || 4321),
    strictPort: true,
  },
});
