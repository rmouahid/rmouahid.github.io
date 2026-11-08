import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('GitHub Pages deploys main with the official Astro action at the site root', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  assert.match(workflow, /branches: \[main\]/);
  assert.match(workflow, /uses: withastro\/action@/);
  assert.match(workflow, /uses: actions\/deploy-pages@/);
  assert.doesNotMatch(workflow, /SITE_BASE/);
});

test('deploy actions are pinned to a commit and permissions are scoped per job', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  for (const [, action, ref] of workflow.matchAll(/uses: ([\w.-]+\/[\w.-]+)@(\S+)/g)) {
    assert.match(ref, /^[0-9a-f]{40}$/, `${action} must be pinned to a full commit SHA`);
  }
  assert.match(workflow, /^permissions: \{\}$/m);
  const [build, deploy] = workflow.split(/^  deploy:$/m);
  assert.doesNotMatch(build, /pages: write|id-token: write/);
  assert.match(deploy, /pages: write/);
  assert.match(deploy, /id-token: write/);
  assert.doesNotMatch(workflow, /SITE_BASE/);
});

test('the default origin is the user site', () => {
  const config = readFileSync('src/config/site.ts', 'utf8');
  assert.match(config, /return 'https:\/\/rmouahid\.github\.io'/);
});
