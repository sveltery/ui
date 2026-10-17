# @sveltery/resizable

Resizable panel groups for Svelte 5, ported from [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) 4.5.8. The framework-free part of that library (the layout algorithm and the document-level pointer and keyboard handling) is copied unchanged, and `Group`, `Panel` and `Separator` are Svelte rewrites of its React components. It renders plain elements and ships no styles.

The styled [Resizable](https://ui.sveltery.dev/docs/components/resizable) component in Sveltery UI is built on it.

## Install

```sh
npm install @sveltery/resizable
```

## Usage

```svelte
<script lang="ts">
  import { Group, Panel, Separator } from '@sveltery/resizable';
</script>

<Group orientation="horizontal" style="height: 200px">
  <Panel defaultSize="30%" minSize="20%">Sidebar</Panel>
  <Separator />
  <Panel>Content</Panel>
</Group>
```

A size is a string with a unit (`"30%"`, `"240px"`, `"2rem"`, `"50vh"`; a bare `"25"` means percent) or a number of pixels. Bind `groupRef` on `Group` to get and set the layout, bind `panelRef` on `Panel` to collapse, expand or resize it, and use `useDefaultLayout({ id })` to keep the layout in `localStorage`.

## Updating from upstream

`node scripts/sync-upstream.mjs <react-resizable-panels checkout>` copies the framework-free files from upstream's `lib` folder into `src/lib`, adds `.js` to their relative imports and applies the patches in `patches/`. Upstream's tests come with them and run with `pnpm test`.

Add the styled version to your app with `npx @sveltery/ui@latest add resizable`.

## License

MIT. See `THIRD_PARTY_NOTICES.md` for the upstream license.
