<script lang="ts">
  import { arSA, he } from 'date-fns/locale';
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';

  const translations = {
    en: { dir: 'ltr' },
    ar: { dir: 'rtl' },
    he: { dir: 'rtl' }
  } as const;

  const locales = { ar: arSA, he } as const;

  let language = $state<keyof typeof translations>('ar');
  let date = $state<Date | undefined>(new Date());
  const t = $derived(translations[language]);
  const locale = $derived(language === 'en' ? undefined : locales[language]);
</script>

<div class="mx-auto flex w-full max-w-xs flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={t.dir}>
    <Calendar mode="single" bind:selected={date} class="rounded-lg border [--cell-size:--spacing(9)]" captionLayout="dropdown" dir={t.dir} {locale} />
  </DirectionProvider>
</div>
