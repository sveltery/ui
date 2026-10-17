<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { format } from 'date-fns';
  import { arSA, he } from 'date-fns/locale';
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';

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

  let language = $state<keyof typeof translations>('ar');
  let date = $state<Date | undefined>();
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);
  const locale = $derived(dir === 'rtl' ? locales[language as keyof typeof locales] : undefined);
  const lang = $derived(dir === 'rtl' ? language : undefined);
</script>

<div class="flex w-full max-w-sm flex-col items-start gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
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
  </DirectionProvider>
</div>
