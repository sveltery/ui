---
title: Accordion
description: A vertically stacked set of interactive headings that each reveal a section of content.
---

<ComponentPreview name="base/AccordionExample" />

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
<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Composition

```text
Accordion
├── AccordionItem
│   ├── AccordionTrigger
│   └── AccordionContent
└── AccordionItem
    ├── AccordionTrigger
    └── AccordionContent
```

## Open items

`Accordion` holds the values of its open items in `value`. Pass it, or bind it to read and set the open items.

```svelte
<script lang="ts">
  let value = $state(['item-1']);
</script>

<Accordion bind:value>
  <AccordionItem value="item-1">…</AccordionItem>
  <AccordionItem value="item-2">…</AccordionItem>
</Accordion>
```

## Multiple

Set `multiple` to let several items stay open at the same time. Without it, opening one item closes the others.

```svelte
<Accordion multiple>…</Accordion>
```

## Disabled

Set `disabled` on an `AccordionItem` to disable that item.

```svelte
<AccordionItem value="item-2" disabled>…</AccordionItem>
```

## API reference

`Accordion` is styled on top of the Sveltery Base `Accordion` primitive, which owns its behavior, open state and accessibility. See the [Base UI Accordion documentation](https://base-ui.com/react/components/accordion) for the behavior it ports.
