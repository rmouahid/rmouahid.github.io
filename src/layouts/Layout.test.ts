import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import Layout from './Layout.astro';
import { site } from '../config/site';

async function render(path = '/') {
  const container = await AstroContainer.create();
  return container.renderToString(Layout, { request: new Request(`https://example.com${path}`) });
}

it('renders the owner identity and profile links', async () => {
  const html = await render();
  expect(html).toContain(site.terminalLabel);
  expect(html).toContain(site.links.github);
  expect(html).toContain(site.links.linkedin);
  expect(html).toContain('<html lang="en"');
  expect(html).not.toContain(['terminalnoir', 'web.app'].join('.'));
});

it('ships a single language without a language switcher', async () => {
  const html = await render();
  expect(html).not.toContain('hreflang');
  expect(html).not.toContain('pt-br');
  expect(html).not.toContain('aria-label="Language"');
});

it('credits the theme author in the footer', async () => {
  const html = await render();
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1] ?? '';
  expect(footer).toMatch(/<a\b[^>]*href="https:\/\/github\.com\/nandomoreirame"[^>]*>\s*nandomoreira\.dev\s*<\/a>/);
  const authorLink = footer.match(/<a\b[^>]*href="https:\/\/github\.com\/nandomoreirame"[^>]*>/)?.[0] ?? '';
  expect(authorLink).toContain('rel="noopener noreferrer"');
});

it('points social metadata at the default card', async () => {
  const html = await render();
  expect(html).toMatch(/<meta property="og:image" content="[^"]*\/og\/default\.png"/);
});
