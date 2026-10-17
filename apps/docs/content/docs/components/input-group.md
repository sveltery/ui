---
title: Input Group
description: Add addons, buttons, and helper content to inputs and textareas.
---

<ComponentPreview name="base/InputGroupDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add input-group
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/input-group`. It builds on the `button`, `input` and `textarea` components, so copy those as well.

<ComponentSource name="input-group" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '#lib/components/ui/input-group';
  import SearchIcon from '@lucide/svelte/icons/search';
</script>
```

```svelte
<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
</InputGroup>
```

`InputGroupAddon` takes `align`: `inline-start` (default), `inline-end`, `block-start` or `block-end`. Clicking an addon focuses the input in the group, unless the click lands on a button. An `onclick` you pass replaces that behavior. `InputGroupInput` and `InputGroupTextarea` accept `bind:value` like the `Input` and `Textarea` they wrap.

## Composition

Use the following composition to build an `InputGroup`:

```text
InputGroup
├── InputGroupInput or InputGroupTextarea
├── InputGroupAddon
├── InputGroupButton
└── InputGroupText
```

## Align

Use the `align` prop on `InputGroupAddon` to position the addon relative to the input.

<Callout>

For proper focus management, `InputGroupAddon` should always be placed after `InputGroupInput` or `InputGroupTextarea` in the DOM. Use the `align` prop to visually position the addon.

</Callout>

### inline-start

Use `align="inline-start"` to position the addon at the start of the input. This is the default.

<ComponentPreview name="base/InputGroupInlineStartExample" />

### inline-end

Use `align="inline-end"` to position the addon at the end of the input.

<ComponentPreview name="base/InputGroupInlineEndExample" />

### block-start

Use `align="block-start"` to position the addon above the input.

<ComponentPreview name="base/InputGroupBlockStartExample" />

### block-end

Use `align="block-end"` to position the addon below the input.

<ComponentPreview name="base/InputGroupBlockEndExample" />

## Icon

<ComponentPreview name="base/InputGroupIconExample" />

## Text

<ComponentPreview name="base/InputGroupTextExample" />

## Button

<ComponentPreview name="base/InputGroupButtonExample" />

## Kbd

<ComponentPreview name="base/InputGroupKbdExample" />

## Dropdown

<ComponentPreview name="base/InputGroupDropdownExample" />

## Spinner

<ComponentPreview name="base/InputGroupSpinnerExample" />

## Textarea

<ComponentPreview name="base/InputGroupTextareaExample" />

## Custom Input

Add the `data-slot="input-group-control"` attribute to your custom input for automatic focus state handling.

Here's an example of a custom resizable textarea. It is a native `textarea` that sizes itself to its content with `field-sizing-content` in browsers that support `field-sizing`.

<ComponentPreview name="base/InputGroupCustomExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the group in a [DirectionProvider](/docs/components/direction) and set `dir` on the container. Use the language selector to switch the language.

<ComponentPreview name="base/InputGroupRtlExample" direction="rtl" align="start" />

## API Reference

### InputGroup

The main component that wraps inputs and addons.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

```svelte
<InputGroup>
  <InputGroupInput />
  <InputGroupAddon />
</InputGroup>
```

### InputGroupAddon

Displays icons, text, buttons, or other content alongside inputs.

<Callout title="Focus Navigation">

For proper focus navigation, the `InputGroupAddon` component should be placed after the input. Set the `align` prop to position the addon.

</Callout>

| Prop    | Type                                                             | Default          |
| ------- | ---------------------------------------------------------------- | ---------------- |
| `align` | `"inline-start"` \| `"inline-end"` \| `"block-start"` \| `"block-end"` | `"inline-start"` |
| `class` | `string`                                                         |                  |

```svelte
<InputGroupAddon align="inline-end">
  <SearchIcon />
</InputGroupAddon>
```

**For `<InputGroupInput />`, use the `inline-start` or `inline-end` alignment. For `<InputGroupTextarea />`, use the `block-start` or `block-end` alignment.**

The `InputGroupAddon` component can have multiple `InputGroupButton` components and icons.

```svelte
<InputGroupAddon>
  <InputGroupButton>Button</InputGroupButton>
  <InputGroupButton>Button</InputGroupButton>
</InputGroupAddon>
```

### InputGroupButton

Displays buttons within input groups.

| Prop      | Type                                                                          | Default   |
| --------- | ----------------------------------------------------------------------------- | --------- |
| `size`    | `"xs"` \| `"icon-xs"` \| `"sm"` \| `"icon-sm"`                                      | `"xs"`    |
| `variant` | `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"` \| `"link"` | `"ghost"` |
| `class`   | `string`                                                                      |           |

```svelte
<InputGroupButton>Button</InputGroupButton>
<InputGroupButton size="icon-xs" aria-label="Copy">
  <CopyIcon />
</InputGroupButton>
```

### InputGroupInput

Replacement for `<Input />` when building input groups. This component has the input group styles pre-applied and uses the unified `data-slot="input-group-control"` for focus state handling.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

All other props are passed through to the underlying `<Input />` component, including `bind:value`.

```svelte
<InputGroup>
  <InputGroupInput placeholder="Enter text..." />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
</InputGroup>
```

### InputGroupTextarea

Replacement for `<Textarea />` when building input groups. This component has the textarea group styles pre-applied and uses the unified `data-slot="input-group-control"` for focus state handling.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` |         |

All other props are passed through to the underlying `<Textarea />` component, including `bind:value`.

```svelte
<InputGroup>
  <InputGroupTextarea placeholder="Enter message..." />
  <InputGroupAddon align="block-end">
    <InputGroupButton>Send</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```
