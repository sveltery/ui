# @sveltery/command

A headless command menu for Svelte 5. It ports the behavior of [cmdk](https://github.com/pacocoursey/cmdk), which is React-only: fuzzy filtering and ranking, keyboard navigation, selection, and the `cmdk-*` attributes, roles and ARIA that upstream styles and screen readers rely on. It renders plain elements and ships no styles.

## Usage

```svelte
<script lang="ts">
  import * as Command from '@sveltery/command';

  let search = $state('');
  let value = $state('');
</script>

<Command.Root label="Command menu" bind:value loop>
  <Command.Input bind:value={search} placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item onSelect={(value) => console.log(value)}>Calendar</Command.Item>
      <Command.Item keywords={['emoji']}>Search Emoji</Command.Item>
      <Command.Item disabled>Calculator</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Item value="settings">Settings</Command.Item>
    <Command.Item forceMount>Search the web for "{search}"</Command.Item>
  </Command.List>
</Command.Root>
```

An item's value is its trimmed text unless you pass `value`. Typing filters and ranks items with `commandScore`. The first matching item is selected, the arrow keys move the selection, and Enter or a click calls the item's `onSelect` with its value.

A bound `value` that names no item is kept, for example while items load, and selects the first item with that value once one mounts. An empty `value` selects the first item.

For results that you fetch yourself, turn filtering off and render what the server returns. Selection and the keyboard keep working:

```svelte
<Command.Root shouldFilter={false}>
  <Command.Input bind:value={query} />
  <Command.List>
    {#if loading}<Command.Loading progress={progress}>Fetching...</Command.Loading>{/if}
    {#each results as result (result.id)}
      <Command.Item value={result.id}>{result.title}</Command.Item>
    {/each}
    <Command.Empty>Nothing found.</Command.Empty>
  </Command.List>
</Command.Root>
```

`getCommandState()` reads the menu's state from any component inside Root. Its fields are reactive:

```svelte
<script lang="ts">
  import { getCommandState } from '@sveltery/command';

  const command = getCommandState();
</script>

{#if command.search}<p>{command.count} results</p>{/if}
```

## Parts

Every part renders one element (Input renders an `<input>`, the others a `<div>`), spreads the remaining props onto it, and accepts `class`.

| Part | Props | Renders |
| --- | --- | --- |
| `Root` | `label`, `value` (bindable), `onValueChange`, `shouldFilter` (default `true`), `filter`, `loop`, `disablePointerSelection`, `vimBindings` (default `true`) | `[cmdk-root]` with `tabindex="-1"` and a visually hidden `[cmdk-label]`. Handles the keyboard. |
| `Input` | `value` (bindable, the search) | `[cmdk-input]`, `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded="true"`, `aria-controls`, `aria-labelledby` and `aria-activedescendant`. |
| `List` | `label` (default `"Suggestions"`) | `[cmdk-list]`, `role="listbox"`, around a `[cmdk-list-sizer]`. Sets `--cmdk-list-height` to the sizer's height. |
| `Empty` | | `[cmdk-empty]` while no item matches the search. |
| `Group` | `heading` (string or snippet), `value`, `forceMount` | `[cmdk-group]` with a `[cmdk-group-heading]` and a `[cmdk-group-items]` with `role="group"`. Hidden while none of its items match. |
| `Item` | `value`, `keywords`, `disabled`, `forceMount`, `onSelect` | `[cmdk-item]`, `role="option"`, `aria-selected`, `aria-disabled`, `data-selected`, `data-disabled` (each `"true"` or `"false"`) and `data-value`. |
| `Separator` | `alwaysRender` | `[cmdk-separator]`, `role="separator"`. Removed while searching unless `alwaysRender`. |
| `Loading` | `progress`, `label` (default `"Loading..."`) | `[cmdk-loading]`, `role="progressbar"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. |

`filter(value, search, keywords)` returns a score from 0 to 1. A score of 0 hides the item. The default is `defaultFilter`, which calls `commandScore(value, search, keywords)`. Both are exported.

### Keyboard

| Key | Action |
| --- | --- |
| ArrowDown, ArrowUp | Next or previous item. Wraps around with `loop`. |
| Ctrl+N or Ctrl+J, Ctrl+P or Ctrl+K | Same as ArrowDown and ArrowUp, unless `vimBindings` is false. |
| Meta with any of the above | Last or first item. |
| Alt with any of the above | First item of the next or previous group. |
| Home, End | First or last item. |
| Enter | Calls the selected item's `onSelect`. |

Root ignores a key when another handler called `preventDefault()` or an input method is composing. Disabled items are never selected by the keyboard or the pointer.

## Dialog

The package has no Dialog part. Put Root inside a dialog, for example `@sveltery/base/dialog`:

```svelte
<script lang="ts">
  import { Dialog } from '@sveltery/base/dialog';
  import * as Command from '@sveltery/command';

  let open = $state(false);
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Popup aria-label="Command menu">
      <Command.Root label="Command menu">
        <Command.Input autofocus placeholder="Type a command..." />
        <Command.List>...</Command.List>
      </Command.Root>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

The menu resets its search and selection each time the popup content mounts again. Bind `value` on Root and Input to keep them across openings. With the styled components from `npx @sveltery/ui@latest add command dialog`, compose `Dialog` and `DialogContent` the same way.

## Differences from cmdk

- **Ranked order is CSS `order`.** cmdk moves item and group nodes in the DOM to sort them. Svelte owns the nodes it renders, so this package leaves them in place and sets `order` on them instead. For that reason List ships one rule that makes the list sizer and every group's items container a flex column: `:where([cmdk-list-sizer], [cmdk-group-items]) { display: flex; flex-direction: column }`. `:where` gives it zero specificity, so your own CSS replaces it. A grid also honors `order`, so a grid layout such as an emoji picker keeps the ranked order. While searching, the visual order is the ranked order, and the keyboard and `aria-activedescendant` follow it. A screen reader's browse mode still reads the DOM order, which is the declared order. Browsers that support `reading-flow` follow the visual order, and the containers set it.
- **Items must be direct children of List or Group, and Groups direct children of List.** `order` only acts on flex and grid children, so an element wrapped around an Item or Group is not ranked.
- **Filtered items stay mounted.** Items and groups that do not match get the `hidden` attribute and an inline `display: none`, so a `display` class cannot show them. They keep their state, and their text value is known even when a search is already set at mount.
- **Disabled items are ranked** like any other item. cmdk leaves them out of the sort.
- **Clearing the search restores the declared order.** cmdk keeps the last sorted order in the DOM.
- **An inferred value follows the text.** cmdk asks for a stable `value` when the text changes. Here Root re-reads an item's text before it ranks a new search, so `<Command.Item forceMount>Search the web for "{search}"</Command.Item>` reports its current text. Other text changes reach the ranking a microtask later.
- **Selection follows the item, not its value.** cmdk tracks only the value, so items that share a value are selected together. Here the arrow keys and the pointer reach each of them, and only the picked one is selected. Writing the bound `value` selects the first item with that value, unless the selected item already has it.
- **Only keyboard moves and a new search scroll the selection into view.** The automatic selection on mount, the pointer, a click and a write to the bound `value` do not, so an inline menu does not scroll the page when it mounts.
- **`onValueChange` fires for every change of the selected value,** including the automatic selection on mount and on search, whether or not `value` is bound.
- **A group that holds only force-mounted items stays visible** while searching. cmdk hides it.
- **Svelte bindings replace controlled props.** Bind `value` on Root in place of cmdk's `value` and `defaultValue`, and bind `value` on Input for the search in place of its `value` and `onValueChange`. `getCommandState()` replaces `useCommandState(selector)`. There is no `asChild`.
- **Item `onclick` and `onpointermove` run before the item's own handling,** which `event.preventDefault()` skips. cmdk replaces them.
- **Group `data-value`** is `value`, else a string `heading`. A snippet heading gives no `data-value`.
- **Server rendering shows the full list.** Nothing is filtered, ordered or selected until Root mounts, so the server markup and the first client render match. Empty renders only after mount, and `getCommandState().count` reads 0 until then.
- **Root does not move focus to Input when the selection changes.** cmdk does so when Root itself has focus.
