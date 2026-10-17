<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Textarea } from '$registry/bases/base/ui/textarea';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      label: 'Feedback',
      placeholder: 'Your feedback helps us improve...',
      description: 'Share your thoughts about our service.'
    },
    ar: {
      dir: 'rtl',
      label: 'التعليقات',
      placeholder: 'تعليقاتك تساعدنا على التحسين...',
      description: 'شاركنا أفكارك حول خدمتنا.'
    },
    he: {
      dir: 'rtl',
      label: 'משוב',
      placeholder: 'המשוב שלך עוזר לנו להשתפר...',
      description: 'שתף את מחשבותיך על השירות שלנו.'
    }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex w-full max-w-xs flex-col gap-4">
  <Field class="w-full max-w-xs" dir={t.dir}>
    <FieldLabel for="feedback" dir={t.dir}>{t.label}</FieldLabel>
    <Textarea id="feedback" placeholder={t.placeholder} dir={t.dir} rows={4} />
    <FieldDescription dir={t.dir}>{t.description}</FieldDescription>
  </Field>
</div>
