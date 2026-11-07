import { Resvg } from '@resvg/resvg-js';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { join } from 'node:path';
import { site } from '../../config/site';
import { cardSvg, type Card } from '../../lib/og';

// Builds run from the project root; the bundled endpoint no longer sits next to its source.
const fontFiles = ['Newsreader.ttf', 'JetBrainsMono.ttf'].map(file => join(process.cwd(), 'src/assets/fonts', file));

export const getStaticPaths = (async () => {
  const projects = await getCollection('projects');
  const footer = `${site.name} · ${site.terminalLabel}`;
  const cards: { params: { slug: string }; props: Card }[] = projects.map(project => ({
    params: { slug: project.id },
    props: {
      eyebrow: 'Case study',
      title: project.data.title,
      description: project.data.summary,
      tags: project.data.tags,
      footer,
    },
  }));
  cards.push({
    params: { slug: 'default' },
    props: {
      eyebrow: site.availability,
      title: site.name,
      description: site.tagline,
      tags: ['LLM', 'RAG', 'MCP', 'Data'],
      footer: site.terminalLabel,
    },
  });
  return cards;
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const svg = cardSvg(props as Card);
  const png = new Resvg(svg, {
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Newsreader' },
  })
    .render()
    .asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
