import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema } from './lib/projects';

// One case study per file in src/content/projects/. The file name is the URL slug.
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => projectSchema(image()),
});

export const collections = { projects };
