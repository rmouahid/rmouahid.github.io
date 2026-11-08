import { describe, expect, it } from 'vitest';
import { isActive } from './site';

describe('isActive', () => {
  it('marks Home only on the root path', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/', '/projects/')).toBe(false);
  });

  it('marks a section on its own path and its children', () => {
    expect(isActive('/projects/', '/projects/')).toBe(true);
    expect(isActive('/projects/', '/projects/rag-agent/')).toBe(true);
    expect(isActive('/projects', '/projects')).toBe(true);
  });

  it('does not match a section that only shares a prefix', () => {
    expect(isActive('/doc/', '/docs/')).toBe(false);
  });

  it('works under a deployment base', () => {
    expect(isActive('/portfolio/', '/portfolio/', '/portfolio/')).toBe(true);
    expect(isActive('/portfolio/', '/portfolio/about/', '/portfolio/')).toBe(false);
    expect(isActive('/portfolio/about/', '/portfolio/about/', '/portfolio/')).toBe(true);
  });
});
