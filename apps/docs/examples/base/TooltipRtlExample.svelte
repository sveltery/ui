<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        content: 'Add to library',
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
        content: 'إضافة إلى المكتبة',
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
        content: 'הוסף לספרייה',
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
      <div class="flex flex-wrap justify-center gap-2">
        {#each physicalSides as side (side)}
          <Tooltip>
            <TooltipTrigger>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              {t[side]}
            </TooltipTrigger>
            <TooltipContent {side} {dir}>
              {t.content}
            </TooltipContent>
          </Tooltip>
        {/each}
      </div>
      <div class="flex flex-wrap justify-center gap-2">
        {#each logicalSides as side (side)}
          <Tooltip>
            <TooltipTrigger>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              {t[side]}
            </TooltipTrigger>
            <TooltipContent {side} {dir}>
              {t.content}
            </TooltipContent>
          </Tooltip>
        {/each}
      </div>
    </div>
  </DirectionProvider>
</div>
