<script lang="ts">
  import { Card, CardContent } from '$registry/bases/base/ui/card';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '$registry/bases/base/ui/carousel';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr' },
    ar: { dir: 'rtl' },
    he: { dir: 'rtl' },
  } as const;

  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);

  function formatNumber(num: number) {
    if (language.current !== 'ar') return num.toString();
    return [...num.toString()].map((digit) => arabicNumerals[Number(digit)]).join('');
  }
</script>

<div class="flex flex-col items-center gap-4">
  <Carousel {dir} class="w-full max-w-[12rem] sm:max-w-xs" opts={{ direction: dir }}>
    <CarouselContent>
      {#each { length: 5 }, index (index)}
        <CarouselItem>
          <div class="p-1">
            <Card>
              <CardContent class="flex aspect-square items-center justify-center p-6">
                <span class="text-4xl font-semibold">{formatNumber(index + 1)}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      {/each}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>
