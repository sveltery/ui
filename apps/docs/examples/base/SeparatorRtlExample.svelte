<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Separator } from '$registry/bases/base/ui/separator';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        title: 'shadcn/ui',
        subtitle: 'The Foundation for your Design System',
        description: 'A set of beautifully designed components that you can customize, extend, and build on.'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        title: 'shadcn/ui',
        subtitle: 'الأساس لنظام التصميم الخاص بك',
        description: 'مجموعة من المكونات المصممة بشكل جميل يمكنك تخصيصها وتوسيعها والبناء عليها.'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        title: 'shadcn/ui',
        subtitle: 'הבסיס למערכת העיצוב שלך',
        description: 'סט של רכיבים מעוצבים בצורה יפה שאתה יכול להתאים אישית, להרחיב ולבנות עליהם.'
      }
    }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <div class="flex max-w-sm flex-col gap-4 text-sm" {dir}>
    <div class="flex flex-col gap-1.5">
      <div class="leading-none font-medium">{t.title}</div>
      <div class="text-muted-foreground">{t.subtitle}</div>
    </div>
    <Separator />
    <div>{t.description}</div>
  </div>
</div>
