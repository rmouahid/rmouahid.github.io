import { expect, it } from 'vitest';
import { site, parseSite, resolveSiteUrl } from './site';

it('describes the portfolio owner', () => {
  expect(site.name).toBe('Rayân Mouahid');
  expect(site.links.github).toBe('https://github.com/rmouahid');
  expect(site.availability).toContain('March 2027');
  expect(site.nav.map(item => item.href)).toEqual(['/', '/projects', '/about']);
});

it('rejects script URLs', () => {
  expect(() => parseSite({ ...site, links: { ...site.links, github: 'javascript:alert(1)' } })).toThrow();
});

it('rejects invalid navigation paths', () => {
  expect(() => parseSite({ ...site, nav: [{ href: '//evil.example', label: 'Home' }] })).toThrow();
});

it('falls back to the GitHub Pages origin unless SITE_URL is an http(s) URL', () => {
  expect(resolveSiteUrl(undefined)).toBe('https://rmouahid.github.io');
  expect(resolveSiteUrl('  ')).toBe('https://rmouahid.github.io');
  expect(resolveSiteUrl('https://demo.example')).toBe('https://demo.example');
  expect(() => resolveSiteUrl('javascript:alert(1)')).toThrow();
});
