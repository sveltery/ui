<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '$registry/bases/base/ui/hover-card';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      name: 'Wireless Headphones',
      price: '$99.99',
      'inline-start': 'Inline Start',
      left: 'Left',
      top: 'Top',
      bottom: 'Bottom',
      right: 'Right',
      'inline-end': 'Inline End',
    },
    ar: {
      dir: 'rtl',
      name: 'سماعات لاسلكية',
      price: '٩٩.٩٩ $',
      'inline-start': 'بداية السطر',
      left: 'يسار',
      top: 'أعلى',
      bottom: 'أسفل',
      right: 'يمين',
      'inline-end': 'نهاية السطر',
    },
    he: {
      dir: 'rtl',
      name: 'אוזניות אלחוטיות',
      price: '99.99 $',
      'inline-start': 'תחילת השורה',
      left: 'שמאל',
      top: 'למעלה',
      bottom: 'למטה',
      right: 'ימין',
      'inline-end': 'סוף השורה',
    },
  } as const;

  const physicalSides = ['left', 'top', 'bottom', 'right'] as const;
  const logicalSides = ['inline-start', 'inline-end'] as const;
  type Side = (typeof physicalSides)[number] | (typeof logicalSides)[number];

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

{#snippet sideGroup(sides: readonly Side[])}
  <div class="flex flex-wrap justify-center gap-2">
    {#each sides as side (side)}
      <HoverCard>
        <HoverCardTrigger delay={10} closeDelay={100}>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          {t[side]}
        </HoverCardTrigger>
        <HoverCardContent {side} class="flex w-64 flex-col gap-1" dir={t.dir}>
          <div class="font-semibold">{t.name}</div>
          <div class="text-sm text-muted-foreground">{t.price}</div>
        </HoverCardContent>
      </HoverCard>
    {/each}
  </div>
{/snippet}

<div class="grid gap-4">
  <div class="grid gap-4">
    {@render sideGroup(physicalSides)}
    {@render sideGroup(logicalSides)}
  </div>
</div>
