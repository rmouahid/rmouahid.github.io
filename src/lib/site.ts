const trim = (path: string) => path.replace(/\/+$/, '') || '/';

// Both arguments are site paths, with or without a trailing slash.
export function isActive(href: string, pathname: string, home = '/'): boolean {
  const [link, path, root] = [trim(href), trim(pathname), trim(home)];
  return link === root ? path === root : path === link || path.startsWith(`${link}/`);
}
