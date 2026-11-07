import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { featuredProjects, projectSchema, projectTags, sortProjects, tagKey } from './projects';
import { project } from '../test/fixtures';

const schema = projectSchema(z.string());
const valid = {
  title: 'rag-agent',
  summary: 'Question answering over documents.',
  tldr: ['a', 'b', 'c'],
  tags: ['RAG'],
  stack: ['Python'],
  repo: 'https://github.com/rmouahid/rag-agent',
  date: '2026-03-03',
};

describe('projectSchema', () => {
  it('fills defaults and coerces the date', () => {
    const data = schema.parse(valid);
    expect(data).toMatchObject({ featured: false, order: 100, status: 'active' });
    expect(data.date).toBeInstanceOf(Date);
  });

  it.each([
    ['more than three TL;DR bullets', { tldr: ['1', '2', '3', '4'] }],
    ['an unsafe repository URL', { repo: 'javascript:alert(1)' }],
    ['an unknown status', { status: 'draft' }],
    ['a cover without alt text', { cover: './cover.png' }],
    ['a summary longer than one line', { summary: 'x'.repeat(161) }],
  ])('rejects %s', (_, patch) => {
    expect(() => schema.parse({ ...valid, ...patch })).toThrow();
  });
});

describe('catalogue helpers', () => {
  const items = [
    project('old', { order: 1, date: new Date('2024-01-01'), tags: ['Java'] }),
    project('new', { order: 1, date: new Date('2026-01-01'), tags: ['LLM', 'RAG'], featured: true }),
    project('first', { order: 0, tags: ['LLM'], featured: true }),
  ];

  it('sorts by order, then newest first', () => {
    expect(sortProjects(items).map(item => item.id)).toEqual(['first', 'new', 'old']);
  });

  it('keeps featured projects only', () => {
    expect(featuredProjects(items).map(item => item.id)).toEqual(['first', 'new']);
  });

  it('lists tags by frequency then name', () => {
    expect(projectTags(items)).toEqual(['LLM', 'Java', 'RAG']);
  });

  it('builds stable keys for tags', () => {
    expect(tagKey('Vector search')).toBe('vector-search');
    expect(tagKey('C++')).toBe('c');
  });
});
