import { z } from 'astro/zod';

const webUrl = z
  .url()
  .refine(value => ['https:', 'http:'].includes(new URL(value).protocol), 'Expected an http(s) URL');

// Frontmatter of a case study. `cover` is passed in so the content config can use Astro's image() helper.
export function projectSchema<Cover extends z.ZodType>(cover: Cover) {
  return z
    .object({
      title: z.string().min(1),
      summary: z.string().min(1).max(160),
      tldr: z.array(z.string().min(1)).min(1).max(3),
      tags: z.array(z.string().min(1)).min(1),
      stack: z.array(z.string().min(1)).min(1),
      featured: z.boolean().default(false),
      order: z.number().int().default(100),
      repo: webUrl,
      demo: webUrl.optional(),
      cover: cover.optional(),
      coverAlt: z.string().min(1).optional(),
      status: z.enum(['active', 'archived']).default('active'),
      date: z.coerce.date(),
    })
    .refine(data => !data.cover || data.coverAlt, { message: 'coverAlt is required with a cover', path: ['coverAlt'] });
}

export interface ProjectLike {
  id: string;
  data: { title: string; tags: string[]; featured: boolean; order: number; date: Date };
}

// Lower `order` first, then the most recent project.
export function sortProjects<T extends ProjectLike>(items: T[]): T[] {
  return [...items].sort((a, b) => a.data.order - b.data.order || b.data.date.getTime() - a.data.date.getTime());
}

export function featuredProjects<T extends ProjectLike>(items: T[], limit = 3): T[] {
  return sortProjects(items.filter(item => item.data.featured)).slice(0, limit);
}

// Tags for the catalogue filters: most used first, then alphabetical.
export function projectTags(items: ProjectLike[]): string[] {
  const counts = new Map<string, number>();
  for (const item of items) for (const tag of item.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
}

export const tagKey = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
