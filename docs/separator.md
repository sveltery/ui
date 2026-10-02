# Styled native Separator

The proposed `Separator` is exported from `@sveltery/ui` and `@sveltery/ui/separator`, with named `SeparatorProps` and `SeparatorState` native type conveniences. One canonical source directory is packaged and copied: [separator](../apps/docs/registry/bases/base/ui/separator/index.ts). All primitive orientation, ARIA, host/render composition, style callback, ref, attachment and event behavior comes from the actual locked `@sveltery/base/separator`; UI adds no behavior controller or placeholder.

```svelte
<script lang="ts">
  import { Separator } from '@sveltery/ui/separator';
</script>
<Separator orientation="vertical" />
```

The immutable styled source is [shadcn Separator](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/separator.tsx), commit `d75a96ab781f3d659be1ad287347d5887ce9f2fc`. The default is horizontal. The default host is a div with `role=separator`, `aria-orientation` and `data-orientation`. The source sets `data-slot=separator` before caller props, so explicit caller values and omissions win. The exact utility string is `shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch`; there is no component-specific Nova CSS block. Caller static classes merge through the same `clsx`/`tailwind-merge` path.

The primitive's advertised class type includes state callbacks, but the actual styled React wrapper passes className to `cn`, which ignores functions. The native wrapper preserves that observable source limit: a function `class` is accepted by the inherited type and is never invoked. Use static native ClassValue strings, arrays or objects. Style callbacks and render state remain delegated to Base and do execute. Native render snippets receive forwarded props, `{ orientation }`, and an optional children snippet; spread all forwarded symbol props on the replacement host to preserve attachments and actual-element refs.

## Preserved shared selector mismatch

[Shared pinned issue #27](https://github.com/sveltery/ui/issues/27) records that actual React Base UI 1.6.0 and Base's 1.8 provenance emit `data-orientation`, while the styled utility selectors require `data-horizontal`/`data-vertical`. Those default selectors match neither implementation. Default divider dimensions therefore follow the actual surrounding layout rather than the advertised one-pixel utility rules. The port retains the same classes and primitive attributes; it adds no orientation aliases and does not correct the selectors. Paired computed-style probes execute the immutable React wrapper and capture actual dimensions, then compare the Svelte result. Explicit caller `data-horizontal`/`data-vertical` witnesses separately exercise the original selector rules. This establishes characterization of the shared behavior; it does not claim a corrected divider or acceptance of a later fix.

## Genuine tests and source-derived coverage

[Styled source hashes](../tests/reference/separator-sources.json) retain the complete wrapper and complete gallery, including Gitblob SHA, SHA-256 and byte counts. No dedicated shadcn runtime Separator suite exists in the audited pin. The styled wrapper, DOM/SSR, gallery and browser assertions are source-derived local comparisons, not copied shadcn tests.

The actual React dependency is `@base-ui/react` 1.6.0, immutable Base UI commit `b34551d644f2e58ebf8fc1050d949f6654ceca6c`. [The separate source manifest](../tests/reference/base-separator-1.6/sources.json) retains ten raw source/test/helper files and MIT notice. `Separator.test.tsx` has two ordinary declarations, expanded into three cases: visible separator role and horizontal/vertical ARIA orientation. Four shared conformance helpers contain fifteen declarations. [The paired port](../tests/dom/base-separator-1.6-conformance.test.ts) executes six ordinary and thirty helper cases against actual React 1.6 and raw Svelte Base. Ordered helper declaration bodies and assertions are unchanged after test-infrastructure import adaptation; ordinary JSX/render/screen infrastructure is adapted while original expect calls remain unchanged. React element/ref/clone infrastructure becomes native Svelte snippets, symbol attachments and bindable refs in the test harness. These are primitive checks, not styled-wrapper or React API equivalence credit.

[Provenance checks](../scripts/tests/separator-provenance.test.mjs) enforce immutable bytes, all fifteen unchanged helper bodies, original ordinary assertions and all four exact source gallery function bodies in the React comparator. Separate [styled DOM tests](../tests/dom/separator.test.ts), [SSR comparison](../scripts/check-separator-ssr.mjs), [native public types](../tests/separator-types.ts), [browser tests](../tests/browser/separator.spec.ts) and [fresh consumers](../tests/installation/separator.spec.ts) cover the exercised native API, source classes, caller precedence, callback limit, snippets, lifecycle and hydration.

All four actual source compositions—Horizontal, Vertical, Vertical Menu and In List—now have their actual dependency closure: Separator plus landed Example/ExampleWrapper. [The native gallery](../apps/docs/examples/base/SeparatorExample.svelte) translates those four functions to snippets; [the React comparator](../tests/reference/SeparatorGallery.tsx) retains all four bodies unchanged. `/separator` and `/separator-reference` display them; `/separator-probe` and its reference contain explicitly supplemental witnesses.

## Framework adaptations and remaining gates

React className/object CSS/children/ref/synthetic events become Svelte class/CSS strings/snippets/bindable refs or symbol attachments/native events. Named `SeparatorProps`/`SeparatorState` exports are local convenience APIs; upstream styled source exports only the component. Root/subpath declarations and fresh archive/source-copy consumers cover these additions. Existing framework substitution categories apply where exposed; a particular new Separator-specific acceptance decision is not recorded. PM implementation authorization and eventual landing remain separate from such acceptance.

The locked Base commit is `d889e75bedfee9174c3b36d16fe8a9fb2d2a66d3`, archive SHA-256 `cc6bcbdf39f661f49f098c6126620e9ac8c755adbf83ff6231c56501da6d4234`; Base's underlying 1.8 source pin is `47b40521eab921c2756bf9bdb0b0f07fbfdb8c8c`. The genuine 1.6 tests do not establish all inherited cross-version behavior. No Base repository or dependency pin changes are part of this slice.

Final exact-head full verification, both fresh archive/source-copy type/SSR/client/browser phases, secured hosted checks, independent review, actual configured automatic review or verified quota exhaustion, PM SHA approval, owner guarded merge and post-merge checks remain required. Initial local source ports executed 36/36 genuine paired cases; wrapper execution and source-derived assertions provide bounded evidence only. Whole-library parity, live assistive-technology acceptance, unrelated components and production readiness remain incomplete. Nothing is released or deployed.
