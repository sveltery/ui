<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { NativeSelect, NativeSelectOption } from '$registry/bases/base/ui/native-select';

  const translations = {
    en: {
      dir: 'ltr',
      placeholder: 'Select status',
      todo: 'Todo',
      inProgress: 'In Progress',
      done: 'Done',
      cancelled: 'Cancelled'
    },
    ar: {
      dir: 'rtl',
      placeholder: 'اختر الحالة',
      todo: 'مهام',
      inProgress: 'قيد التنفيذ',
      done: 'منجز',
      cancelled: 'ملغي'
    },
    he: {
      dir: 'rtl',
      placeholder: 'בחר סטטוס',
      todo: 'לעשות',
      inProgress: 'בתהליך',
      done: 'הושלם',
      cancelled: 'בוטל'
    }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const t = $derived(translations[language]);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={t.dir}>
    <NativeSelect dir={t.dir}>
      <NativeSelectOption value="">{t.placeholder}</NativeSelectOption>
      <NativeSelectOption value="todo">{t.todo}</NativeSelectOption>
      <NativeSelectOption value="in-progress">{t.inProgress}</NativeSelectOption>
      <NativeSelectOption value="done">{t.done}</NativeSelectOption>
      <NativeSelectOption value="cancelled">{t.cancelled}</NativeSelectOption>
    </NativeSelect>
  </DirectionProvider>
</div>
