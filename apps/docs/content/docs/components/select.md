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
npm install @sveltery/base
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

## Without JavaScript

`Select` needs JavaScript to open. For a form that must work before the page hydrates, or for a remote form's `as('select')` and `as('select multiple')` spreads, use [Native Select](/docs/components/native-select).

## Align Item With Trigger

Use `alignItemWithTrigger` on `SelectContent` to control whether the selected item aligns with the trigger. When `true` (default), the popup positions so the selected item appears over the trigger. When `false`, the popup aligns to the trigger edge like a menu, and `side` and `align` apply.

<ComponentPreview name="base/SelectAlignItemExample" />

## Groups

Use `SelectGroup`, `SelectLabel`, and `SelectSeparator` to organize items.

<ComponentPreview name="base/SelectGroupsExample" />

## Scrollable

A select with many items that scrolls.

<ComponentPreview name="base/SelectScrollableExample" />

## Disabled

<ComponentPreview name="base/SelectDisabledExample" />

## Invalid

Add the `data-invalid` attribute to the `Field` component and the `aria-invalid` attribute to the `SelectTrigger` component to show an error state.

```svelte
<Field data-invalid>
  <FieldLabel>Fruit</FieldLabel>
  <Select {items}>
    <SelectTrigger aria-invalid>
      <SelectValue />
    </SelectTrigger>
    ...
  </Select>
</Field>
```

<ComponentPreview name="base/SelectInvalidExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the select in a [DirectionProvider](/docs/components/direction) and set `dir` on `SelectTrigger` and `SelectContent`. Use the language selector to switch the language.

<ComponentPreview name="base/SelectRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Select](https://base-ui.com/react/components/select#api-reference) documentation.

`SelectContent` renders the Base portal, positioner, popup and list with scroll arrows, and takes the positioner's `side`, `align`, `sideOffset`, `alignOffset` and `alignItemWithTrigger` props. `SelectTrigger` takes `size` (`default` or `sm`) and sets `data-popup-open` while the popup is open, so style the open state with `data-popup-open:`.
