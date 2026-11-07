import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import Projects from './Projects.astro';
import { project } from '../test/fixtures';

const render = async (projects: unknown[]) =>
  (await AstroContainer.create()).renderToString(Projects, { props: { projects } });

it('lists every project with search data and one filter per tag', async () => {
  const html = await render([
    project('rag', { tags: ['RAG', 'LLM'] }),
    project('mcp', { tags: ['MCP', 'LLM'] }),
    project('jav', { tags: ['Java'] }),
  ]);
  for (const id of ['rag', 'mcp', 'jav']) expect(html).toContain(`/projects/${id}`);
  expect(html).toContain('id="project-search"');
  expect(html).toMatch(/data-tag=""[^>]*aria-pressed="true"/);
  for (const tag of ['llm', 'rag', 'mcp', 'java']) expect(html).toContain(`data-tag="${tag}"`);
  expect(html).toContain('data-tags="rag llm"');
});

it('announces an empty catalogue', async () => {
  const html = await render([]);
  expect(html).toContain('No projects published yet.');
  expect(html).not.toContain('id="project-search"');
});
