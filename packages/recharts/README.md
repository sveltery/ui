# @sveltery/recharts

Composable SVG charts for Svelte 5, ported from [recharts](https://github.com/recharts/recharts) 3.8.0. Recharts' framework-free core (the Redux store and its slices, the selectors, scales, stacks, tick math and animation timing) is copied from upstream with its tests. The chart components are being rewritten in Svelte. The chart shells are done: `BarChart`, `LineChart`, `AreaChart`, `ComposedChart`, `PieChart`, `RadarChart` and `RadialBarChart` render recharts' wrapper, surface and layers, and `ResponsiveContainer`, `Cell`, `Surface` and `Layer` are exported. The Cartesian parts are ported: `XAxis`, `YAxis`, `CartesianAxis`, `CartesianGrid`, `Bar`, `Line`, `Area`, `Tooltip`, `Legend`, `Text`, `Label`, `LabelList` and the `Rectangle`, `Curve`, `Dot` and `Symbols` shapes. So are the polar parts: `Pie`, `Radar`, `RadialBar`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`, the `Sector`, `Polygon`, `Trapezoid` and `Cross` shapes, the sector tooltip cursor of radial layouts, and the cross cursor that ScatterChart will draw. `ScatterChart`, `Scatter`, `ErrorBar`, `ReferenceLine` and `Brush` are not ported yet.

[`differences.md`](differences.md) lists every place the port differs from recharts and why.

## Updating from upstream

`node scripts/sync-upstream.mjs <recharts checkout>` copies the framework-free files listed in `scripts/upstream.mjs` into `src` at their upstream paths, along with the React-free upstream specs into `test`. Each relative import gains `.js`, and imports from `react` point to `src/react.ts`, which gives React's types Svelte and DOM meanings. For a module that is bound to React, the script keeps only its types and the values that `scripts/upstream.mjs` names in `EXTRACTED_VALUES`, such as pure functions and `default*Props` constants. It skips the upstream modules listed in `REPLACED`, which a hand-written Svelte module replaces. It then applies the patches in `patches/` and writes the list of files it owns to `scripts/vendored.txt`. It refuses to overwrite a file that exists but is not in that list, so a generated path never replaces a hand-written one.

Add `--check` to compare the committed files with a fresh copy instead of writing them. The checkout must be at recharts commit `a1044db` (tag `v3.8.0`).

Components write recharts' React prop bags to the DOM through `attrs()`, which uses the tables react-dom itself uses (attribute aliases, unitless styles, boolean attributes, event names). `node scripts/react-dom-tables.mjs <react-dom/cjs/react-dom-client.development.js>` regenerates them into `src/util/reactDomTables.ts` from react-dom 19.2.3, the version shadcn/ui pins. Add `--check` to compare instead of writing.

The upstream specs run with `pnpm test` from the repository root.

## The shadcn chart gallery

`node scripts/convert-shadcn-charts.mjs <shadcn>/apps/v4/registry/new-york-v4/charts <routes dir>` converts shadcn's chart gallery into Svelte pages on this package. Each `chart-*.tsx` becomes `<routes dir>/chart-*/+page.svelte`. Element and render-function props become snippets, `useState` and `useMemo` become `$state` and `$derived`, a `useCallback` render function becomes a snippet at the top of the page, and JSX text keeps Babel's whitespace rules. A spread onto a DOM element goes through `attrs()`, which writes React prop names as react-dom would. The pages import card, chart and select helpers from `--helpers` (default `<routes dir>/shadcn`), and the script writes one component per lucide icon into its `icons` folder. `--match <regex>` picks the charts (default area, bar, line, pie, radar, radial and tooltip), `--only <name>` converts one, and `--check` compares instead of writing. The test app keeps the converted pages in `tests/app/src/routes/chart/recharts`, where they are compared with shadcn's own rendering.

`--docs` writes the docs site's examples instead. Each `chart-*.tsx` becomes `<output dir>/Chart*.svelte`, with `--suffix` appended to the name. Imports point at the docs registry (`$registry/bases/base/ui/*`), a lucide icon in markup becomes an `IconPlaceholder`, and an icon used as a value, such as a chart config's `icon`, becomes a component in `<output dir>/icons`. A file with more than one function keeps the exported one as the component and turns the others into snippets. The docs site keeps the gallery in `apps/docs/examples/charts` and shadcn's chart page examples in `apps/docs/examples/charts` (`chart-example*`) and `apps/docs/examples/base` (`--suffix Example`), and upstream's `registry/bases/base/examples/chart-example.tsx` as `apps/docs/examples/base/ChartExample.svelte`.

## License

MIT. See `THIRD_PARTY_NOTICES.md` for the upstream license.
