<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Button, buttonVariants } from '$registry/bases/base/ui/button';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const variants = [
    { variant: 'default', label: 'Default' },
    { variant: 'secondary', label: 'Secondary' },
    { variant: 'outline', label: 'Outline' },
    { variant: 'ghost', label: 'Ghost' },
    { variant: 'destructive', label: 'Destructive' },
    { variant: 'link', label: 'Link' },
  ] as const;
  const sizes = ['xs', 'sm', 'default', 'lg'] as const;
  const iconSizes = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const;
</script>

{#snippet ButtonVariantsAndSizes()}
  <Example title="Variants & Sizes">
    {#each sizes as size (size)}
      <div class="flex flex-wrap items-center gap-2">
        {#each variants as { variant, label } (variant)}
          <Button {size} {variant}>{label}</Button>
        {/each}
      </div>
    {/each}
  </Example>
{/snippet}

{#snippet ButtonIconRight()}
  <Example title="Icon Right">
    {#each sizes as size (size)}
      <div class="flex flex-wrap items-center gap-2">
        {#each variants as { variant, label } (variant)}
          <Button {size} {variant}>
            {label}
            <IconPlaceholder
              lucide="ArrowRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight02Icon"
              phosphor="ArrowRightIcon"
              remixicon="RiArrowRightLine"
              data-icon="inline-end"
            />
          </Button>
        {/each}
      </div>
    {/each}
  </Example>
{/snippet}

{#snippet ButtonIconLeft()}
  <Example title="Icon Left">
    {#each sizes as size (size)}
      <div class="flex flex-wrap items-center gap-2">
        {#each variants as { variant, label } (variant)}
          <Button {size} {variant}>
            <IconPlaceholder
              lucide="ArrowLeftCircleIcon"
              hugeicons="CircleArrowLeft02Icon"
              tabler="IconCircleArrowLeft"
              phosphor="ArrowCircleLeftIcon"
              remixicon="RiArrowLeftCircleLine"
              data-icon="inline-start"
            />
            {label}
          </Button>
        {/each}
      </div>
    {/each}
  </Example>
{/snippet}

{#snippet ButtonIconOnly()}
  <Example title="Icon Only">
    {#each iconSizes as size (size)}
      <div class="flex flex-wrap items-center gap-2">
        {#each variants as { variant } (variant)}
          <Button {size} {variant}>
            <IconPlaceholder
              lucide="ArrowRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight02Icon"
              phosphor="ArrowRightIcon"
              remixicon="RiArrowRightLine"
            />
          </Button>
        {/each}
      </div>
    {/each}
  </Example>
{/snippet}

{#snippet ButtonInvalidStates()}
  <Example title="Invalid States">
    {#each sizes as size (size)}
      <div class="flex flex-wrap items-center gap-2">
        {#each variants as { variant, label } (variant)}
          <Button {size} {variant} aria-invalid="true">{label}</Button>
        {/each}
      </div>
    {/each}
  </Example>
{/snippet}

{#snippet ButtonExamples()}
  <Example title="Examples">
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>
          Submit
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="destructive">Delete</Button>
        <Button size="icon">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
      </div>
      <!-- svelte-ignore a11y_invalid_attribute -->
      <a href="#" class={buttonVariants()}>Link</a>
    </div>
  </Example>
{/snippet}

<ExampleWrapper class="lg:grid-cols-1 2xl:grid-cols-1">
  {@render ButtonVariantsAndSizes()}
  {@render ButtonIconRight()}
  {@render ButtonIconLeft()}
  {@render ButtonIconOnly()}
  {@render ButtonInvalidStates()}
  {@render ButtonExamples()}
</ExampleWrapper>
