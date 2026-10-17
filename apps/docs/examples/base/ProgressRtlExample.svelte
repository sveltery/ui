<script lang="ts">
  import { Progress, ProgressLabel, ProgressValue } from '$registry/bases/base/ui/progress';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr', values: { label: 'Upload progress' } },
    ar: { dir: 'rtl', values: { label: 'تقدم الرفع' } },
    he: { dir: 'rtl', values: { label: 'התקדמות העלאה' } }
  } as const;

  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  function toArabicNumerals(num: number): string {
    return num
      .toString()
      .split('')
      .map((digit) => arabicNumerals[parseInt(digit, 10)])
      .join('');
  }

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);

  function formatNumber(num: number): string {
    return language.current === 'ar' ? toArabicNumerals(num) : num.toString();
  }
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <Progress value={56} class="w-full max-w-sm" {dir}>
    <ProgressLabel>{t.label}</ProgressLabel>
    <ProgressValue>
      {#snippet children(value)}
        <span class="ms-auto">{formatNumber(parseFloat(value ?? '0'))}%</span>
      {/snippet}
    </ProgressValue>
  </Progress>
</div>
