# Experimental native Table

This bounded Svelte 5 slice follows [shadcn's native Table wrapper at `d75a96ab781f3d659be1ad287347d5887ce9f2fc`](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/table.tsx). It provides eight native elements and the pinned horizontal scroll container. It adds no Base primitive, sorting, selection state, pagination or keyboard navigation. The package remains private and unpublished; passing these probes does not establish whole-library parity or production readiness.

Import `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell` and `TableCaption` from `@sveltery/ui/table` or the root. The [registry directory](../apps/docs/registry/bases/base/ui/table/index.ts) is the single packaged implementation.

| Export | Native element and behavior |
| --- | --- |
| `Table` | A `table` inside the fixed `div[data-slot="table-container"]`; props and refs belong to the table |
| `TableHeader` | `thead`, retaining the descendant row border rule |
| `TableBody` | `tbody`, retaining the last row border removal |
| `TableFooter` | `tfoot`, retaining the background, top border and last row border rule |
| `TableRow` | `tr`, retaining hover, `data-state="selected"` and descendant `aria-expanded` styles |
| `TableHead` | `th`, retaining native `scope`, `headers`, `colspan` and `rowspan` |
| `TableCell` | `td`, retaining native `headers`, `colspan` and `rowspan` |
| `TableCaption` | `caption`, retaining native table naming and the pinned bottom placement |

```svelte
<script lang="ts">
  import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@sveltery/ui/table';
  let table = $state<HTMLTableElement>();
</script>
<Table bind:ref={table}>
  <TableCaption>Recent invoices</TableCaption>
  <TableHeader><TableRow><TableHead scope="col">Invoice</TableHead><TableHead scope="col">Amount</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>INV001</TableCell><TableCell>$250.00</TableCell></TableRow></TableBody>
</Table>
```

React `className`, object styles, children, refs and synthetic events become Svelte `class`, CSS strings, snippets, `bind:ref`/symbol attachments and native events. Each component accepts its native attributes, forwards caller attributes including an overriding `data-slot`, and merges caller classes after the pinned class tokens with the shared `clsx`/`tailwind-merge` helper. Native refs can begin undefined or null, publish the actual element after attachment, and clear to null on removal; attachment cleanups run on removal. The Table ref targets the `table`, not its surrounding container. The wrapper exposes no configurable container props, custom host, render API or Base state callback.

Table semantics remain native: consumers supply caption text, header scope and associations, meaningful span values, and accessible labels for controls placed in cells. `data-state="selected"` only changes styling. The descendant checkbox selectors preserve right padding removal for native content with `role="checkbox"`; no Checkbox composition is ported. The wrapper's `has-aria-expanded:bg-muted/50` token matches a descendant with `aria-expanded="true"`. Svelte's native caption attributes type event `currentTarget` as `HTMLElement`; its bindable ref retains the actual `HTMLTableCaptionElement` type.

The [four examples](../apps/docs/examples/base/TableExample.svelte) preserve Basic, With Footer, Simple and With Badges from the [complete pinned example file](../tests/reference/table-example.tsx). Native sections/headings replace the out-of-scope Example/ExampleWrapper layout in both [React comparison gallery](../tests/reference/TableGallery.tsx) and Svelte. Invoice data, caption text, classes, three displayed invoice rows and Footer's `colspan=3`/`$2,500.00` source values are retained. The source's seven-record invoice array and displayed total are not recalculated. With Badges preserves the actual three task rows and six literal spans; it requires no Badge component. DropdownMenu action, Select and Input compositions are explicitly deferred; their contents in the complete source fixture do not indicate implemented scope. Full Example layout styling and APIs are also unimplemented.

Nova is Tailwind input CSS. The [scoped Table section](../tests/reference/table-nova.css) retains upstream lines 1266–1313, including the separate `*-aria` rules; the native wrapper does not add these classes itself. It preserves full-width horizontal overflow, native table layout, whitespace, row transitions, border selectors, captions and checkbox selectors. Follow the [installation scaffold](installation.md) for light theme mappings and Tailwind scanning. Source-copy consumers need the `table` directory and its sibling `shared/classes.js`, `clsx` 2.1.1, `tailwind-merge` 3.6.0, and a scan covering both directories, plus the scoped Nova rules and [MIT notices](../packages/ui/THIRD_PARTY_NOTICES.md). Build archives and source copies from the same exact reviewed checkout selected in that guide.

## Assertion provenance and remaining gates

[Source hashes](../tests/reference/table-sources.json) identify the byte-exact wrapper, complete example file and scoped Table CSS. The [provenance tests](../scripts/tests/table-provenance.test.mjs) verify these bytes, the retained MIT license, shared CSS inclusion and the exact four React example functions/invoice data. No dedicated upstream Table test file has been identified for this slice. The local DOM, browser, SSR and consumer probes derive assertions from the pinned source and native platform behavior; they are supplemental tests, not copied upstream test ports. The [reference MIT license](../tests/reference/LICENSE) covers the derived materials.

The paired gallery exposes `/table` and `/table-reference`; native reactive/lifecycle probes use `/table-probe` and `/table-probe-reference`. Paired SSR and hydration retain the actual native Table nodes in both runtimes. Paired comparisons execute the actual pinned wrapper and check native structure, attributes/classes, captions/spans, row selectors and computed layout. Svelte-only binding, undefined ref initialization, symbol attachment and cleanup assertions test the framework substitution; they earn no React parity credit. Accessibility probes establish native roles, caption names, spans and explicit header associations in the exercised fixtures, with no live assistive-technology claim. The fresh archive and source-copy consumers must exercise the same implementation and Table CSS.

Run `bash scripts/bootstrap.sh`, `bash scripts/verify.sh`, `bash scripts/check-installation.sh`, `pnpm test:browser` and `bash scripts/check-installation.sh --browser`. Documentation/source hash checks establish provenance and documentation consistency only. Final-head secured Chromium with zero retries, both consumer modes, independent GPT-6.1 Sol high review, and all configured automatic reviews remain required before eligibility is reported. A passing historical checkpoint does not certify a later head. The [compatibility register](upstream-differences.md) records framework/scaffold substitutions and decision status. Broader shadcn compositions, interactive data tables, dark palettes, Firefox/WebKit and live assistive technology remain unclaimed.

The initial three-example implementation landed through [PR #16](https://github.com/sveltery/ui/pull/16) as main `39979bdaaf8217e003702a80ed9c2f0938049bab`, after actual Skeleton/Kbd main `d6c1cba4f42ca8b0ab03cea25666cb67d732e449`. Its historical gates certify that scope only.

## With Badges composition continuation

The [actual pinned TableWithBadges function, lines 194–255](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/examples/table-example.tsx#L194-L255) uses six native spans, rather than a missing Badge component. This continuation corrects the prior deferred-dependency description and ports only that omitted function beside Basic/Footer/Simple. Tasks, statuses and priorities remain literal source data: Design homepage/Completed/High, Implement API/In Progress/Medium and Write tests/Pending/Low. Green, blue, yellow and gray utility classes, right-aligned Priority cells, native spans and the absence of caption/footer/interactive state are preserved. No wrapper, dependency, Base pin or package API changes are introduced.

The paired [DOM gallery test](../tests/dom/table.test.ts) and [actual SSR comparison](../scripts/check-table-ssr.mjs) compare all four trees. [Browser witnesses](../tests/browser/table-badges-cases.ts) assert six exact class strings, native structure, 12px/500 text, 4px/8px padding, 24px span height and independently resolved Tailwind foreground/background colors in light and dark mode. Desktop/mobile paired geometry and 25 actual native hosts retained through SSR/hydration are checked in both runtimes. [Fresh archive/source-copy probes](../tests/installation/table.spec.ts) run the actual example and the same hydration/style assertions; their installer now copies the documented hydrated route and the example separately, retaining source-copy import remapping. Dark utility behavior uses the documented Tailwind scaffold's default `prefers-color-scheme` variant; this does not claim a complete upstream dark palette.

Original baseline is UI main `2eefcae79079b4f51f7288f368976912ebf90216`; serialized integration adds landed Alert main `c84a4e19f8753865ceb7b4898e23d272562e279d`, retaining SkeletonCard, AspectRatio, Empty and all existing control/direct remote-field gates. Native Example/ExampleWrapper scaffold remains an unaccepted substitution; With Actions/Select/Input and whole-gallery/production parity remain incomplete. Full local verification, fresh consumers, exact-head secured hosted Chromium with zero retries, independent review and all configured automatic reviews are required for this proposed [PR #23](https://github.com/sveltery/ui/pull/23) continuation; historical PR #16 evidence does not certify it.
