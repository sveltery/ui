<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { ScrollArea } from '$registry/bases/base/ui/scroll-area';
  import { Separator } from '$registry/bases/base/ui/separator';

  const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

  const translations = {
    en: { dir: 'ltr', values: { tags: 'Tags' } },
    ar: { dir: 'rtl', values: { tags: 'العلامات' } },
    he: { dir: 'rtl', values: { tags: 'תגיות' } }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
    <ScrollArea class="h-72 w-48 rounded-md border" {dir}>
      <div class="p-4">
        <h4 class="mb-4 text-sm leading-none font-medium">{t.tags}</h4>
        {#each tags as tag (tag)}
          <div class="text-sm">{tag}</div>
          <Separator class="my-2" />
        {/each}
      </div>
    </ScrollArea>
  </DirectionProvider>
</div>
