import { expect, test } from '@playwright/test';

const paths = [
  '',
  'about',
  'projects',
  'projects/rag-agent',
  'og/rag-agent.png',
  'og/default.png',
  'rayan-mouahid-cv.pdf',
];

for (const path of paths) {
  test(`serves /${path}`, async ({ page }) => {
    const response = await page.request.get(path);
    expect(response.status()).toBeLessThan(400);
    if (!path.includes('.')) {
      const html = await response.text();
      expect(html).not.toContain('/toolkit/toolkit');
      expect(html).not.toContain(['terminalnoir', 'web.app'].join('.'));
    }
  });
}

for (const removed of ['docs', 'showcase', 'integrations', 'pt-br']) {
  test(`no longer publishes /${removed}`, async ({ page }) => {
    const response = await page.request.get(removed);
    expect(response.status()).toBe(404);
  });
}

test('every internal link on the main pages resolves', async ({ page, baseURL }) => {
  const seen = new Set<string>();
  for (const path of ['', 'projects', 'about', 'projects/rag-agent']) {
    await page.goto(path);
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll(nodes => nodes.map(node => (node as HTMLAnchorElement).href));
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== new URL(baseURL!).origin) continue;
      url.hash = '';
      if (seen.has(url.href)) continue;
      seen.add(url.href);
      const response = await page.request.get(url.href);
      expect(response.status(), url.href).toBeLessThan(400);
    }
  }
  expect(seen.size).toBeGreaterThan(5);
});
