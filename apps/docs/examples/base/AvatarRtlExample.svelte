<script lang="ts">
  import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '$registry/bases/base/ui/avatar';
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        moreUsers: '+3'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        moreUsers: '+٣'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        moreUsers: '+3'
      }
    }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);
</script>

<div class="flex w-full flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
    <div class="flex flex-row flex-wrap items-center gap-6 md:gap-12" {dir}>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge class="bg-green-600 dark:bg-green-800" />
      </Avatar>
      <AvatarGroup class="grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>{t.moreUsers}</AvatarGroupCount>
      </AvatarGroup>
    </div>
  </DirectionProvider>
</div>
