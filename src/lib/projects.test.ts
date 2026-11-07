import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { checkCaseStudy, featuredProjects, projectSchema, projectTags, sortProjects, tagKey } from './projects';
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

describe('checkCaseStudy', () => {
  const body = [
    '## Problem',
    'Slow search.',
    '## Architecture',
    '```mermaid',
    'flowchart LR',
    '## not a heading inside a fence',
    '```',
    '## Technical choices & trade-offs',
    'IVF over HNSW.',
    '## Results',
    '| k | recall |',
    '| - | ------ |',
    '| 10 | 0.92 |',
    '## Limitations & next steps',
    'No GPU.',
    '## Links',
    '- repo',
  ].join('\n');

  it('accepts a complete case study', () => {
    expect(checkCaseStudy(body, ['Recall@10 of 0.92'])).toEqual([]);
  });

  it('requires a number in the TL;DR unless marked TODO', () => {
    expect(checkCaseStudy(body, ['Fast and accurate'])).toHaveLength(1);
    expect(checkCaseStudy(body, ['TODO: measure recall'])).toEqual([]);
  });

  it('rejects missing or reordered sections', () => {
    const swapped = body.replace('## Problem', '## Results\n').replace(/## Results\n\| k/, '## Problem\n| k');
    expect(checkCaseStudy(swapped, ['1'])[0]).toMatch(/sections must be exactly/);
    expect(checkCaseStudy(body.replace('## Links\n- repo', ''), ['1'])[0]).toMatch(/sections must be exactly/);
  });

  it('asks for a diagram and a table', () => {
    const plain = body.replace(/```mermaid[\s\S]*?```/, 'Text only.').replace(/\|[\s\S]*?0\.92 \|/, 'Good.');
    expect(checkCaseStudy(plain, ['1'])).toEqual([
      'Architecture needs a Mermaid diagram or an image',
      'Results needs a table or a chart',
    ]);
  });
});
