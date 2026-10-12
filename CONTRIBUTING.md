# Contributing

## Setup

Use Node 24 and pnpm 12. Then run `pnpm install`.

## Layout

- `packages/ui/src/lib/<component>` holds each component, its variants and its types.
- `packages/ui/src/lib/styles` holds the Nova and scoped style sheets.
- `apps/docs` consumes `@sveltery/ui` like any app and hosts the examples.
- `tests/dom` holds vitest behavior tests, `tests/browser` holds Playwright tests, and `tests/installation` holds the packaging smoke test.

## Rules

Follow [AGENTS.md](AGENTS.md). Port the upstream shadcn/ui component, keep its classes and slots, and adapt only what Svelte does differently. Write tests that assert what a user observes.

## Checks

`pnpm verify` runs lint, type checks, unit tests, the docs build, the remote-form fixture and the packaging smoke test. `pnpm test:browser --project chromium` runs the browser tests. Firefox and WebKit run nightly in CI.
