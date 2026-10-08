<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from '../../apps/docs/registry/bases/base/ui/avatar/index.js';
  let refs = $state<[HTMLElement | null | undefined, HTMLImageElement | null | undefined, HTMLElement | null | undefined, HTMLSpanElement | null | undefined, HTMLDivElement | null | undefined, HTMLDivElement | null | undefined]>([undefined, null, undefined, null, undefined, null]);
  let shown = $state(true);
  let changed = $state(false);
  let replaced = $state(false);
  let src = $state('/avatar-first.png');
  let attached = 0;
  let cleaned = 0;
  const statuses: string[] = [];
  const clicks: string[] = [];
  function attachment(node: HTMLElement) { attached++; node.dataset.attached = 'true'; return () => { cleaned++; }; }
  const initial = (node: HTMLElement) => attachment(node);
  const replacement = (node: HTMLElement) => attachment(node);
  const spread = $derived({ [createAttachmentKey()]: replaced ? replacement : initial });
  // Base parts have no refs; capture their hosts with an attachment, as consumers do.
  function capture(index: 0 | 1 | 2) { return (node: HTMLElement) => { refs[index] = node; return () => { if (refs[index] === node) refs[index] = null; }; }; }
  export function snapshot() { return { refs: [...refs], attached, cleaned, statuses: [...statuses], clicks: [...clicks] }; }
  export function update() { changed = true; }
  export function swap() { replaced = !replaced; }
  export function remove() { shown = false; }
  export function show() { shown = true; }
  export function source(value: string) { src = value; }
</script>
{#if shown}
  <AvatarGroup id="bound-avatar-4" bind:ref={refs[4]} {...spread}>
    <Avatar id="bound-avatar-0" size={changed ? 'sm' : 'default'} class={changed ? 'size-12' : undefined} {@attach capture(0)} {...spread} onclick={event => clicks.push(event.currentTarget.id)}>
      <AvatarImage id="bound-avatar-1" {src} alt="Fixture portrait" {@attach capture(1)} {...spread} onLoadingStatusChange={status => statuses.push(status)} />
      <AvatarFallback id="bound-avatar-2" {@attach capture(2)} {...spread}>Initial &lt;Avatar&gt;</AvatarFallback>
      <AvatarBadge id="bound-avatar-3" bind:ref={refs[3]} {...spread}>Badge</AvatarBadge>
    </Avatar>
    <AvatarGroupCount id="bound-avatar-5" bind:ref={refs[5]} {...spread}>+3</AvatarGroupCount>
  </AvatarGroup>
{/if}
