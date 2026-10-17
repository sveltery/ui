<script lang="ts">
  import { Card, CardContent } from '$registry/bases/base/ui/card';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '$registry/bases/base/ui/carousel';
</script>

<Carousel opts={{ align: 'start' }} class="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm">
  <CarouselContent>
    {#each { length: 5 }, index (index)}
      <CarouselItem class="basis-1/2 lg:basis-1/3">
        <div class="p-1">
          <Card>
            <CardContent class="flex aspect-square items-center justify-center p-6">
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
