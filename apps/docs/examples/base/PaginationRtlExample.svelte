<script lang="ts">
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
  } from '$registry/bases/base/ui/pagination';
  import { useLanguage } from '$lib/components/docs/language.svelte';

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

  const language = useLanguage();
  const t = $derived(translations[language.current]);

  function formatNumber(num: number): string {
    return language.current === 'ar' ? toArabicNumerals(num) : num.toString();
  }
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
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
</div>
