---
title: Combobox
description: Autocomplete input with a list of suggestions.
---

<ComponentPreview name="base/ComboboxDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add combobox
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/combobox`.

<ComponentSource name="combobox" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Combobox, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '#lib/components/ui/combobox';

  const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
</script>
```

```svelte
<Combobox items={frameworks}>
  <ComboboxInput placeholder="Select a framework" />
  <ComboboxContent>
    <ComboboxEmpty>No items found.</ComboboxEmpty>
    <ComboboxList>
      <ComboboxCollection>
        {#snippet children(item)}
          <ComboboxItem value={item}>{item}</ComboboxItem>
        {/snippet}
      </ComboboxCollection>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

Pass `items` to `Combobox` so it can filter the list as the user types. `ComboboxCollection` renders its snippet once for each item that matches, so render the items there instead of with `{#each}`.

## Composition

Use the following compositions to build a `Combobox`.

### Simple

A single-line input and a flat list (see [Basic](#basic)).

```text
Combobox
├── ComboboxInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        └── ComboboxCollection
            ├── ComboboxItem
            └── ComboboxItem
```

### With chips

Multi-select with `multiple`, chips, and a chips input (see [Multiple](#multiple)).

```text
Combobox
├── ComboboxChips
│   └── ComboboxValue
│       ├── ComboboxChip
│       └── ComboboxChipsInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        └── ComboboxCollection
            ├── ComboboxItem
            └── ComboboxItem
```

### With groups and collection

Nested items per group using `ComboboxCollection` inside each `ComboboxGroup`, with a separator between groups (see [Groups](#groups)).

```text
Combobox
├── ComboboxInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        └── ComboboxCollection
            ├── ComboboxGroup
            │   ├── ComboboxLabel
            │   └── ComboboxCollection
            │       ├── ComboboxItem
            │       └── ComboboxItem
            ├── ComboboxSeparator
            └── ComboboxGroup
                ├── ComboboxLabel
                └── ComboboxCollection
                    ├── ComboboxItem
                    └── ComboboxItem
```

## Binding the value

Bind `value` to read or change the selection from outside, `inputValue` to read the text in the input, and `open` to control the popup. Pass `defaultValue` to set the starting value.

```svelte
<script lang="ts">
  let framework = $state<string | null>('SvelteKit');
  let query = $state('');
</script>

<Combobox items={frameworks} bind:value={framework} bind:inputValue={query}>
  ...
</Combobox>
```

## Custom Items

Use `itemToStringValue` when your items are objects. It gives the form value and the hidden input a string. `itemToStringLabel` does the same for the label shown in the input, and an object with a `label` field needs neither.

```svelte
<script lang="ts">
  type Framework = { label: string; value: string };

  const frameworks: Framework[] = [
    { label: 'Next.js', value: 'next' },
    { label: 'SvelteKit', value: 'sveltekit' },
    { label: 'Nuxt', value: 'nuxt' }
  ];
</script>

<Combobox items={frameworks} itemToStringValue={(framework: Framework) => framework.label}>
  <ComboboxInput placeholder="Select a framework" />
  <ComboboxContent>
    <ComboboxEmpty>No items found.</ComboboxEmpty>
    <ComboboxList>
      <ComboboxCollection>
        {#snippet children(framework: Framework)}
          <ComboboxItem value={framework}>{framework.label}</ComboboxItem>
        {/snippet}
      </ComboboxCollection>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

## Multiple Selection

Use `multiple` with chips for multi-select behavior. `ComboboxValue` passes the selected values to its snippet. Attach to `ComboboxChips` to get its element, and pass it to `ComboboxContent` as `anchor` so the popup lines up with the chips instead of the input.

```svelte
<script lang="ts">
  let anchor = $state<HTMLElement | null>(null);
  let value = $state<string[]>([]);
</script>

<Combobox items={frameworks} multiple bind:value>
  <ComboboxChips {@attach (node) => { anchor = node; }}>
    <ComboboxValue>
      {#snippet children(values)}
        {@const selected = values as string[]}
        {#each selected as item (item)}
          <ComboboxChip>{item}</ComboboxChip>
        {/each}
        <ComboboxChipsInput placeholder="Add framework" />
      {/snippet}
    </ComboboxValue>
  </ComboboxChips>
  <ComboboxContent {anchor}>
    <ComboboxEmpty>No items found.</ComboboxEmpty>
    <ComboboxList>
      <ComboboxCollection>
        {#snippet children(item)}
          <ComboboxItem value={item}>{item}</ComboboxItem>
        {/snippet}
      </ComboboxCollection>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

## Forms

Give `Combobox` a `name` and it submits the selected value with its form through a hidden input. Set `required` to block submission until the user picks a value.

```svelte
<form method="POST">
  <Combobox name="framework" items={frameworks} required>
    ...
  </Combobox>
  <button type="submit">Submit</button>
</form>
```

## Basic

A simple combobox with a list of frameworks.

<ComponentPreview name="base/ComboboxBasicExample" />

## Multiple

A combobox with multiple selection using `multiple` and `ComboboxChips`.

<ComponentPreview name="base/ComboboxMultipleExample" />

## Clear Button

Use the `showClear` prop to show a clear button.

<ComponentPreview name="base/ComboboxClearExample" />

## Groups

Use `ComboboxGroup` and `ComboboxSeparator` to group items.

<ComponentPreview name="base/ComboboxGroupsExample" />

## Custom Items

You can render a custom component inside `ComboboxItem`.

<ComponentPreview name="base/ComboboxCustomExample" />

## Invalid

Use the `aria-invalid` prop to make the combobox invalid.

<ComponentPreview name="base/ComboboxInvalidExample" />

## Disabled

Use the `disabled` prop to disable the combobox.

<ComponentPreview name="base/ComboboxDisabledExample" />

## Auto Highlight

Use the `autoHighlight` prop to automatically highlight the first item on filter.

<ComponentPreview name="base/ComboboxAutoHighlightExample" />

## Popup

You can trigger the combobox from a button or any other component by using the `render` snippet of `ComboboxTrigger`. Move the `ComboboxInput` inside the `ComboboxContent`.

<ComponentPreview name="base/ComboboxPopupExample" />

## Input Group

You can add an addon to the combobox by using the `InputGroupAddon` component inside the `ComboboxInput`.

<ComponentPreview name="base/ComboboxInputGroupExample" />

## RTL

Wrap the combobox in a [DirectionProvider](/docs/components/direction) and set `dir` on `ComboboxContent`. Use the buttons to switch the language.

<ComponentPreview name="base/ComboboxRtlExample" align="start" />

## Examples

<ComponentPreview name="base/ComboboxExample" />

## API reference

`Combobox` is styled on top of the Sveltery Base `Combobox` primitive, which owns the filtering, popup positioning, keyboard navigation, focus handling, dismissal and form value. `ComboboxContent` renders the Base portal, positioner and popup, and takes the positioner's `side`, `align`, `sideOffset`, `alignOffset` and `anchor` props. `ComboboxInput` takes `showTrigger` and `showClear`, and `ComboboxChip` takes `showRemove`. The trigger and the input group button set `data-popup-open` and `data-pressed` while the popup is open, so style the open state with `data-popup-open:`. See the [Base UI Combobox documentation](https://base-ui.com/react/components/combobox) for the behavior it ports.
