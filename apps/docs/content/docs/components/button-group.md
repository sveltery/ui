---
title: Button Group
description: A container that groups related buttons together with consistent styling.
---

<ComponentPreview name="base/ButtonGroupDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add button-group
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/button-group`.

<ComponentSource name="button-group" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';
  import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '#lib/components/ui/button-group';
</script>
```

```svelte
<ButtonGroup>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## Composition

Use the following composition to build a `ButtonGroup`:

```text
ButtonGroup
├── Button or Input
├── ButtonGroupSeparator
└── ButtonGroupText
```

## Accessibility

- The `ButtonGroup` component has the `role` attribute set to `group`.
- Use `Tab` to navigate between the buttons in the group.
- Use `aria-label` or `aria-labelledby` to label the button group.

```svelte showLineNumbers
<ButtonGroup aria-label="Button group">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## ButtonGroup vs ToggleGroup

- Use the `ButtonGroup` component when you want to group buttons that perform an action.
- Use the `ToggleGroup` component when you want to group buttons that toggle a state.

## Orientation

Set the `orientation` prop to change the button group layout.

<ComponentPreview name="base/ButtonGroupOrientationExample" />

## Size

Control the size of buttons using the `size` prop on individual buttons.

<ComponentPreview name="base/ButtonGroupSizeExample" />

## Nested

Nest `<ButtonGroup>` components to create button groups with spacing.

<ComponentPreview name="base/ButtonGroupNestedExample" />

## Separator

The `ButtonGroupSeparator` component visually divides buttons within a group.

Buttons with variant `outline` do not need a separator since they have a border. For other variants, a separator is recommended to improve the visual hierarchy.

<ComponentPreview name="base/ButtonGroupSeparatorExample" />

## Split

Create a split button group by adding two buttons separated by a `ButtonGroupSeparator`.

<ComponentPreview name="base/ButtonGroupSplitExample" />

## Input

Wrap an `Input` component with buttons.

<ComponentPreview name="base/ButtonGroupInputExample" />

## Input Group

Wrap an `InputGroup` component to create complex input layouts.

<ComponentPreview name="base/ButtonGroupInputGroupExample" />

## Dropdown Menu

Create a split button group with a `DropdownMenu` component.

<ComponentPreview name="base/ButtonGroupDropdownExample" />

## Select

Pair with a `Select` component.

<ComponentPreview name="base/ButtonGroupSelectExample" />

## Popover

Use with a `Popover` component.

<ComponentPreview name="base/ButtonGroupPopoverExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the button group in a [DirectionProvider](/docs/components/direction) and set `dir` on the dropdown menu content. Use the language selector to switch the language.

<ComponentPreview name="base/ButtonGroupRtlExample" direction="rtl" />

## API Reference

### ButtonGroup

The `ButtonGroup` component is a container that groups related buttons together with consistent styling.

| Prop          | Type                         | Default        |
| ------------- | ---------------------------- | -------------- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |

```svelte
<ButtonGroup>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

Nest multiple button groups to create complex layouts with spacing. See the [nested](#nested) example for more details.

```svelte
<ButtonGroup>
  <ButtonGroup />
  <ButtonGroup />
</ButtonGroup>
```

### ButtonGroupSeparator

The `ButtonGroupSeparator` component visually divides buttons within a group.

| Prop          | Type                         | Default      |
| ------------- | ---------------------------- | ------------ |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` |

```svelte
<ButtonGroup>
  <Button>Button 1</Button>
  <ButtonGroupSeparator />
  <Button>Button 2</Button>
</ButtonGroup>
```

### ButtonGroupText

Use this component to display text within a button group.

| Prop     | Type                                | Default |
| -------- | ----------------------------------- | ------- |
| `render` | `Snippet<[props, state, children]>` |         |

```svelte
<ButtonGroup>
  <ButtonGroupText>Text</ButtonGroupText>
  <Button>Button</Button>
</ButtonGroup>
```

Use the `render` snippet to render a custom component as the text, for example a label.

```svelte showLineNumbers
<script lang="ts">
  import { ButtonGroup, ButtonGroupText } from '#lib/components/ui/button-group';
  import { Input } from '#lib/components/ui/input';
  import { Label } from '#lib/components/ui/label';
</script>

<ButtonGroup>
  <ButtonGroupText>
    {#snippet render(props, _state, children)}
      <Label for="name" {...props}>{@render children?.()}</Label>
    {/snippet}
    Text
  </ButtonGroupText>
  <Input placeholder="Type something here..." id="name" />
</ButtonGroup>
```
