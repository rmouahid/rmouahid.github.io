import { z } from 'zod';

const webUrl = z.url().refine(value => ['https:', 'http:'].includes(new URL(value).protocol));

export function resolveSiteUrl(value: string | undefined): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return 'https://rmouahid.github.io';
  return webUrl.parse(trimmed);
}

// A site path ("/projects", "/cv.pdf", "/about#stack"), resolved against the deployment base.
const sitePath = z.string().regex(/^\/(?!\/)[a-z0-9/._-]*(?:#[a-z0-9-]+)?$/);
const mailto = z.string().regex(/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/);

const action = z.object({
  label: z.string().min(1),
  href: z.union([sitePath, webUrl, mailto]),
});

const schema = z.object({
  name: z.string().min(1),
  terminalLabel: z.string().min(1),
  url: webUrl,
  role: z.string().min(1),
  tagline: z.string().min(1),
  availability: z.string().min(1),
  location: z.string().min(1),
  links: z.object({
    github: webUrl,
    linkedin: webUrl,
    email: z.email(),
    cv: sitePath,
  }),
  ctas: z.object({
    header: action,
    box: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      body: z.string().min(1),
      primary: action,
      secondary: action,
    }),
  }),
  nav: z.array(z.object({ href: z.string().regex(/^\/(?!\/)[a-z0-9/-]*$/), label: z.string().min(1) })),
});

export type Site = z.infer<typeof schema>;
export const parseSite = (value: unknown) => schema.parse(value);

const email = 'prorayanmouahid@gmail.com';
const cv = '/rayan-mouahid-cv.pdf';

export const site = parseSite({
  name: 'Rayân Mouahid',
  terminalLabel: '~/rayan-mouahid',
  url: resolveSiteUrl(process.env.SITE_URL),
  role: 'AI engineering student · CY Tech, Paris',
  tagline: 'AI engineering student building measured LLM & RAG systems.',
  availability: 'Looking for an AI internship from March 2027',
  location: 'Paris, France',
  links: {
    github: 'https://github.com/rmouahid',
    linkedin: 'https://www.linkedin.com/in/rmouahid/',
    email,
    cv,
  },
  ctas: {
    header: { label: 'Resume', href: cv },
    box: {
      eyebrow: 'Internship · March 2027',
      title: 'Looking for an AI intern?',
      body: 'I am looking for a 6-month AI / ML engineering internship starting March 2027. The fastest way to reach me is email.',
      primary: { label: 'Email me', href: `mailto:${email}` },
      secondary: { label: 'Download resume', href: cv },
    },
  },
  nav: [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
  ],
});
