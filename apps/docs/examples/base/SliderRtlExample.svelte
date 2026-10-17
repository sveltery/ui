<script lang="ts">
  import { Slider } from '$registry/bases/base/ui/slider';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr' },
    ar: { dir: 'rtl' },
    he: { dir: 'rtl' }
  } as const;

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
</script>

<div class="flex w-full max-w-xs flex-col gap-4">
  <Slider defaultValue={[75]} max={100} step={1} class="mx-auto w-full max-w-xs" {dir} />
</div>
