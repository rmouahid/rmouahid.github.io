import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('theme license and attribution are kept', () => {
  for (const path of ['LICENSE', 'docs/credits.md']) assert.ok(existsSync(path), path);
  const readme = readFileSync('README.md', 'utf8');
  assert.match(readme, /nandomoreirame\/terminalnoir-astro-theme/);
  assert.match(readme, /src\/config\/site.ts/);
  assert.match(readFileSync('LICENSE', 'utf8'), /Fernando Moreira/);
});

test('the resume linked from the site is published', () => {
  const config = readFileSync('src/config/site.ts', 'utf8');
  const cv = config.match(/const cv = '([^']+)'/)?.[1];
  assert.ok(cv, 'cv path in site config');
  assert.ok(existsSync(`public${cv}`), `public${cv}`);
});
