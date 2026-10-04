# SvelteKit installation

Try the experimental Svelte 5 Dialog in a fresh SvelteKit app. This guide covers the ten [Dialog exports](dialog.md) and the Nova style subset. UI and Base are private, unpublished `0.0.0` packages; registry installs such as `pnpm add @sveltery/ui` are not available. There is no component CLI or styled Toast export. Passing this example does not establish production readiness or full shadcn/Base UI parity; see [readiness](readiness.md).

The Installation → Usage → Components organization and Dialog anatomy follow [shadcn-ui/ui](https://github.com/shadcn-ui/ui/tree/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry). Sveltery is an independent, unofficial Svelte adaptation. Preserve the [MIT upstream credit](../packages/ui/THIRD_PARTY_NOTICES.md) when copying source.

## Installation

### 1. Build the pinned UI archive and copy the frozen Base archive

Use Bash, Git, Node `>=24.15.0 <25`, and pnpm `12.6.0` (or Corepack, which the repository launcher uses to select that exact pnpm). Select the exact 40-character UI commit from the reviewed checkout or pull request you intend to consume, and export it as `SVELTERY_UI_SHA`. Build the UI archive and copy the committed Base archive and source from that same detached UI commit; the commands do not select a moving branch or a historical fallback. Bootstrap authenticates the existing archive before the frozen install; it does not clone, install, build or package the separately managed Base project. Run them in an empty working directory:

```sh
: "${SVELTERY_UI_SHA:?Export the exact reviewed 40-character UI commit SHA first}"
git clone https://github.com/sveltery/ui.git sveltery-ui
cd sveltery-ui
git checkout --detach "$SVELTERY_UI_SHA"
git rev-parse HEAD > ../SVELTERY_UI_SHA
bash scripts/bootstrap.sh
source scripts/toolchain.sh
pnpm --filter @sveltery/ui build
mkdir -p ../dialog-app/vendor
pnpm --filter @sveltery/ui pack --pack-destination ../dialog-app/vendor
cp .vendor/sveltery-base-0.0.0.tgz ../dialog-app/vendor/
cd ../dialog-app
printf '%s  %s\n' \
  915dd6aebd304a7a9c384b0dd5eecd589722686897079fb6dec2961608c564fd \
  vendor/sveltery-base-0.0.0.tgz | sha256sum --check
sha256sum vendor/*.tgz > vendor/SHA256SUMS
```

This current checkout contains the byte-exact frozen Base archive for commit `f884f3bb265485ef8e422e43a75eb3055db11fab` and verifies its SHA-256 against [base.lock.json](../scripts/base.lock.json) and its SHA-512 against the unchanged workspace lockfile before installation. The [frozen delivery contract](frozen-base-delivery.md) supersedes the historical ordinary-bootstrap reconstruction described in the [Avatar/Accordion dependency update](base-pin-upgrade.md#avatar-and-accordion-prerequisite-upgrade). Keep the recorded `SVELTERY_UI_SHA`, both archives, and `vendor/SHA256SUMS` with your consumer; final-head review and secured UI browser acceptance remain required. Historical PR #24 used Base `d889e75bedfee9174c3b36d16fe8a9fb2d2a66d3` with SHA-256 `cc6bcbdf39f661f49f098c6126620e9ac8c755adbf83ff6231c56501da6d4234`. Historical PR #13 used Base `400ab42408f276824be7fe17250ed44bd01fd260` with SHA-256 `fae93c0aa896b09f58dfcb5e1580ac6293b489994cd4556c90f1e77abaa197e7`. The historical Button-era Base pin was `4dd04e495fc9f5bb6a0bb872fe103563d49535b1` with archive SHA-256 `0f15a815e69e8553b2c67f8b5315ee7334c8b001cc0fcf1efde09c5e5c4289d6`; when selecting another UI commit, check its `scripts/base.lock.json` and matching installation guide rather than mixing archives across snapshots. The generated UI checksum records your local artifact; it is not a published release checksum. On macOS, use `shasum -a 256` / `shasum -a 256 -c` in place of `sha256sum` / `sha256sum --check`.

### 2. Create the consumer

Create the following files in `dialog-app`. The exact versions match the repository fixtures. This small scaffold avoids a changing `create` CLI default; existing SvelteKit apps can apply the same dependencies and configuration. Shared wrapper classes use genuine `cn` 0.2.2, selected by the pinned modern shadcn lock; [class-merging fidelity](class-merging.md) records the original dependency tests and source-copy requirements. Icons separately use `clsx` 2.1.1.

#### `package.json`

<!-- consumer-file: package.json -->
```json
{
  "name": "sveltery-dialog-consumer",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@12.6.0",
  "engines": { "node": ">=24.15.0 <25" },
  "scripts": {
    "dev": "vite dev --host 127.0.0.1",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "build": "vite build"
  },
  "dependencies": {
    "@sveltery/base": "file:vendor/sveltery-base-0.0.0.tgz",
    "@sveltery/ui": "file:vendor/sveltery-ui-0.0.0.tgz",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "cn": "0.2.2",
    "svelte": "5.57.1"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "7.0.1",
    "@sveltejs/kit": "2.70.3",
    "@sveltejs/vite-plugin-svelte": "7.3.1",
    "@tailwindcss/vite": "4.3.0",
    "tailwindcss": "4.3.0",
    "tw-animate-css": "1.4.0",
    "shadcn": "4.21.1",
    "vite": "8.3.1",
    "svelte-check": "4.7.6",
    "typescript": "5.9.3"
  }
}
```

#### `pnpm-workspace.yaml`

<!-- consumer-file: pnpm-workspace.yaml -->
```yaml
engineStrict: true
autoInstallPeers: false
allowBuilds:
  esbuild: true
overrides:
  "shadcn@4.21.1>cn": "0.2.4"
```

#### `svelte.config.js`

<!-- consumer-file: svelte.config.js -->
```js
import adapter from '@sveltejs/adapter-auto';
export default { kit: { adapter: adapter() } };
```

#### `vite.config.ts`

<!-- consumer-file: vite.config.ts -->
```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
export default defineConfig({ plugins: [tailwindcss(), sveltekit()] });
```

#### `tsconfig.json`

<!-- consumer-file: tsconfig.json -->
```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "strict": true,
    "moduleResolution": "bundler",
    "skipLibCheck": true
  }
}
```

#### `src/app.html`

<!-- consumer-file: src/app.html -->
```html
<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />%sveltekit.head%</head>
  <body data-sveltekit-preload-data="hover"><div style="display: contents">%sveltekit.body%</div></body>
</html>
```

### 3. Configure Nova

Nova is Tailwind input CSS, not a precompiled standalone stylesheet. It imports `tw-animate-css` and the genuine `shadcn/tailwind.css` support stylesheet. Keep the same complete original CSS environment in your application: `shadcn` is pinned to 4.21.1; its CLI-only `cn` dependency is pinned separately to original 0.2.4 while the application uses genuine `cn` 0.2.2. The browser loads the CSS export, not the Node CLI. See the [shared CSS source contract](shadcn-css.md). Use the [Tailwind Vite plugin](https://tailwindcss.com/docs/installation/using-vite), and register the installed UI source explicitly: Tailwind [ignores node_modules by default](https://tailwindcss.com/docs/detecting-classes-in-source-files). The `@source` path below is relative to `src/app.css`; it supplies positioning and other utilities used inside the wrappers.

#### `src/app.css`

<!-- consumer-file: src/app.css -->
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@sveltery/ui/themes.css";
@import "@sveltery/ui/nova.css";
@import "@sveltery/ui/styles.css";
@custom-variant style-lyra (&:where(.style-lyra *));
@custom-variant style-sera (&:where(.style-sera *));
@custom-variant dark (&:is(.dark *));
@source "../node_modules/@sveltery/ui/dist";
body { margin: 0; background: var(--background); color: var(--foreground); font-family: Arial, sans-serif; }
.cn-font-heading { font-family: inherit; }
```

The [modern theme and style assets](themes.md) provide the exact pinned Neutral light/dark palette, all seven complete bases and seventeen accent overlays. The default unscoped Nova retains historical geometry. Opt into genuine scoped geometry with `class="style-nova"` on `html`; select a complete base and optional accent on that same root (for example `class="style-maia theme-zinc theme-blue dark"`). Put `.dark` on `html` to apply the actual palette and class-based dark selectors, including portaled Dialog content. Media preference alone does not select dark mode. The heading utility inherits the app font; fonts and complete gallery parity remain outside this slice.

#### `src/routes/+layout.svelte`

<!-- consumer-file: src/routes/+layout.svelte -->
```svelte
<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>
{@render children()}
```

## Usage

### Minimal accessible Dialog

#### `src/routes/+page.svelte`

<!-- consumer-file: src/routes/+page.svelte -->
```svelte
<script lang="ts">
  import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@sveltery/ui/dialog';
</script>
<svelte:head><title>Dialog installation example</title></svelte:head>
<main class="p-8">
  <h1 class="mb-4 text-2xl font-medium">Dialog installation example</h1>
  <Dialog>
    <DialogTrigger class="rounded-lg border border-border px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring">
      Open welcome dialog
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Welcome</DialogTitle>
        <DialogDescription>A small Dialog using the Nova theme. Close it to return to the page.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose class="cn-button cn-button-variant-outline cn-button-size-default">Done</DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</main>
```

Title and Description provide the accessible name and description. The trigger and closes remain native buttons with text labels. `DialogContent` includes Portal, Overlay, and a labeled X close; do not wrap it in another Portal or add another Overlay. No Button component or provider is needed. Base handles open state, modal focus and dismissal. This example closes without implying that it saves data.

### Install and verify

From `dialog-app`, using the pinned pnpm selected above:

```sh
pnpm install
pnpm install --frozen-lockfile
sha256sum --check vendor/SHA256SUMS
pnpm check
pnpm build
pnpm dev --port 5173
```

Commit the generated `pnpm-lock.yaml` and keep the archives at the manifest's paths; future installs use `--frozen-lockfile`. Initial dependency resolution generates a new consumer lockfile, so retain it for reproducibility rather than rerunning an unlocked install each time. Adapter-auto's local build is a validation step; choosing a deployment adapter and hosting is outside this guide.

Open `http://127.0.0.1:5173` after hydration. Tab to **Open welcome dialog** and press Enter. Expect a centered panel, overlay, the name **Welcome**, and the description above. Tab and Shift+Tab should remain among the X close and Done button. Escape, X close, and Done should dismiss and return focus to the trigger. Reopen using Space. Check the console for hydration errors and repeat at a narrow viewport. Portal content is absent from server HTML and mounts in the browser; the trigger and page still server-render.

An unpositioned panel usually means the `@source` path is wrong. Missing colors or failed `@apply` compilation usually mean missing theme mappings, Tailwind integration, or animation dependencies. Check these prerequisites before modifying Base focus behavior.

## Components: copy the Dialog source instead

For an app-owned copy, first complete the scaffold above. From `dialog-app`, copy from the pinned sibling checkout, retaining the ten wrappers, barrel, canonical Button and IconPlaceholder dependencies, shared helper, CSS and complete notices together. The built-in closes use the same Button and configurable icon composition as the pinned original; copying only the Dialog directory is insufficient.

<!-- consumer-copy -->
```sh
mkdir -p src/lib/components/ui src/lib/styles
cp -R ../sveltery-ui/apps/docs/registry/bases/base/ui/dialog src/lib/components/ui/
cp -R ../sveltery-ui/apps/docs/registry/bases/base/ui/button src/lib/components/ui/
cp -R ../sveltery-ui/apps/docs/registry/bases/base/ui/icons src/lib/components/ui/
cp -R ../sveltery-ui/apps/docs/registry/bases/base/ui/shared src/lib/components/ui/
cp ../sveltery-ui/apps/docs/registry/styles/style-nova.css src/lib/styles/nova.css
cp ../sveltery-ui/apps/docs/registry/styles/themes.css src/lib/styles/themes.css
cp ../sveltery-ui/apps/docs/registry/styles/styles.css src/lib/styles/styles.css
cp -R ../sveltery-ui/apps/docs/registry/styles/scoped src/lib/styles/
cp ../sveltery-ui/packages/ui/LICENSE src/lib/components/ui/LICENSE
cp ../sveltery-ui/packages/ui/THIRD_PARTY_NOTICES.md src/lib/components/ui/THIRD_PARTY_NOTICES.md
```

Make these three edits:

1. In `package.json`, remove the `@sveltery/ui` dependency. Keep the verified Base archive, Svelte, `class-variance-authority` 0.7.1, `cn` 0.2.2, `clsx` 2.1.1, Tailwind, `tw-animate-css` and `shadcn` 4.21.1 dependencies. Retain every icon implementation, generated data and license file. Retain the scaffold's `pnpm-workspace.yaml` override `"shadcn@4.21.1>cn": "0.2.4"`; it pins the original CLI dependency separately from the application's `cn` 0.2.2. The copied Nova and scoped CSS still import the genuine `shadcn/tailwind.css` export.
2. In `src/app.css`, replace `@import "@sveltery/ui/nova.css";` with `@import "./lib/styles/nova.css";` replace `@import "@sveltery/ui/themes.css";` and `@import "@sveltery/ui/styles.css";` with imports from `./lib/styles/themes.css` and `./lib/styles/styles.css`, and replace the installed-package `@source` line with `@source "./lib/components/ui";`.
3. In `src/routes/+page.svelte`, import the same names from `$lib/components/ui/dialog`. The broader Tailwind source path also scans the canonical Button variants and `shared/classes.js`; Dialog imports the sibling Button and full icon closure.

Run `pnpm install` to update the consumer lockfile, then repeat the frozen install, checks, build and browser instructions. The copied wrappers still depend on Base; copying them does not vendor its behavior implementation. Keep the source SHA and notices with your copy, including when redistributing it. Review local modifications and upstream updates explicitly. See [Dialog API adaptations](dialog.md) for controlled state, render snippets, native events and the remaining focus/compatibility limits.

## Native Table

The proposed [three-engine gate](browser-engines.md) runs both fresh consumer modes and documented/experimental phases in Chromium, Firefox and WebKit. `bash scripts/check-installation.sh --browser` selects all configured engines; set `SVELTERY_BROWSER_PROJECT` to `chromium`, `firefox` or `webkit` for an individual engine. Pin selection, types, build and source-copy checks remain unchanged; engine discovery alone is not execution evidence.

The same reviewed archive exports the eight [native Table components](table.md) at `@sveltery/ui/table` and the root. Their fixed container provides horizontal scrolling; attributes, native events and `bind:ref` belong to the inner table. Keep Nova and Tailwind scanning configured as above. Basic, Footer, Simple and the dependency-free With Badges body are implemented; its six badge-shaped elements are literal native spans. DropdownMenu, Select and Input compositions remain deferred. The gallery still uses a bounded Example/ExampleWrapper substitute, although the genuine helpers below are available for migration.

For an app-owned Table copy, retain the `table` directory alongside the shared helper and notices from the same selected checkout:

```sh
cp -R ../sveltery-ui/apps/docs/registry/bases/base/ui/table src/lib/components/ui/
```

Import the same names from `$lib/components/ui/table`, preserve `shared/classes.js`, `cn` 0.2.2, and repeat the types, SSR/client build and browser gates. Table itself requires no Base primitive; this guide's Dialog scaffold still consumes the verified Base archive. Fresh consumer verification exercises Table's examples, native semantic tree, refs/attachments, reactive attributes, styles and scrolling in both archive and source-copy modes, before enabling the separate experimental remote-field fixture.

### Native Skeleton

Import `Skeleton` from `@sveltery/ui/skeleton` (also exported at the root) using the same reviewed archive. For source copies, copy `registry/bases/base/ui/skeleton` beside `shared/classes.js`, retain the MIT notices and scan both directories with Tailwind. The shared Nova CSS includes `.cn-skeleton`; consumer theme tokens must include the scaffold's existing `--color-muted` mapping and radius tokens. The [feature contract](skeleton.md) documents native div props, snippets, bindable refs and attachments, plus the landed actual [SkeletonCard composition](https://github.com/sveltery/ui/pull/19). That example also requires the sibling `card` directory and a matching Card import remap to `$lib/components/ui/card`; the fresh source-copy gate now supplies both. The original selected Skeleton gallery now uses the genuine Example/ExampleWrapper helpers; copying that gallery additionally needs the sibling `example` directory and its import remap. This installation route remains a supplemental native Skeleton consumer. The fresh consumer gate adds a native Skeleton route to both archive and source-copy modes before experimental remote-field configuration.

### Native Kbd and KbdGroup

Import `Kbd` and `KbdGroup` from `@sveltery/ui/kbd` or the root of the same reviewed archive. For source copies, copy `registry/bases/base/ui/kbd` beside `shared/classes.js`, retain the notices and scan both directories. The existing Nova/theme scaffold supplies the muted/background/radius tokens. Both leaves render `kbd`, including KbdGroup despite the React source's div prop annotation. They display keys without adding keyboard listeners or shortcut execution. See [Kbd scope](kbd.md): the current genuine icon pair continuation proposes seven original bodies using public icon/Example helpers and awaits final exact-head gates; InputGroup/Tooltip still need missing styled components. Fresh archive/source-copy gates execute the route's SSR/hydration, reactive declarations and ref/attachment cleanup before remote-field opt-ins.

### Native Card parts

Import the seven native div parts from `@sveltery/ui/card` or the root of the same reviewed archive. For source copies, copy `registry/bases/base/ui/card` beside `shared/classes.js`, keep the notices and scan both directories. The scaffold now maps `--color-card` and `--color-card-foreground` to light consumer theme tokens. [Card scope](card.md) records `default`/`sm` sizes, native refs and attachments, seven selected inner example bodies and five unimplemented compositions. Both image functions now have available native helpers; Custom Spacing/Login/Meeting Notes still need their missing styled components. The seven bodies also retain an unmigrated Example scaffold. Archive/source-copy gates exercise all seven parts, SSR/hydration, reactive updates and cleanup.

### Native Label

Import the single `Label` export from `@sveltery/ui/label` or the root of the same reviewed archive. Use Svelte `for` with a matching native control `id`; `bind:ref` exposes the native label. For source copies, copy `registry/bases/base/ui/label` beside `shared/classes.js`, retain the notices and scan both directories. Nova includes `.cn-label` and the separate opt-in `.cn-label-aria` rule. The [Label contract](label.md) records exact disabled styling selectors and the bounded With Textarea example's native Field/Example scaffold substitution. Example is now available but unmigrated; Field remains missing, and Checkbox/Input/Disabled compositions remain deferred. Both consumer modes exercise actual Label code/CSS, SSR/hydration, trusted association/focus, reactive props and refs/attachments before remote-field opt-ins.

### Native AspectRatio

Import `AspectRatio` from `@sveltery/ui/aspect-ratio` or the root of the same reviewed archive. For source copies, copy `registry/bases/base/ui/aspect-ratio` beside `shared/classes.js`, retain the notices and scan both directories with Tailwind. The required `ratio` sets `--ratio` only when `style` is absent; caller `style` replaces that generated declaration, including an explicitly undefined/null/empty style. Supply `--ratio` yourself when combining caller styles with the ratio utility. No Base primitive or new Nova rule is needed. The [feature contract](aspect-ratio.md) records native div/snippet/ref/attachment adaptations and the unmigrated gallery scaffold using now-available Example helpers. Next Image remains a separate recorded framework substitution. Fresh archive/source-copy checks exercise actual SSR/hydration, responsive ratios and caller overrides.

### Native Alert

The landed bounded slice exports `Alert`, `AlertTitle`, `AlertDescription` and `AlertAction` from `@sveltery/ui/alert` or the root of the same reviewed archive. All parts render native divs. Root supports `default`, `destructive` and null variants; caller role/data-slot overrides remain observable. For source copies, copy `registry/bases/base/ui/alert` beside `shared/classes.js`, keep the notices, `cn` 0.2.2, install `class-variance-authority` 0.7.1 for this source copy (`pnpm add class-variance-authority@0.7.1`), and scan both directories. Existing card, foreground, muted, destructive and radius tokens support Nova. [Alert scope](alert.md) records native APIs, Basic's unmigrated scaffold and three omitted functions. With Icons/Destructive now have available Example/icon helpers but remain unimplemented; With Actions still needs styled Badge. Fresh archive/source-copy gates exercise all four parts, SSR/client builds, reactive props, refs/attachments and secured browsers before experimental remote-field opt-ins.

### Native Empty

Import the six [native Empty parts](empty.md) from `@sveltery/ui/empty` or the root of the same reviewed archive. For source copies, copy `registry/bases/base/ui/empty` beside `shared/classes.js`, retain the notices and scan both directories with Tailwind. Keep `class-variance-authority` 0.7.1 and `cn` 0.2.2. Nova supplies the Empty rules using existing theme tokens. EmptyDescription renders a div; EmptyMedia uses `data-slot="empty-icon"` and default/icon/null variants. Both fresh consumer modes exercise supplemental native primitives, SSR/hydration, styles, props, refs and attachment cleanup. All six original gallery functions remain unimplemented. Basic/Muted Background/Icon/In Card now have available helpers; Border/Muted Background Alt still need styled InputGroup parts. Preserve the original Button render/nativeButton anchor composition when migrating the three link examples; see [current Empty prerequisites](empty.md#deferred-gallery-scope).

### Configurable icons

The reviewed local archive exports `IconPlaceholder`, `IconLibraryProvider` and `iconLibraries` from `@sveltery/ui/icons` and the root, with native props/library types. The provider takes a reactive resolved `library` value, default `lucide`; the placeholder retains all five required name strings, exact selected geometry, real Square fallback and null/unknown behavior. [The icon contract](icons.md) records framework substitutions and unimplemented Next/nuqs configuration.

For source copies, copy the entire `registry/bases/base/ui/icons` directory to `src/lib/components/ui/`, including `generated` ESM modules and complete `licenses` files, retain the source SHA and package/repository notices, and import the same names from `$lib/components/ui/icons`. This full closure requires Svelte 5.57.1 and `clsx` 2.1.1 at runtime; its icon libraries and React renderers remain development references. It introduces no Base primitive or new stylesheet requirement. Future sibling wrappers using icons must include this directory in their source-copy closure. Fresh archive/source-copy gates execute actual public SSR/hydration, all five libraries, delayed native ESM chunks, null/stale results, events, refs and attachment cleanup before the separate remote-field fixture.

## Native example scaffolds

The [source-derived Example and ExampleWrapper](example.md) helpers are exported from `@sveltery/ui/example` and the root of the same reviewed archive. For source copies, copy `registry/bases/base/ui/example` beside `shared/classes.js`, retain the notices and scan both directories. Keep the three pinned dark/style-lyra/style-sera custom variants in the stylesheet above. Example's `class` styles the content div; `containerClassName`, native attributes, events and ref target the outer div. ExampleWrapper's ref/attributes/classes target the inner grid; its outer background shell is fixed. Skeleton/Kbd selected galleries use these actual native helpers; other galleries retain their documented scope. Both fresh consumer modes test scaffold SSR/hydration, responsive layout, source variant selectors, props and native ref/attachment lifecycle. Consumer token selection does not establish full upstream palette parity.

## Experimental styled Separator

The same private archive includes `Separator` at the root and `@sveltery/ui/separator`, plus native `SeparatorProps`/`SeparatorState` type conveniences. For a source copy, retain the complete `apps/docs/registry/bases/base/ui/separator` directory and the existing package notices, and import its index from your app. It requires the actual locked Base Separator, Svelte 5.57.1, genuine `cn` 0.2.2 and the complete genuine `shadcn` 4.21.1 `shadcn/tailwind.css` environment from the scaffold above. Keep the existing Tailwind `@source` scanning and border token mapping; Separator adds original literal utilities rather than a Nova component block. Full four-function examples additionally require the actual Example/ExampleWrapper directory.

Read [the Separator contract](separator.md) before using it: original support CSS maps `data-horizontal`/`data-vertical` utilities to the primitive's `data-orientation` attribute, producing the original one-pixel horizontal height and vertical width without Base alias attributes or changed wrapper selectors. The old mismatch diagnosis omitted that required CSS and is invalid; its historical records remain preserved. Function classes are source-advertised but ignored by genuine styled `cn`; style callbacks and render state remain delegated to Base. Fresh archive/source-copy fixtures require strict actual orientation geometry and this complete closure; passing bounded acceptance does not establish production readiness.

## Proposed Avatar consumption

The proposed six-part Avatar family is imported from `@sveltery/ui/avatar` or the root; source copies retain the complete `avatar` directory, frozen Base, genuine `cn` 0.2.2 and the existing original CSS environment. The seven genuine original gallery functions additionally require `example`, `button`, `empty` and `icons` with their notices and import remaps. Fresh gates exercise that actual gallery and a separate native lifecycle/render probe in both archive/source-copy modes, keeping all existing installation checks. See [Avatar source/API limits](avatar.md): explicit fallback `delay=0` remains unsupported and unaccepted; these consumers do not establish complete original API/version or production readiness.
