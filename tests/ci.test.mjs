import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('CI verifies locally without deployment credentials', () => {
  const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run verify/);
  assert.doesNotMatch(workflow, /firebase|google-github-actions|id-token: write/);
});

test('every action used by any workflow is pinned to a full commit SHA', () => {
  for (const file of ['ci.yml', 'deploy.yml']) {
    const workflow = readFileSync(`.github/workflows/${file}`, 'utf8');
    for (const [, action, ref] of workflow.matchAll(/uses: ([\w.-]+\/[\w.-]+)@(\S+)/g)) {
      assert.match(ref, /^[0-9a-f]{40}$/, `${file}: ${action} must be pinned to a full commit SHA`);
    }
  }
});
