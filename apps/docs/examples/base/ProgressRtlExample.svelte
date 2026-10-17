<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Progress, ProgressLabel, ProgressValue } from '$registry/bases/base/ui/progress';

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

  let language = $state<keyof typeof translations>('ar');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);

  function formatNumber(num: number): string {
    return language === 'ar' ? toArabicNumerals(num) : num.toString();
  }
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
    <Progress value={56} class="w-full max-w-sm" {dir}>
      <ProgressLabel>{t.label}</ProgressLabel>
      <ProgressValue>
        {#snippet children(value)}
          <span class="ms-auto">{formatNumber(parseFloat(value ?? '0'))}%</span>
        {/snippet}
      </ProgressValue>
    </Progress>
  </DirectionProvider>
</div>
