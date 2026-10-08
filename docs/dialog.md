# Experimental Dialog API

Import `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, and `DialogDescription` from `@sveltery/ui` or `@sveltery/ui/dialog`. Components forward native props, symbol attachments and supported Base props to the `Dialog` namespace of Base `ea4e108e14ae8a73140bb7a360bc32454b19da4a`. Base parts have no refs: pass `{@attach}` to reach a host. Root relays `bind:open`, `bind:triggerId` and the `close()`/`unmount()` methods through `bind:this`. See the [Base restart adoption](upstream-differences.md#proposed-base-restart-adoption).

`DialogContent` owns its Portal, Overlay and Popup; its `showCloseButton` defaults to true. `DialogFooter` defaults to false. Built-in closes render Base Close through the canonical [Button](button.md): ghost/icon-sm with `cn-dialog-close` for Content, outline/default for Footer. Content uses the canonical [IconPlaceholder](icons.md) with the original five X names and the original screen-reader Close span. Both compositions produce one native button, retaining Content's `dialog-close` slot and Footer's default `button` slot. The [composition source map](dialog-composition.md) records the proposed fidelity repair, required checks and unchanged historical limits.

The built-in closes spread Base Close's render props onto the canonical Button. Base ea4e108e supplies `tabindex: 0` itself, so the earlier undefined-`tabindex` omission is gone.

| React source API | Bounded Svelte adaptation |
| --- | --- |
| children | Svelte snippet |
| className | `class` (native class values; Base ea4e108e has no state callbacks) |
| render element or function | Base `render(props, state, children)` snippet; spread all props, including attachment symbols, and render the supplied children |
| DOM ref | `{@attach}` on the part; Base ea4e108e has no `ref` prop |
| actionsRef | Root `bind:this` methods `close()` and `unmount()` |
| synthetic events | Native lowercase Svelte event props; a consumer handler skips the part's handler with `event.preventDefault()` |
| CSS style object | CSS string; object styles remain unsupported |
| header/footer div | Native Svelte div, native props/attachments/children and `bind:ref`; custom render/state callback conformance is not promised for these layout divs |
| Root data-slot | No Root DOM element; no new wrapper element is inserted |
| generated IDs | Base's Svelte `$props.id()` values; relationships rather than React ID bytes are preserved |

Replacement snippets must retain the supplied child snippet to preserve Content/Footer built-in closes. Base ea4e108e does not export `mergeProps`; when a replacement adds its own handler, call the supplied handler from it. Upstream Portal produces no server DOM and mounts its content after hydration; Base ea4e108e still renders it inline on the server (open Base gap). Base ea4e108e Portal takes host attributes and `{@attach}` (Base #159), so `DialogPortal` passes the pinned `data-slot="dialog-portal"`; Portal `render` remains an open Base gap (see the restart adoption).

Trigger, Close, Title, Description and Overlay forward the original child snippet directly. Base ea4e108e always hands Dialog render snippets a children snippet, so a render snippet can no longer tell omitted children from supplied ones; the forwarding tests assert that UI matches Base.

Historical PR #13 advanced Base to [`400ab42408f276824be7fe17250ed44bd01fd260`](https://github.com/sveltery/base/tree/400ab42408f276824be7fe17250ed44bd01fd260), incorporating the separately reviewed core ref/Portal repairs. UI Trigger, Portal, Content, Overlay, Title, Description and Close also remove their `$bindable(null)` DOM-ref fallbacks consistently with Base. Initially undefined refs remain undefined until attachment, then receive the actual host and clear to null on cleanup. Header/Footer and native Textarea already support this contract. Root's imperative `actions` fallback and `close()`/`unmount()` behavior are retained. This is an approved intentional Svelte API relaxation; the [compatibility decision](upstream-differences.md#landed-base-pin-and-native-ref-adaptation) distinguishes it from the Portal fidelity repair and records landed status.

Standalone `DialogPortal` forwards Base's `container` unchanged. Base ea4e108e takes an element or nothing (no ref objects); undefined uses the parent portal or document body. Upstream waits without a host for an explicit `null`, while Base ea4e108e treats `null` like undefined; that test stays failing until Base matches.

The [SvelteKit installation guide](installation.md) covers local archives, source copying, Tailwind 4.3 source scanning, `tw-animate-css` 1.4.0 and Nova theme tokens. The [fixture theme](../apps/docs/src/lib/theme.css) is the workspace integration. Styles are the scoped Nova Dialog and native close subset; screenshots compare the exercised example only.

The shared-helper and example simplifications landed as main `0e2c1556013ddcd8012c17cfd114c6ae7cc7872c` in [PR #11](https://github.com/sveltery/ui/pull/11); see the [exact-head validation and decision record](upstream-differences.md#organization-and-framework-validation).

Registry wrappers share the unchanged [class-merging helper](../apps/docs/registry/bases/base/ui/shared/classes.js) with Button and Textarea. Dialog source copies must also retain the sibling `button` and full `icons` directories, including generated native geometry and complete licenses, and declare genuine `class-variance-authority` 0.7.1 alongside `cn` 0.2.2 and `clsx` 2.1.1. Scan the whole copied UI directory, including Button variants and the shared class tokens. The package already ships this canonical closure; no dependency pin, CSS body or class-merging behavior changes. The [minimum-copy regression](../scripts/tests/dialog-source-copy.test.mjs) executes the actual documented scaffold/commands without the UI package or the broader harness's injected helpers/dependencies.

The [Dialog example](../apps/docs/examples/base/DialogExample.svelte) uses a block-local `{const resolvedTriggerId = $derived(...)}` to keep Root and Trigger IDs synchronized with scenario changes, and native conditional `{@attach}` for the custom content host. Owner state and refs remain outside the block, and attachment counters retain `untrack` and disposal callbacks. [Scenario-transition regressions](../tests/dom/dialog-example.test.ts) preserve cancellation, repeated completion callbacks when an open host is replaced, refs, cleanup and owner state. The [browser probes](../tests/browser/dialog.spec.ts) retain initial SSR/hydration IDs, trusted activation, attachment cleanup and animation coverage. Declaration tags require Svelte 5.56 and attachments 5.29; the installed and declared minimum Svelte versions are 5.57.1. See the [official declaration](https://svelte.dev/docs/svelte/declaration-tags) and [attachment](https://svelte.dev/docs/svelte/@attach) contracts.

The React reference uses `@base-ui/react` 1.6.0, matching shadcn's package manifest at the pinned commit, with React 19.3.0 fixture tooling. Sveltery Base's own behavior reference is separately pinned to Base UI 1.8.0. This difference is explicit and neither visual agreement nor the local probes certify complete behavior parity across those versions.

Base's corrected native focus discovery retains two pinned upstream limits: its helper normalizes even explicit negative tabindex values for details, media and editable candidates; Chromium can reach an implicit summary through native Tab, but reverse wrapping cannot programmatically focus its details element and leaves Base's owned before guard focused. The native UI regressions exercise an explicit summary and empty/plaintext-only editable values; they do not establish broad embedded/media, implicit-summary reverse-focus or live VoiceOver conformance. See [Base PR #15](https://github.com/sveltery/base/pull/15) for the paired evidence and limits.

The Base restart dropped the earlier inherited canceled-close deferral correction: a canceled close that called `preventUnmountOnClose()` now keeps the next close mounted until `unmount()`, as Base UI 1.8 does. See the [restart adoption](upstream-differences.md#proposed-base-restart-adoption).

Base `f884f3bb265485ef8e422e43a75eb3055db11fab` and its [Avatar/Accordion upgrade contract](base-pin-upgrade.md#avatar-and-accordion-prerequisite-upgrade) are historical; the current pin is Base `ea4e108e14ae8a73140bb7a360bc32454b19da4a`.
