<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr', list: 'List', grid: 'Grid', cards: 'Cards' },
    ar: { dir: 'rtl', list: 'قائمة', grid: 'شبكة', cards: 'بطاقات' },
    he: { dir: 'rtl', list: 'רשימה', grid: 'רשת', cards: 'כרטיסים' }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex flex-col items-center gap-4">
  <ToggleGroup variant="outline" value={['list']} dir={t.dir}>
    <ToggleGroupItem value="list" aria-label={t.list}>{t.list}</ToggleGroupItem>
    <ToggleGroupItem value="grid" aria-label={t.grid}>{t.grid}</ToggleGroupItem>
    <ToggleGroupItem value="cards" aria-label={t.cards}>{t.cards}</ToggleGroupItem>
  </ToggleGroup>
</div>
