---
title: Accordion
description: A vertically stacked set of interactive headings that each reveal a section of content.
---

<ComponentPreview name="base/AccordionDemoExample" align="start" class="[&_[data-slot=accordion]]:max-w-sm" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add accordion
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/accordion`.

<ComponentSource name="accordion" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '#lib/components/ui/accordion';
</script>
```

```svelte
<Accordion value={['item-1']}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## Composition

Use the following composition to build an `Accordion`:

```text
Accordion
├── AccordionItem
│   ├── AccordionTrigger
│   └── AccordionContent
└── AccordionItem
    ├── AccordionTrigger
    └── AccordionContent
```

## Binding the value

`Accordion` holds the values of its open items in `value`. Pass `value` without `bind:` to set the items that start open, or bind it to read and change the open items from your code.

```svelte
<script lang="ts">
  let value = $state(['item-1']);
</script>

<Accordion bind:value>
  <AccordionItem value="item-1">…</AccordionItem>
  <AccordionItem value="item-2">…</AccordionItem>
</Accordion>
```

## Basic

A basic accordion that shows one item at a time. The first item is open by default.

<ComponentPreview name="base/AccordionBasicExample" align="start" class="[&_[data-slot=accordion]]:max-w-sm" />

## Multiple

Use the `multiple` prop to allow multiple items to be open at the same time.

<ComponentPreview name="base/AccordionMultipleExample" align="start" class="[&_[data-slot=accordion]]:max-w-sm" />

## Disabled

Use the `disabled` prop on `AccordionItem` to disable individual items.

<ComponentPreview name="base/AccordionDisabledExample" align="start" class="[&_[data-slot=accordion]]:max-w-sm" />

## Borders

Add `border` to the `Accordion` and `border-b last:border-b-0` to the `AccordionItem` to add borders to the items.

<ComponentPreview name="base/AccordionBordersExample" align="start" class="[&_[data-slot=accordion]]:max-w-sm" />

## Card

Wrap the `Accordion` in a `Card` component.

<ComponentPreview name="base/AccordionCardExample" align="start" class="[&_[data-slot=accordion]]:max-w-sm" />

## RTL

Wrap the accordion in a [DirectionProvider](/docs/components/direction) and set `dir` on `Accordion`. Use the language selector to switch the language.

<ComponentPreview name="base/AccordionRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Accordion](https://base-ui.com/react/components/accordion#api-reference) documentation.

`Accordion` is styled on top of the Sveltery Base `Accordion` primitive, which owns its behavior, open state and accessibility. `Accordion` takes `value` (the open item values, bindable; there is no `defaultValue`), `multiple` and `disabled`, and `AccordionItem` takes `value` and `disabled`.
