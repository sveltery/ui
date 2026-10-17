<script lang="ts">
  import { AspectRatio } from '$registry/bases/base/ui/aspect-ratio';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr', caption: 'Beautiful landscape' },
    ar: { dir: 'rtl', caption: 'منظر طبيعي جميل' },
    he: { dir: 'rtl', caption: 'נוף יפה' }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <figure class="w-full max-w-sm" dir={t.dir}>
    <AspectRatio ratio={16 / 9} class="rounded-lg bg-muted">
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        class="absolute inset-0 size-full rounded-lg object-cover grayscale dark:brightness-20"
      />
    </AspectRatio>
    <figcaption class="mt-2 text-center text-sm text-muted-foreground">{t.caption}</figcaption>
  </figure>
</div>
