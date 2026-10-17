<script lang="ts">
  import { Skeleton } from '$registry/bases/base/ui/skeleton';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr' },
    ar: { dir: 'rtl' },
    he: { dir: 'rtl' }
  } as const;

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center gap-4" {dir}>
    <Skeleton class="h-12 w-12 rounded-full" />
    <div class="space-y-2">
      <Skeleton class="h-4 w-[250px]" />
      <Skeleton class="h-4 w-[200px]" />
    </div>
  </div>
</div>
