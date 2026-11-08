import { asset, canonicalPath } from './urls';

export function pageMetadata(
  origin: string,
  base: string,
  pathname: string,
  title: string,
  description: string,
  image = '/og/default.png',
) {
  return {
    title,
    description,
    canonical: new URL(canonicalPath(pathname), origin).href,
    image: new URL(asset(image, base), origin).href,
  };
}

export function robotsBody(origin: string, base: string): string {
  return `User-agent: *\nAllow: /\nSitemap: ${new URL(asset('/sitemap-index.xml', base), origin).href}\n`;
}
