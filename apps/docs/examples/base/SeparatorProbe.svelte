<script lang="ts">
  import { onMount, untrack, type Snippet } from 'svelte';
  import { Separator } from '@sveltery/ui/separator';
  import type { SeparatorState } from '@sveltery/ui/separator';
  let hydrated = $state(false);
  let vertical = $state(false);
  let show = $state(true);
  let clicks = $state(0);
  let ref = $state<HTMLElement | null>();
  let attaches = $state(0);
  let detaches = $state(0);
  function attachment(node: HTMLElement) { untrack(() => attaches++); node.dataset.probed = 'separator'; return () => untrack(() => detaches++); }
  onMount(() => { hydrated = true; });
</script>
{#snippet replacement(props: Record<string | symbol, unknown>, state: SeparatorState, children: Snippet | undefined)}
  <div data-testid="replacement-wrap"><span {...props} data-state-orientation={state.orientation}>{#if children}{@render children()}{/if}</span></div>
{/snippet}
<main data-separator-probe data-hydrated={hydrated} class="p-8">
  <section class="flex flex-col gap-4 w-60 h-12" data-testid="horizontal-container"><Separator data-testid="default-horizontal" /><Separator data-testid="explicit-horizontal" data-vertical="" /></section>
  <section class="flex items-center gap-4 w-60 h-12" data-testid="vertical-container"><Separator data-testid="default-vertical" orientation="vertical" /><Separator data-testid="explicit-vertical" orientation="vertical" data-horizontal="" /></section>
  <Separator data-testid="callback" class={() => 'ignored-class'} />
  <Separator data-testid="custom" render={replacement} orientation="vertical">Replacement &amp; child</Separator>
  {#if show}<Separator data-testid="reactive" orientation={vertical ? 'vertical' : 'horizontal'} class={vertical ? 'w-6 bg-red-500' : undefined} style={state => state.orientation === 'vertical' ? 'height: 32px; color: rgb(60, 70, 80)' : 'height: 32px; color: rgb(30, 40, 50)'} data-slot={vertical ? 'caller-slot' : 'separator'} bind:ref {@attach attachment} onclick={() => clicks++}>Reactive child</Separator>{/if}
  <button onclick={() => vertical = !vertical}>Change orientation</button>
  <button onclick={() => show = !show}>{show ? 'Remove separator' : 'Restore separator'}</button>
  <output data-testid="separator-state">{JSON.stringify({ vertical, clicks, tag: ref === undefined ? 'undefined' : ref?.tagName ?? null, attaches, detaches })}</output>
</main>
