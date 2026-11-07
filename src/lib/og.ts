import palette from '../data/palette.json';

// 1200×630 social card in the Noir palette, drawn as SVG and rasterised at build time.
const c = palette.variants.dark;

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Greedy word wrap on an average glyph width; the last kept line gets an ellipsis when text overflows.
export function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length <= maxChars) line = next;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s,.;:]+$/, '')}…`;
  return kept;
}

export type Card = {
  eyebrow: string;
  title: string;
  description: string;
  tags?: string[];
  footer: string;
};

export function cardSvg({ eyebrow, title, description, tags = [], footer }: Card): string {
  const titleLines = wrap(title, 30, 2);
  const titleSize = titleLines.length > 1 ? 64 : 76;
  const titleTop = 230;
  const descTop = titleTop + titleLines.length * titleSize * 1.1 + 30;
  const descLines = wrap(description, 62, 3);
  const text = (lines: string[], x: number, y: number, size: number, lead: number, attrs: string) =>
    lines
      .map(
        (value, i) => `<text x="${x}" y="${y + i * size * lead}" font-size="${size}" ${attrs}>${escape(value)}</text>`,
      )
      .join('');

  let tagX = 80;
  const tagEls = tags.slice(0, 5).map(tag => {
    const width = tag.length * 14.5 + 28;
    const el =
      `<rect x="${tagX}" y="512" width="${width}" height="40" rx="4" fill="${c.surface.elevated}" stroke="${c.surface.border}"/>` +
      `<text x="${tagX + 14}" y="539" font-size="22" font-family="JetBrains Mono" fill="${c.text.muted}">${escape(tag)}</text>`;
    tagX += width + 12;
    return el;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${c.surface.base}"/>
<rect width="16" height="630" fill="${c.accent.primary}"/>
<text x="80" y="120" font-size="24" font-family="JetBrains Mono" letter-spacing="2" fill="${c.accent.primary}">${escape(eyebrow.toUpperCase())}</text>
${text(titleLines, 80, titleTop, titleSize, 1.1, `font-family="Newsreader" fill="${c.text.primary}"`)}
${text(descLines, 80, descTop, 32, 1.35, `font-family="Newsreader" fill="${c.text.muted}"`)}
${tagEls.join('')}
<text x="1120" y="590" font-size="22" font-family="JetBrains Mono" text-anchor="end" fill="${c.text.faint}">${escape(footer)}</text>
</svg>`;
}
