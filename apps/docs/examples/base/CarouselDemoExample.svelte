<script lang="ts">
  import { Card, CardContent } from '$registry/bases/base/ui/card';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '$registry/bases/base/ui/carousel';
</script>

<Carousel class="w-full max-w-[12rem] sm:max-w-xs">
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
