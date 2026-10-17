<script lang="ts">
  import BadgeCheck from '@lucide/svelte/icons/badge-check';
  import BookmarkIcon from '@lucide/svelte/icons/bookmark';
  import { Badge } from '$registry/bases/base/ui/badge';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        badge: 'Badge',
        secondary: 'Secondary',
        destructive: 'Destructive',
        outline: 'Outline',
        verified: 'Verified',
        bookmark: 'Bookmark'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        badge: 'شارة',
        secondary: 'ثانوي',
        destructive: 'مدمر',
        outline: 'مخطط',
        verified: 'متحقق',
        bookmark: 'إشارة مرجعية'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        badge: 'תג',
        secondary: 'משני',
        destructive: 'הרסני',
        outline: 'קווי מתאר',
        verified: 'מאומת',
        bookmark: 'סימנייה'
      }
    }
  } as const;

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);
</script>

<div class="flex w-full flex-col gap-4">
  <div class="flex w-full flex-wrap justify-center gap-2" {dir}>
    <Badge>{t.badge}</Badge>
    <Badge variant="secondary">{t.secondary}</Badge>
    <Badge variant="destructive">{t.destructive}</Badge>
    <Badge variant="outline">{t.outline}</Badge>
    <Badge variant="secondary">
      <BadgeCheck data-icon="inline-start" />
      {t.verified}
    </Badge>
    <Badge variant="outline">
      {t.bookmark}
      <BookmarkIcon data-icon="inline-end" />
    </Badge>
  </div>
</div>
