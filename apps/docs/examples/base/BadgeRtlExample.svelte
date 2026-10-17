<script lang="ts">
  import BadgeCheck from '@lucide/svelte/icons/badge-check';
  import BookmarkIcon from '@lucide/svelte/icons/bookmark';
  import { Badge } from '$registry/bases/base/ui/badge';
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';

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

  let language = $state<keyof typeof translations>('ar');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);
</script>

<div class="flex w-full flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
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
  </DirectionProvider>
</div>
