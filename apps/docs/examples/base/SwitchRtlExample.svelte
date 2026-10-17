<script lang="ts">
  import { Field, FieldContent, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Switch } from '$registry/bases/base/ui/switch';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      label: 'Share across devices',
      description: 'Focus is shared across devices, and turns off when you leave the app.'
    },
    ar: {
      dir: 'rtl',
      label: 'المشاركة عبر الأجهزة',
      description: 'يتم مشاركة التركيز عبر الأجهزة، ويتم إيقاف تشغيله عند مغادرة التطبيق.'
    },
    he: {
      dir: 'rtl',
      label: 'שיתוף בין מכשירים',
      description: 'המיקוד משותף בין מכשירים, וכבה כשאתה עוזב את האפליקציה.'
    }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <Field orientation="horizontal" class="max-w-sm" dir={t.dir}>
    <FieldContent>
      <FieldLabel for="switch-focus-mode-rtl" dir={t.dir}>{t.label}</FieldLabel>
      <FieldDescription dir={t.dir}>{t.description}</FieldDescription>
    </FieldContent>
    <Switch id="switch-focus-mode-rtl" dir={t.dir} />
  </Field>
</div>
