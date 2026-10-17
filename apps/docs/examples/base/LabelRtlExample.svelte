<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Label } from '$registry/bases/base/ui/label';

  const translations = {
    en: { dir: 'ltr', label: 'Accept terms and conditions' },
    ar: { dir: 'rtl', label: 'قبول الشروط والأحكام' },
    he: { dir: 'rtl', label: 'קבל תנאים והגבלות' }
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
    <div class="flex gap-2" dir={t.dir}>
      <Checkbox id="terms-rtl" dir={t.dir} />
      <Label for="terms-rtl" dir={t.dir}>{t.label}</Label>
    </div>
  </DirectionProvider>
</div>
