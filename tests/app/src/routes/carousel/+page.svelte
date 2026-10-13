<script lang="ts">
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@sveltery/ui/carousel';
  let api = $state.raw<CarouselApi>();
  let selected = $state(-1);
  let loop = $state(false);
  $effect(() => {
    if (!api) return;
    const carousel = api;
    const select = () => { selected = carousel.selectedScrollSnap(); };
    select();
    carousel.on('select', select).on('reInit', select);
    return () => { carousel.off('select', select).off('reInit', select); };
  });
</script>
<label><input type="checkbox" bind:checked={loop} /> Loop</label>
<p data-testid="selected">{selected}</p>
<Carousel bind:api opts={{ loop }} class="mx-16 w-64">
  <CarouselContent>
    {#each ['One', 'Two', 'Three'] as label (label)}
      <CarouselItem><div class="h-32">{label}</div></CarouselItem>
    {/each}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
