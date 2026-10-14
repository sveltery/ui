export const site = {
  name: 'Sveltery UI',
  description: 'Accessible Svelte components built on Sveltery Base and styled like shadcn/ui. Copy them into your app and make them your own.',
  github: 'https://github.com/sveltery/ui',
  /** Absolute URLs in the sitemap and llms.txt. Set `VITE_SITE_URL` at build time for the deployed origin. */
  url: (import.meta.env.VITE_SITE_URL || 'http://localhost:4173').replace(/\/$/, ''),
  nav: [
    { href: '/docs', label: 'Docs' },
    { href: '/docs/components', label: 'Components' },
    { href: '/docs/forms', label: 'Forms' },
    { href: '/blocks', label: 'Blocks' },
  ],
} as const;
