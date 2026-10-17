<script lang="ts">
  import { ScrollArea } from '$registry/bases/base/ui/scroll-area';
  import { Separator } from '$registry/bases/base/ui/separator';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

  const translations = {
    en: { dir: 'ltr', values: { tags: 'Tags' } },
    ar: { dir: 'rtl', values: { tags: 'العلامات' } },
    he: { dir: 'rtl', values: { tags: 'תגיות' } }
  } as const;

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <ScrollArea class="h-72 w-48 rounded-md border" {dir}>
    <div class="p-4">
      <h4 class="mb-4 text-sm leading-none font-medium">{t.tags}</h4>
      {#each tags as tag (tag)}
        <div class="text-sm">{tag}</div>
        <Separator class="my-2" />
      {/each}
    </div>
  </ScrollArea>
</div>
