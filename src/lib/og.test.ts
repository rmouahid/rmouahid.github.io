import { expect, it } from 'vitest';
import { cardSvg, wrap } from './og';

it('wraps on words and marks overflow with an ellipsis', () => {
  expect(wrap('one two three four', 9, 3)).toEqual(['one two', 'three', 'four']);
  expect(wrap('one two three four', 9, 2)).toEqual(['one two', 'three…']);
});

it('escapes text in the SVG card', () => {
  const svg = cardSvg({ eyebrow: 'x', title: 'LLM & <RAG>', description: 'd', footer: 'f' });
  expect(svg).toContain('LLM &amp; &lt;RAG&gt;');
  expect(svg).not.toContain('<RAG>');
});
