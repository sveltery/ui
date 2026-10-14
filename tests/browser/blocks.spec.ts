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
  'dashboard-01': 'Total Visitors',
  'sidebar-01': 'Getting Started',
  'sidebar-02': 'Getting Started',
  'sidebar-03': 'Getting Started',
  'sidebar-04': 'Getting Started',
  'sidebar-05': 'Getting Started',
  'sidebar-06': 'Subscribe to our newsletter',
  'sidebar-07': 'Platform',
  'sidebar-08': 'Platform',
  'sidebar-09': 'Meeting Tomorrow',
  'sidebar-10': 'Favorites',
  'sidebar-11': 'api/hello/route.ts',
  'sidebar-12': 'My Calendars',
  'sidebar-13': 'Messages & media',
  'sidebar-14': 'Table of Contents',
  'sidebar-15': 'Workspaces',
  'sidebar-16': 'Platform',
};

/** Errors the last visited page logged; every test ends by expecting none. */
let errors: string[] = [];
test.beforeEach(() => {
  errors = [];
});
test.afterEach(() => {
  expect(errors).toEqual([]);
});

async function visit(page: Page, path: string) {
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.location().url.includes('/pagefind/')) errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().includes('/pagefind/')) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-ready');
}

test('every registered block has a row here', () => {
  expect(Object.keys(blocks)).toEqual(registry.map(({ name }) => name));
});

for (const [name, text] of Object.entries(blocks)) {
  test(`${name} renders on its own page`, async ({ page }) => {
    await visit(page, `/view/${name}`);
    await expect(page.getByText(text, { exact: true }).first()).toBeVisible();
  });
}

test('the category nav lists each category and its blocks', async ({ page }) => {
  await visit(page, '/blocks');
  const nav = page.getByRole('navigation', { name: 'Blocks' });
  await expect(nav.getByRole('link')).toHaveText(['Featured', 'Sidebar', 'Login', 'Signup']);
  await expect(nav.getByRole('link', { name: 'Featured' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-slot=block-viewer]').evaluateAll((viewers) => viewers.map((viewer) => viewer.id))).resolves.toEqual(['dashboard-01', 'sidebar-07', 'sidebar-03', 'login-03', 'login-04']);
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

test('the Code tab keeps a block data file beside its page', async ({ page }) => {
  await visit(page, '/blocks');
  const viewer = page.locator('#dashboard-01');
  await expect(viewer.locator('iframe')).toHaveAttribute('src', '/view/dashboard-01');
  await viewer.getByRole('tab', { name: 'Code' }).click();
  const caption = viewer.locator('figcaption');
  await expect(caption).toHaveText('src/routes/dashboard/+page.svelte Copy');
  await expect(viewer.locator('pre')).toContainText("import data from './data.json';");

  await viewer.getByRole('button', { name: 'data.json' }).click();
  await expect(caption).toHaveText('src/routes/dashboard/data.json Copy');
  await expect(viewer.locator('pre code')).toHaveAttribute('data-language', 'json');
  await expect(viewer.locator('pre')).toContainText('"header": "Cover page"');
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
  await expect(page.getByRole('link', { name: 'Getting Started' })).toHaveCSS('font-weight', '500');
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
  // Each button holds a plus and a minus icon; the open one shows its minus.
  const icons = async (button: typeof gettingStarted) => [await button.locator('svg').nth(0).isVisible(), await button.locator('svg').nth(1).isVisible()];
  await expect(page.getByRole('link', { name: 'Routing' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Installation' })).toBeHidden();
  await expect.poll(() => icons(gettingStarted)).toEqual([true, false]);
  await expect.poll(() => icons(buildYourApplication)).toEqual([false, true]);

  await gettingStarted.click();
  await expect(page.getByRole('link', { name: 'Installation' })).toBeVisible();
  await expect.poll(() => icons(gettingStarted)).toEqual([false, true]);
  await buildYourApplication.click();
  await expect(page.getByRole('link', { name: 'Routing' })).toBeHidden();
  await expect(buildYourApplication).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => icons(buildYourApplication)).toEqual([true, false]);
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

test('sidebar-07 shows nav tooltips only while collapsed', async ({ page }) => {
  await visit(page, '/view/sidebar-07');
  const models = page.getByRole('button', { name: 'Models' });
  await models.hover();
  await page.waitForTimeout(800);
  // Base UI gives the tooltip popup no role.
  const tooltip = page.locator('[data-slot=tooltip-content]');
  await expect(tooltip).toBeHidden();
  await page.locator(trigger).click();
  await expect(page.locator(sidebar)).toHaveAttribute('data-collapsible', 'icon');
  await page.mouse.move(600, 400);
  await models.hover();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText('Models');
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
  const models = page.getByRole('listitem').filter({ has: page.getByRole('link', { name: 'Models', exact: true }) });
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

const desktopSidebar = (page: Page) => page.locator('[data-slot=sidebar][data-state]');
// sidebar-16's toggle sits in its site header and, as upstream, has no accessible name.
const triggerFor = (page: Page, name: string) => (name === 'sidebar-16' ? page.locator('header button').first() : page.locator('[data-slot=sidebar-trigger]'));

for (const name of ['sidebar-09', 'sidebar-10', 'sidebar-11', 'sidebar-12', 'sidebar-14', 'sidebar-15', 'sidebar-16']) {
  test(`${name} collapses and expands from its trigger`, async ({ page }) => {
    await visit(page, `/view/${name}`);
    await expect(desktopSidebar(page)).toHaveAttribute('data-state', 'expanded');
    await triggerFor(page, name).click();
    await expect(desktopSidebar(page)).toHaveAttribute('data-state', 'collapsed');
    await triggerFor(page, name).click();
    await expect(desktopSidebar(page)).toHaveAttribute('data-state', 'expanded');
  });

  test(`${name} opens as a sheet at phone width`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, `/view/${name}`);
    const sheet = page.getByRole('dialog', { name: 'Sidebar' });
    await expect(sheet).toBeHidden();
    await triggerFor(page, name).click();
    await expect(sheet).toBeVisible();
    await expect(sheet.locator('[data-slot=sidebar-menu-button]').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
  });
}

test('sidebar-09 shows the picked folder and a shorter mail list', async ({ page }) => {
  // Picking a folder shuffles the mails and keeps 5 to 10; with Math.random at 0 it keeps 5.
  await page.addInitScript(() => (Math.random = () => 0));
  await visit(page, '/view/sidebar-09');
  const title = page.locator('[data-slot=sidebar-header] .text-base');
  const mails = page.locator('[data-slot=sidebar-content] a.border-b');
  await expect(title).toHaveText('Inbox');
  await expect(mails).toHaveCount(10);

  await page.getByRole('button', { name: 'Drafts' }).click();
  await expect(title).toHaveText('Drafts');
  await expect(mails).toHaveCount(5);
});

test('sidebar-09 opens the user menu and picking a folder reopens a collapsed sidebar', async ({ page }) => {
  await visit(page, '/view/sidebar-09');
  await page.locator('[data-slot=sidebar-trigger]').click();
  await expect(desktopSidebar(page)).toHaveAttribute('data-state', 'collapsed');
  await page.getByRole('button', { name: 'Sent' }).click();
  await expect(desktopSidebar(page)).toHaveAttribute('data-state', 'expanded');
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
  // The popover opens on mount, after its trigger registers, and still anchors to the trigger's right edge.
  const trigger = (await page.locator('[data-slot=popover-trigger]').boundingBox())!;
  await expect.poll(async () => Math.round(((await popover.boundingBox())!).x + ((await popover.boundingBox())!).width)).toBe(Math.round(trigger.x + trigger.width));
  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await page.locator('[data-slot=popover-trigger]').click();
  await expect(popover.getByRole('button', { name: 'Export' })).toBeVisible();
});

test('sidebar-10 switches the team', async ({ page }) => {
  await visit(page, '/view/sidebar-10');
  await expect(page.locator('[data-slot=popover-content]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-slot=popover-content]')).toBeHidden();
  const trigger = page.getByRole('button', { name: 'Acme Inc' });
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: /Acme Corp\./ })).toContainText('⌘2');
  await page.getByRole('menuitem', { name: /Evil Corp\./ }).click();
  await expect(page.getByRole('button', { name: 'Evil Corp.' })).toBeVisible();
  await expect(trigger).toBeHidden();
});

test('sidebar-10 expands a workspace and opens a favorite menu', async ({ page }) => {
  await visit(page, '/view/sidebar-10');
  await expect(page.locator('[data-slot=popover-content]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-slot=popover-content]')).toBeHidden();
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
  await expect(page.getByRole('button', { name: 'api', exact: true })).toBeVisible();
  await expect(page.getByText('layout.tsx', { exact: true })).toBeHidden();
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
  await expect(desktopSidebar(page)).toHaveAttribute('data-side', 'right');
  const box = (await desktopSidebar(page).locator('[data-slot=sidebar-container]').boundingBox())!;
  expect(Math.round(box.x + box.width)).toBe(1280);
  await expect(page.locator('[data-slot=sidebar] a[data-active=true]')).toHaveText('Data Fetching');
});

test('sidebar-15 shows a left sidebar and a calendar sidebar on the right', async ({ page }) => {
  await visit(page, '/view/sidebar-15');
  await expect(page.getByText('Workspaces', { exact: true })).toBeVisible();
  await expect(page.getByText('My Calendars', { exact: true })).toBeVisible();
  await expect(desktopSidebar(page)).toHaveCount(1);
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
