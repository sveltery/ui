# @sveltery/resizable

Resizable panel groups for Svelte 5. The layout algorithm is ported from [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels): panels clamp to their minimum and maximum sizes, collapse past a threshold, and resize with the pointer or the keyboard. It renders plain elements and ships no styles.

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

A size is a string with a unit (`"30%"`, `"240px"`, `"2rem"`, `"50vh"`; a bare `"25"` means percent) or a number of pixels. Bind `layout` on `Group` to read or set every panel's size, and spread `savedLayout({ id })` onto `Group` to keep the layout in `localStorage`.

The styled version lives in `@sveltery/ui/resizable`.

## License

MIT. See `THIRD_PARTY_NOTICES.md` for the upstream license.
