<script lang="ts">
  import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue } from '$registry/bases/base/ui/combobox';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const categories = ['technology', 'design', 'business', 'marketing', 'education', 'health'] as const;

  const translations = {
    en: {
      dir: 'ltr',
      label: 'Categories',
      placeholder: 'Add categories',
      empty: 'No categories found.',
      technology: 'Technology',
      design: 'Design',
      business: 'Business',
      marketing: 'Marketing',
      education: 'Education',
      health: 'Health'
    },
    ar: {
      dir: 'rtl',
      label: 'الفئات',
      placeholder: 'أضف فئات',
      empty: 'لم يتم العثور على فئات.',
      technology: 'التكنولوجيا',
      design: 'التصميم',
      business: 'الأعمال',
      marketing: 'التسويق',
      education: 'التعليم',
      health: 'الصحة'
    },
    he: {
      dir: 'rtl',
      label: 'קטגוריות',
      placeholder: 'הוסף קטגוריות',
      empty: 'לא נמצאו קטגוריות.',
      technology: 'טכנולוגיה',
      design: 'עיצוב',
      business: 'עסקים',
      marketing: 'שיווק',
      education: 'חינוך',
      health: 'בריאות'
    }
  } as const;

  const language = useLanguage();
  let anchor = $state<HTMLElement | null>(null);
  const t = $derived(translations[language.current]);
  const label = (category: string) => t[category as (typeof categories)[number]] ?? category;
</script>

<div class="mx-auto flex w-full max-w-xs flex-col gap-4">
  <Field>
    <FieldLabel>{t.label}</FieldLabel>
    <Combobox multiple autoHighlight items={categories} defaultValue={[categories[0]]} itemToStringLabel={label} itemToStringValue={label}>
      <ComboboxChips {@attach (node) => { anchor = node; }}>
        <ComboboxValue>
          {#snippet children(values)}
            {const selected = $derived(values as string[])}
            {#each selected as value (value)}
              <ComboboxChip>{label(value)}</ComboboxChip>
            {/each}
            <ComboboxChipsInput placeholder={t.placeholder} />
          {/snippet}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent {anchor} dir={t.dir} data-lang={t.dir === 'rtl' ? language.current : undefined}>
        <ComboboxEmpty>{t.empty}</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {#snippet children(item: string)}
              <ComboboxItem value={item}>{label(item)}</ComboboxItem>
            {/snippet}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  </Field>
</div>
