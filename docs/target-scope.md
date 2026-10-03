# Current target selection

The user selected Sveltery Base as the primitive layer on **2 October 2026 (Pacific time)**. Delivery uses the pinned shadcn Base styling and composition for **Toast, Combobox and Drawer**, with the corresponding Sveltery Base primitives. The separate Command and Sonner entries are excluded from current delivery. No Sonner, cmdk or Vaul port is required by this selection.

This is a product selection over the immutable [source catalog](catalog.md), whose 62 original entries remain recorded in [catalog.json](catalog.json). Excluded entries are outside current scope, not implemented or completed. All other selected families retain their previous scope, source/test provenance and readiness gates. No implementation, package dependency, source pin or test expectation changes with this document.

## Selected originals and exclusions

| Original entry | Current selection | Pinned implementation and remaining work |
| --- | --- | --- |
| [Toast](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/toast.tsx) | Selected | Uses `@base-ui/react/toast`. The styled native wrapper remains unimplemented; the locked Base Toast module is bounded and needs the documented manager API adaptation and lifecycle/swipe review. |
| [Combobox](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/combobox.tsx) | Selected | Uses Base Combobox, Button, InputGroup and IconPlaceholder. The locked Base package lacks Combobox; the native wrapper and its InputGroup composition remain unimplemented. It does not import cmdk. |
| [Drawer](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/drawer.tsx) | Selected | Uses `@base-ui/react/drawer`. The locked Base package lacks Drawer and the native styled wrapper remains unimplemented. Vaul is unnecessary for this original. |
| [Command](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/command.tsx) | Excluded from current delivery | The separate original imports cmdk and exports nine Command components. Its source records remain intact; excluding it gives no implementation or test credit. |
| [Sonner](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/sonner.tsx) | Excluded from current delivery | The alternative Toaster imports `sonner` and `next-themes`. Preserve its historical source and dependency records without requiring a native Sonner port. |

The selected Combobox is its own pinned component, not an implementation of the excluded Command exports. No Command facade, substitute command engine or new behavior mapping is introduced. A future decision to expose such a facade would need an explicit source/composition contract and independent acceptance.

## Authenticated upstream distinction

The [Base Toast documentation](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/content/docs/components/base/toast.mdx) describes the Base-backed Toast. [Radix Toast](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/content/docs/components/radix/toast.mdx) and [React Aria Toast](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/content/docs/components/aria/toast.mdx) instead explicitly deprecate Toast in favor of Sonner. Those sibling selections do not change this project's Base Toast target. The [Base Drawer migration guide](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/content/docs/components/base/drawer.mdx#migrating-from-vaul) replaces Vaul with Base Drawer.

The separate [Base Command documentation](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/content/docs/components/base/command.mdx) still documents cmdk, whereas [Base Combobox](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/content/docs/components/base/combobox.mdx) documents the Base primitive. The five wrapper implementations above, compared component documentation and [registry metadata](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/bases/base/ui/_registry.ts) match official repository main `295a1f114a138f23b5dfee0e0c6812394dfeb90c`, observed read-only. The source pin remains `d75a96ab781f3d659be1ad287347d5887ce9f2fc`; this comparison does not advance it. Direct website requests were blocked by the session proxy, so this evidence authenticates repository content, not a deployed website revision.

## Remaining dependencies and acceptance

Choosing Base does not remove the React-specific engines of other selected originals: Calendar/react-day-picker, Carousel/embla-carousel-react, Chart/recharts, InputOTP/input-otp, Resizable/react-resizable-panels and the MessageScroller/Questionnaire cores from `@shadcn/react` remain separate work. Sidebar's native hook adaptation and the existing icon/helper, CSS and source-copy/package requirements also remain. Framework-agnostic dependencies can be reused where their pinned source contracts permit it; React bindings still need a genuine Svelte solution.

Keep historical raw-source imports and test inventories separate from this current selection. Source fidelity, exact-head independent/configured review, passing checks and the [readiness gates](readiness.md) continue to apply to each selected implementation. This documentation establishes no new native parity, full API equivalence, live assistive-technology acceptance or release readiness.
