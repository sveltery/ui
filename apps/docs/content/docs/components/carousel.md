---
title: Carousel
description: A carousel with motion and swipe built using Embla.
---

<ComponentPreview name="base/CarouselExample" />

## About

The carousel component is built using the [Embla Carousel](https://www.embla-carousel.com/) library. It calls the framework-agnostic `embla-carousel` core from a Svelte attachment, so it needs no Svelte wrapper package.

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx sveltery add carousel
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority embla-carousel @sveltery/base @lucide/svelte
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
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '$lib/components/ui/carousel';
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

To set the size of the items, use the `basis` utility class on `CarouselItem`. The Multiple example above shows three items per view on large screens.

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

To set the spacing between the items, use a `pl-[VALUE]` utility on `CarouselItem` and a negative `-ml-[VALUE]` on `CarouselContent`. The With Gap example above uses `pl-1` and `-ml-1`.

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

Pass options to the carousel with the `opts` prop. See the [Embla Carousel options](https://www.embla-carousel.com/api/options/) for the full list.

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
  import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '$lib/components/ui/carousel';

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
  import type { CarouselApi } from '$lib/components/ui/carousel';

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

Use the `plugins` prop to add plugins to the carousel.

<ComponentPreview name="base/CarouselPluginExample" />

```svelte
<script lang="ts">
  import Autoplay from 'embla-carousel-autoplay';

  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel plugins={[plugin]} onmouseenter={() => plugin.stop()} onmouseleave={() => plugin.reset()}>
  <!-- ... -->
</Carousel>
```

## Keyboard

The left and right arrow keys move to the previous and next slide while focus is inside the carousel. `CarouselPrevious` and `CarouselNext` are disabled when there is no slide to move to.

## RTL

When localizing the carousel for right-to-left languages, set Embla's `direction` option to match the text direction so the carousel scrolls the correct way.

```svelte
<Carousel dir="rtl" opts={{ direction: 'rtl' }}>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious class="rtl:rotate-180" />
  <CarouselNext class="rtl:rotate-180" />
</Carousel>
```

The `direction` option accepts `ltr` or `rtl` and should match the `dir` attribute. Rotate the navigation buttons with `rtl:rotate-180` so they point the right way.

## API reference

See the [Embla Carousel API](https://www.embla-carousel.com/api/) for the instance methods, options and plugins.
