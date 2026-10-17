<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Textarea } from '$registry/bases/base/ui/textarea';

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
    <Field class="w-full max-w-xs" dir={t.dir}>
      <FieldLabel for="feedback" dir={t.dir}>{t.label}</FieldLabel>
      <Textarea id="feedback" placeholder={t.placeholder} dir={t.dir} rows={4} />
      <FieldDescription dir={t.dir}>{t.description}</FieldDescription>
    </Field>
  </DirectionProvider>
</div>
