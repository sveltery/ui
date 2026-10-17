<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent } from '$registry/bases/base/ui/card';
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '$registry/bases/base/ui/carousel';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';

  const translations = {
    en: { dir: 'ltr' },
    ar: { dir: 'rtl' },
    he: { dir: 'rtl' },
  } as const;

  type Language = keyof typeof translations;

  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  let language = $state<Language>('ar');
  const dir = $derived(translations[language].dir);

  function formatNumber(num: number) {
    if (language !== 'ar') return num.toString();
    return [...num.toString()].map((digit) => arabicNumerals[Number(digit)]).join('');
  }
</script>

<div class="flex flex-col items-center gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as Language)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
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
  </DirectionProvider>
</div>
