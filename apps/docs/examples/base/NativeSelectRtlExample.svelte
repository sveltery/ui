<script lang="ts">
  import { NativeSelect, NativeSelectOption } from '$registry/bases/base/ui/native-select';
  import { useLanguage } from '$lib/components/docs/language.svelte';

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

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <NativeSelect dir={t.dir}>
    <NativeSelectOption value="">{t.placeholder}</NativeSelectOption>
    <NativeSelectOption value="todo">{t.todo}</NativeSelectOption>
    <NativeSelectOption value="in-progress">{t.inProgress}</NativeSelectOption>
    <NativeSelectOption value="done">{t.done}</NativeSelectOption>
    <NativeSelectOption value="cancelled">{t.cancelled}</NativeSelectOption>
  </NativeSelect>
</div>
