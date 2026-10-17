<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Field, FieldContent, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Switch } from '$registry/bases/base/ui/switch';

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
    <Field orientation="horizontal" class="max-w-sm" dir={t.dir}>
      <FieldContent>
        <FieldLabel for="switch-focus-mode-rtl" dir={t.dir}>{t.label}</FieldLabel>
        <FieldDescription dir={t.dir}>{t.description}</FieldDescription>
      </FieldContent>
      <Switch id="switch-focus-mode-rtl" dir={t.dir} />
    </Field>
  </DirectionProvider>
</div>
