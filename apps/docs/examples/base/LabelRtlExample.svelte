<script lang="ts">
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { Label } from '$registry/bases/base/ui/label';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr', label: 'Accept terms and conditions' },
    ar: { dir: 'rtl', label: 'قبول الشروط والأحكام' },
    he: { dir: 'rtl', label: 'קבל תנאים והגבלות' }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex gap-2" dir={t.dir}>
    <Checkbox id="terms-rtl" dir={t.dir} />
    <Label for="terms-rtl" dir={t.dir}>{t.label}</Label>
  </div>
</div>
