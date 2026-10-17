import { expect, test, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175', viewport: { width: 1440, height: 900 } });

async function visit(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });
  await expect(page.getByRole('button', { name: /^Body/ })).toBeVisible({ timeout: 30_000 });
}

const frame = (page: Page) => page.frameLocator('iframe[title="typeset preview"]');

async function choose(page: Page, picker: string, option: string) {
  await page.getByRole('button', { name: new RegExp(`^${picker}`) }).click();
  await page.getByRole('menuitemradio', { name: option, exact: true }).click();
  await page.keyboard.press('Escape');
}

test('the header and the docs page link to the builder, which previews the docs specimen in its defaults', async ({ page }) => {
  await page.goto('/docs/typeset');
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Typeset' })).toHaveAttribute('href', '/typeset');
  await page.getByRole('link', { name: 'Build your typeset' }).click();
  await expect(page).toHaveURL('/typeset');
  await expect(page.getByRole('button', { name: /^Body/ })).toHaveText(/Geist/, { timeout: 30_000 });

  const preview = frame(page);
  await expect(preview.getByRole('heading', { level: 1 })).toHaveText('Building a Streaming Chatbot');
  await expect(preview.locator('.preview-params')).toHaveCSS('font-size', '15px');
  await expect(preview.locator('.preview-params')).toHaveCSS('max-width', `${37 * 15}px`);
});

test('a picked option restyles the preview, goes in the URL, and Undo and Redo step through it', async ({ page }) => {
  await visit(page, '/typeset');
  const params = frame(page).locator('.preview-params');
  await expect(params).toHaveCSS('font-size', '15px');

  await choose(page, 'Size', '18px');
  await expect(page).toHaveURL('/typeset?scale=18');
  await expect(params).toHaveCSS('font-size', '18px');
  await expect(page.locator('iframe[title="typeset preview"]'), 'the frame restyles by message instead of reloading').toHaveAttribute('src', '/preview/typeset/docs');

  await choose(page, 'Body', 'Lora');
  await expect(page).toHaveURL('/typeset?body=lora&scale=18');
  await expect(page.getByRole('button', { name: /^Heading/ })).toHaveText(/Lora/);
  await expect(params.locator('.typeset p').first()).toHaveCSS('font-family', /Lora/);

  await page.keyboard.press('ControlOrMeta+z');
  await expect(page).toHaveURL('/typeset?scale=18');
  await page.keyboard.press('ControlOrMeta+z');
  await expect(page).toHaveURL('/typeset');
  await expect(params).toHaveCSS('font-size', '15px');
  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(page).toHaveURL('/typeset?scale=18');
});

test('the URL opens a typeset, the specimen buttons switch the preview, and Reset goes back to the defaults', async ({ page }) => {
  await visit(page, '/typeset?flow=2em&leading=1.9&item=chat');
  await expect(page.getByRole('button', { name: /^Leading/ })).toHaveText(/Loose \(1\.9\)/);
  const preview = frame(page);
  await expect(preview.getByText("My Next.js dev server takes forever to start. How do I figure out what's actually slow?")).toBeVisible();
  const typeset = preview.locator('.typeset');
  const size = parseFloat(await typeset.evaluate((element) => getComputedStyle(element).fontSize));
  expect(parseFloat(await typeset.evaluate((element) => getComputedStyle(element).lineHeight))).toBeCloseTo(size * 1.9, 1);

  await page.getByRole('button', { name: 'Article' }).click();
  await expect(page).toHaveURL('/typeset?flow=2em&leading=1.9&item=article');
  await expect(page.locator('iframe[title="typeset preview"]')).toHaveAttribute('src', '/preview/typeset/article?flow=2em&leading=1.9&item=article');

  await page.keyboard.press('Shift+R');
  await expect(page).toHaveURL('/typeset');
  await expect(page.getByRole('button', { name: /^Leading/ })).toHaveText(/Regular \(1\.75\)/);

  await choose(page, 'Size', '14px');
  await expect(page).toHaveURL('/typeset?scale=14');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Typeset' }).click();
  await expect(page).toHaveURL('/typeset');
  await expect(page.getByRole('button', { name: /^Size/ })).toHaveText(/15px/);
});

test('Shuffle keeps locked choices and the specimen', async ({ page }) => {
  await visit(page, '/typeset?body=lora&item=notes');
  await page.getByRole('button', { name: /^Body/ }).hover();
  await page.getByRole('button', { name: 'Lock Body' }).click();
  await expect(page.getByRole('button', { name: 'Lock Body' })).toHaveAttribute('aria-pressed', 'true');
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: 'Shuffle' }).click();
    await expect(page.getByRole('button', { name: /^Body/ })).toHaveText(/Lora/);
    expect(new URL(page.url()).searchParams.get('item')).toBe('notes');
  }
});

test('the docs panel writes the preset and wrapper for the picks, and copies the stylesheet', async ({ page, context, request }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await visit(page, '/typeset?heading=merriweather&mono=jetbrains-mono&scale=16&measure=60&item=chat');
  const panel = page.getByRole('tabpanel', { name: 'Docs' });
  await expect(panel).toContainText(`.typeset-chat {
  --typeset-font-body: var(--font-geist);
  --typeset-font-heading: var(--font-merriweather);
  --typeset-font-mono: var(--font-jetbrains-mono);
  --typeset-size: 16px;
  --typeset-leading: 1.75;
  --typeset-flow: 1.25em;
}`);
  await expect(panel).toContainText('<div class="typeset typeset-chat max-w-[28em]">');
  await expect(panel.locator('[data-slot=font-command]')).toHaveText('pnpm add @fontsource-variable/geist @fontsource-variable/merriweather @fontsource-variable/jetbrains-mono');
  await panel.getByRole('button', { name: 'npm', exact: true }).click();
  await expect(panel.locator('[data-slot=font-command]')).toHaveText('npm install @fontsource-variable/geist @fontsource-variable/merriweather @fontsource-variable/jetbrains-mono');

  await panel.getByRole('button', { name: 'Copy typeset.css' }).click();
  const css = await (await request.get('/typeset.css')).text();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(css);

  await page.getByRole('tab', { name: 'Prompt' }).click();
  await expect(page.getByRole('tabpanel', { name: 'Prompt' })).toContainText('Install shadcn/typeset in this project.');
  await expect(page.getByRole('tabpanel', { name: 'Prompt' })).toContainText('--typeset-font-heading: var(--font-merriweather);');
});
