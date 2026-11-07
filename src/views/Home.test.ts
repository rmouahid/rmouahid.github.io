import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import Home from './Home.astro';
import { site } from '../config/site';
import { project } from '../test/fixtures';

const render = async (projects: unknown[]) =>
  (await AstroContainer.create()).renderToString(Home, {
    props: { projects },
    request: new Request('https://example.com/'),
  });

it('presents the owner, availability and contact links', async () => {
  const html = await render([]);
  expect(html).toContain(site.name);
  expect(html).toContain(site.tagline.replace('&', '&amp;'));
  expect(html).toContain(site.availability);
  for (const href of [site.links.cv, site.links.github, site.links.linkedin, `mailto:${site.links.email}`]) {
    expect(html).toContain(`href="${href}"`);
  }
  expect(html).not.toMatch(/get started|integrations|install/i);
});

it('shows at most three featured projects in order', async () => {
  const projects = ['a', 'b', 'c', 'd'].map((id, i) => project(id, { featured: true, order: 4 - i }));
  const html = await render([...projects, project('plain')]);
  expect(html).toContain('featured-projects');
  expect(html).toContain('/projects/d');
  expect(html).not.toContain('/projects/a"');
  expect(html).not.toContain('/projects/plain');
  expect(html.indexOf('/projects/d')).toBeLessThan(html.indexOf('/projects/c'));
});

it('hides the featured section when nothing is featured', async () => {
  const html = await render([project('plain')]);
  expect(html).not.toContain('featured-projects');
});
