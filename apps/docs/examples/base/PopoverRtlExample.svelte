<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '$registry/bases/base/ui/popover';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        title: 'Dimensions',
        description: 'Set the dimensions for the layer.',
        'inline-start': 'Inline Start',
        left: 'Left',
        top: 'Top',
        bottom: 'Bottom',
        right: 'Right',
        'inline-end': 'Inline End'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        title: 'الأبعاد',
        description: 'تعيين الأبعاد للطبقة.',
        'inline-start': 'بداية السطر',
        left: 'يسار',
        top: 'أعلى',
        bottom: 'أسفل',
        right: 'يمين',
        'inline-end': 'نهاية السطر'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        title: 'מימדים',
        description: 'הגדר את המימדים לשכבה.',
        'inline-start': 'תחילת השורה',
        left: 'שמאל',
        top: 'למעלה',
        bottom: 'למטה',
        right: 'ימין',
        'inline-end': 'סוף השורה'
      }
    }
  } as const;

  const physicalSides = ['left', 'top', 'bottom', 'right'] as const;
  const logicalSides = ['inline-start', 'inline-end'] as const;

  let language = $state<keyof typeof translations>('ar');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
    <div class="grid gap-4">
      {#each [physicalSides, logicalSides] as sides (sides[0])}
        <div class="flex flex-wrap justify-center gap-2">
          {#each sides as side (side)}
            <Popover>
              <PopoverTrigger>
                {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                {t[side]}
              </PopoverTrigger>
              <PopoverContent {side} {dir}>
                <PopoverHeader>
                  <PopoverTitle>{t.title}</PopoverTitle>
                  <PopoverDescription>{t.description}</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          {/each}
        </div>
      {/each}
    </div>
  </DirectionProvider>
</div>
