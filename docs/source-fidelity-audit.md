# Implementation fidelity audit

Audited on October 3, 2026 UTC. This report compares actual landed production code with immutable original source. It records implementation correspondence and gaps separately from test success and release readiness. Later repairs do not retroactively change this checkpoint.

## Current selected product scope

The canonical [current target selection](target-scope.md) is separate from the historical source inventory.

Current delivery selects the pinned Base Toast, Combobox and Drawer wrappers over corresponding Sveltery Base primitives. The separate cmdk-backed Command entry and optional Sonner entry are excluded from current delivery, not completed. Vaul is unnecessary for the selected Base Drawer. No Command facade or substitute engine is introduced. All other selected families and their existing React-specific closures remain unchanged.

The immutable source inventory below still records the original families/imports, including Command and Sonner. Those rows describe authenticated source, not authorization to port an excluded engine. Historical 62-entry/373-export and 29-package counts remain intact; current delivery is a separate selection overlay, not a rewrite of original provenance.

## Verified repairs after the audit

The missing support-CSS dependency identified at `db25cb86` has been repaired by [PR #40](https://github.com/sveltery/ui/pull/40), merged as `0c4e1e5be376c7a8d298f0e28d8a8d3b8c1980dd`. The [landed CSS contract](shadcn-css.md) records current delivery of genuine `shadcn` 4.21.1 `tailwind.css`, retains UI `cn` 0.2.2 separately from the original CLI/registry `cn` 0.2.4, and corrects the central Separator interpretation using the complete authenticated CSS environment. [Post-merge CI](https://github.com/sveltery/ui/actions/runs/37088455405) and [Documentation](https://github.com/sveltery/ui/actions/runs/37088455389) passed on that exact merge.

Current readiness records were subsequently reconciled by [PR #42](https://github.com/sveltery/ui/pull/42), merged as `01b8ea72e71574317587006115b389e7f68ddbee`, with passing [post-merge CI](https://github.com/sveltery/ui/actions/runs/37095183526) and [Documentation](https://github.com/sveltery/ui/actions/runs/37095183545). The [readiness checklist](readiness.md), affected [Card](card.md), [Alert](alert.md), [Kbd](kbd.md) and [Empty](empty.md) contracts, and [compatibility register](upstream-differences.md) now distinguish available Example/IconPlaceholder dependencies from actual migrated gallery functions. The six icon/image examples identified below remain unimplemented despite their available dependencies; other genuine styled-component and framework blockers retain their own scope. This documentation repair grants no new component, gallery, acceptance or test credit.

The [proposed canonical Dialog composition repair](dialog-composition.md) addresses the original Button/IconPlaceholder bypass in the two built-in closes, preserving the original audit finding below. It reuses the existing helpers and consumed Base pin, with a narrowly documented undefined-tabindex render-prop translation. Its new runtime/delivery checks are supplemental source-derived regressions; exact-head review, hosted/configured checks, merge and post-merge verification remain required. This proposal grants no gallery completion or full-library parity.

Statements below that CSS is missing describe the immutable audited `db25cb86` checkpoint, not present delivery. The original findings, package versions, source hashes and provenance remain unchanged. This subsequent repair does not establish full-library implementation parity or copied ordinary upstream UI test credit; the remaining composition/helper/default-style findings retain their own scope.

## Immutable scope

| Source | Commit / identity |
| --- | --- |
| Landed Sveltery UI | `db25cb86dd2d8ebbbb78f83b5f6c20cc36cea946`, tree `4ac2f00bd7cdefbfcc79d782b0408860856a6faf` |
| Original shadcn/ui | `d75a96ab781f3d659be1ad287347d5887ce9f2fc`, tree `b5fe6239eadcaa7167662cc28e55b4f7911a1e1e` |
| Consumed Sveltery Base | `d889e75bedfee9174c3b36d16fe8a9fb2d2a66d3`, archive SHA-256 `cc6bcbdf39f661f49f098c6126620e9ac8c755adbf83ff6231c56501da6d4234` |
| Original headless binding | `@base-ui/react` 1.6.0; consumed Sveltery Base documents a Base UI 1.8.0 behavior reference |

The dependency API is therefore a correspondence to verify, not an established version-equivalence assumption. Original React/React DOM lock selections are 19.2.3, while current UI development references use 19.3.0; this is another explicit environment difference, not an exact full upstream execution setup. Base is separately managed and was inspected read-only. Pending Input, Separator, native-engine harness and Base-pin PRs receive no landed implementation credit here.

Eleven of the original 62 modern Base registry UI families are landed: Button, Dialog, Textarea, Skeleton, Kbd, Table, Card, Label, Alert, AspectRatio and Empty. Their 42 original component exports have 42 corresponding production Svelte components. The complete original registry has 373 named exports; the remaining scope is not an existing implementation that merely differs.

## Assessment

The landed thin wrappers mostly resemble the original: native/Base host choice, named parts, literal utility strings, CVA tables and prop forwarding remain recognizable. All 35 direct literal class arguments examined match original source; three CVA tables were also inspected. None of the 42 component wrappers contains a Svelte state/effect controller. There is no UI-owned focus trap, portal engine, dismissal state machine, keyboard manager or form controller. Complex behavior remains delegated to Base.

The full repository is less closely matched. Available canonical components/helpers are bypassed in Dialog and many galleries. Production omits a genuine framework-independent shadcn CSS dependency. Icons and theme/default-style machinery include deliberate local architecture beyond a syntax translation. Passing bounded paired tests does not establish source/composition fidelity in these areas.

A single TSX module containing several components reasonably becomes several `.svelte` files with a barrel, type and variant module. The eleven families use 42 component files and 18 accompanying TypeScript modules. SvelteKit documentation replaces Next, and the authorized unpublished package compiles the same canonical registry source used by source-copy consumers. Those framework/delivery differences should not be measured through raw line counts or a code-match percentage.

## Landed wrapper correspondence

Original paths are under `apps/v4/registry/bases/base/ui/` at the shadcn pin above. Local paths are under `apps/docs/registry/bases/base/ui/` at the UI pin above. Class names, slots, native hosts and variant defaults are preserved except for the explicit findings below; React props/events/refs/children/CSS are translated to Svelte native props/events/refs or attachments/snippets/CSS strings.

| Family / original exports | Source evidence | Local correspondence / result |
| --- | --- | --- |
| Button / 1 | [button.tsx:1–50](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/button.tsx#L1) | [Button.svelte](../apps/docs/registry/bases/base/ui/button/Button.svelte) and [variants.ts](../apps/docs/registry/bases/base/ui/button/variants.ts): real Base Button, six variants, eight sizes, default/default; callback API is an extra local behavior. |
| Dialog / 10 | [dialog.tsx:10–156](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/dialog.tsx#L10) | [Dialog family](../apps/docs/registry/bases/base/ui/dialog/index.ts): real Root/Trigger/Portal/Close/Backdrop/Popup/Title/Description, native Header/Footer, same Portal→Overlay→Popup nesting and close-button defaults. Built-in Button/icon composition differs. Root actions only forward Base methods. |
| Textarea / 1 | [textarea.tsx:4–17](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/textarea.tsx#L4) | [Textarea.svelte](../apps/docs/registry/bases/base/ui/textarea/Textarea.svelte): native textarea and exact classes; binding/SSR translation and previously accepted reset difference are explicit. |
| Skeleton / 1 | [skeleton.tsx:3–13](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/skeleton.tsx#L3) | [Skeleton.svelte](../apps/docs/registry/bases/base/ui/skeleton/Skeleton.svelte): native div, `cn-skeleton animate-pulse`, caller-overridable slot; no added loading behavior. |
| Kbd / 2 | [kbd.tsx:3–26](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/kbd.tsx#L3) | [Kbd family](../apps/docs/registry/bases/base/ui/kbd/index.ts): both original kbd hosts, including KbdGroup despite its original div-props annotation, and both exact class strings. |
| Table / 8 | [table.tsx:6–100](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/table.tsx#L6) | [Table family](../apps/docs/registry/bases/base/ui/table/index.ts): fixed outer scroll div and native table parts, table-level prop forwarding and exact classes; no sorting/selection engine. |
| Card / 7 | [card.tsx:4–93](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/card.tsx#L4) | [Card family](../apps/docs/registry/bases/base/ui/card/index.ts): seven native divs, default/sm size, grid/action/container selectors and precedence retained. |
| Label / 1 | [label.tsx:6–19](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/label.tsx#L6) | [Label.svelte](../apps/docs/registry/bases/base/ui/label/Label.svelte): native label and selectors; htmlFor→for, native association/focus remain browser behavior. |
| Alert / 4 | [alert.tsx:5–71](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/alert.tsx#L5) | [Alert family](../apps/docs/registry/bases/base/ui/alert/index.ts): native divs, caller-overridable alert role, original default/destructive CVA and link selectors. |
| AspectRatio / 1 | [aspect-ratio.tsx:3–22](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/aspect-ratio.tsx#L3) | [AspectRatio.svelte](../apps/docs/registry/bases/base/ui/aspect-ratio/AspectRatio.svelte): native div/required ratio; derived CSS-string expression retains caller style replacement including null/undefined. No measurement observer. |
| Empty / 6 | [empty.tsx:4–103](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/empty.tsx#L4) | [Empty family](../apps/docs/registry/bases/base/ui/empty/index.ts): six native divs, including Description despite original paragraph-props annotation; default/icon CVA, empty-icon slot, data-variant and link selectors preserved. |

## Findings at the audited checkpoint

The support-CSS finding below is now repaired as recorded above. Other findings remain distinct from that dependency repair.

### Genuine shadcn support CSS is absent

Original [globals.css:1–3](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/app/globals.css#L1) imports Tailwind, tw-animate-css and `shadcn/tailwind.css`. Audited production [theme.css:1–7](https://github.com/sveltery/ui/blob/db25cb86dd2d8ebbbb78f83b5f6c20cc36cea946/apps/docs/src/lib/theme.css#L1), the installation recipe and generated styles omit the last dependency. The separately authenticated theme reference app has the genuine support stylesheet, so the different reference paths do not all establish the same complete original CSS environment.

This is an avoidable fidelity gap. The original [support CSS:76–85](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/packages/shadcn/src/tailwind.css#L76) maps `data-horizontal` and `data-vertical` variants to `[data-orientation]`, alongside other state variants, keyframes and utilities. Independently compiling the same four original Separator candidates with Tailwind 4.3.0 proves that adding this source changes generated selectors from direct data-horizontal/data-vertical attributes to actual data-orientation attributes. Actual React Base 1.6 SSR emits data-orientation.

The previous SSR-only conclusion of a shared upstream Separator selector bug is therefore unsupported by the complete original CSS. Reuse the genuine pinned export or authenticated exact source, rerun actual secured browser/fresh-consumer checks and correct the compatibility interpretation while retaining historical evidence. Keep original wrapper classes unchanged. This witness is CSS compilation plus actual React SSR, not a new browser acceptance result. The authenticated original support CSS SHA-256 is `4c371f7a1ff5d219ae2f7ff28bd256b4346fd546fe46fbae22092e57db2f0fae`.

### Dialog bypasses original Button and configurable icon composition

Original [DialogContent:60–76](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/dialog.tsx#L60) composes Close with a genuine ghost/icon-sm Button and IconPlaceholder names `XIcon`, `IconX`, `Cancel01Icon`, `XIcon`, `RiCloseLine`. Original [Footer:114](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/dialog.tsx#L114) composes Close with an outline Button.

Audited [Content:14–15](https://github.com/sveltery/ui/blob/db25cb86dd2d8ebbbb78f83b5f6c20cc36cea946/apps/docs/registry/bases/base/ui/dialog/DialogContent.svelte#L14) and [Footer:11](https://github.com/sveltery/ui/blob/db25cb86dd2d8ebbbb78f83b5f6c20cc36cea946/apps/docs/registry/bases/base/ui/dialog/DialogFooter.svelte#L11) instead concatenate copied Button styling directly on Base Close; Content uses a fixed inline X. Both genuine local Button and the configurable helper now exist. A separate direct SSR diagnostic executed original Footer with actual React Base 1.6 and actual production Svelte Footer: class strings match, but only the original emitted `data-slot="button"` and `tabindex="0"`. The missing helper composition is observable beyond appearance.

Consumed Base exposes a render snippet with merged props/state/children and attachments. Restore Close→Button composition through that actual API and select the same five icon names through canonical IconPlaceholder. Revalidate cancellation, focus, merged props, refs/attachments, overrides and loading/library selection. Copying the two missing attributes alone would leave the structural finding unresolved.

### Existing shared class and Textarea differences need explicit treatment

The genuine reusable `cn` 0.2.2 is now used. However [shared/classes.js:7–8](https://github.com/sveltery/ui/blob/db25cb86dd2d8ebbbb78f83b5f6c20cc36cea946/apps/docs/registry/bases/base/ui/shared/classes.js#L7) intentionally preserves state-class callbacks. Original styled Button passes through CVA/`cn`, which ignores functions. Direct execution confirmed original `cn('cn-button', callback)` omits callback output, while the local helper evaluates and merges it. This is a local API extension, not a needed change to the merging engine or automatic Svelte syntax exception. Prefer direct genuine `cn` for thin wrappers; decide the callback exception explicitly before altering existing public behavior.

[Textarea:5–13](https://github.com/sveltery/ui/blob/db25cb86dd2d8ebbbb78f83b5f6c20cc36cea946/apps/docs/registry/bases/base/ui/textarea/Textarea.svelte#L5) adds bindable value/default selection and server-only leading-newline compensation to an original native spread-only wrapper. The compensation restores actual React serialization and should not be removed to minimize line count. Native Svelte reset changes bound state where React controlled value retains state; [the Textarea contract](textarea.md) retains the specific earlier acceptance in PR #8. Preserve that explicit exception and its scope rather than declaring exact implementation equivalence or silently reversing it.

## Gallery composition gaps

The authentic Example/ExampleWrapper helpers preserve the original native div tree, conditional title, five literal classes and content/container separation. Five selected Skeleton and five selected Kbd compositions use them. Selected Table With Badges genuinely uses six native spans from original source; it requires no Badge component.

Other selected galleries still replace available original helpers with handmade section/heading/grid scaffolds. Their React reference fixtures repeat the same replacements, so passing paired tests certify the declared substitute rather than original source structure:

| Gallery | Local source/reference | Original source / prerequisites |
| --- | --- | --- |
| Card, seven bodies | [CardExample](../apps/docs/examples/base/CardExample.svelte), [selected reference](../tests/reference/card-selected-examples.tsx) | [card-example:57](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/examples/card-example.tsx#L57); outer helper repair has no missing prerequisite. |
| Table, four bodies | [TableExample](../apps/docs/examples/base/TableExample.svelte), [reference](../tests/reference/TableGallery.tsx) | [table-example:81](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/examples/table-example.tsx#L81); outer helper repair has no missing prerequisite. |
| Alert, Basic | [AlertExample](../apps/docs/examples/base/AlertExample.svelte), [reference](../tests/reference/AlertGallery.tsx) | [alert-example:15](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/examples/alert-example.tsx#L15); real helper and original lg:grid-cols-1 wrapper available. |
| AspectRatio, four ratios | [AspectRatioExample](../apps/docs/examples/base/AspectRatioExample.svelte), [reference](../tests/reference/AspectRatioGallery.tsx) | [aspect-ratio-example:9](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/examples/aspect-ratio-example.tsx#L9); helper available, Next Image is a separate recorded substitution. |
| Textarea, five states | [TextareaExample](../apps/docs/examples/base/TextareaExample.svelte), [reference](../tests/reference/TextareaGallery.tsx) | [textarea-example:12](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/examples/textarea-example.tsx#L12); helper available, three labeled compositions need Field parts. |
| Label, With Textarea | [LabelExample](../apps/docs/examples/base/LabelExample.svelte), [reference](../tests/reference/LabelGallery.tsx) | [label-example:55](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/examples/label-example.tsx#L55); Example available, original Field is still missing. |

Six omitted original functions are now dependency-ready: CardWithImage, CardWithImageSmall, KbdWithIcons, KbdWithIconsAndText, AlertExample2 and AlertExample3. Their dependencies are actual landed Card/Button/Kbd/Alert/IconPlaceholder and native content. Other compositions still require missing styled ToggleGroup, Input, Field, Avatar, DropdownMenu, Select, Checkbox, InputGroup, Tooltip or Badge and remain blocked. Empty's native probes are explicitly supplemental; none of its six original complete examples is ported.

Repair the genuine available scaffolds and functions; retain unimplemented prerequisite boundaries. Update provenance rules that currently require historical scaffold substitutes when implementing those repairs, while preserving original function bodies, expectations and accurate historical records.

## Helpers, icons, styles and repository structure

| Area | Source correspondence / remaining difference |
| --- | --- |
| Framework-independent utilities | Actual `cn` and CVA reused; no new merge engine. See the [dependency inventory](external-dependencies.md) for exact package versions and runtime roles. |
| Icon rendering/loading | All 871 selected exports retain genuine authenticated native geometry and licenses. React lazy/Suspense/use and React renderer bindings require native integration; the public provider, extra cache layers, lack of original five-module eager preload, generic renderer and app-helper promotion are deliberate architecture differences. The original placeholder→per-library loader→export-map shape should remain recognizable. Restricted Hugeicons React renderer source must remain excluded. |
| CSS section bodies | All 80 shipped marked scoped sections contain byte-exact original bodies from eight styles, ten selected sections each. Original complete files contain 471 marked sections. These are bounded projections, not a whole-style completion percentage. |
| Theme/default-style architecture | All 24 genuine records are retained, but [theme-assets.mjs:83](https://github.com/sveltery/ui/blob/db25cb86dd2d8ebbbb78f83b5f6c20cc36cea946/scripts/theme-assets.mjs#L83) adds `all: revert-layer`, duplicate scope specificity, property clearing and local radius aliases to preserve historical unscoped Nova. Original source has direct radius formulas/single scopes. At Neutral radius 10px, historical Card/Kbd are 12px/2px versus source 14px/6px. This is intentional compatibility, not a Svelte requirement. |
| Pure theme helpers | Original `buildRegistryTheme` and `buildThemeForPreset` decomposition/schema validation is condensed into a bounded local helper. One unchanged original theme case passing does not establish the full helper API/structure. Reuse genuine pure utilities/schema where suitable and keep unsupported config/menu/font/RTL scope explicit. |
| Canonical source and delivery | The unpublished package and source-copy mode use the same registry components; no second wrapper implementation. Example and IconPlaceholder are additionally public package APIs, unlike original helper placement. Preserve requested package delivery while keeping registry source canonical and documenting this expansion. |
| Missing repository scope | Original packages include helpers, react, registry, shadcn and tests; local package facade is UI only. Missing modern families, blocks, registry/CLI/preset pipeline and native MessageScroller/Questionnaire primitives are incomplete scope. |

The [compatibility register](upstream-differences.md) remains the decision/history index. This audit identifies source-policy repairs; it does not silently accept a new architecture or revoke specific earlier accepted behavior. A proposed default-style simplification must preserve evidence and explicitly determine the status of historical consumers before changing defaults.

## Evidence and limits

Four independent read-only audits authenticated original Git blobs, actual production bytes, helper/import structure and CSS projections at these exact commits. The original 62 catalog SHA-256/byte-length/Git-blob identities and 373 export records match source. Thirty-four complete retained reference records from ten manifests also match original blobs. Hash authentication proves provenance; it does not prove that production composition matches.

The gallery/style auditor ran three existing provenance files: eight checks passed. Separate witnesses executed genuine support CSS compilation and actual React Base/Svelte Footer SSR. They are local supplemental diagnostics, not copied ordinary shadcn runtime suites or new secured browser/full verification acceptance. The complete original test inventory is 133 executable sources plus six snapshots; seventeen original MessageScroller geometry declarations still supply zero native Svelte implementation credit. No implementation, tests, dependency, Base source or security setting was changed by the read-only audit.

Detailed authenticated inventories and witness logs are retained in PM handoff artifacts (`implementation-audit-*-oct03`); final repair PRs must link their source maps and exact-head review/check evidence. No quantitative code-match percentage, all-library parity, automatic comprehensive structure CI or production readiness is claimed.

The required [source-first workflow](../CONTRIBUTING.md#source-first-implementation-workflow) now treats implementation/composition review and runtime tests as independent acceptance gates. Both must pass for a source-conforming port.
