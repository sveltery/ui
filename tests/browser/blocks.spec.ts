import { expect, test, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

/** Every ported block and a line of its demo content. */
const blocks: Record<string, string> = {
  'preview-03': 'Preview 03',
  'login-01': 'Login to your account',
  'login-02': 'Login to your account',
  'login-03': 'Welcome back',
  'login-04': 'Welcome back',
  'login-05': 'Welcome to Acme Inc.',
  'signup-01': 'Create an account',
  'signup-02': 'Create your account',
  'signup-03': 'Create your account',
  'signup-04': 'Create your account',
  'signup-05': 'Welcome to Acme Inc.',
  'sidebar-09': 'Meeting Tomorrow',
  'sidebar-10': 'Favorites',
  'sidebar-11': 'api/hello/route.ts',
  'sidebar-12': 'My Calendars',
  'sidebar-13': 'Messages & media',
  'sidebar-14': 'Table of Contents',
  'sidebar-15': 'Workspaces',
  'sidebar-16': 'Platform',
};

async function visit(page: Page, path: string) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.location().url.includes('/pagefind/')) errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().includes('/pagefind/')) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-ready');
  return errors;
}

for (const [name, text] of Object.entries(blocks)) {
  test(`${name} renders on its own page`, async ({ page }) => {
    const errors = await visit(page, `/view/${name}`);
    await expect(page.getByText(text, { exact: true }).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('the category nav lists each category and its blocks', async ({ page }) => {
  await visit(page, '/blocks');
  const nav = page.getByRole('navigation', { name: 'Blocks' });
  await expect(nav.getByRole('link')).toHaveText(['Featured', 'Sidebar', 'Login', 'Signup']);
  await expect(nav.getByRole('link', { name: 'Featured' })).toHaveAttribute('aria-current', 'page');

  await nav.getByRole('link', { name: 'Login' }).click();
  await expect(page).toHaveURL('/blocks/login');
  await expect(page.locator('[data-slot=block-viewer]').evaluateAll((viewers) => viewers.map((viewer) => viewer.id))).resolves.toEqual(['login-01', 'login-02', 'login-03', 'login-04', 'login-05']);
  await expect(page.locator('#login-01 iframe')).toHaveAttribute('src', '/view/login-01');
  await expect(page.locator('#login-01').getByRole('link', { name: 'A simple login form' })).toHaveAttribute('href', '#login-01');
});

test('the Code tab shows the files in their app paths', async ({ page }) => {
  await visit(page, '/blocks/login');
  const viewer = page.locator('#login-01');
  await viewer.getByRole('tab', { name: 'Code' }).click();
  await expect(viewer.locator('iframe')).toBeHidden();
  const caption = viewer.locator('figcaption');
  await expect(caption).toHaveText('src/routes/login/+page.svelte Copy');
  await expect(viewer.locator('pre')).toContainText("import LoginForm from '$lib/components/login-form.svelte';");

  await viewer.getByRole('button', { name: 'login-form.svelte' }).click();
  await expect(caption).toHaveText('src/lib/components/login-form.svelte Copy');
  await expect(viewer.locator('pre')).toContainText("import { Button } from '$lib/components/ui/button/index.js';");

  await viewer.getByRole('button', { name: 'components' }).click();
  await expect(viewer.getByRole('button', { name: 'login-form.svelte' })).toBeHidden();

  await viewer.getByRole('tab', { name: 'Preview' }).click();
  await expect(viewer.locator('iframe')).toBeVisible();
});

test('the size toggles resize the preview', async ({ page }) => {
  await visit(page, '/blocks/login');
  const viewer = page.locator('#login-01');
  const panel = viewer.locator('[data-slot=resizable-panel]').first();
  const full = (await panel.boundingBox())!.width;

  await viewer.getByRole('button', { name: 'Mobile' }).click();
  await expect.poll(async () => Math.round(((await panel.boundingBox())!.width / full) * 10)).toBe(3);
  await viewer.getByRole('button', { name: 'Desktop' }).click();
  await expect.poll(async () => Math.round((await panel.boundingBox())!.width)).toBe(Math.round(full));
});

const expandedSidebar = (page: Page) => page.locator('[data-slot=sidebar][data-state]');
const triggerFor = (page: Page, name: string) => (name === 'sidebar-16' ? page.locator('header button').first() : page.locator('[data-slot=sidebar-trigger]'));

for (const name of ['sidebar-09', 'sidebar-10', 'sidebar-11', 'sidebar-12', 'sidebar-14', 'sidebar-15', 'sidebar-16']) {
  test(`${name} collapses and expands from its trigger`, async ({ page }) => {
    await visit(page, `/view/${name}`);
    await expect(expandedSidebar(page)).toHaveAttribute('data-state', 'expanded');
    await triggerFor(page, name).click();
    await expect(expandedSidebar(page)).toHaveAttribute('data-state', 'collapsed');
    await triggerFor(page, name).click();
    await expect(expandedSidebar(page)).toHaveAttribute('data-state', 'expanded');
  });

  test(`${name} opens as a sheet at phone width`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, `/view/${name}`);
    const sheet = page.getByRole('dialog', { name: 'Sidebar' });
    await expect(sheet).toBeHidden();
    await triggerFor(page, name).click();
    await expect(sheet).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
  });
}

test('sidebar-09 shows the picked folder and a shorter mail list', async ({ page }) => {
  await visit(page, '/view/sidebar-09');
  const title = page.locator('[data-slot=sidebar-header] .text-base');
  const mails = page.locator('[data-slot=sidebar-content] a.border-b');
  await expect(title).toHaveText('Inbox');
  await expect(mails).toHaveCount(10);

  await page.getByRole('button', { name: 'Drafts' }).click();
  await expect(title).toHaveText('Drafts');
  await expect.poll(() => mails.count()).toBeGreaterThanOrEqual(5);
  await expect.poll(() => mails.count()).toBeLessThanOrEqual(10);
});

test('sidebar-09 opens the user menu and picking a folder reopens a collapsed sidebar', async ({ page }) => {
  await visit(page, '/view/sidebar-09');
  await page.locator('[data-slot=sidebar-trigger]').click();
  await expect(expandedSidebar(page)).toHaveAttribute('data-state', 'collapsed');
  await page.getByRole('button', { name: 'Sent' }).click();
  await expect(expandedSidebar(page)).toHaveAttribute('data-state', 'expanded');
  await expect(page.locator('[data-slot=sidebar-header] .text-base')).toHaveText('Sent');

  await page.getByRole('button', { name: /shadcn/ }).click();
  await expect(page.getByRole('menuitem', { name: 'Upgrade to Pro' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Log out' })).toBeVisible();
});

test('sidebar-10 opens its actions popover on load and closes it with Escape', async ({ page }) => {
  await visit(page, '/view/sidebar-10');
  const popover = page.locator('[data-slot=popover-content]');
  await expect(popover.getByRole('button', { name: 'Customize Page' })).toBeVisible();
  await expect(popover.getByRole('button', { name: 'Move to Trash' })).toBeVisible();
  const trigger = (await page.locator('[data-slot=popover-trigger]').boundingBox())!;
  const box = (await popover.boundingBox())!;
  expect(Math.round(box.x + box.width)).toBe(Math.round(trigger.x + trigger.width));
  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await page.locator('[data-slot=popover-trigger]').click();
  await expect(popover.getByRole('button', { name: 'Export' })).toBeVisible();
});

test('sidebar-10 switches the team', async ({ page }) => {
  await visit(page, '/view/sidebar-10');
  await page.keyboard.press('Escape');
  const trigger = page.getByRole('button', { name: 'Acme Inc' });
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: /Acme Corp\./ })).toContainText('⌘2');
  await page.getByRole('menuitem', { name: /Evil Corp\./ }).click();
  await expect(page.getByRole('button', { name: 'Evil Corp.' })).toBeVisible();
  await expect(trigger).toBeHidden();
});

test('sidebar-10 expands a workspace and opens a favorite menu', async ({ page }) => {
  await visit(page, '/view/sidebar-10');
  await page.keyboard.press('Escape');
  await expect(page.getByText('Daily Journal & Reflection')).toBeHidden();
  const toggle = page.locator('[data-slot=sidebar-menu-item]', { hasText: 'Personal Life Management' }).locator('[data-slot=sidebar-menu-action]').first();
  await toggle.click();
  await expect(page.getByText('Daily Journal & Reflection')).toBeVisible();
  await toggle.click();
  await expect(page.getByText('Daily Journal & Reflection')).toBeHidden();

  await page.locator('[data-slot=dropdown-menu-trigger]').nth(1).click();
  await expect(page.getByRole('menuitem', { name: 'Remove from Favorites' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Open in New Tab' })).toBeVisible();
});

test('sidebar-11 opens and closes the file tree folders', async ({ page }) => {
  await visit(page, '/view/sidebar-11');
  await expect(page.getByText('button.tsx', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('layout.tsx', { exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'app', exact: true }).click();
  await page.getByRole('button', { name: 'api', exact: true }).click();
  await expect(page.getByText('layout.tsx', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'app', exact: true }).click();
  await expect(page.getByText('layout.tsx', { exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'components', exact: true }).click();
  await expect(page.getByText('footer.tsx', { exact: true })).toBeHidden();
});

test('sidebar-12 opens a calendar group and picks a day', async ({ page }) => {
  await visit(page, '/view/sidebar-12');
  await expect(page.getByRole('button', { name: 'Personal' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Holidays' })).toBeHidden();
  await page.getByRole('button', { name: 'Favorites' }).click();
  await expect(page.getByRole('button', { name: 'Holidays' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Birthdays' })).toBeVisible();

  const selected = page.locator('[data-slot=calendar] [data-selected-single=true]');
  await expect(selected).toHaveText('12');
  await page.locator('[data-slot=calendar] button[data-day]', { hasText: /^15$/ }).first().click();
  await expect(selected).toHaveText('15');
});

test('sidebar-12 opens the user menu', async ({ page }) => {
  await visit(page, '/view/sidebar-12');
  await page.getByRole('button', { name: /shadcn/ }).click();
  await expect(page.getByRole('menuitem', { name: 'Billing' })).toBeVisible();
});

test('sidebar-13 shows the settings dialog open, closes it, and reopens it', async ({ page }) => {
  await visit(page, '/view/sidebar-13');
  const dialog = page.getByRole('dialog', { name: 'Settings' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-slot=sidebar] a')).toHaveCount(12);
  await expect(dialog.locator('[data-slot=sidebar] a[data-active=true]')).toHaveText('Messages & media');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await page.getByRole('button', { name: 'Open Dialog' }).click();
  await expect(dialog).toBeVisible();
});

test('sidebar-13 hides the settings navigation at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, '/view/sidebar-13');
  const dialog = page.getByRole('dialog', { name: 'Settings' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-slot=sidebar]')).toBeHidden();
});

test('sidebar-14 puts the sidebar on the right', async ({ page }) => {
  await visit(page, '/view/sidebar-14');
  await expect(expandedSidebar(page)).toHaveAttribute('data-side', 'right');
  const box = (await expandedSidebar(page).locator('[data-slot=sidebar-container]').boundingBox())!;
  expect(Math.round(box.x + box.width)).toBe(1280);
  await expect(page.locator('[data-slot=sidebar] a[data-active=true]')).toHaveText('Data Fetching');
});

test('sidebar-15 shows a left sidebar and a calendar sidebar on the right', async ({ page }) => {
  await visit(page, '/view/sidebar-15');
  await expect(page.getByText('Workspaces', { exact: true })).toBeVisible();
  await expect(page.getByText('My Calendars', { exact: true })).toBeVisible();
  await expect(expandedSidebar(page)).toHaveCount(1);
  await page.getByRole('button', { name: /shadcn/ }).click();
  await expect(page.getByRole('menuitem', { name: 'Log out' })).toBeVisible();
});

test('sidebar-16 expands the navigation sections and opens a project menu', async ({ page }) => {
  await visit(page, '/view/sidebar-16');
  await expect(page.getByRole('link', { name: 'History' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Genesis' })).toBeHidden();
  await page.getByRole('button', { name: 'Toggle' }).nth(1).click();
  await expect(page.getByRole('link', { name: 'Genesis' })).toBeVisible();

  await page.locator('[data-slot=dropdown-menu-trigger]').first().click();
  await expect(page.getByRole('menuitem', { name: 'Share Project' })).toBeVisible();
});
