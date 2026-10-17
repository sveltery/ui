<script lang="ts">
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Spinner } from '$registry/bases/base/ui/spinner';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        button: 'Button',
        submit: 'Submit',
        delete: 'Delete',
        loading: 'Loading'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        button: 'زر',
        submit: 'إرسال',
        delete: 'حذف',
        loading: 'جاري التحميل'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        button: 'כפתור',
        submit: 'שלח',
        delete: 'מחק',
        loading: 'טוען'
      }
    }
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
    <div class="flex flex-wrap items-center gap-2 md:flex-row" {dir}>
      <Button variant="outline">{t.button}</Button>
      <Button variant="destructive">{t.delete}</Button>
      <Button variant="outline">
        {t.submit}
        <ArrowRightIcon class="rtl:rotate-180" data-icon="inline-end" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button variant="secondary" disabled>
        <Spinner data-icon="inline-start" />
        {t.loading}
      </Button>
    </div>
  </DirectionProvider>
</div>
