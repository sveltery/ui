<script lang="ts">
  import { Card, CardContent } from '$registry/bases/base/ui/card';

  const styleTitle = 'Nova';
  const fontName = 'Geist';
  const colorVariables = [
    '--background',
    '--foreground',
    '--primary',
    '--secondary',
    '--muted',
    '--accent',
    '--border',
    '--chart-1',
    '--chart-2',
    '--chart-3',
    '--chart-4',
    '--chart-5'
  ];
</script>

<Card>
  <CardContent class="flex flex-col gap-6 style-lyra:gap-4 style-mira:gap-4">
    <div class="flex flex-col gap-1">
      <div
        class="cn-font-heading text-2xl font-medium style-lyra:text-lg style-mira:text-lg style-sera:text-lg style-sera:font-semibold style-sera:tracking-wide style-sera:uppercase"
      >
        {styleTitle} - {fontName}
      </div>
      <div
        class="line-clamp-2 text-base text-muted-foreground style-lyra:text-sm style-mira:text-sm style-sera:text-sm style-sera:leading-relaxed"
      >
        Designers love packing quirky glyphs into test phrases. This is a preview of the typography styles.
      </div>
    </div>
    <div class="grid grid-cols-6 gap-3">
      {#each colorVariables as variant (variant)}
        <div class="flex flex-col flex-wrap items-center gap-2">
          <div
            class="relative aspect-square w-full rounded-lg bg-(--color) after:absolute after:inset-0 after:rounded-lg after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten style-sera:rounded-none style-sera:after:rounded-none"
            style:--color={`var(${variant})`}></div>
          <div
            class="hidden max-w-14 truncate font-mono text-[0.60rem] md:block style-lyra:max-w-10 style-mira:max-w-10"
          >
            {variant}
          </div>
        </div>
      {/each}
    </div>
  </CardContent>
</Card>
