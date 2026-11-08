import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { pageMetadata, robotsBody } from './seo';

it('builds absolute base-aware canonical and social image links', () => {
  const meta = pageMetadata('https://example.com', '/portfolio/', '/portfolio/projects/', 'Projects', 'All');
  expect(meta.canonical).toBe('https://example.com/portfolio/projects/');
  expect(meta.image).toBe('https://example.com/portfolio/og/default.png');
});

it('uses a per-page social image when given', () => {
  const meta = pageMetadata('https://example.com', '/', '/projects/rag-agent', 'RAG', 'x', '/og/rag-agent.png');
  expect(meta.image).toBe('https://example.com/og/rag-agent.png');
});

it('points robots at the sitemap index for the configured base', () => {
  expect(robotsBody('https://example.com', '/portfolio/')).toContain(
    'Sitemap: https://example.com/portfolio/sitemap-index.xml',
  );
  expect(robotsBody('https://example.com', '/')).toContain('Sitemap: https://example.com/sitemap-index.xml');
});

it('includes the sitemap integration and drops the original domain', () => {
  const config = readFileSync(new URL('../../astro.config.mjs', import.meta.url), 'utf8');
  expect(config).toContain('@astrojs/sitemap');
  expect(config).not.toContain(['terminalnoir', 'web.app'].join('.'));
});
