<script lang="ts">
  import { Card, CardContent } from '@sveltery/components/card';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@sveltery/components/carousel';

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

<div class="mx-auto max-w-[10rem] sm:max-w-xs">
  <Carousel bind:api class="w-full max-w-xs">
    <CarouselContent>
      {#each { length: 5 }, index (index)}
        <CarouselItem>
          <Card class="m-px">
            <CardContent class="flex aspect-square items-center justify-center p-6">
              <span class="text-4xl font-semibold">{index + 1}</span>
            </CardContent>
          </Card>
        </CarouselItem>
      {/each}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
  <div class="py-2 text-center text-sm text-muted-foreground">
    Slide {current} of {count}
  </div>
</div>
