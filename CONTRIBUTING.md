# Contributing

## Setup

Use Node 24 and pnpm 12. Then run `pnpm install`.

## Layout

- `apps/docs/registry/bases/base/ui/<component>` holds each component, its variants and its types. This is registry source: users get it through the CLI (`npx @sveltery/ui@latest init`, then `add`), not from npm. Inside `apps/docs`, the `$registry` alias points at `apps/docs/registry`.
- `apps/docs/registry/styles` holds one sheet per style, scoped by `.style-<name>` as upstream does, and the shared themes. The docs site renders Nova by setting `style-nova` on `<body>`.
- `apps/docs` is the docs site. It serves the registry and hosts the examples. Its pages live in `apps/docs/content/docs`, and [its README](apps/docs/content/docs/README.md) shows how to add one.
- `tests/dom` holds vitest behavior tests, `tests/browser` holds Playwright tests, and `tests/installation` holds the packaging smoke test.

## Rules

Follow [AGENTS.md](AGENTS.md). Port the upstream shadcn/ui component, keep its classes and slots, and adapt only what Svelte does differently. Write tests that assert what a user observes.

## Checks

`pnpm verify` runs lint, type checks, unit tests, the docs build, the remote-form fixture and the packaging smoke test. `pnpm test:browser --project chromium` runs the browser tests. Firefox and WebKit run nightly in CI.

## Docs site

`pnpm --filter @sveltery/docs dev` serves the site with hot reload. `pnpm --filter @sveltery/docs build` prerenders it for Cloudflare and builds the Pagefind search index, and `pnpm --filter @sveltery/docs preview` serves that build with `wrangler dev`. Cloudflare Workers Builds deploys the site through its GitHub integration. It runs `pnpm build` in `apps/docs`, which builds `@sveltery/charts` before the site, then deploys `main` to production and every other branch to a Worker Preview. The Docs workflow runs the same build as a pull request check. The site's origin, https://ui.sveltery.dev, is the default in `apps/docs/src/lib/site.ts`, and the `VITE_SITE_URL` build variable overrides it.
