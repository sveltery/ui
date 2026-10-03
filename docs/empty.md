# Experimental native Empty

This bounded Svelte 5 slice follows [shadcn Empty at `d75a96ab781f3d659be1ad287347d5887ce9f2fc`](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/empty.tsx) and the pinned Nova Empty section, lines 585–616. Import `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription` and `EmptyContent` from `@sveltery/ui/empty` or the package root. All six render native divs; no Base primitive or new dependency is introduced. The package remains private and unpublished, with whole-library parity and production readiness blocked.

```svelte
<script lang="ts">
  import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from '@sveltery/ui/empty';
</script>
<Empty>
  <EmptyHeader>
    <EmptyTitle>No saved notes</EmptyTitle>
    <EmptyDescription>Create a note to get started.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><a href="#create">Create a note</a></EmptyContent>
</Empty>
```

This is a supplemental usage composition, not a port of an upstream gallery function. The wrappers add no heading, live-region, navigation, focus or action behavior. Consumers supply appropriate native semantics and interactive children.

## Native contract and framework adaptations

`EmptyMedia` alone accepts `variant`: omitted or explicitly undefined selects `default`, `icon` selects icon styling, and explicit null removes the variant class and `data-variant`. Its actual slot is **`empty-icon`**, despite the component's name. Caller props override or omit the default `data-slot` and media `data-variant`, following the pinned spread order. Class merging retains the exact source tokens and applies caller conflicts last through the existing CVA and pinned `cn` 0.2.2 dependencies. No media variant utility is publicly exported by either implementation.

`EmptyDescription` preserves the pinned **div host**, even though React annotates `React.ComponentProps<"p">`. Local attributes, event targets and refs use `HTMLDivElement` to describe that actual host. This is a framework typing adaptation, without changing the rendered element or claiming React paragraph-ref equivalence. Direct child links receive the pinned underline/hover rules; nested links do not acquire those direct-child styles. The Nova icon variant's nested SVG selectors remain styling rules; the wrapper supplies no icon.

React `className`, object CSS, children, refs and synthetic events become Svelte `class`, CSS strings, optional snippets, bindable refs/symbol attachments and native event handlers. Named native props types are exported for all six parts. Refs can start undefined or null, receive the actual div after mounting and clear to null on removal. Attachments forward through native rest props and clean up on replacement/removal. These Svelte API assertions earn no React parity credit. There is no custom host/render API, class callback API or extra size/role behavior.

## Deferred gallery scope

All six functions in the [complete pinned gallery](../tests/reference/empty-example.tsx) remain unimplemented and receive no original gallery composition credit. Their historical icon blocker was removed by [public icon PR #33](https://github.com/sveltery/ui/pull/33), and the genuine [Example helpers](example.md) landed in [PR #28](https://github.com/sveltery/ui/pull/28).

| Original function | Current prerequisite status |
| --- | --- |
| EmptyBasic, EmptyWithMutedBackground, EmptyWithIcon, EmptyInCard | Example, Empty parts, Button and IconPlaceholder are available for genuine composition migration. Despite its name, EmptyInCard uses no Card component. |
| EmptyWithBorder, EmptyWithMutedBackgroundAlt | Still require missing styled InputGroup/InputGroupInput/InputGroupAddon. Kbd and icons are available; no stand-in is supplied. |

Basic, With Muted Background and In Card render Button as a native anchor with `nativeButton={false}`. The consumed [Base pin](base-pin-upgrade.md) supports Button's render snippet, supplying merged props, state and children; styled Button forwards that API. A migration must preserve those props/children and symbol attachments on the actual anchor, rather than replace Button with an unstyled link. This existing native API is not Next Link and establishes no full React/Base API equivalence or acceptance of a new gallery adaptation. No icon replacement, omitted-icon gallery or completed example is supplied. Supplemental native SVG and link witnesses exercise selectors only and earn no gallery composition coverage.

## Evidence and gates

The [source manifest](../tests/reference/empty-sources.json) records byte-exact wrapper, full example and scoped Nova hashes. [Provenance checks](../scripts/tests/empty-provenance.test.mjs) enforce source integrity, CSS inclusion and MIT credit. [DOM tests](../tests/dom/empty.test.ts), [paired SSR](../scripts/check-empty-ssr.mjs), [secured browser probes](../tests/browser/empty.spec.ts), [public types](../tests/empty-types.ts) and [fresh consumer cases](../tests/installation/empty.spec.ts) are local source-derived evidence. They are not copied upstream test ports; no dedicated upstream Empty test file has been identified for this slice.

`/empty-probe` and `/empty-probe-reference` run supplemental native compositions in Svelte and the unchanged pinned React wrappers. They cover native hosts/slots/classes, media variants and spread precedence, light Nova styles at desktop/mobile widths, SVG/link selectors, actual SSR host identity through hydration and trusted native interactive children. Svelte lifecycle probes additionally exercise reactive props/snippets, initially undefined/null refs and attachment replacement/removal cleanup. Full gallery, dark palettes, Firefox/WebKit and live assistive technology remain unimplemented or untested.

Run `bash scripts/bootstrap.sh`, `bash scripts/verify.sh`, `bash scripts/check-installation.sh`, `pnpm test:browser` and `bash scripts/check-installation.sh --browser`. Both fresh archive/source-copy modes must consume the same source/CSS with sandboxed Chromium and zero retries, preserving existing regressions. See [installation](installation.md). Independent GPT-6.1 Sol high review and configured automatic review must cover the final head; the user's quota-exhaustion exception waives only automatic review when exhaustion is actually reported.

The independent starting base is verified main `b0796909c2cb77aa1e6b8574cb15553ddc9ac397`, including AspectRatio, SkeletonCard, Label, Table and Card. Alert PR 21 is outside this work and will not be merged or bypassed here. Shared integration additions preserve any subsequently landed Alert checkpoint. Checks and review establish eligibility only for their exact head; post-merge CI and Documentation require separate verification. Framework typing/API substitutions and decision status are recorded in [upstream differences](upstream-differences.md).

The initial [PR #22](https://github.com/sveltery/ui/pull/22) checkpoint `fa76849165d28cb61c69a38cb3cc6a559cb1009a` passed local bootstrap/full verification: 19 source/toolchain assertions, 213 DOM cases (33 Empty), 37 paired Empty SSR wrapper cases and 11 supplemental paired probe hosts, zero type diagnostics, lint, SSR/client builds and isolated tarball runtime/exports/declarations/types/CSS/notices. All four fresh consumer type/build phases passed. CSS object/string serialization spacing is compared through parsed CSS, while tags, non-style attributes and aggregate host text are compared exactly. Local official Chromium download returned HTTP 403, and system Chromium aborted at its misconfigured setuid sandbox helper before interaction. These are blocked executions, not browser evidence; sandbox settings remain enabled. Hosted gates and independent/configured review must cover the final changed head.

The first final-head [CI run 37049505312](https://github.com/sveltery/ui/actions/runs/37049505312) at `b37bb0bb108bf4c689c1314f5552f0d72bf99ea9` passed Standards/Verification and 98 secured main browser cases, including Empty's six-host lifecycle and paired SSR identity tests. Four supplemental width/class-context comparisons failed only at the link x coordinates by 1/64 pixel; attributes, exact text and other measured styles/geometry matched. Fresh consumer browsers were skipped by that failure and have no clearance from this run. The React probe emitted three leading text nodes (Initial, space, index) while Svelte emitted one; the supplemental probes now supply one identical text expression. Hydratable paired SSR checks retain an explicit text-node witness. Exact geometry assertions and all wrapper/CSS behavior remain unchanged; fresh hosted execution must establish whether the fixture correction resolves the offset. This historical result does not establish final-head browser eligibility.

The repaired implementation checkpoint `681ca3e11026a2e02f1dc4965c1d2b69debb623f` passed [CI 37050272626](https://github.com/sveltery/ui/actions/runs/37050272626) and [Documentation 37050272631](https://github.com/sveltery/ui/actions/runs/37050272631): 213 DOM cases, all paired SSR/public/package checks, **102 secured main browser cases**, then 18 documented plus 10 remote-field cases in each fresh archive/source-copy mode. Sandbox remained enabled and retries were zero. All six Empty main browser cases, including exact desktop/mobile geometry and supplemental class contexts, passed. Independent GPT-6.1 Sol high review approved that exact head with no findings. The ready-triggered [automatic review result](https://github.com/sveltery/ui/pull/22#issuecomment-5959054503) reported actual quota exhaustion at 18:45:01 UTC on 2026-10-02; the user's explicit exception waives automatic review only, with no completed automatic review claimed. These results certify that implementation checkpoint. The subsequent documentation revision still requires its own exact-head checks/review before merge, and post-merge CI/Documentation must certify the actual merge SHA. [PR #22](https://github.com/sveltery/ui/pull/22) records current eligibility and landing results.
