# SvelteKit installation

Try the experimental Svelte 5 Dialog in a fresh SvelteKit app. This guide covers the ten [Dialog exports](dialog.md) and the Nova style subset. UI and Base are private, unpublished `0.0.0` packages; registry installs such as `pnpm add @sveltery/ui` are not available. There is no component CLI or styled Toast export. Passing this example does not establish production readiness or full shadcn/Base UI parity; see [readiness](readiness.md).

The Installation → Usage → Components organization and Dialog anatomy follow [shadcn-ui/ui](https://github.com/shadcn-ui/ui/tree/d75a96ab781f3d659be1ad287347d5887ce9f2fc/apps/v4/registry). Sveltery is an independent, unofficial Svelte adaptation. Preserve the [MIT upstream credit](../packages/ui/THIRD_PARTY_NOTICES.md) when copying source.

## Installation

### 1. Build pinned local archives

Use Bash, Git, Node `>=24.15.0 <25`, and pnpm `12.6.0` (or Corepack, which the repository launcher uses to select that exact pnpm). Select the exact 40-character UI commit from the reviewed checkout or pull request you intend to consume, and export it as `SVELTERY_UI_SHA`. Build archives and copy source from that same detached commit; the commands do not select a moving branch or a historical fallback. Run them in an empty working directory:

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
  cc6bcbdf39f661f49f098c6126620e9ac8c755adbf83ff6231c56501da6d4234 \
  vendor/sveltery-base-0.0.0.tgz | sha256sum --check
sha256sum vendor/*.tgz > vendor/SHA256SUMS
```

This current checkout rebuilds Base commit `d889e75bedfee9174c3b36d16fe8a9fb2d2a66d3` and verifies its archive against [base.lock.json](../scripts/base.lock.json). Keep the recorded `SVELTERY_UI_SHA`, both archives, and `vendor/SHA256SUMS` with your consumer. These Base pin/checksum instructions match the [separate proposed dependency update](base-pin-upgrade.md); final-head review and secured UI browser acceptance remain required. Historical PR #13 used Base `400ab42408f276824be7fe17250ed44bd01fd260` with SHA-256 `fae93c0aa896b09f58dfcb5e1580ac6293b489994cd4556c90f1e77abaa197e7`. The historical Button-era Base pin was `4dd04e495fc9f5bb6a0bb872fe103563d49535b1` with archive SHA-256 `0f15a815e69e8553b2c67f8b5315ee7334c8b001cc0fcf1efde09c5e5c4289d6`; when selecting another UI commit, check its `scripts/base.lock.json` and matching installation guide rather than mixing archives across snapshots. The generated UI checksum records your local artifact; it is not a published release checksum. On macOS, use `shasum -a 256` / `shasum -a 256 -c` in place of `sha256sum` / `sha256sum --check`.

### 2. Create the consumer

Create the following files in `dialog-app`. The exact versions match the repository fixtures. This small scaffold avoids a changing `create` CLI default; existing SvelteKit apps can apply the same dependencies and configuration.

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
    "clsx": "2.1.1",
    "tailwind-merge": "3.6.0",
    "svelte": "5.57.1"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "7.0.1",
    "@sveltejs/kit": "2.70.3",
    "@sveltejs/vite-plugin-svelte": "7.3.1",
    "@tailwindcss/vite": "4.3.0",
    "tailwindcss": "4.3.0",
    "tw-animate-css": "1.4.0",
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

Nova is Tailwind input CSS, not a precompiled standalone stylesheet. It imports `tw-animate-css` itself. Use the [Tailwind Vite plugin](https://tailwindcss.com/docs/installation/using-vite), and register the installed UI source explicitly: Tailwind [ignores node_modules by default](https://tailwindcss.com/docs/detecting-classes-in-source-files). The `@source` path below is relative to `src/app.css`; it supplies positioning and other utilities used inside the wrappers.

#### `src/app.css`

<!-- consumer-file: src/app.css -->
```css
@import "tailwindcss";
@import "@sveltery/ui/nova.css";
@source "../node_modules/@sveltery/ui/dist";
@theme inline {
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}
:root {
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --radius: 0.625rem;
}
body { margin: 0; background: var(--background); color: var(--foreground); font-family: Arial, sans-serif; }
.cn-font-heading { font-family: inherit; }
```

These are the light theme tokens needed by the current Nova Dialog/native-close subset. Match the variable mappings and values when adapting your theme. Adding a `.dark` class alone does not define a dark palette. The heading utility deliberately inherits the app font.

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

For an app-owned copy, first complete the scaffold above. From `dialog-app`, copy from the pinned sibling checkout, retaining the ten wrappers, barrel, sibling shared helper, CSS and notices together:

<!-- consumer-copy -->
```sh
mkdir -p src/lib/components/ui src/lib/styles
cp -R ../sveltery-ui/apps/docs/registry/bases/base/ui/dialog src/lib/components/ui/
cp -R ../sveltery-ui/apps/docs/registry/bases/base/ui/shared src/lib/components/ui/
cp ../sveltery-ui/apps/docs/registry/styles/style-nova.css src/lib/styles/nova.css
cp ../sveltery-ui/packages/ui/LICENSE src/lib/components/ui/LICENSE
cp ../sveltery-ui/packages/ui/THIRD_PARTY_NOTICES.md src/lib/components/ui/THIRD_PARTY_NOTICES.md
```

Make these three edits:

1. In `package.json`, remove the `@sveltery/ui` dependency. Keep the verified Base archive, Svelte, `clsx`, `tailwind-merge`, Tailwind and `tw-animate-css` dependencies.
2. In `src/app.css`, replace `@import "@sveltery/ui/nova.css";` with `@import "./lib/styles/nova.css";` and replace the installed-package `@source` line with `@source "./lib/components/ui";`.
3. In `src/routes/+page.svelte`, import the same names from `$lib/components/ui/dialog`. The broader Tailwind source path also scans `shared/classes.js`, which supplies native close-button utility classes.

Run `pnpm install` to update the consumer lockfile, then repeat the frozen install, checks, build and browser instructions. The copied wrappers still depend on Base; copying them does not vendor its behavior implementation. Keep the source SHA and notices with your copy, including when redistributing it. Review local modifications and upstream updates explicitly. See [Dialog API adaptations](dialog.md) for controlled state, render snippets, native events and the remaining focus/compatibility limits.

## Native Table

The same reviewed archive exports the eight [native Table components](table.md) at `@sveltery/ui/table` and the root. Their fixed container provides horizontal scrolling; attributes, native events and `bind:ref` belong to the inner table. Keep Nova and Tailwind scanning configured as above. Only Basic, Footer and Simple examples are implemented; Badge, DropdownMenu, Select and Input compositions remain deferred.

For an app-owned Table copy, retain the `table` directory alongside the shared helper and notices from the same selected checkout:

```sh
cp -R ../sveltery-ui/apps/docs/registry/bases/base/ui/table src/lib/components/ui/
```

Import the same names from `$lib/components/ui/table`, preserve `shared/classes.js`, `clsx` and `tailwind-merge`, and repeat the types, SSR/client build and browser gates. Table itself requires no Base primitive; this guide's Dialog scaffold still consumes the verified Base archive. Fresh consumer verification exercises Table's examples, native semantic tree, refs/attachments, reactive attributes, styles and scrolling in both archive and source-copy modes, before enabling the separate experimental remote-field fixture.

### Native Skeleton

Import `Skeleton` from `@sveltery/ui/skeleton` (also exported at the root) using the same reviewed archive. For source copies, copy `registry/bases/base/ui/skeleton` beside `shared/classes.js`, retain the MIT notices and scan both directories with Tailwind. The shared Nova CSS includes `.cn-skeleton`; consumer theme tokens must include the scaffold's existing `--color-muted` mapping and radius tokens. The [feature contract](skeleton.md) documents native div props, snippets, bindable refs and attachments, plus the landed actual [SkeletonCard composition](https://github.com/sveltery/ui/pull/19). That example also requires the sibling `card` directory and a matching Card import remap to `$lib/components/ui/card`; the fresh source-copy gate now supplies both. Full Example/ExampleWrapper layout remains outside this bounded scaffold. The fresh consumer gate adds a native Skeleton route to both archive and source-copy modes before experimental remote-field configuration.

### Native Kbd and KbdGroup

Import `Kbd` and `KbdGroup` from `@sveltery/ui/kbd` or the root of the same reviewed archive. For source copies, copy `registry/bases/base/ui/kbd` beside `shared/classes.js`, retain the notices and scan both directories. The existing Nova/theme scaffold supplies the muted/background/radius tokens. Both leaves render `kbd`, including KbdGroup despite the React source's div prop annotation. They display keys without adding keyboard listeners or shortcut execution. See [Kbd scope](kbd.md); InputGroup/Tooltip/icon composition is deferred. Fresh archive/source-copy gates execute the route's SSR/hydration, reactive declarations and ref/attachment cleanup before remote-field opt-ins.

### Native Card parts

Import the seven native div parts from `@sveltery/ui/card` or the root of the same reviewed archive. For source copies, copy `registry/bases/base/ui/card` beside `shared/classes.js`, keep the notices and scan both directories. The scaffold now maps `--color-card` and `--color-card-foreground` to light consumer theme tokens. [Card scope](card.md) records `default`/`sm` sizes, native refs and attachments, seven actual examples and five deferred compositions. Archive/source-copy gates exercise all seven parts, SSR/hydration, reactive updates and cleanup.

### Native Label

Import the single `Label` export from `@sveltery/ui/label` or the root of the same reviewed archive. Use Svelte `for` with a matching native control `id`; `bind:ref` exposes the native label. For source copies, copy `registry/bases/base/ui/label` beside `shared/classes.js`, retain the notices and scan both directories. Nova includes `.cn-label` and the separate opt-in `.cn-label-aria` rule. The [Label contract](label.md) records exact disabled styling selectors and the bounded With Textarea example's native Field/Example scaffold substitution; Checkbox/Input/Disabled compositions remain deferred. Both consumer modes exercise actual Label code/CSS, SSR/hydration, trusted association/focus, reactive props and refs/attachments before remote-field opt-ins.

### Native AspectRatio

Import `AspectRatio` from `@sveltery/ui/aspect-ratio` or the root of the same reviewed archive. For source copies, copy `registry/bases/base/ui/aspect-ratio` beside `shared/classes.js`, retain the notices and scan both directories with Tailwind. The required `ratio` sets `--ratio` only when `style` is absent; caller `style` replaces that generated declaration, including an explicitly undefined/null/empty style. Supply `--ratio` yourself when combining caller styles with the ratio utility. No Base primitive or new Nova rule is needed. The [feature contract](aspect-ratio.md) records native div/snippet/ref/attachment adaptations and deferred Next Image/Example scaffolds. Fresh archive/source-copy checks exercise actual SSR/hydration, responsive ratios and caller overrides.

### Native Alert

This proposed integrated slice exports `Alert`, `AlertTitle`, `AlertDescription` and `AlertAction` from `@sveltery/ui/alert` or the root of the same reviewed archive. All parts render native divs. Root supports `default`, `destructive` and null variants; caller role/data-slot overrides remain observable. For source copies, copy `registry/bases/base/ui/alert` beside `shared/classes.js`, keep the notices, `clsx` and `tailwind-merge`, install `class-variance-authority` 0.7.1 for this source copy (`pnpm add class-variance-authority@0.7.1`), and scan both directories. Existing card, foreground, muted, destructive and radius tokens support Nova. [Alert scope](alert.md) records native APIs, Basic's bounded scaffold and deferred icon/Badge compositions. Fresh archive/source-copy gates exercise all four parts, SSR/client builds, reactive props, refs/attachments and secured browsers before experimental remote-field opt-ins.

### Native Empty

Import the six [native Empty parts](empty.md) from `@sveltery/ui/empty` or the root of the same reviewed archive. For source copies, copy `registry/bases/base/ui/empty` beside `shared/classes.js`, retain the notices and scan both directories with Tailwind. Keep `class-variance-authority` 0.7.1, `clsx` 2.1.1 and `tailwind-merge` 3.6.0. Nova supplies the Empty rules using existing theme tokens. EmptyDescription renders a div; EmptyMedia uses `data-slot="empty-icon"` and default/icon/null variants. Both fresh consumer modes exercise supplemental native primitives, SSR/hydration, styles, props, refs and attachment cleanup. Actual gallery compositions remain deferred for missing icons and/or InputGroup.
