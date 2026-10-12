---
title: Tabs
description: A set of layered sections of content, known as tab panels, that are displayed one at a time.
---

<ComponentPreview name="base/TabsExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/tabs`.

<ComponentSource name="tabs" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  let tab = $state('account');
</script>
```

```svelte
<Tabs bind:value={tab}>
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Make changes to your account here.</TabsContent>
  <TabsContent value="password">Change your password here.</TabsContent>
</Tabs>
```

Pass `value` without `bind:` to start on a tab and let the user move from there. `TabsList` takes `variant="line"` for the underlined style, and `Tabs` takes `orientation="vertical"` for a vertical list.

## API reference

`Tabs` is styled on top of the Sveltery Base `Tabs` primitive, which owns its behavior, focus handling and accessibility. See the [Base UI Tabs documentation](https://base-ui.com/react/components/tabs) for the behavior it ports.
