# Experimental Button

## Landed direct remote submitter gates

The isolated [remote-field fixture](../apps/docs/remote-fields-fixture/src/routes/+page.svelte) spreads actual Kit 2.70.3 `fields.*.as('submit', value)` attributes directly onto native, public Base and public UI Buttons. Typed assignments use the published component props, not casts or consumer field adapters. The [HTTP/SSR check](../scripts/check-remote-fields.mjs) submits all three through genuine remote-form actions; [secured main browser cases](../tests/browser/remote-fields.spec.ts) and [fresh archive/source-copy cases](../tests/installation/remote-fields.spec.ts) assert trusted activation, exact FormData/server submitter values, switching submitters, defaults/reset, validation and progressive enhancement.

Fresh consumers first type-check, build and exercise the documented scaffold without experimental substitutions, then run the remote fixture as a second phase. The explicit-reset fixture uses pinned Kit's tick/prototype-reset behavior and retains parsed-result assertions, including a reset-control ID shadowing regression. The remote-field test scope preserves Svelte 5.57.1, Kit 2.70.3, the Base pin and Button implementation at its starting checkpoint. The separate landed Base pin/ref adaptation below changes the archive and ref initialization, without adding a field adapter. Remote-function/async compiler opt-ins are test-only, with no Bits or new dependency. These framework integration tests do not establish additional pinned React parity or production readiness. [PR #12](https://github.com/sveltery/ui/pull/12) landed as main `dcabf10d1e85681fcb29cf9f39e983a5a539ba28` after exact-head hosted browser checks and independent/configured automatic reviews passed; the [compatibility record](upstream-differences.md#landed-direct-remote-field-test-scope) gives the runs. Later changes need their own final-head gates.

A bounded styled Svelte 5 Button built on the [Base Button](https://github.com/sveltery/base/pull/17), with the current checkout pinned at `400ab42408f276824be7fe17250ed44bd01fd260`. The original Button slice used historical Base `4dd04e495fc9f5bb6a0bb872fe103563d49535b1`. UI delegates native/custom activation, disabled guards, forms, events, render composition and refs to Base. It adds the [shadcn Button](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/button.tsx) variant/size classes and scoped Nova CSS. This is private and unpublished; no whole-library parity or production-readiness claim follows from these tests.

Build the current checked-out UI slice with `bash scripts/bootstrap.sh` and `source scripts/toolchain.sh; pnpm --filter @sveltery/ui build`. The verified Base archive SHA-256 is `fae93c0aa896b09f58dfcb5e1580ac6293b489994cd4556c90f1e77abaa197e7`. Follow the [installation scaffold](installation.md) for local archive consumption and Tailwind integration, using archives built from the same exact reviewed checkout selected in that guide for Button. Keep your UI SHA, archive checksums and consumer lockfile. Runtime dependencies now also include `class-variance-authority` 0.7.1. For source copies, copy the `button` directory together with `shared/classes.js`, add that dependency, scan the copied `ui` directory with Tailwind so both sibling source paths are included and retain the [MIT notices](../packages/ui/THIRD_PARTY_NOTICES.md).

The landed pin/ref update accepts `let ref = $state<HTMLButtonElement>();` with `bind:ref`: the actual native or replacement host is published on attachment and null on cleanup. Previously the UI wrapper's `$bindable(null)` rejected an initially undefined bound ref before forwarding to Base; `$bindable()` removes that restriction. An omitted or unattached ref can now remain undefined instead of acquiring an implicit null value. This is an approved intentional Svelte API relaxation, not React ref syntax equivalence; replacement snippets must still spread the supplied attachment props. [Public wrapper regressions](../tests/dom/base-pin.test.ts), [SSR/hydration and lifecycle browser cases](../tests/browser/base-pin-cases.ts) and [archive/source-copy cases](../tests/installation/base-pin.spec.ts) preserve host identity, bindings and cleanup. The [landed pin decision/evidence](upstream-differences.md#landed-base-pin-and-native-ref-adaptation) records final-head gates.

Import `Button`, `buttonVariants`, `variants` and `sizes` from `@sveltery/ui/button` or the root. `ButtonProps`, `ButtonState` and `ButtonVariants` are exported types. `buttonVariants` produces class tokens for composition; it supplies no interactive behavior.

| Prop | Values / behavior |
| --- | --- |
| `variant` | `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`; default `default` |
| `size` | `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`; default `default` |
| `disabled` | Native disabled for an ordinary button; suppresses Base activation handlers |
| `focusableWhenDisabled` | Keeps a disabled host in the Tab order, exposes `aria-disabled`, suppresses activation and form submission/reset |
| `nativeButton` | Default `true`; set `false` when a render snippet uses an anchor or custom host |
| `class`, `style` | Svelte class/CSS string or state callback; UI merges classes with `clsx` and `tailwind-merge` before Base evaluates them |
| `render`, `children`, `ref` | Base Svelte snippets, forwarded attachments and bindable DOM ref |
| `type`, `name`, `value`, `form`, native handlers | Forwarded to Base; omitted `type` becomes `button`; explicitly supplied `undefined`/`null` removes the attribute and restores the browser's submit default |

Explicit `null` variant/size omits its style class, as pinned CVA does. Styling variants describe appearance: `variant="link"` remains a native button unless you supply an anchor render. Label icon-only controls with `aria-label`; decorative SVGs need `aria-hidden="true"`.

```svelte
<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  let saved = $state(false);
</script>
<form onsubmit={event => { event.preventDefault(); saved = true; }}>
  <Button type="submit">Save preferences</Button>
  <Button variant="outline" disabled>Unavailable</Button>
</form>
<p aria-live="polite">{saved ? 'Preferences saved locally' : 'Ready'}</p>
```

For a custom host, spread all snippet props (including symbol attachments), render its children and set `nativeButton={false}`. Use Base `mergeProps` when composing handlers/classes; later render handlers run first (including on disabled custom hosts) and can call `preventBaseUIHandler()` to stop Base activation/consumer callbacks. `preventDefault()` cancels browser defaults. These channels differ; cancel non-native Space on keyup when needed. DOM native events replace React synthetic events, `class` replaces `className`, snippets replace React `render` elements, and `bind:ref` replaces callback refs. There is no `asChild` or React slot API. The Svelte state callback for `class` is supported deliberately rather than being flattened through the pinned React wrapper's CVA call.

Nova remains Tailwind input CSS. Along with the existing Dialog tokens, Button requires `primary`, `primary-foreground`, `secondary`, and `secondary-foreground` theme mappings; the [workspace theme](../apps/docs/src/lib/theme.css) and installation scaffold include these light values. The pinned CSS uses native `disabled:` opacity/pointer rules. Focusable-disabled and custom disabled hosts retain pointer hit testing and hover, with activation suppressed by Base; they expose `data-disabled`/`aria-disabled` rather than native `disabled`, so their opacity is unchanged. A supplied dark palette, other Nova components, theming tooling and further styling adaptations remain outside this slice.

## Evidence and limits

[Source hashes](../tests/reference/button-sources.json) identify the byte-exact pinned wrapper and Button-only Nova CSS (upstream lines 149–207). The API matrix executes all 48 variant/size combinations against the actual reference `buttonVariants`; nullable/default/class behavior is checked separately. The test-first style-free baseline failed 50 assertions and passed 16 Base behavior companions before UI styling was added. This is executable supplemental evidence, not a ported shadcn test inventory or new Base parity credit.

DOM companions retain the [Base UI MIT notice](../tests/reference/BASE_BUTTON_LICENSE) and preserve Base Button assertion provenance without reimplementing it. Browser tests exercise trusted pointer/keyboard activation, forms, disabled/focusable-disabled states, cancellation, refs, hydration and mobile/desktop computed-style comparisons to the pinned React wrapper. Fresh archive and source-copy SvelteKit consumers exercise both Button and unchanged Dialog. SSR tarball checks compile public types and verify root/subpath exports, notices and CSS. The reference uses the workspace's pinned `@base-ui/react` 1.6.0; Base's behavior provenance is its separately reviewed v1.8.0 adaptation, so the UI comparison establishes only selected Nova styles and listed API assertions.

Run `bash scripts/verify.sh`, `bash scripts/check-installation.sh`, `pnpm test:browser` and `bash scripts/check-installation.sh --browser` after bootstrap. Secured hosted Chromium, independent GPT-6.1 Sol high review and completed automatic review must cover the final head. Parent coordinates readiness and merge; this PR remains draft. Firefox/WebKit, composite navigation, all shared conformance tests, dark palette validation and full shadcn/Base UI API parity remain unclaimed.

The first hosted checkpoint `9515eb8b239491cc425530538a3898011c852767` passed Verification and 38/41 secured browser cases, including both Nova matrices and all retained Dialog cases ([run](https://github.com/sveltery/ui/actions/runs/36918477467)). Three new supplemental assertions assumed that hash-link navigation retained focus for a subsequent Space press and that disabled Base guards suppressed earlier render handlers. The corrected tests refocus the link before a separate trusted Space activation, assert each activation count, and distinguish render handlers from suppressed Base consumer callbacks; no runtime shim or preserved Dialog assertion changed. Standards separately exposed an upstream section separator blank at EOF; the scoped reference now ends at source line 207 with its rules unchanged and hash updated.

Independent exact-head review identified a P2: wrapping absent children supplied a truthy snippet and erased custom render fallback labels. A new DOM regression failed before correction (17 passing / 1 failing). The wrapper now forwards `children` directly, preserving Base's omitted/present distinction; packaged SSR and fresh consumer browser checks also require the fallback accessible label. Both reviews and hosted gates must be repeated on the corrected final head; their exact evidence belongs in the PR.

See the [upstream differences register](upstream-differences.md) for the inherited disabled chorded-mousedown correction, class-callback adaptation and Nova focusable-disabled styling limit. UI’s 1.6.0 reference does not establish all Base 1.8.0 inherited behavior.
