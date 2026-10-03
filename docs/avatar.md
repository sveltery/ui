# Avatar source port

This proposed bounded port implements the six original styled exports and the seven original gallery functions at shadcn `d75a96ab781f3d659be1ad287347d5887ce9f2fc`. Full API parity, native browser/fresh delivery acceptance and landing are not established by this proposal. The genuine optional `delay={0}` contract remains blocked by the consumed Base version difference below.

## Original implementation mapping

The complete [wrapper](../tests/reference/avatar.tsx) and [gallery](../tests/reference/avatar-example.tsx) retain their immutable bytes and [source provenance](../tests/reference/avatar-sources.json). Native files split the original TSX module into six Svelte components and a type/barrel module; state machines remain entirely in the frozen Base dependency `f884f3bb265485ef8e422e43a75eb3055db11fab`. No UI image loader, observer, timer, cache or presence controller is introduced.

| Original export | Native correspondence | Composition, defaults and spread precedence |
| --- | --- | --- |
| Avatar | Base Avatar.Root, span | Original full cn string; default/sm/lg size, default size only when omitted/undefined; data-slot and data-size before caller spread. |
| AvatarImage | Base Avatar.Image, img | Original aspect-square/size-full/object-cover string; source, alt, responsive image props, callback, render and refs forwarded to Base. |
| AvatarFallback | Base Avatar.Fallback, span | Original full flex/text and parent small-size selector string; delay and loading presence delegated unchanged to Base. |
| AvatarBadge | Native span | All four original cn string arguments, exact size-dependent SVG branches; no status/count controller. |
| AvatarGroup | Native div | Original direct-avatar ring and negative spacing selectors; literal children and caller props. |
| AvatarGroupCount | Native div | Original class string and literal empty-string cn argument; literal count/icon children, no inferred count. |

All six wrappers use genuine `cn` 0.2.2 directly. The source-advertised primitive function class is ignored by original cn; the Button-specific callback extension is not inherited. Native class/snippets/events/CSS-string/bindable refs and symbol attachments translate React className/children/synthetic events/object styles/ref. Original primitive/native hosts, branches, literal cn arguments and rightmost caller prop spread remain recognizable. Named native types and package/root subpaths are distribution conveniences with no specific new API acceptance recorded.

The actual seven gallery bodies translate to Svelte snippets in the original order: Sizes, Badge, Badge with Icon, Group, Group with Count, Group with Icon Count, In Empty. They retain the plain ExampleWrapper, canonical Example, all six genuine Empty leaves, genuine Button and canonical IconPlaceholder with actual five-library Plus/Check mappings. Original GitHub image URLs, alt text, grayscale classes, literal +3 and text remain unchanged. The runnable React reference changes module import paths only; every function body remains byte-exact. Original Next/nuqs resolved-configuration lifecycle is still outside this helper adaptation.

Five exact original Avatar CSS blocks are added to the historical unscoped Nova input and all eight generated scoped current-family projections. Prior sections, full original globals, genuine shadcn 4.21.1 support CSS and complete eight original styles remain authenticated. The independent React document executes that full original environment; production retains its separately recorded scope/reset/radius adaptation. This addition does not establish whole-library or full-theme parity.

## Required checks and provenance

New wrapper/gallery/SSR/DOM/types/lifecycle/layout/delivery checks are authored source-derived supplements. The exhaustive immutable source inventory has 133 executable sources and six snapshots but no dedicated ordinary styled Avatar runtime suite. This slice earns zero copied ordinary shadcn runtime-test or unchanged-original-fixture test credit; genuine original bodies are reference executions. Existing Base tests have separate dependency provenance.

Initial meaningful failure-first checks passed fixture integrity and failed the absent wrappers and Avatar CSS. Subsequent local SSR comparison executes 24 wrapper/default/spread/static-cn cases and all seven genuine fallback-state source trees: 183 independently derived original native hosts, 48 Root, 48 Fallback, zero Image, 12 Badge, 10 Group and seven GroupCount. Loading/loaded/error trees must be counted independently; static source calls are not simultaneous loaded-plus-fallback host counts. Local SSR success does not establish secured native or delivery acceptance.

All existing gates remain: frozen archive/lock checks, lint, types, full DOM and SSR/client builds, package exports/declarations, all four fresh documented/experimental archive/source-copy type/build phases, real Chromium/Firefox/WebKit main and fresh suites with sandbox, one worker and zero retries. Exact-head independent source/composition/full CSS/runtime review, current configured review or a freshly authenticated PM quota exception, PM approval, owning-developer expected-head merge and exact post-merge checks precede completion. Strict Input draft failures and the known native Textarea diagnostic receive no Avatar credit.

## Blocked version/API contracts

The genuine original uses React Base 1.6.0; the consumed primitive follows Base 1.8.0. Development references use React/ReactDOM 19.3.0 rather than original 19.2.3. No complete cross-version equivalence is claimed.

Independent genuine SSR execution shows original 1.6 omitted Fallback delay visible, but explicit delay=0 absent; consumed f884 omitted and explicit zero both visible. Positive one and negative one are absent in both SSR outputs. The wrapper passes the original delay prop through unchanged and preserves this concrete unsupported contract as blocked/unaccepted. No UI timer shim, silent delay removal, changed original expectation or Base mutation resolves it. All seven selected original galleries omit delay and therefore do not certify explicit zero behavior.

Original Image1.6 has no keepMounted API. The native original-facing type omits that Base1.8 extension; no paired invented original keepMounted case earns parity. Base1.8's default empty alt, rendered-source attribute observer and detached cached-hydration sampling remain explicit inherited limits requiring separate characterization; all original gallery images pass explicit alt and detached default mode. Base AV-01 imperative-source invalidation and cached hydration timing have no separately recorded acceptance. Original render/snippet/ref, callback ordering, stale completion, cleanup and real image decode need actual source-bound evidence. Full OS assistive technology, application URL/preset/fonts configuration and release readiness remain incomplete.
