<script lang="ts">
  import { Kbd, KbdGroup } from '$registry/bases/base/ui/kbd';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr', values: {} },
    ar: { dir: 'rtl', values: {} },
    he: { dir: 'rtl', values: {} }
  } as const;

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex flex-col items-center gap-4" {dir}>
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
    </KbdGroup>
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>B</Kbd>
    </KbdGroup>
  </div>
</div>
