---
title: Button
description: Displays a button or a component that looks like a button.
---

<ComponentPreview name="base/ButtonDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add button
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/button`.

<ComponentSource name="button" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';
</script>
```

```svelte
<Button variant="outline">Button</Button>
```

## Cursor

Tailwind v4 [switched](https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor) from `cursor: pointer` to `cursor: default` for the button component.

If you want to keep the `cursor: pointer` behavior, add the following code to your CSS file:

```css showLineNumbers title="src/app.css"
@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}
```

## Size

Use the `size` prop to change the size of the button.

<ComponentPreview name="base/ButtonSizeExample" />

## Default

<ComponentPreview name="base/ButtonDefaultExample" />

## Outline

<ComponentPreview name="base/ButtonOutlineExample" />

## Secondary

<ComponentPreview name="base/ButtonSecondaryExample" />

## Ghost

<ComponentPreview name="base/ButtonGhostExample" />

## Destructive

<ComponentPreview name="base/ButtonDestructiveExample" />

## Link

<ComponentPreview name="base/ButtonLinkExample" />

## Icon

<ComponentPreview name="base/ButtonIconExample" />

## With Icon

Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"` attribute to the icon for the correct spacing.

<ComponentPreview name="base/ButtonWithIconExample" />

## Rounded

Use the `rounded-full` class to make the button rounded.

<ComponentPreview name="base/ButtonRoundedExample" />

## Spinner

Render a `<Spinner />` component inside the button to show a loading state. Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"` attribute to the spinner for the correct spacing.

<ComponentPreview name="base/ButtonSpinnerExample" />

## Button Group

To create a button group, use the `ButtonGroup` component. See the [Button Group](/docs/components/button-group) documentation for more details.

<ComponentPreview name="base/ButtonGroupDemoExample" />

## As Link

You can use the `buttonVariants` helper to make a link look like a button.

**Do not use `<Button>` with a `render` snippet and `nativeButton={false}` for links.** The Base `Button` component always applies `role="button"`, which overrides the semantic link role on `<a>` elements. Use `buttonVariants` with a plain `<a>` tag instead.

<ComponentPreview name="base/ButtonRenderExample" />

## RTL

Wrap the buttons in a [DirectionProvider](/docs/components/direction) and set `dir` on their container. Use the buttons to switch the language.

<ComponentPreview name="base/ButtonRtlExample" />

## API Reference

### Button

The `Button` component is a wrapper around the `button` element that adds a variety of styles and functionality. It is styled on top of the Sveltery Base `Button` primitive, which owns its behavior, focus handling and accessibility. See the [Base UI Button documentation](https://base-ui.com/react/components/button#api-reference) for the behavior it ports.

| Prop      | Type                                                                                 | Default     |
| --------- | ------------------------------------------------------------------------------------ | ----------- |
| `variant` | `"default" \| "outline" \| "ghost" \| "destructive" \| "secondary" \| "link"`        | `"default"` |
| `size`    | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` |
