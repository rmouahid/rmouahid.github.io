import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import ProjectDetail from './ProjectDetail.astro';
import { project } from '../test/fixtures';

const headings = [
  { depth: 2, slug: 'tldr', text: 'TL;DR' },
  { depth: 2, slug: 'problem', text: 'Problem' },
  { depth: 3, slug: 'detail', text: 'Detail' },
];

it('links the repository, the stack and the section index', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(ProjectDetail, {
    props: { project: project('rag-agent', { stack: ['NumPy', 'FastAPI'] }), headings },
  });
  expect(html).toContain('href="https://github.com/rmouahid/rag-agent"');
  expect(html).toContain('NumPy');
  expect(html).toContain('href="#problem"');
  expect(html).toContain('href="#tldr"');
  expect(html).toMatch(/<h2 id="tldr">TL;DR<\/h2>\s*<ul class="tldr">\s*<li>Result one<\/li>/);
  expect(html).not.toContain('href="#detail"');
  expect(html).toContain('/og/rag-agent.png');
  expect(html).not.toContain('<img');
  expect(html).not.toContain('Live demo');
});

it('shows the demo link and archived status when present', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(ProjectDetail, {
    props: { project: project('x', { demo: 'https://demo.example', status: 'archived' }) },
  });
  expect(html).toContain('href="https://demo.example"');
  expect(html).toContain('archived');
});
