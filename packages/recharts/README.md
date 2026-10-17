# @sveltery/recharts

Composable SVG charts for Svelte 5, ported from [recharts](https://github.com/recharts/recharts) 3.8.0. Recharts' framework-free core (the Redux store and its slices, the selectors, scales, stacks, tick math and animation timing) is copied from upstream with its tests. The chart components are being rewritten in Svelte, so this package does not export any yet.

## Updating from upstream

`node scripts/sync-upstream.mjs <recharts checkout>` copies the framework-free files listed in `scripts/upstream.mjs` into `src` at their upstream paths, along with the React-free upstream specs into `test`. Each relative import gains `.js`, and imports from `react` point to `src/react.ts`, which gives React's types Svelte and DOM meanings. For a module that is bound to React, the script keeps only its types and the pure functions that `scripts/upstream.mjs` names. It then applies the patches in `patches/` and writes the list of files it owns to `scripts/vendored.txt`.

Add `--check` to compare the committed files with a fresh copy instead of writing them. The checkout must be at recharts commit `a1044db` (tag `v3.8.0`).

The upstream specs run with `pnpm test` from the repository root.

## License

MIT. See `THIRD_PARTY_NOTICES.md` for the upstream license.
