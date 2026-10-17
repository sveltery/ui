<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';

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
    <Field dir={t.dir}>
      <FieldLabel for="input-rtl-api-key">{t.apiKey}</FieldLabel>
      <Input id="input-rtl-api-key" type="password" placeholder={t.placeholder} dir={t.dir} />
      <FieldDescription>{t.description}</FieldDescription>
    </Field>
  </DirectionProvider>
</div>
