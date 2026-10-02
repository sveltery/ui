# Modern themes and scoped styles

The immutable reference is [shadcn-ui/ui `d75a96ab781f3d659be1ad287347d5887ce9f2fc`](https://github.com/shadcn-ui/ui/tree/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry). The [source inventory and hashes](../tests/reference/themes/sources.json) retain byte-exact modern theme, base-color, style, configuration, merge and original test sources plus all eight complete original stylesheets, the original globals animation/variant dependency and legacy globals dependency. Preserve the existing [MIT notice](../packages/ui/THIRD_PARTY_NOTICES.md). Upstream legacy public HSL assets are a separate historical inventory and are not substitutes for modern OKLCH records.

## Inventory and scope

| Kind | Canonical records |
| --- | --- |
| Styles | Vega, Nova, Maia, Lyra, Mira, Luma, Sera, Rhea |
| Complete bases | Neutral, Stone, Zinc, Mauve, Olive, Mist, Taupe |
| Accent overlays | Amber, Blue, Cyan, Emerald, Fuchsia, Green, Indigo, Lime, Orange, Pink, Purple, Red, Rose, Sky, Teal, Violet, Yellow |

All 24 theme records include their exact original light/dark variables, including chart/sidebar variables. Shipping those tokens does not implement Chart or Sidebar. The eight opt-in styles retain only the current Alert, Button, Card, Dialog, Empty, Kbd, Label, Skeleton, Table and Textarea sections; AspectRatio has no component stylesheet section. [Section line ranges and hashes](../tests/reference/themes/sections.json) identify these byte-exact projections. Missing components, the complete upstream stylesheet, legacy themes, fonts, RTL/menu configuration, the full example gallery, cross-browser and live assistive-technology parity remain unimplemented or blocked. No complete library or production-readiness claim is made.

## Package and source-copy use

Follow the [pinned unpublished-archive installation](installation.md), including Tailwind 4, `tw-animate-css`, explicit source scanning and notices. These exports are Tailwind input CSS rather than standalone compiled CSS:

```css
@import "tailwindcss";
@import "@sveltery/ui/themes.css";
@import "@sveltery/ui/nova.css";
@import "@sveltery/ui/styles.css";
@source "../node_modules/@sveltery/ui/dist";
```

`themes.css` supplies Neutral defaults, all color mappings, exact class-based dark activation and the 24 opt-in `.theme-*` records. `nova.css` is the existing unscoped Nova subset, unchanged. `styles.css` imports all eight scoped subsets and registers their exact source style variants. To ship one opt-in style, replace the final import with `@import "@sveltery/ui/styles/maia.css";` (or another canonical name). Keep the default Nova import when you want the historical appearance outside selected scopes.

Set selection classes on `html` so Dialog portals inherit them:

```html
<html class="style-maia theme-zinc theme-blue dark">
```

A complete base is required before an accent: upstream merges base variables first, then the selected theme variables. Neutral is the fallback when no complete base class is supplied. Complete bases are emitted before accents so a same-root `.theme-zinc.theme-blue` applies that exact merge independent of HTML class order. Choose one complete base and at most one accent; selecting multiple bases or multiple accents has no supported precedence contract. Omit the accent to use the complete base. `.dark` selects the genuine dark record and source dark selectors; operating-system media preference alone does not select the mode. Removing `.dark` restores the selected light record. Setting classes on a subtree scopes ordinary descendants, but a body portal needs the same style/palette scope on its actual ancestors; root selection is the tested integration.

For source copy, retain `themes.css`, `styles.css` and the complete `scoped` directory beside the copied `nova.css`. Replace the three package imports with those local files and scan the copied wrappers/shared helper. The [installation guide](installation.md#components-copy-the-dialog-source-instead) executes these exact copy commands in the isolated consumer gate. Copy the assets and components from the same immutable selected UI checkout, with notices.

## Compatibility adaptations

Upstream style selection is opt-in through `.style-*`; the historical UI Nova subset is unscoped. Loading both directly would leak properties omitted by a different style, such as Nova rounding and negative footer margins into Sera. Each opt-in style first applies `all: revert-layer` to the union of the implemented fallback Nova and selected source-section class inventories, then applies its exact pinned section declarations. The union also covers Lyra's Dialog footer, which has no source style declaration and must not retain Nova's footer background/margins. This removes the old component-layer fallback within that selected scope while retaining higher-layer caller utilities, inline styles and native/framework structure. It does not reset unrelated components.

Pinned radius mappings use factors `0.6`, `0.8`, `1`, `1.4`, `1.8`, `2.2` and `2.6`. The old unscoped consumer used Tailwind defaults for small/xl radii and `radius - 2px`/`radius` for md/lg. Public mappings therefore use compatibility fallbacks and each opt-in scope defines source-derived radius aliases. Historical unscoped Nova keeps a 12px Card radius and 2px Kbd radius at the 10px Neutral base radius; explicit modern `.style-nova` uses genuine 14px/6px geometry. Other scoped styles use their own exact source classes/formulas. Default old geometry assertions remain required. Fonts and the application shell are consumer-owned, rather than ports of the entire upstream globals stylesheet.

These are explicit packaging/framework adaptations, not acceptance of every upstream scaffold or API. The [compatibility register](upstream-differences.md#modern-theme-and-scoped-style-continuation) records proposed/landed status separately from a specific maintainer acceptance decision.

## Tests and provenance

One genuine [upstream `buildThemeForPreset` test](https://github.com/shadcn-ui/ui/blob/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry/config.test.ts#L168-L191) is ported: its entire describe block, input and seven `expect` calls remain byte-exact in [the executable test](../tests/dom/themes-upstream.test.ts). Only imports point to the production asset generator's registry-independent adaptation. The complete original source and hash are retained. That test checks the Taupe/Taupe record, bold accent, large radius, registry metadata, both complete palettes and absent CSS. The original CLI, public schema, presets, fonts, dependencies and partial registry-base suites remain unimplemented; no copied-suite credit is assigned to them.

Supplemental local assertions separately verify source hashes, generated byte-exact section projections, every permitted base/accent merge, [responsive paired React/Svelte styles](../tests/browser/themes.spec.ts), functional switching and every original token, actual portaled Dialog palette/styles, hover/focus/invalid/disabled selectors, [public archive exports](../scripts/check-package.sh), and [fresh archive/source-copy browser consumers](../tests/installation/themes.spec.ts). The React wrappers remain the genuine existing immutable source fixtures; the independent React reference app compiles all eight full original scoped stylesheets and full original globals in a separate browser document, with no production CSS, unscoped Nova fallback or compatibility reset. Its sole source-content change is the globals package-import path pointing to the separately hashed original shadcn/tailwind.css. Raw styles enter the component layer to preserve caller utility precedence; the body/font input is explicitly shared, including body background/text colors from each document's palette variables. Its palette is assigned directly from immutable theme records independently of the production generator. Skeleton animation names/durations are compared; phase-dependent opacity is not used as geometry/color evidence.

Initial execution found a harness load failure: Node type stripping retained the empty mixed-type `shadcn/schema` import. Removing only that fixture-loader import repaired execution while retaining the original source bytes and test block. The genuine original test then passed; no upstream generator failure or weakened expected result is claimed. Type checking additionally caught the consumer fixture's original package resolution from the scripts directory, and an earlier reference stylesheet build caught missing Tailwind context. The final reference was replaced with a fully isolated source app, eliminating that shared-css context. These are local harness issues, not verified upstream defects.

Exact-final-head lint, types, actual DOM tests, SSR/client builds, isolated package and both documented fresh consumers, secured hosted browsers with zero retries, independent source review, configured automatic reviews and PM approval remain required. Passing historical feature tests, source hashes or documentation checks does not certify a changed head or imply full parity.

The first hosted run passed standard verification but found real browser harness failures: the selection labels accidentally included their option text, and historical supplemental Empty dark-selector contexts lacked their fixed light-primary input after genuine dark tokens became available. Explicit native label associations repair the controls without changing exact locators. Both existing React/Svelte Empty selector contexts retain the explicitly recorded `--primary: oklch(0.205 0 0)` witness and their unchanged expected hover color; the independent theme tests separately assert every genuine dark token. Exhaustive supplemental comparisons have proportional time budgets with zero retries and unchanged source expectations.

After those repairs, the hosted functional palette test passed every base/overlay/mode combination. The first independent style comparison found matching geometry/fonts but different inherited text colors: the reference shell had no body text palette, while the actual documented consumer shell uses `--foreground`. The reference now receives that same explicit consumer-owned body palette input from its immutable theme records; original globals, original style declarations and comparison assertions remain unchanged. Later style results still require the final-head browser gate.
