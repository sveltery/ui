<script lang="ts">
  // Authored render-snippet/ref witness, outside the genuine original gallery functions.
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes, HTMLImgAttributes } from 'svelte/elements';
  import { createAttachmentKey } from 'svelte/attachments';
  import { untrack } from 'svelte';
  import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, type AvatarRootState, type AvatarImageState, type AvatarFallbackState } from '@sveltery/ui/avatar';
  let root = $state<HTMLSpanElement>();
  let image = $state<HTMLImageElement>();
  let fallback = $state<HTMLSpanElement>();
  let shown = $state(true);
  let error = $state(false);
  let attached = $state(0);
  let cleaned = $state(0);
  let trace = $state<{ status: string; rootDOMStatus: string | null }[]>([]);
  const attachment = { [createAttachmentKey()]: () => { untrack(() => { attached++; }); return () => { untrack(() => { cleaned++; }); }; } };
</script>
<!-- Base 2984bb24 calls Avatar render snippets with (props, state) only, so children stay absent until Base passes them. -->
{#snippet rootRender(props: HTMLAttributes<HTMLSpanElement>, _state: AvatarRootState, children?: Snippet)}
  <span {...props} data-root-status={_state.imageLoadingStatus} bind:this={root}>{@render children?.()}</span>
{/snippet}
{#snippet imageRender(props: HTMLImgAttributes, _state: AvatarImageState, children?: Snippet)}
  <img {...props} bind:this={image} />{@render children?.()}
{/snippet}
{#snippet fallbackRender(props: HTMLAttributes<HTMLSpanElement>, _state: AvatarFallbackState, children?: Snippet)}
  <span {...props} bind:this={fallback}>{@render children?.()}</span>
{/snippet}
<section data-avatar-render-probe>
  {#if shown}
    <Avatar id="render-avatar-root" render={rootRender} {...attachment}>
      <AvatarImage id="render-avatar-image" src={error ? '/avatar-error.png' : '/avatar-probe.png'} alt="Rendered actual portrait" render={imageRender} {...attachment} onLoadingStatusChange={status => trace.push({ status, rootDOMStatus: root?.dataset.rootStatus ?? null })} />
      <AvatarFallback id="render-avatar-fallback" render={fallbackRender} {...attachment}>Rendered CN</AvatarFallback>
    </Avatar>
  {/if}
  <button onclick={() => { error = !error; }}>Change rendered Avatar source</button>
  <button onclick={() => { shown = !shown; }}>Toggle rendered Avatar</button>
  <output data-testid="avatar-render-state">{JSON.stringify({ refs: [root, image, fallback].map(node => node?.id ?? null), attached, cleaned })}</output>
  <output data-testid="avatar-callback-trace">{JSON.stringify(trace)}</output>
</section>
<section data-avatar-mixed>
  <AvatarGroup><Avatar size="sm"><AvatarFallback>Small</AvatarFallback></Avatar><Avatar size="lg"><AvatarFallback>Large</AvatarFallback></Avatar><AvatarGroupCount>+3</AvatarGroupCount></AvatarGroup>
  <Avatar size="sm" data-size="lg"><AvatarFallback>Caller size</AvatarFallback></Avatar>
</section>
