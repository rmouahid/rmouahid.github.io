import { expect, it } from 'vitest';
import { asset, canonicalPath, resolveHref, route } from './urls';

it.each([
  ['/', '/', '/'],
  ['/portfolio/', '/', '/portfolio/'],
  ['/portfolio/', '/projects/rag-agent', '/portfolio/projects/rag-agent/'],
  ['/', '/projects/', '/projects/'],
  ['/portfolio/', '/about#stack', '/portfolio/about/#stack'],
] as const)('composes base %s with %s', (base, path, result) => expect(route(path, base)).toBe(result));

it('resolves site paths and leaves external links alone', () => {
  expect(resolveHref('/rayan-mouahid-cv.pdf', '/portfolio/')).toBe('/portfolio/rayan-mouahid-cv.pdf');
  expect(resolveHref('https://github.com/rmouahid', '/portfolio/')).toBe('https://github.com/rmouahid');
  expect(resolveHref('mailto:someone@example.com', '/portfolio/')).toBe('mailto:someone@example.com');
});

it('resolves assets from the base', () => {
  expect(asset('/favicon.svg', '/')).toBe('/favicon.svg');
  expect(asset('/og/rag-agent.png', '/portfolio/')).toBe('/portfolio/og/rag-agent.png');
});

it('gives every page one canonical form', () => {
  expect(canonicalPath('/projects')).toBe('/projects/');
  expect(canonicalPath('/projects/')).toBe('/projects/');
  expect(canonicalPath('/')).toBe('/');
});
