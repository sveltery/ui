<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      apiKey: 'API Key',
      placeholder: 'sk-...',
      description: 'Your API key is encrypted and stored securely.'
    },
    ar: {
      dir: 'rtl',
      apiKey: 'مفتاح API',
      placeholder: 'sk-...',
      description: 'مفتاح API الخاص بك مشفر ومخزن بأمان.'
    },
    he: {
      dir: 'rtl',
      apiKey: 'מפתח API',
      placeholder: 'sk-...',
      description: 'מפתח ה-API שלך מוצפן ונשמר בצורה מאובטחת.'
    }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex w-full max-w-xs flex-col gap-4">
  <Field dir={t.dir}>
    <FieldLabel for="input-rtl-api-key">{t.apiKey}</FieldLabel>
    <Input id="input-rtl-api-key" type="password" placeholder={t.placeholder} dir={t.dir} />
    <FieldDescription>{t.description}</FieldDescription>
  </Field>
</div>
