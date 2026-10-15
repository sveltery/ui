# Installation

Sveltery Base is published to npm. Sveltery UI is not published yet, so install it from a packed archive of this repository.

## 1. Add the packages

```sh
pnpm add @sveltery/base
pnpm add @sveltery/ui@file:<path-to-packed-ui>.tgz
pnpm add tailwindcss tw-animate-css
```

Build the UI archive from a checkout of this repository:

```sh
pnpm install
pnpm --filter @sveltery/ui build
pnpm --filter @sveltery/ui pack
```

## 2. Add the styles

Import Tailwind and the Sveltery UI styles in your global CSS, and let Tailwind scan the package:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@sveltery/ui/themes.css";
@import "@sveltery/ui/nova.css";
@source "../node_modules/@sveltery/ui/dist";
```

## 3. Use a component

```svelte
<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  let open = $state(false);
</script>

<Dialog bind:open>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogTitle>Hello</DialogTitle>
    <Button onclick={() => (open = false)}>Done</Button>
  </DialogContent>
</Dialog>
```

`tests/installation/smoke.sh` runs this install path on every change: it packs the UI, installs it with Base into a fresh project and renders every component on the server.
