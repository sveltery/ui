---
title: Spinner
description: An indicator that can be used to show a loading state.
---

<ComponentPreview name="base/SpinnerDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add spinner
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Copy the component

Copy the following files into `src/lib/components/ui/spinner`.

<ComponentSource name="spinner" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Spinner } from '#lib/components/ui/spinner';
</script>
```

```svelte
<Spinner />
```

## Customization

You can replace the default spinner icon with any other icon by editing the `Spinner` component.

<ComponentPreview name="base/SpinnerCustomExample" />

```svelte title="src/lib/components/ui/spinner/Spinner.svelte" showLineNumbers
<script lang="ts">
  import { cn } from 'cn';
  import LoaderIcon from '@lucide/svelte/icons/loader';
  import type { SVGAttributes } from 'svelte/elements';

  let { class: className, ...props }: SVGAttributes<SVGSVGElement> = $props();
</script>

<LoaderIcon role="status" aria-label="Loading" class={cn('size-4 animate-spin', className)} {...props} />
```

## Size

Use the `size-*` utility class to change the size of the spinner.

<ComponentPreview name="base/SpinnerSizeExample" />

## Button

Add a spinner to a button to indicate a loading state. Place the `<Spinner />` before the label with `data-icon="inline-start"` for a start position, or after the label with `data-icon="inline-end"` for an end position.

<ComponentPreview name="base/SpinnerButtonExample" />

## Badge

Add a spinner to a badge to indicate a loading state. Place the `<Spinner />` before the label with `data-icon="inline-start"` for a start position, or after the label with `data-icon="inline-end"` for an end position.

<ComponentPreview name="base/SpinnerBadgeExample" />

## Input Group

<ComponentPreview name="base/SpinnerInputGroupExample" />

## Empty

<ComponentPreview name="base/SpinnerEmptyExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the spinner in a [DirectionProvider](/docs/components/direction) and set `dir` on the container. Use the language selector to switch the language.

<ComponentPreview name="base/SpinnerRtlExample" direction="rtl" align="start" />
