<script lang="ts">
  import Autoplay from 'embla-carousel-autoplay';
  import { Card, CardContent } from '@sveltery/components/card';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@sveltery/components/carousel';

  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel
  plugins={[plugin]}
  class="w-full max-w-[10rem] sm:max-w-xs"
  onmouseenter={() => plugin.stop()}
  onmouseleave={() => plugin.reset()}
>
  <CarouselContent>
    {#each { length: 5 }, index (index)}
      <CarouselItem>
        <div class="p-1">
          <Card>
            <CardContent class="flex aspect-square items-center justify-center p-6">
              <span class="text-4xl font-semibold">{index + 1}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    {/each}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
