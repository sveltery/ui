# Experimental Dialog API

Import `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, and `DialogDescription` from `@sveltery/ui` or `@sveltery/ui/dialog`. Components forward native props, symbol attachments, and supported Base props. Primitive wrappers relay `render` snippets, children and `bind:ref` to Base. Root relays `bind:actions` and exposes `close()` / `unmount()` through `bind:this`.

`DialogContent` owns its Portal, Overlay and Popup; its `showCloseButton` defaults to true. `DialogFooter` defaults to false. Built-in closes style Base's existing native Close button with the upstream ghost/icon-sm or outline/default classes. The package also exports a standalone `Button` and `buttonVariants` with bounded variants/sizes; see [Button API](button.md). The built-in Dialog closes still wrap Base Close directly. The X glyph is a native SVG adaptation of upstream's configurable icon placeholder.

| React source API | Bounded Svelte adaptation |
| --- | --- |
| children | Svelte snippet |
| className | `class`; primitive wrappers support Base state callbacks |
| render element or function | Base `render(props, state, children)` snippet; spread all props, including attachment symbols, and render the supplied children |
| DOM ref | `bind:ref`; attachment cleanup clears primitive refs |
| actionsRef | `bind:actions`, or Root `bind:this` methods |
| synthetic events | Native lowercase Svelte event props; Base `preventBaseUIHandler()` is distinct from native `preventDefault()` |
| CSS style object | CSS string or primitive state callback returning a string; object styles remain unsupported |
| header/footer div | Native Svelte div, native props/attachments/children and `bind:ref`; custom render/state callback conformance is not promised for these layout divs |
| Root data-slot | No Root DOM element; no new wrapper element is inserted |
| generated IDs | Base's Svelte `$props.id()` values; relationships rather than React ID bytes are preserved |

Replacement snippets must retain the supplied child snippet to preserve Content/Footer built-in closes. Use Base `mergeProps` when adding replacement-native handlers so cancellation/composition survives. Portal produces no server DOM and mounts its content after hydration. Base remains a partial eight-part implementation: Viewport, detached handles/payloads, shared full render/ref conformance, broad nested/cross-component behavior and many upstream variants remain outside this slice.

Trigger, Close, Title, Description and Overlay forward the original child snippet directly: omitted children remain `undefined`, supplied children remain renderable, and an explicitly empty snippet remains supplied. A custom render snippet can therefore distinguish absence from emptiness and supply its own fallback label, as pinned Base and the pinned React wrapper do. Content keeps its composed snippet because it owns built-in close content. Header/Footer accept an initially undefined or null bound native div ref, assign the actual host after mounting and clear it to null on removal. These local repairs are covered by [paired Base/UI DOM regressions](../tests/dom/dialog-forwarding.test.ts) and the [SSR/hydration browser probe](../tests/browser/dialog-forwarding.spec.ts). They do not change inherited Base primitive ref initialization; that separate limitation remains outside this patch.

The [SvelteKit installation guide](installation.md) covers local archives, source copying, Tailwind 4.3 source scanning, `tw-animate-css` 1.4.0 and Nova theme tokens. The [fixture theme](../apps/docs/src/lib/theme.css) is the workspace integration. Styles are the scoped Nova Dialog and native close subset; screenshots compare the exercised example only.

Registry wrappers share the unchanged [class-merging helper](../apps/docs/registry/bases/base/ui/shared/classes.js) with Button and Textarea. Source copies must retain the sibling `shared` directory and scan the whole copied UI directory, including the native close class tokens. The package build already includes and scans that registry tree; no new runtime dependency or class-normalization behavior is introduced.

The [Dialog example](../apps/docs/examples/base/DialogExample.svelte) uses a block-local `{const resolvedTriggerId = $derived(...)}` to keep Root and Trigger IDs synchronized with scenario changes, and native conditional `{@attach}` for the custom content host. Owner state and refs remain outside the block, and attachment counters retain `untrack` and disposal callbacks. [Scenario-transition regressions](../tests/dom/dialog-example.test.ts) preserve cancellation, repeated completion callbacks when an open host is replaced, refs, cleanup and owner state. The [browser probes](../tests/browser/dialog.spec.ts) retain initial SSR/hydration IDs, trusted activation, attachment cleanup and animation coverage. Declaration tags require Svelte 5.56 and attachments 5.29; the installed and declared minimum Svelte versions are 5.57.1. See the [official declaration](https://svelte.dev/docs/svelte/declaration-tags) and [attachment](https://svelte.dev/docs/svelte/@attach) contracts.

The React reference uses `@base-ui/react` 1.6.0, matching shadcn's package manifest at the pinned commit, with React 19.3.0 fixture tooling. Sveltery Base's own behavior reference is separately pinned to Base UI 1.8.0. This difference is explicit and neither visual agreement nor the local probes certify complete behavior parity across those versions.

Base's corrected native focus discovery retains two pinned upstream limits: its helper normalizes even explicit negative tabindex values for details, media and editable candidates; Chromium can reach an implicit summary through native Tab, but reverse wrapping cannot programmatically focus its details element and leaves Base's owned before guard focused. The native UI regressions exercise an explicit summary and empty/plaintext-only editable values; they do not establish broad embedded/media, implicit-summary reverse-focus or live VoiceOver conformance. See [Base PR #15](https://github.com/sveltery/base/pull/15) for the paired evidence and limits.

See the [upstream differences register](upstream-differences.md) for inherited canceled-close deferral and nonmodal ShadowRoot exit corrections, with Base 1.8.0 evidence kept separate from UI’s React 1.6.0 fixture.
