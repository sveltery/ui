<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Badge } from '$registry/bases/base/ui/badge';
  import { Spinner } from '$registry/bases/base/ui/spinner';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const variants = [
    { variant: 'default', label: 'Default' },
    { variant: 'secondary', label: 'Secondary' },
    { variant: 'destructive', label: 'Destructive' },
    { variant: 'outline', label: 'Outline' },
    { variant: 'ghost', label: 'Ghost' },
    { variant: 'link', label: 'Link' },
  ] as const;

  const customColors = [
    { class: 'bg-blue-600 text-blue-50 dark:bg-blue-600 dark:text-blue-50', label: 'Blue' },
    { class: 'bg-green-600 text-green-50 dark:bg-green-600 dark:text-green-50', label: 'Green' },
    { class: 'bg-sky-600 text-sky-50 dark:bg-sky-600 dark:text-sky-50', label: 'Sky' },
    { class: 'bg-purple-600 text-purple-50 dark:bg-purple-600 dark:text-purple-50', label: 'Purple' },
    { class: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300', label: 'Blue' },
    { class: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300', label: 'Green' },
    { class: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300', label: 'Sky' },
    { class: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300', label: 'Purple' },
    { class: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300', label: 'Red' },
  ];
</script>

{#snippet BadgeVariants()}
  <Example title="Variants">
    <div class="flex flex-wrap gap-2 style-sera:gap-6">
      {#each variants as { variant, label } (variant)}
        <Badge {variant}>{label}</Badge>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet BadgeWithIconLeft()}
  <Example title="Icon Left" class="max-w-fit">
    <div class="flex flex-wrap gap-2 style-sera:gap-6">
      {#each variants as { variant, label } (variant)}
        <Badge {variant}>
          <IconPlaceholder
            lucide="BadgeCheck"
            tabler="IconRosetteDiscountCheck"
            hugeicons="CheckmarkBadge02Icon"
            phosphor="CheckCircleIcon"
            remixicon="RiCheckboxCircleLine"
            data-icon="inline-start"
          />
          {label}
        </Badge>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet BadgeWithIconRight()}
  <Example title="Icon Right" class="max-w-fit">
    <div class="flex flex-wrap gap-2 style-sera:gap-6">
      {#each variants as { variant, label } (variant)}
        <Badge {variant}>
          {label}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Badge>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet BadgeWithSpinner()}
  <Example title="With Spinner" class="max-w-fit">
    <div class="flex flex-wrap gap-2 style-sera:gap-6">
      {#each variants as { variant, label } (variant)}
        <Badge {variant}>
          <Spinner data-icon="inline-start" />
          {label}
        </Badge>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet ExternalLink(props: Record<string, unknown>)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>
    Link
    <IconPlaceholder
      lucide="ArrowUpRightIcon"
      tabler="IconArrowUpRight"
      hugeicons="ArrowUpRightIcon"
      phosphor="ArrowUpRightIcon"
      remixicon="RiArrowRightUpLine"
      data-icon="inline-end"
    />
  </a>
{/snippet}

{#snippet BadgeAsLink()}
  <Example title="asChild">
    <div class="flex flex-wrap gap-2 style-sera:gap-6">
      <Badge>
        {#snippet render(props)}
          {@render ExternalLink(props)}
        {/snippet}
      </Badge>
      <Badge variant="secondary">
        {#snippet render(props)}
          {@render ExternalLink(props)}
        {/snippet}
      </Badge>
      <Badge variant="destructive">
        {#snippet render(props)}
          {@render ExternalLink(props)}
        {/snippet}
      </Badge>
      <Badge variant="ghost">
        {#snippet render(props)}
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#" {...props}>
            Link
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowRight02Icon"
              phosphor="ArrowUpRightIcon"
              remixicon="RiArrowRightUpLine"
              data-icon="inline-end"
            />
          </a>
        {/snippet}
      </Badge>
    </div>
  </Example>
{/snippet}

{#snippet BadgeLongText()}
  <Example title="Long Text">
    <div class="flex flex-wrap gap-2 style-sera:gap-6">
      <Badge variant="secondary">A badge with a lot of text to see how it wraps</Badge>
    </div>
  </Example>
{/snippet}

{#snippet BadgeCustomColors()}
  <Example title="Custom Colors" class="max-w-fit">
    <div class="flex flex-wrap gap-2 style-sera:gap-6">
      {#each customColors as color (color.class)}
        <Badge class={color.class}>{color.label}</Badge>
      {/each}
    </div>
  </Example>
{/snippet}

<ExampleWrapper class="lg:grid-cols-1">
  {@render BadgeVariants()}
  {@render BadgeWithIconLeft()}
  {@render BadgeWithIconRight()}
  {@render BadgeWithSpinner()}
  {@render BadgeAsLink()}
  {@render BadgeLongText()}
  {@render BadgeCustomColors()}
</ExampleWrapper>
