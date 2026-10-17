<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';

  const translations = {
    en: { dir: 'ltr', list: 'List', grid: 'Grid', cards: 'Cards' },
    ar: { dir: 'rtl', list: 'قائمة', grid: 'شبكة', cards: 'بطاقات' },
    he: { dir: 'rtl', list: 'רשימה', grid: 'רשת', cards: 'כרטיסים' }
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
    <ToggleGroup variant="outline" value={['list']} dir={t.dir}>
      <ToggleGroupItem value="list" aria-label={t.list}>{t.list}</ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label={t.grid}>{t.grid}</ToggleGroupItem>
      <ToggleGroupItem value="cards" aria-label={t.cards}>{t.cards}</ToggleGroupItem>
    </ToggleGroup>
  </DirectionProvider>
</div>
