<script lang="ts">
  import BookmarkIcon from '@lucide/svelte/icons/bookmark';
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Toggle } from '$registry/bases/base/ui/toggle';

  const translations = {
    en: { dir: 'ltr', label: 'Bookmark' },
    ar: { dir: 'rtl', label: 'إشارة مرجعية' },
    he: { dir: 'rtl', label: 'סימנייה' }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const t = $derived(translations[language]);
</script>

<div class="flex flex-col items-center gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={t.dir}>
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline" dir={t.dir}>
      <BookmarkIcon class="group-aria-pressed/toggle:fill-foreground" />
      {t.label}
    </Toggle>
  </DirectionProvider>
</div>
