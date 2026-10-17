<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';
  import { useLanguage } from '$lib/components/docs/language.svelte';

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

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
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
</div>
