---
title: Alert
description: Displays a callout for user attention.
---

<ComponentPreview name="base/AlertDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add alert
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Copy the component

Copy the following files into `src/lib/components/ui/alert`.

<ComponentSource name="alert" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Alert, AlertAction, AlertDescription, AlertTitle } from '#lib/components/ui/alert';
</script>
```

```svelte
<Alert>
  <InfoIcon />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
  <AlertAction>
    <Button variant="outline">Enable</Button>
  </AlertAction>
</Alert>
```

## Composition

Use the following composition to build an `Alert`:

```text
Alert
├── Icon
├── AlertTitle
├── AlertDescription
└── AlertAction
```

## Basic

A basic alert with an icon, title and description.

<ComponentPreview name="base/AlertBasicExample" />

## Destructive

Use `variant="destructive"` to create a destructive alert.

<ComponentPreview name="base/AlertDestructiveExample" />

## Action

Use `AlertAction` to add a button or other action element to the alert.

<ComponentPreview name="base/AlertActionExample" />

## Custom Colors

You can customize the alert colors by adding custom classes such as `bg-amber-50 dark:bg-amber-950` to the `Alert` component.

<ComponentPreview name="base/AlertColorsExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the alerts in a [DirectionProvider](/docs/components/direction) and set `dir` on their container. Use the language selector to switch the language.

<ComponentPreview name="base/AlertRtlExample" direction="rtl" />

## API Reference

### Alert

The `Alert` component displays a callout for user attention.

| Prop      | Type                         | Default     |
| --------- | ---------------------------- | ----------- |
| `variant` | `"default" \| "destructive"` | `"default"` |

### AlertTitle

The `AlertTitle` component displays the title of the alert.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### AlertDescription

The `AlertDescription` component displays the description or content of the alert.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### AlertAction

The `AlertAction` component displays an action element (like a button) positioned absolutely in the top-right corner of the alert.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |
