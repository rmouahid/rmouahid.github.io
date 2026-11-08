import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

test('mode selection persists', async ({ page }) => {
  await page.goto('');
  await page.getByRole('button', { name: 'Paper', exact: true }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('mobile navigation is reachable from the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('');
  const links = page.getByRole('navigation', { name: 'Main' }).getByRole('link');
  await links.first().focus();
  await expect(links.first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(links.nth(1)).toBeFocused();
});

test('the home page has no horizontal scroll at 375px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  for (const path of ['', 'projects/', 'about/', 'projects/rag-agent/']) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path || 'home').toBeLessThanOrEqual(0);
  }
});

test('project search announces an empty result', async ({ page }) => {
  await page.goto('projects/');
  await page.getByRole('searchbox', { name: 'Search projects' }).fill('zzzz-not-real');
  await expect(page.getByText('No project matches these filters.')).toBeVisible();
  await expect(page.locator('#search-status')).toContainText('0 projects');
});

test('tag filters narrow the list and survive a reload', async ({ page }) => {
  await page.goto('projects/');
  const all = await page.locator('[data-project]').count();
  const filter = page.getByRole('group', { name: 'Filter by tag' }).getByRole('button').nth(1);
  const key = await filter.getAttribute('data-tag');
  await filter.click();
  await expect(filter).toHaveAttribute('aria-pressed', 'true');
  const visible = page.locator('[data-project]:not([hidden])');
  const shown = await visible.count();
  expect(shown).toBeGreaterThan(0);
  expect(shown).toBeLessThan(all);
  for (const tags of await visible.evaluateAll(nodes => nodes.map(node => (node as HTMLElement).dataset.tags))) {
    expect(tags?.split(' ')).toContain(key);
  }
  await page.reload();
  await expect(page.locator('[data-project]:not([hidden])')).toHaveCount(shown);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('[data-project]:not([hidden])')).toHaveCount(all);
});

test('a project card opens its case study', async ({ page }) => {
  await page.goto('');
  await page.locator('ul[aria-labelledby="featured-projects"] a').first().click();
  await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+\/$/);
  await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
});

test('escape closes the cover lightbox and returns focus', async ({ page }) => {
  await page.goto('projects/novit/');
  const open = page.getByRole('button', { name: 'Full size' });
  await open.focus();
  await open.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
});

test('case study diagrams are drawn and stay legible', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('projects/rag-agent/');
    const svg = page.locator('.mermaid-diagram[data-ready] svg').first();
    await expect(svg).toBeVisible();
    const scale = await svg.evaluate(node => {
      const element = node as SVGSVGElement;
      return element.getBoundingClientRect().width / element.viewBox.baseVal.width;
    });
    expect(scale).toBeGreaterThanOrEqual(0.69);
  }
});

test('theme selection survives denied storage', async ({ page }) => {
  await page.addInitScript(() => {
    const denied = () => {
      throw new DOMException('denied', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: { getItem: denied, setItem: denied, removeItem: denied, clear() {}, key: () => null, length: 0 },
    });
  });
  await page.goto('');
  await page.getByRole('button', { name: 'Paper', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('reduced motion stops the cursor blink', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('');
  await expect(page.locator('.cursor').first()).toHaveCSS('animation-name', 'none');
});

async function expectClean(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 375, height: 800 },
]) {
  for (const path of ['', 'projects/', 'projects/rag-agent/', 'about/']) {
    for (const mode of ['Noir', 'Paper'] as const) {
      test(`axe ${path || 'home'} ${mode} ${viewport.width}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        if (mode === 'Paper') await page.getByRole('button', { name: 'Paper', exact: true }).first().click();
        await expectClean(page);
      });
    }
  }
}
