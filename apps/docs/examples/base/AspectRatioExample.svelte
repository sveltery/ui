<script lang="ts">
  // Pinned example contents; native sections/headings and img replace Example/Next Image.
  import { AspectRatio } from '@sveltery/ui/aspect-ratio';
  const examples = [{ title: '16:9', ratio: 16 / 9, class: 'items-center justify-center' }, { title: '21:9', ratio: 21 / 9, class: 'items-center justify-center' }, { title: '1:1', ratio: 1, class: 'items-start' }, { title: '9:16', ratio: 9 / 16, class: 'items-center justify-center' }];
</script>
<section data-aspect-ratio-gallery class="grid max-w-4xl gap-6 2xl:max-w-4xl">
  {#each examples as example (example.title)}
    <section><h2>{example.title}</h2><div class={example.class}>
      <AspectRatio ratio={example.ratio} class="rounded-lg bg-muted style-luma:rounded-3xl">
        <!-- Preserve the pinned example Photo alternative text. -->
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <img src="https://avatar.vercel.sh/shadcn1" alt="Photo" style="position: absolute; inset: 0;" class="h-full w-full rounded-lg object-cover grayscale dark:brightness-20 style-luma:rounded-3xl" />
      </AspectRatio>
    </div></section>
  {/each}
</section>
