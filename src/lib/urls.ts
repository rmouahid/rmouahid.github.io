const normalize = (value: string) => '/' + value.split('/').filter(Boolean).join('/');

// Pages are folders (/projects/), files keep their name (/rayan-mouahid-cv.pdf).
const withSlash = (path: string) => (path === '/' || /\.[a-z0-9]+$/i.test(path) ? path : `${path}/`);

// A site path under the deployment base, ending with "/" as GitHub Pages serves it, keeping an optional #hash.
export function route(path: string, base = '/'): string {
  const [pathname, hash] = path.split('#');
  const result = withSlash(normalize(`${base}/${pathname}`));
  return hash === undefined ? result : `${result}#${hash}`;
}

// Site paths get the base; external and mailto links are returned unchanged.
export function resolveHref(href: string, base = '/'): string {
  return href.startsWith('/') ? route(href, base) : href;
}

export function asset(path: string, base = '/'): string {
  const prefix = normalize(base);
  const file = normalize(path);
  return prefix === '/' ? file : `${prefix}${file}`;
}

export const canonicalPath = (pathname: string) => withSlash(normalize(pathname));
