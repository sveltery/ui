<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Item, ItemContent, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';
  import { Spinner } from '$registry/bases/base/ui/spinner';

  const translations = {
    en: { dir: 'ltr', title: 'Processing payment...', amount: '$100.00' },
    ar: { dir: 'rtl', title: 'جاري معالجة الدفع...', amount: '١٠٠.٠٠ دولار' },
    he: { dir: 'rtl', title: 'מעבד תשלום...', amount: '$100.00' }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const t = $derived(translations[language]);
</script>

<div class="flex w-full max-w-xs flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={t.dir}>
    <div class="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]" dir={t.dir}>
      <Item variant="muted" dir={t.dir}>
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle class="line-clamp-1">{t.title}</ItemTitle>
        </ItemContent>
        <ItemContent class="flex-none justify-end">
          <span class="text-sm tabular-nums">{t.amount}</span>
        </ItemContent>
      </Item>
    </div>
  </DirectionProvider>
</div>
