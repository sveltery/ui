<script lang="ts">
  import BookmarkIcon from '@lucide/svelte/icons/bookmark';
  import { Toggle } from '$registry/bases/base/ui/toggle';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr', label: 'Bookmark' },
    ar: { dir: 'rtl', label: 'إشارة مرجعية' },
    he: { dir: 'rtl', label: 'סימנייה' }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex flex-col items-center gap-4">
  <Toggle aria-label="Toggle bookmark" size="sm" variant="outline" dir={t.dir}>
    <BookmarkIcon class="group-aria-pressed/toggle:fill-foreground" />
    {t.label}
  </Toggle>
</div>
