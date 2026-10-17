<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '$registry/bases/base/ui/popover';
  import { useLanguage } from '$lib/components/docs/language.svelte';

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

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
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
</div>
