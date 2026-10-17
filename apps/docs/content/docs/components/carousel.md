---
title: Carousel
description: A carousel with motion and swipe built using Embla.
---

<ComponentPreview name="base/CarouselDemoExample" />

## About

The carousel component is built using the [Embla Carousel](https://www.embla-carousel.com/) library. It calls the framework-agnostic `embla-carousel` core from a Svelte attachment, so it needs no Svelte wrapper package.

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add carousel
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install embla-carousel @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/carousel`.

<ComponentSource name="carousel" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '#lib/components/ui/carousel';
</script>
```

```svelte
<Carousel>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

## Composition

Use the following composition to build a `Carousel`:

```text
Carousel
├── CarouselContent
│   ├── CarouselItem
│   └── CarouselItem
├── CarouselPrevious
└── CarouselNext
```

## Sizes

To set the size of the items, you can use the `basis` utility class on `CarouselItem`.

<ComponentPreview name="base/CarouselSizeExample" />

```svelte
<!-- 33% of the carousel width. -->
<Carousel>
  <CarouselContent>
    <CarouselItem class="basis-1/3">...</CarouselItem>
    <CarouselItem class="basis-1/3">...</CarouselItem>
    <CarouselItem class="basis-1/3">...</CarouselItem>
  </CarouselContent>
</Carousel>
```

```svelte
<!-- 50% on small screens and 33% on larger screens. -->
<Carousel>
  <CarouselContent>
    <CarouselItem class="md:basis-1/2 lg:basis-1/3">...</CarouselItem>
    <CarouselItem class="md:basis-1/2 lg:basis-1/3">...</CarouselItem>
    <CarouselItem class="md:basis-1/2 lg:basis-1/3">...</CarouselItem>
  </CarouselContent>
</Carousel>
```

## Spacing

To set the spacing between the items, we use a `pl-[VALUE]` utility on `CarouselItem` and a negative `-ml-[VALUE]` on `CarouselContent`.

<ComponentPreview name="base/CarouselSpacingExample" />

```svelte
<Carousel>
  <CarouselContent class="-ml-4">
    <CarouselItem class="pl-4">...</CarouselItem>
    <CarouselItem class="pl-4">...</CarouselItem>
    <CarouselItem class="pl-4">...</CarouselItem>
  </CarouselContent>
</Carousel>
```

```svelte
<Carousel>
  <CarouselContent class="-ml-2 md:-ml-4">
    <CarouselItem class="pl-2 md:pl-4">...</CarouselItem>
    <CarouselItem class="pl-2 md:pl-4">...</CarouselItem>
    <CarouselItem class="pl-2 md:pl-4">...</CarouselItem>
  </CarouselContent>
</Carousel>
```

## Orientation

Use the `orientation` prop to set the orientation of the carousel.

<ComponentPreview name="base/CarouselOrientationExample" />

```svelte
<Carousel orientation="vertical">
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
</Carousel>
```

## Options

You can pass options to the carousel using the `opts` prop. See the [Embla Carousel docs](https://www.embla-carousel.com/api/options/) for more information.

```svelte
<Carousel opts={{ align: 'start', loop: true }}>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
</Carousel>
```

The carousel restarts Embla when `opts`, `plugins` or `orientation` change.

## API

Use `bind:api` to read the Embla instance. It is `undefined` until the carousel mounts. Store it in `$state.raw`, because the instance is not data to make deeply reactive.

<ComponentPreview name="base/CarouselApiExample" />

```svelte
<script lang="ts">
  import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '#lib/components/ui/carousel';

  let api = $state.raw<CarouselApi>();
  let current = $state(0);
  let count = $state(0);

  $effect(() => {
    if (!api) return;
    const carousel = api;
    const select = () => { current = carousel.selectedScrollSnap() + 1; };
    count = carousel.scrollSnapList().length;
    select();
    carousel.on('select', select);
    return () => { carousel.off('select', select); };
  });
</script>

<Carousel bind:api>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
</Carousel>
```

## Events

Listen to events on the instance from `bind:api`. Return a cleanup from the effect so the listener goes away with the instance.

```svelte
<script lang="ts">
  import type { CarouselApi } from '#lib/components/ui/carousel';

  let api = $state.raw<CarouselApi>();

  $effect(() => {
    if (!api) return;
    const onSelect = () => {
      // Do something on select.
    };
    api.on('select', onSelect);
    return () => { api?.off('select', onSelect); };
  });
</script>
```

See the [Embla Carousel events](https://www.embla-carousel.com/api/events/) for the full list.

## Plugins

You can use the `plugins` prop to add plugins to the carousel.

```svelte
<script lang="ts">
  import Autoplay from 'embla-carousel-autoplay';

  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel plugins={[plugin]} onmouseenter={() => plugin.stop()} onmouseleave={() => plugin.reset()}>
  <!-- ... -->
</Carousel>
```

<ComponentPreview name="base/CarouselPluginExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the carousel in a [DirectionProvider](/docs/components/direction), set `dir` on `Carousel` and use the language selector to switch the language.

<ComponentPreview name="base/CarouselRtlExample" direction="rtl" align="start" />

When localizing the carousel for RTL languages, you need to set the `direction` option in the `opts` prop to match the text direction. This ensures the carousel scrolls in the correct direction.

```svelte
<Carousel {dir} opts={{ direction: dir }}>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious class="rtl:rotate-180" />
  <CarouselNext class="rtl:rotate-180" />
</Carousel>
```

The `direction` option accepts `"ltr"` or `"rtl"` and should match the `dir` prop value. You may also want to rotate the navigation buttons using the `rtl:rotate-180` class to ensure they point in the correct direction.

## API Reference

See the [Embla Carousel docs](https://www.embla-carousel.com/api/) for more information on props and plugins.
