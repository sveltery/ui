<script lang="ts">
  import { AspectRatio } from '$registry/bases/base/ui/aspect-ratio';
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';

  const translations = {
    en: { dir: 'ltr', caption: 'Beautiful landscape' },
    ar: { dir: 'rtl', caption: 'منظر طبيعي جميل' },
    he: { dir: 'rtl', caption: 'נוף יפה' }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const t = $derived(translations[language]);
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
  </DirectionProvider>
</div>
