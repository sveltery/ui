<script lang="ts">
  // Complete original helper composition; Next Image remains the recorded native-img fill model.
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { AspectRatio } from '@sveltery/ui/aspect-ratio';
</script>

{#snippet AspectRatio16x9()}
  <Example title="16:9" class="items-center justify-center">
    <AspectRatio ratio={16 / 9} class="rounded-lg bg-muted style-luma:rounded-3xl">
      <!-- Preserve the pinned Photo alternative text. Native-img fill does not implement Next Image. -->
      <!-- svelte-ignore a11y_img_redundant_alt -->
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        style="position: absolute; inset: 0;"
        class="h-full w-full rounded-lg object-cover grayscale dark:brightness-20 style-luma:rounded-3xl"
      />
    </AspectRatio>
  </Example>
{/snippet}

{#snippet AspectRatio1x1()}
  <Example title="1:1" class="items-start">
    <AspectRatio ratio={1 / 1} class="rounded-lg bg-muted style-luma:rounded-3xl">
      <!-- Preserve the pinned Photo alternative text. Native-img fill does not implement Next Image. -->
      <!-- svelte-ignore a11y_img_redundant_alt -->
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        style="position: absolute; inset: 0;"
        class="h-full w-full rounded-lg object-cover grayscale dark:brightness-20 style-luma:rounded-3xl"
      />
    </AspectRatio>
  </Example>
{/snippet}

{#snippet AspectRatio9x16()}
  <Example title="9:16" class="items-center justify-center">
    <AspectRatio ratio={9 / 16} class="rounded-lg bg-muted style-luma:rounded-3xl">
      <!-- Preserve the pinned Photo alternative text. Native-img fill does not implement Next Image. -->
      <!-- svelte-ignore a11y_img_redundant_alt -->
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        style="position: absolute; inset: 0;"
        class="h-full w-full rounded-lg object-cover grayscale dark:brightness-20 style-luma:rounded-3xl"
      />
    </AspectRatio>
  </Example>
{/snippet}

{#snippet AspectRatio21x9()}
  <Example title="21:9" class="items-center justify-center">
    <AspectRatio ratio={21 / 9} class="rounded-lg bg-muted style-luma:rounded-3xl">
      <!-- Preserve the pinned Photo alternative text. Native-img fill does not implement Next Image. -->
      <!-- svelte-ignore a11y_img_redundant_alt -->
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        style="position: absolute; inset: 0;"
        class="h-full w-full rounded-lg object-cover grayscale dark:brightness-20 style-luma:rounded-3xl"
      />
    </AspectRatio>
  </Example>
{/snippet}

<ExampleWrapper class="max-w-4xl 2xl:max-w-4xl">
  {@render AspectRatio16x9()}
  {@render AspectRatio21x9()}
  {@render AspectRatio1x1()}
  {@render AspectRatio9x16()}
</ExampleWrapper>
