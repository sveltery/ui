<script lang="ts">
  import { Card, CardContent } from '@sveltery/components/card';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@sveltery/components/carousel';
</script>

<Carousel opts={{ align: 'start' }} orientation="vertical" class="my-12 w-full max-w-xs">
  <CarouselContent class="-mt-1 h-[270px]">
    {#each { length: 5 }, index (index)}
      <CarouselItem class="basis-1/2 pt-1">
        <div class="p-1">
          <Card>
            <CardContent class="flex items-center justify-center p-6">
              <span class="text-3xl font-semibold">{index + 1}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    {/each}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
