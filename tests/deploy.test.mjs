import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('GitHub Pages deploys main with the official Astro action at the site root', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  assert.match(workflow, /branches: \[main\]/);
  assert.match(workflow, /uses: withastro\/action@v\d+/);
  assert.match(workflow, /uses: actions\/deploy-pages@v\d+/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
  assert.doesNotMatch(workflow, /SITE_BASE/);
});

test('the default origin is the user site', () => {
  const config = readFileSync('src/config/site.ts', 'utf8');
  assert.match(config, /return 'https:\/\/rmouahid\.github\.io'/);
});
