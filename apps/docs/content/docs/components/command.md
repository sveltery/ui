---
title: Command
description: Command menu for search and quick actions.
---

<ComponentPreview name="base/CommandDemoExample" align="start" />

## About

Command is built on `@sveltery/command`, a Svelte port of [cmdk](https://github.com/pacocoursey/cmdk) by Paco Coursey. The port is released under the MIT License and has no runtime dependencies.

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/command github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/command`.

<ComponentSource name="command" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte showLineNumbers
<script lang="ts">
  import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from '$lib/components/ui/command';
</script>
```

```svelte showLineNumbers
<Command class="max-w-sm rounded-lg border">
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>Profile</CommandItem>
      <CommandItem>Billing</CommandItem>
      <CommandItem>Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

Bind the selected item with `bind:value` on `Command` and the search text with `bind:value` on `CommandInput`. Run an action when an item is chosen with `onSelect` on `CommandItem`.

## Composition

Use the following composition to build a `Command`:

```text
Command
├── CommandInput
└── CommandList
    ├── CommandEmpty
    ├── CommandGroup
    │   ├── CommandItem
    │   └── CommandItem
    ├── CommandSeparator
    └── CommandGroup
        ├── CommandItem
        └── CommandItem
```

## Filtering and ranking

Items filter and rank by a fuzzy score as you type. An item that does not match the search is hidden, and the best matches come first.

An item matches on its `value`, which defaults to its text content. Give an item `keywords` to match words that are not in its text.

```svelte
<CommandItem value="billing" keywords={['invoice', 'payment']}>Billing</CommandItem>
```

Pass `filter` to `Command` to score items yourself. It receives the item value, the search text and the item keywords, and returns a number. An item that scores `0` is hidden, and a higher score ranks first.

```svelte
<Command filter={(value, search) => (value.toLowerCase().startsWith(search.toLowerCase()) ? 1 : 0)}>
  ...
</Command>
```

Set `shouldFilter={false}` when you filter the items yourself, for example with results from a server. `Command` then shows every item you render, in the order you render them.

```svelte
<script lang="ts">
  let search = $state('');
  let results = $state<string[]>([]);

  $effect(() => {
    const query = search;
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((items) => (results = items));
  });
</script>

<Command shouldFilter={false}>
  <CommandInput bind:value={search} placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    {#each results as result (result)}
      <CommandItem value={result}>{result}</CommandItem>
    {/each}
  </CommandList>
</Command>
```

## Basic

A simple command menu in a dialog.

<ComponentPreview name="base/CommandBasicExample" />

## Shortcuts

<ComponentPreview name="base/CommandShortcutsExample" />

## Groups

A command menu with groups, icons and separators.

<ComponentPreview name="base/CommandGroupsExample" />

## Scrollable

Scrollable command menu with multiple items.

<ComponentPreview name="base/CommandScrollableExample" />

## Dialog

`CommandDialog` shows a command menu in a dialog. It takes `bind:open`, and `title`, `description` and `showCloseButton` for the dialog. The title and description are only for screen readers. Put a `Command` inside it.

Press ⌘J or Ctrl+J to open the menu below. A `<svelte:window onkeydown>` handler toggles `open`.

<ComponentPreview name="base/CommandDialogExample" />

```svelte
<script lang="ts">
  let open = $state(false);

  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'j' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      open = !open;
    }
  }
</script>

<svelte:window {onkeydown} />

<CommandDialog bind:open>
  <Command>
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>Calendar</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</CommandDialog>
```

## RTL

Wrap the menu in a [DirectionProvider](/docs/components/direction) and set `dir` on `Command` and `CommandInput`. Use the buttons to switch the language.

<ComponentPreview name="base/CommandRtlExample" align="start" />

## API reference

The [`@sveltery/command` README](https://github.com/sveltery/ui/tree/main/packages/command) documents the parts, the props and the keyboard behavior in full. The tables below summarize the props.

### Command

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | | Bindable. The value of the selected item |
| `shouldFilter` | `boolean` | `true` | Filters and ranks items by the search. Set `false` to filter them yourself |
| `filter` | `(value, search, keywords) => number` | fuzzy score | Scores an item. `0` hides it and a higher score ranks first |
| `loop` | `boolean` | `false` | Wraps the selection from the last item to the first, and back |
| `vimBindings` | `boolean` | `true` | Moves the selection with `Ctrl+N`, `Ctrl+P`, `Ctrl+J` and `Ctrl+K` |
| `label` | `string` | | An accessible name for the menu |
| `class` | `string` | | Added to the menu |

### CommandInput

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Bindable. The search text |
| `placeholder` | `string` | | The input placeholder |
| `class` | `string` | | Added to the input |

### CommandGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string \| Snippet` | | The group label |
| `class` | `string` | | Added to the group |

### CommandItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | text content | What the search matches and what `Command` reports as selected |
| `keywords` | `string[]` | | Extra words the search matches |
| `disabled` | `boolean` | `false` | Skips the item for selection and keyboard navigation |
| `forceMount` | `boolean` | `false` | Keeps the item in the list when the search does not match it |
| `onSelect` | `(value: string) => void` | | Runs when the item is chosen with the pointer or Enter |
| `class` | `string` | | Added to the item |

### CommandDialog

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Bindable. Whether the dialog is open |
| `title` | `string` | `'Command Palette'` | The dialog title, read by screen readers |
| `description` | `string` | `'Search for a command to run...'` | The dialog description, read by screen readers |
| `showCloseButton` | `boolean` | `false` | Shows a close button in the dialog |
| `class` | `string` | | Added to the dialog content |

`CommandList`, `CommandEmpty` and `CommandSeparator` take `class`. `CommandShortcut` renders a `<span>` and takes `class`.
