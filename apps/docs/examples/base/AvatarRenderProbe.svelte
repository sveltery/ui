<script lang="ts">
  // Authored render-snippet/ref witness, outside the genuine original gallery functions.
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes, HTMLImgAttributes } from 'svelte/elements';
  import { createAttachmentKey } from 'svelte/attachments';
  import { untrack } from 'svelte';
  import { Avatar, AvatarImage, AvatarFallback, type AvatarRootState, type AvatarImageState, type AvatarFallbackState } from '@sveltery/ui/avatar';
  let root = $state<HTMLSpanElement>();
  let image = $state<HTMLImageElement>();
  let fallback = $state<HTMLSpanElement>();
  let shown = $state(true);
  let error = $state(false);
  let attached = $state(0);
  let cleaned = $state(0);
  const attachment = { [createAttachmentKey()]: () => { untrack(() => { attached++; }); return () => { untrack(() => { cleaned++; }); }; } };
</script>
{#snippet rootRender(props: Record<string | symbol, unknown>, _state: AvatarRootState, children: Snippet | undefined)}
  <span {...(props as HTMLAttributes<HTMLSpanElement>)} bind:this={root}>{@render children?.()}</span>
{/snippet}
{#snippet imageRender(props: Record<string | symbol, unknown>, _state: AvatarImageState, children: Snippet | undefined)}
  <img {...(props as HTMLImgAttributes)} bind:this={image} />{@render children?.()}
{/snippet}
{#snippet fallbackRender(props: Record<string | symbol, unknown>, _state: AvatarFallbackState, children: Snippet | undefined)}
  <span {...(props as HTMLAttributes<HTMLSpanElement>)} bind:this={fallback}>{@render children?.()}</span>
{/snippet}
<section data-avatar-render-probe>
  {#if shown}
    <Avatar id="render-avatar-root" render={rootRender} {...attachment}>
      <AvatarImage id="render-avatar-image" src={error ? '/avatar-error.png' : '/avatar-probe.png'} alt="Rendered actual portrait" render={imageRender} {...attachment} />
      <AvatarFallback id="render-avatar-fallback" render={fallbackRender} {...attachment}>Rendered CN</AvatarFallback>
    </Avatar>
  {/if}
  <button onclick={() => { error = !error; }}>Change rendered Avatar source</button>
  <button onclick={() => { shown = !shown; }}>Toggle rendered Avatar</button>
  <output data-testid="avatar-render-state">{JSON.stringify({ refs: [root, image, fallback].map(node => node?.id ?? null), attached, cleaned })}</output>
</section>
