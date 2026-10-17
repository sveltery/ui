---
title: Tabs
description: A set of layered sections of content, known as tab panels, that are displayed one at a time.
---

<ComponentPreview name="base/TabsDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add tabs
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/tabs`.

<ComponentSource name="tabs" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '#lib/components/ui/tabs';
</script>
```

```svelte
<Tabs value="account" class="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Make changes to your account here.</TabsContent>
  <TabsContent value="password">Change your password here.</TabsContent>
</Tabs>
```

## Value

`value` is the active tab. Pass it to start on a tab and let the user move from there, or bind it to read and write the active tab.

```svelte
<script lang="ts">
  let tab = $state('account');
</script>

<Tabs bind:value={tab}>
  ...
</Tabs>
```

## Composition

Use the following composition to build `Tabs`:

```text
Tabs
├── TabsList
│   ├── TabsTrigger
│   └── TabsTrigger
├── TabsContent
└── TabsContent
```

## Line

Use the `variant="line"` prop on `TabsList` for a line style.

<ComponentPreview name="base/TabsLineExample" />

## Vertical

Use `orientation="vertical"` for vertical tabs.

<ComponentPreview name="base/TabsVerticalExample" />

## Disabled

<ComponentPreview name="base/TabsDisabledExample" />

## Icons

<ComponentPreview name="base/TabsIconsExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Set `dir` on `Tabs`, `TabsList` and the content, and wrap the tabs in a [DirectionProvider](/docs/components/direction). Use the language selector to switch the language.

<ComponentPreview name="base/TabsRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Tabs](https://base-ui.com/react/components/tabs#api-reference) documentation.

`Tabs` is styled on top of the Sveltery Base `Tabs` primitive, which owns its behavior, focus handling and accessibility.
