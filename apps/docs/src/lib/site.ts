export const site = {
  name: 'Sveltery UI',
  description: 'Accessible Svelte components built on Sveltery Base and styled like shadcn/ui. Copy them into your app and make them your own.',
  github: 'https://github.com/sveltery/ui',
  /** The deployed origin, used in the sitemap, llms.txt and the registry's `$schema` links. `VITE_SITE_URL` overrides it at build time. */
  url: (import.meta.env.VITE_SITE_URL || 'https://ui.sveltery.dev').replace(/\/$/, ''),
  nav: [
    { href: '/', label: 'Home' },
    { href: '/docs/installation', label: 'Docs' },
    { href: '/docs/components', label: 'Components' },
    { href: '/docs/forms', label: 'Forms' },
    { href: '/blocks', label: 'Blocks' },
    { href: '/typeset', label: 'Typeset' },
    { href: '/create', label: 'Create' },
  ],
} as const;
