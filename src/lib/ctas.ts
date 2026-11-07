import { site } from '../config/site';
import { resolveHref } from './urls';

type Action = { label: string; href: string };

export function getCtas(base: string) {
  const resolve = (action: Action): Action => ({ ...action, href: resolveHref(action.href, base) });
  const { header, box } = site.ctas;
  return {
    header: resolve(header),
    box: { ...box, primary: resolve(box.primary), secondary: resolve(box.secondary) },
  };
}

// Hero contact row: resume first, then the public profiles.
export function getContactLinks(base: string) {
  return [
    { id: 'cv', label: 'Resume (PDF)', href: resolveHref(site.links.cv, base), icon: 'lucide:file-text' },
    { id: 'github', label: 'GitHub', href: site.links.github, icon: 'simple-icons:github' },
    { id: 'linkedin', label: 'LinkedIn', href: site.links.linkedin, icon: 'lucide:linkedin' },
    { id: 'email', label: 'Email', href: `mailto:${site.links.email}`, icon: 'lucide:mail' },
  ];
}
