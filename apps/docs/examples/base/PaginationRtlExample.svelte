<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
  } from '$registry/bases/base/ui/pagination';

  const translations = {
    en: { dir: 'ltr', previous: 'Previous', next: 'Next' },
    ar: { dir: 'rtl', previous: 'السابق', next: 'التالي' },
    he: { dir: 'rtl', previous: 'הקודם', next: 'הבא' }
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
  const t = $derived(translations[language]);

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
  <DirectionProvider direction={t.dir}>
    <Pagination dir={t.dir}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" text={t.previous} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">{formatNumber(1)}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>{formatNumber(2)}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">{formatNumber(3)}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" text={t.next} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </DirectionProvider>
</div>
