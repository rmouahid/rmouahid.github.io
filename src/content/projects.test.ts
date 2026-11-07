import { readdirSync, readFileSync } from 'node:fs';
import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { checkCaseStudy, projectSchema } from '../lib/projects';

// Every case study, and the template, must follow the editorial structure.
const dir = new URL('./projects/', import.meta.url);
const files = readdirSync(dir).filter(file => /\.mdx?$/.test(file));
const schema = projectSchema(z.string());

function read(file: string) {
  const source = readFileSync(new URL(file, dir), 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing frontmatter`);
  return { data: parse(match[1]), body: match[2] };
}

it('finds the template and at least one case study', () => {
  expect(files).toContain('_template.md');
  expect(files.filter(file => !file.startsWith('_')).length).toBeGreaterThan(0);
});

describe.each(files)('%s', file => {
  const { data, body } = read(file);

  it('has valid frontmatter', () => {
    expect(() => schema.parse(data)).not.toThrow();
  });

  it('follows the case study structure', () => {
    expect(checkCaseStudy(body, data.tldr)).toEqual([]);
  });

  it('links its own repository', () => {
    expect(body).toContain(data.repo);
  });
});

it('features at most three projects', () => {
  const featured = files.filter(file => !file.startsWith('_') && read(file).data.featured);
  expect(featured.length).toBeLessThanOrEqual(3);
});
