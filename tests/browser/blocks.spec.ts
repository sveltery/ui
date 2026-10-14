import { expect, test, type Page } from '@playwright/test';
import { blocks as registry } from '../../apps/docs/blocks/registry';

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
  'sidebar-01': 'Getting Started',
  'sidebar-02': 'Getting Started',
  'sidebar-03': 'Getting Started',
  'sidebar-04': 'Getting Started',
  'sidebar-05': 'Getting Started',
  'sidebar-06': 'Subscribe to our newsletter',
  'sidebar-07': 'Platform',
  'sidebar-08': 'Platform',
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

test('every registered block has a row here', () => {
  expect(Object.keys(blocks)).toEqual(registry.map(({ name }) => name));
});

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
  await expect(page.locator('[data-slot=block-viewer]').evaluateAll((viewers) => viewers.map((viewer) => viewer.id))).resolves.toEqual(['sidebar-07', 'sidebar-03', 'login-03', 'login-04']);
  await expect(page.getByRole('link', { name: 'Browse more blocks' })).toHaveAttribute('href', '/blocks/sidebar');

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
  await expect(viewer.locator('pre')).toContainText("import { Button } from '$lib/components/ui/button';");
  await expect(viewer.locator('pre')).not.toContainText('svelte-ignore');

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

test('a preview follows the docs theme toggle', async ({ page }) => {
  await visit(page, '/blocks/login');
  const preview = page.locator('#login-01 iframe');
  await preview.scrollIntoViewIfNeeded();
  const html = page.frameLocator('#login-01 iframe').locator('html');
  await expect(html).toHaveAttribute('data-ready');
  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect(html).toHaveClass(/dark/);
});

const sidebarBlocks = ['sidebar-01', 'sidebar-02', 'sidebar-03', 'sidebar-04', 'sidebar-05', 'sidebar-06', 'sidebar-07', 'sidebar-08'];
const sidebar = '[data-slot=sidebar]';
const trigger = '[data-slot=sidebar-trigger]';

for (const name of sidebarBlocks) {
  test(`${name} trigger collapses and expands the sidebar`, async ({ page }) => {
    await visit(page, `/view/${name}`);
    await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'expanded');
    await page.locator(trigger).click();
    await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'collapsed');
    await page.locator(trigger).click();
    await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'expanded');
  });

  test(`${name} opens the sidebar as a sheet on a phone`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, `/view/${name}`);
    await expect(page.getByRole('dialog')).toBeHidden();
    await page.locator(trigger).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByText(blocks[name], { exact: true }).first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });
}

for (const name of ['sidebar-01', 'sidebar-02']) {
  test(`${name} version switcher changes the shown version`, async ({ page }) => {
    await visit(page, `/view/${name}`);
    const switcher = page.getByRole('button', { name: 'Documentation v1.0.1' });
    await switcher.click();
    await expect(page.getByRole('menuitem')).toHaveText(['v1.0.1', 'v1.1.0-alpha', 'v2.0.0-beta1']);
    await page.getByRole('menuitem', { name: 'v2.0.0-beta1' }).click();
    await expect(page.getByRole('menuitem')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Documentation v2.0.0-beta1' })).toBeVisible();
    await expect(page.locator(sidebar).getByRole('link', { name: 'Data Fetching' })).toHaveAttribute('data-active', 'true');
  });
}

test('sidebar-02 section labels collapse and expand their links', async ({ page }) => {
  await visit(page, '/view/sidebar-02');
  const installation = page.getByRole('link', { name: 'Installation' });
  await expect(installation).toBeVisible();
  await page.getByRole('button', { name: 'Getting Started' }).click();
  await expect(installation).toBeHidden();
  await expect(page.getByRole('link', { name: 'Routing' })).toBeVisible();
  await page.getByRole('button', { name: 'Getting Started' }).click();
  await expect(installation).toBeVisible();
});

test('sidebar-03 lists submenu links under each section link', async ({ page }) => {
  await visit(page, '/view/sidebar-03');
  await expect(page.getByRole('link', { name: 'Getting Started' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Installation' })).toBeVisible();
  await expect(page.locator(sidebar).getByRole('link', { name: 'Data Fetching' })).toHaveAttribute('data-active', 'true');
  await expect(page.locator(sidebar).getByRole('link', { name: 'Routing' })).not.toHaveAttribute('data-active');
});

test('sidebar-04 is a floating sidebar 19rem wide', async ({ page }) => {
  await visit(page, '/view/sidebar-04');
  await expect(page.locator(sidebar)).toHaveAttribute('data-variant', 'floating');
  await expect(page.locator('[data-slot=sidebar-container]')).toHaveCSS('width', '304px');
  await expect(page.locator(sidebar).getByRole('link', { name: 'Data Fetching' })).toHaveAttribute('data-active', 'true');
});

test('sidebar-05 sections open with a plus and close with a minus', async ({ page }) => {
  await visit(page, '/view/sidebar-05');
  const gettingStarted = page.getByRole('button', { name: 'Getting Started' });
  const buildYourApplication = page.getByRole('button', { name: 'Build Your Application' });
  await expect(buildYourApplication).toHaveAttribute('aria-expanded', 'true');
  await expect(gettingStarted).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('link', { name: 'Routing' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Installation' })).toBeHidden();

  await gettingStarted.click();
  await expect(page.getByRole('link', { name: 'Installation' })).toBeVisible();
  await buildYourApplication.click();
  await expect(page.getByRole('link', { name: 'Routing' })).toBeHidden();
  await expect(buildYourApplication).toHaveAttribute('aria-expanded', 'false');
});

test('sidebar-06 opens each section as a dropdown menu of links', async ({ page }) => {
  await visit(page, '/view/sidebar-06');
  await expect(page.getByRole('link', { name: 'Installation' })).toBeHidden();
  await page.getByRole('button', { name: 'Getting Started' }).click();
  await expect(page.getByRole('menuitem')).toHaveText(['Installation', 'Project Structure']);
  await expect(page.getByRole('menuitem', { name: 'Installation' })).toHaveAttribute('href', '#');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem')).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Subscribe' })).toBeVisible();
});

test('sidebar-07 collapses to icons and hides the project list', async ({ page }) => {
  await visit(page, '/view/sidebar-07');
  await expect(page.getByText('Projects', { exact: true })).toBeVisible();
  await page.locator(trigger).click();
  await expect(page.locator(sidebar)).toHaveAttribute('data-collapsible', 'icon');
  await expect(page.locator('[data-slot=sidebar-container]')).toHaveCSS('width', '48px');
  await expect(page.getByText('Projects', { exact: true })).toBeHidden();
});

test('sidebar-07 team switcher changes the active team', async ({ page }) => {
  await visit(page, '/view/sidebar-07');
  await page.getByRole('button', { name: 'Acme Inc Enterprise' }).click();
  await expect(page.getByRole('menuitem')).toHaveText(['Acme Inc ⌘1', 'Acme Corp. ⌘2', 'Evil Corp. ⌘3', 'Add team']);
  await page.getByRole('menuitem', { name: 'Evil Corp.' }).click();
  await expect(page.getByRole('button', { name: 'Evil Corp. Free' })).toBeVisible();
});

test('sidebar-07 platform sections open their submenus', async ({ page }) => {
  await visit(page, '/view/sidebar-07');
  await expect(page.getByRole('link', { name: 'History' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Genesis' })).toBeHidden();
  await page.getByRole('button', { name: 'Models' }).click();
  await expect(page.getByRole('link', { name: 'Genesis' })).toBeVisible();
  await page.getByRole('button', { name: 'Playground' }).click();
  await expect(page.getByRole('link', { name: 'History' })).toBeHidden();
});

test('sidebar-07 project and user menus open', async ({ page }) => {
  await visit(page, '/view/sidebar-07');
  const project = page.locator('[data-slot=sidebar-menu-item]', { hasText: 'Design Engineering' });
  await project.hover();
  await project.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('menuitem')).toHaveText(['View Project', 'Share Project', 'Delete Project']);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem')).toHaveCount(0);

  await page.getByRole('button', { name: 'shadcn m@example.com' }).click();
  await expect(page.getByRole('menuitem')).toHaveText(['Upgrade to Pro', 'Account', 'Billing', 'Notifications', 'Log out']);
});

test('sidebar-08 is an inset sidebar with a secondary menu', async ({ page }) => {
  await visit(page, '/view/sidebar-08');
  await expect(page.locator(sidebar)).toHaveAttribute('data-variant', 'inset');
  await expect(page.getByRole('link', { name: 'Support' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Feedback' })).toBeVisible();
  await expect(page.getByText('Acme Inc', { exact: true })).toBeVisible();
});

test('sidebar-08 toggle buttons open the submenus', async ({ page }) => {
  await visit(page, '/view/sidebar-08');
  await expect(page.getByRole('link', { name: 'History' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Genesis' })).toBeHidden();
  const models = page.locator('li', { hasText: 'Models' });
  await models.getByRole('button', { name: 'Toggle' }).click();
  await expect(page.getByRole('link', { name: 'Genesis' })).toBeVisible();
  await models.getByRole('button', { name: 'Toggle' }).click();
  await expect(page.getByRole('link', { name: 'Genesis' })).toBeHidden();
});

test('sidebar-08 project and user menus open', async ({ page }) => {
  await visit(page, '/view/sidebar-08');
  const project = page.locator('[data-slot=sidebar-menu-item]', { hasText: 'Sales & Marketing' });
  await project.hover();
  await project.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('menuitem')).toHaveText(['View Project', 'Share Project', 'Delete Project']);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem')).toHaveCount(0);

  await page.getByRole('button', { name: 'shadcn m@example.com' }).click();
  await expect(page.getByRole('menuitem', { name: 'Log out' })).toBeVisible();
});
