---
title: Select
description: Displays a list of options for the user to pick from, triggered by a button.
---

<ComponentPreview name="base/SelectDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add select
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/select`.

<ComponentSource name="select" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '#lib/components/ui/select';

  const items = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' }
  ];
</script>
```

```svelte
<Select {items}>
  <SelectTrigger class="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {#each items as item (item.value)}
        <SelectItem value={item.value}>{item.label}</SelectItem>
      {/each}
    </SelectGroup>
  </SelectContent>
</Select>
```

Pass `items` to `Select` so `SelectValue` shows the label of the selected item instead of its value. An item with a `null` value acts as the placeholder: its label shows while nothing is selected.

## Composition

Use the following composition to build a `Select`.

```text
Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectGroup
    │   ├── SelectLabel
    │   ├── SelectItem
    │   └── SelectItem
    ├── SelectSeparator
    └── SelectGroup
        ├── SelectLabel
        ├── SelectItem
        └── SelectItem
```

## Binding the value

Bind `value` to read or change the selection from outside, or pass `defaultValue` to set the starting value. Bind `open` to control the popup.

```svelte
<script lang="ts">
  let theme = $state<string | null>('system');
</script>

<Select {items} bind:value={theme}>
  ...
</Select>
```

## Align Item With Trigger

Set `alignItemWithTrigger` on `SelectContent` to choose how the popup sits against the trigger. When `true`, the default, the popup lines the selected item up with the trigger. When `false`, the popup aligns to the trigger edge like a menu, and `side` and `align` apply.

<ComponentPreview name="base/SelectAlignItemExample" />

## Groups

Use `SelectGroup`, `SelectLabel` and `SelectSeparator` to organize items.

<ComponentPreview name="base/SelectGroupsExample" />

## Scrollable

A select with many items scrolls inside the popup. Scroll arrows appear at the edges while there is more to see.

<ComponentPreview name="base/SelectScrollableExample" />

## Multiple selection

Set `multiple` to let the user pick several items. The value becomes an array, and the popup stays open while the user picks. Pass a function to `SelectValue` to format the selection.

```svelte
<Select {items} multiple defaultValue={[]}>
  <SelectTrigger class="w-72">
    <SelectValue>
      {#snippet children(value)}
        {(value as string[]).length === 0 ? 'Select fruits' : `${(value as string[]).length} fruits selected`}
      {/snippet}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {#each items as item (item.value)}
        <SelectItem value={item.value}>{item.label}</SelectItem>
      {/each}
    </SelectGroup>
  </SelectContent>
</Select>
```

## Object values

An item value can be an object. Pass `itemToStringValue` so the form value and the hidden input get a string, and `itemToStringLabel` when the object has no `label`.

```svelte
<Select defaultValue={plans[0]} itemToStringValue={(plan) => plan.name}>
  <SelectTrigger class="h-auto! w-72">
    <SelectValue>
      {#snippet children(value)}
        {(value as Plan).name}
      {/snippet}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {#each plans as plan (plan.name)}
        <SelectItem value={plan}>{plan.name}</SelectItem>
      {/each}
    </SelectGroup>
  </SelectContent>
</Select>
```

## Forms

Give `Select` a `name` and it submits with its form through a hidden input, and a form reset restores `defaultValue`. Set `required` to block submission until the user picks a value.

```svelte
<form method="POST">
  <Select name="fruit" {items} required>
    ...
  </Select>
  <button type="submit">Submit</button>
</form>
```

## Disabled

Set `disabled` on `Select` to disable the whole control, or on a `SelectItem` to disable one option.

<ComponentPreview name="base/SelectDisabledExample" />

## Invalid

Set `aria-invalid` on `SelectTrigger` to show an error state. In a [Field](/docs/components/field), also set `data-invalid` on the `Field` and add a `FieldError`.

```svelte
<Field data-invalid>
  <FieldLabel>Fruit</FieldLabel>
  <Select {items}>
    <SelectTrigger aria-invalid>
      <SelectValue />
    </SelectTrigger>
    ...
  </Select>
  <FieldError>Please select a fruit.</FieldError>
</Field>
```

<ComponentPreview name="base/SelectInvalidExample" />

## RTL

Wrap the select in a [DirectionProvider](/docs/components/direction) and set `dir` on `SelectTrigger` and `SelectContent`. Use the buttons to switch the language.

<ComponentPreview name="base/SelectRtlExample" align="start" />

## Examples

<ComponentPreview name="base/SelectExample" />

## Without JavaScript

`Select` needs JavaScript to open. For a form that must work before the page hydrates, or for a remote form's `as('select')` and `as('select multiple')` spreads, use [Native Select](/docs/components/native-select).

## API reference

`Select` is styled on top of the Sveltery Base `Select` primitive, which owns the popup positioning, keyboard navigation, typeahead, focus handling, dismissal and form value. `SelectContent` renders the Base portal, positioner, popup and list with scroll arrows, and takes the positioner's `side`, `align`, `sideOffset`, `alignOffset` and `alignItemWithTrigger` props. `SelectTrigger` takes `size` (`default` or `sm`). The trigger sets `data-popup-open` while the popup is open, so style the open state with `data-popup-open:`. See the [Base UI Select documentation](https://base-ui.com/react/components/select) for the behavior it ports.
