const normalize = (value: string) => '/' + value.split('/').filter(Boolean).join('/');

// A site path under the deployment base, keeping an optional #hash.
export function route(path: string, base = '/'): string {
  const [pathname, hash] = path.split('#');
  const result = normalize(`${base}/${pathname}`);
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
