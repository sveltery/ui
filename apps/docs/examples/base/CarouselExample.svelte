<script lang="ts">
  import { Card, CardContent } from '@sveltery/components/card';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@sveltery/components/carousel';
  import { Example, ExampleWrapper } from '@sveltery/components/example';
</script>

<ExampleWrapper class="lg:grid-cols-1">
  <Example title="Basic">
    <Carousel class="mx-auto max-w-xs sm:max-w-sm">
      <CarouselContent>
        {#each { length: 5 }, index (index)}
          <CarouselItem>
            <div class="p-1 style-luma:p-2.5">
              <Card>
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        {/each}
      </CarouselContent>
      <CarouselPrevious class="hidden sm:inline-flex" />
      <CarouselNext class="hidden sm:inline-flex" />
    </Carousel>
  </Example>
  <Example title="Multiple">
    <Carousel class="mx-auto max-w-xs sm:max-w-sm" opts={{ align: 'start' }}>
      <CarouselContent>
        {#each { length: 5 }, index (index)}
          <CarouselItem class="sm:basis-1/2 lg:basis-1/3">
            <div class="p-1 style-luma:p-2.5">
              <Card>
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        {/each}
      </CarouselContent>
      <CarouselPrevious class="hidden sm:inline-flex" />
      <CarouselNext class="hidden sm:inline-flex" />
    </Carousel>
  </Example>
  <Example title="With Gap">
    <Carousel class="mx-auto max-w-xs sm:max-w-sm">
      <CarouselContent class="-ml-1">
        {#each { length: 5 }, index (index)}
          <CarouselItem class="pl-1 md:basis-1/2">
            <div class="p-1 style-luma:p-2.5">
              <Card>
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-2xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        {/each}
      </CarouselContent>
      <CarouselPrevious class="hidden sm:inline-flex" />
      <CarouselNext class="hidden sm:inline-flex" />
    </Carousel>
  </Example>
</ExampleWrapper>
