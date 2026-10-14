/** Block categories, in nav order. A hidden category has a page but no nav link. */
export const categories = [
  { name: 'Sidebar', slug: 'sidebar', hidden: false },
  { name: 'Dashboard', slug: 'dashboard', hidden: true },
  { name: 'Authentication', slug: 'authentication', hidden: true },
  { name: 'Login', slug: 'login', hidden: false },
  { name: 'Signup', slug: 'signup', hidden: false },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export type Block = {
  /** The folder in `apps/docs/blocks`, which holds `page.svelte` and its `components`. */
  name: string;
  description: string;
  /** The app route `page.svelte` becomes: `src/routes/<route>/+page.svelte`. */
  route: string;
  categories: CategorySlug[];
  iframeHeight?: string;
};

/** Every block, in upstream registry order. A block without categories is served at `/view/<name>` only. */
export const blocks: Block[] = [
  { name: 'preview-03', description: 'Preview 03', route: 'preview', categories: [] },
  { name: 'login-01', description: 'A simple login form.', route: 'login', categories: ['authentication', 'login'] },
  { name: 'login-02', description: 'A two column login page with a cover image.', route: 'login', categories: ['authentication', 'login'] },
  { name: 'login-03', description: 'A login page with a muted background color.', route: 'login', categories: ['authentication', 'login'] },
  { name: 'login-04', description: 'A login page with form and image.', route: 'login', categories: ['authentication', 'login'] },
  { name: 'login-05', description: 'A simple email-only login page.', route: 'login', categories: ['authentication', 'login'] },
  { name: 'signup-01', description: 'A simple signup form.', route: 'signup', categories: ['authentication', 'signup'] },
  { name: 'signup-02', description: 'A two column signup page with a cover image.', route: 'signup', categories: ['authentication', 'signup'] },
  { name: 'signup-03', description: 'A signup page with a muted background color.', route: 'signup', categories: ['authentication', 'signup'] },
  { name: 'signup-04', description: 'A signup page with form and image.', route: 'signup', categories: ['authentication', 'signup'] },
  { name: 'signup-05', description: 'A simple signup form with social providers.', route: 'signup', categories: ['authentication', 'signup'] },
  { name: 'sidebar-01', description: 'A simple sidebar with navigation grouped by section.', route: 'dashboard', categories: ['sidebar', 'dashboard'] },
  { name: 'sidebar-02', description: 'A sidebar with collapsible sections.', route: 'dashboard', categories: ['sidebar', 'dashboard'] },
  { name: 'sidebar-03', description: 'A sidebar with submenus.', route: 'dashboard', categories: ['sidebar', 'dashboard'] },
  { name: 'sidebar-04', description: 'A floating sidebar with submenus.', route: 'dashboard', categories: ['sidebar', 'dashboard'] },
  { name: 'sidebar-05', description: 'A sidebar with collapsible submenus.', route: 'dashboard', categories: ['sidebar', 'dashboard'] },
  { name: 'sidebar-06', description: 'A sidebar with submenus as dropdowns.', route: 'dashboard', categories: ['sidebar', 'dashboard'] },
  { name: 'sidebar-07', description: 'A sidebar that collapses to icons.', route: 'dashboard', categories: ['sidebar', 'dashboard'] },
  { name: 'sidebar-08', description: 'An inset sidebar with secondary navigation.', route: 'dashboard', categories: ['sidebar', 'dashboard'] },
];

export const blocksIn = (slug: CategorySlug) => blocks.filter((block) => block.categories.includes(slug));

/** Categories in the nav: not hidden, and with a block to show. */
export const navCategories = categories.filter((category) => !category.hidden && blocksIn(category.slug).length);

/** Upstream's featured list, in its order, limited to ported blocks. dashboard-01 waits for Select. */
export const featured = ['dashboard-01', 'sidebar-07', 'sidebar-03', 'login-03', 'login-04'].flatMap((name) => blocks.filter((block) => block.name === name));
