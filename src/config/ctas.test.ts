import { expect, it } from 'vitest';
import { getContactLinks, getCtas } from '../lib/ctas';
import { parseSite, site } from './site';

it('resolves site paths against the base and keeps external links', () => {
  const ctas = getCtas('/portfolio/');
  expect(ctas.header.href).toBe(`/portfolio${site.links.cv}`);
  expect(ctas.box.primary.href).toBe(`mailto:${site.links.email}`);
});

it('lists resume, GitHub, LinkedIn and email in that order', () => {
  const links = getContactLinks('/');
  expect(links.map(link => link.id)).toEqual(['cv', 'github', 'linkedin', 'email']);
  expect(links[0].href).toBe(site.links.cv);
  expect(links[3].href).toBe(`mailto:${site.links.email}`);
});

it.each(['javascript:alert(1)', '//evil.example', '/\\evil.example', 'mailto:not-an-email'])(
  'rejects unsafe CTA links: %s',
  href => {
    const input = structuredClone(site);
    input.ctas.header.href = href;
    expect(() => parseSite(input)).toThrow();
  },
);
