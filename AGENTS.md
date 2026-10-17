# Repository guidance

Sveltery UI is the shadcn/ui layer for Svelte, built on [Sveltery Base](https://github.com/sveltery/base). Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing code.

- Follow upstream shadcn/ui for anatomy, class strings, `data-slot` values, variants and examples.
- Record every deliberate difference from upstream on the docs page `apps/docs/content/docs/differences.md`.
- Mirror HTML and Svelte behavior. Use `class`, `onclick`, `bind:value`, `bind:open`, snippets and attachments.
- Never emulate React behavior: no `className`, no controlled-input emulation, no React SSR quirks, no DOM shaping for React parity.
- Headless behavior (focus, keyboard, ARIA, dismissal, forms) belongs in Sveltery Base. If a component needs behavior Base lacks, fix it in Base.
- Keep components thin: a Base part or native element, the upstream classes, and spread props.
- Framework-agnostic dependencies are used directly. React-only dependencies get a Svelte implementation in its own package.
- Test behavior with literal expected values. Do not diff against React output.
- Run `pnpm verify` before opening a pull request.
