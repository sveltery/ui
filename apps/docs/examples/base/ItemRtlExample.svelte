<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
  import { Button } from '$registry/bases/base/ui/button';
  import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      basicItem: 'Basic Item',
      basicItemDesc: 'A simple item with title and description.',
      action: 'Action',
      verifiedTitle: 'Your profile has been verified.'
    },
    ar: {
      dir: 'rtl',
      basicItem: 'عنصر أساسي',
      basicItemDesc: 'عنصر بسيط يحتوي على عنوان ووصف.',
      action: 'إجراء',
      verifiedTitle: 'تم التحقق من ملفك الشخصي.'
    },
    he: {
      dir: 'rtl',
      basicItem: 'פריט בסיסי',
      basicItemDesc: 'פריט פשוט עם כותרת ותיאור.',
      action: 'פעולה',
      verifiedTitle: 'הפרופיל שלך אומת.'
    }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<div class="flex w-full max-w-md flex-col gap-4">
  <div class="flex w-full flex-col gap-6" dir={t.dir}>
    <Item variant="outline" dir={t.dir}>
      <ItemContent>
        <ItemTitle>{t.basicItem}</ItemTitle>
        <ItemDescription>{t.basicItemDesc}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">{t.action}</Button>
      </ItemActions>
    </Item>
    <Item variant="outline" size="sm" render={link} dir={t.dir}>
      <ItemMedia>
        <BadgeCheckIcon class="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{t.verifiedTitle}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <ChevronRightIcon class="size-4" />
      </ItemActions>
    </Item>
  </div>
</div>
