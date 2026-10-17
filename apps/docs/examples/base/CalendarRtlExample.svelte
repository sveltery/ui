<script lang="ts">
  import { arSA, he } from 'date-fns/locale';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr' },
    ar: { dir: 'rtl' },
    he: { dir: 'rtl' }
  } as const;

  const locales = { ar: arSA, he } as const;

  const language = useLanguage();
  let date = $state<Date | undefined>(new Date());
  const t = $derived(translations[language.current]);
  const locale = $derived(language.current === 'en' ? undefined : locales[language.current]);
</script>

<div class="mx-auto flex w-full max-w-xs flex-col gap-4">
  <Calendar mode="single" bind:selected={date} class="rounded-lg border [--cell-size:--spacing(9)]" captionLayout="dropdown" dir={t.dir} {locale} />
</div>
