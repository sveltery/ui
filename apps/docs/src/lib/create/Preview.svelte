<!-- Port of shadcn's apps/v4/app/(app)/(create)/components/preview.tsx and preview-switcher.tsx at af983e8. -->
<script lang="ts">
  import { untrack } from 'svelte';
  import { Button } from '@sveltery/components/button';
  import { previewSrc, sendPreviewConfig } from './preview/message';
  import { getDesigner, PREVIEW_ITEMS } from './designer.svelte';

  const designer = getDesigner();
  let iframe = $state<HTMLIFrameElement>();

  // The first load carries the config in its URL. Later configs go by message, so the frame never reloads for them.
  const src = $derived(previewSrc(designer.item, untrack(() => designer.previewed)));

  $effect(() => sendPreviewConfig(iframe ?? null, designer.previewed));
</script>

<div class="relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl ring ring-foreground/10 md:ring-muted dark:ring-foreground/10">
  <div class="relative z-0 mx-auto flex w-full flex-1 flex-col overflow-hidden">
    <div class="absolute inset-0 bg-muted dark:bg-muted/30"></div>
    {#key designer.item}
      <iframe bind:this={iframe} {src} title="Preview" class="z-10 size-full flex-1" onload={() => sendPreviewConfig(iframe ?? null, designer.previewed)}></iframe>
    {/key}
  </div>
  <div class="dark absolute right-3 bottom-3 z-20 flex items-center gap-1 rounded-xl bg-card/90 p-1 shadow-xl backdrop-blur-xl">
    {#each PREVIEW_ITEMS as item (item.value)}
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Preview ${item.label}`}
        aria-pressed={designer.item === item.value}
        data-active={designer.item === item.value}
        class="h-7 min-w-8 cursor-pointer rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
        onclick={() => (designer.item = item.value)}>{item.label}</Button
      >
    {/each}
  </div>
</div>
