<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { format } from 'date-fns';
  import { arSA, he } from 'date-fns/locale';
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        placeholder: 'Pick a date',
      },
    },
    ar: {
      dir: 'rtl',
      values: {
        placeholder: 'اختر تاريخًا',
      },
    },
    he: {
      dir: 'rtl',
      values: {
        placeholder: 'בחר תאריך',
      },
    },
  } as const;

  const locales = { ar: arSA, he } as const;

  const language = useLanguage();
  let date = $state<Date | undefined>();
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);
  const locale = $derived(dir === 'rtl' ? locales[language.current as keyof typeof locales] : undefined);
  const lang = $derived(dir === 'rtl' ? language.current : undefined);
</script>

<div class="flex w-full max-w-sm flex-col items-start gap-4">
  <Popover>
    <PopoverTrigger data-empty={!date} {dir}>
      {#snippet render(props, _state, content)}
        <Button variant="outline" class="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground" {...props}>{@render content?.()}</Button>
      {/snippet}
      {#if date}{format(date, 'PPP', { locale })}{:else}<span>{t.placeholder}</span>{/if}
      <ChevronDownIcon data-icon="inline-end" />
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start" {dir} data-lang={lang}>
      <Calendar mode="single" bind:selected={date} defaultMonth={date} {dir} {locale} />
    </PopoverContent>
  </Popover>
</div>
