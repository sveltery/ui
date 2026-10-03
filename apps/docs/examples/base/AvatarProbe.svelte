<script lang="ts">
  // Authored consumer lifecycle probe; separate from the seven unchanged original galleries.
  import { untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from '@sveltery/ui/avatar';
  let refs = $state<[HTMLElement | null | undefined, HTMLImageElement | null | undefined, HTMLElement | null | undefined, HTMLSpanElement | null | undefined, HTMLDivElement | null | undefined, HTMLDivElement | null | undefined]>([undefined, null, undefined, null, undefined, null]);
  let visible = $state(true);
  let small = $state(false);
  let src = $state('/avatar-probe.png');
  let statuses = $state<string[]>([]);
  let clicks = $state<string[]>([]);
  let attached = $state(0);
  let cleaned = $state(0);
  const attachment = { [createAttachmentKey()]: (node: HTMLElement) => {
    node.dataset.attached = 'true'; untrack(() => { attached++; });
    return () => { untrack(() => { cleaned++; }); };
  } };
</script>
<section data-avatar-probe>
  {#if visible}
    <AvatarGroup id="probe-avatar-4" bind:ref={refs[4]} {...attachment}>
      <Avatar id="probe-avatar-0" size={small ? 'sm' : 'default'} class={small ? 'size-12 rounded-none' : undefined} bind:ref={refs[0]} {...attachment} onclick={event => clicks.push(event.currentTarget.id)}>
        <AvatarImage id="probe-avatar-1" {src} alt="Actual decoded portrait" bind:ref={refs[1]} {...attachment} onLoadingStatusChange={status => statuses.push(status)} />
        <AvatarFallback id="probe-avatar-2" bind:ref={refs[2]} {...attachment}>CN &lt;portrait&gt;</AvatarFallback>
        <AvatarBadge id="probe-avatar-3" bind:ref={refs[3]} {...attachment}>Badge</AvatarBadge>
      </Avatar>
      <AvatarGroupCount id="probe-avatar-5" bind:ref={refs[5]} {...attachment}>+3</AvatarGroupCount>
    </AvatarGroup>
  {/if}
  <button onclick={() => { small = !small; }}>Update Avatar</button>
  <button onclick={() => { src = '/avatar-second.png'; }}>Replace Avatar source</button>
  <button onclick={() => { src = '/avatar-error.png'; }}>Fail Avatar source</button>
  <button onclick={() => { src = '/avatar-probe.png'; }}>Restore cached Avatar</button>
  <button onclick={() => { visible = !visible; }}>Toggle Avatar</button>
  <output data-testid="avatar-state">{JSON.stringify({ refs: refs.map(ref => ref?.id ?? null), attached, cleaned, statuses, clicks })}</output>
</section>
