<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { Button } from '@sveltery/ui/button';
  import { mergeProps } from '@sveltery/base/merge-props';
  let hydrated = $state(false);
  let clicks = $state(0);
  let submits = $state(0);
  let ref = $state<HTMLElement | null>(null);
  onMount(() => { hydrated = true; });
</script>
{#snippet replacement(props: Record<string | symbol, unknown>, _state: { disabled: boolean }, children: Snippet | undefined)}
  <span {...mergeProps(props, { class: 'consumer-render' })}>{#if children}{@render children()}{:else}Fallback label{/if}</span>
{/snippet}
<main data-hydrated={hydrated} class="p-8">
  <form onsubmit={event => { event.preventDefault(); submits += 1; }}>
    <Button id="default" onclick={() => clicks += 1}>Action</Button>
    <Button id="submit" type="submit" variant="secondary" size="lg">Submit</Button>
    <Button id="disabled" type="submit" disabled>Disabled</Button>
    <Button id="focusable" type="submit" disabled focusableWhenDisabled>Focusable disabled</Button>
    <Button id="custom" nativeButton={false} render={replacement} variant="outline" class="px-6" bind:ref onclick={() => clicks += 1}>Custom</Button>
    <Button id="fallback" nativeButton={false} render={replacement} />
  </form>
  <output data-testid="state">{JSON.stringify({ clicks, submits, ref: ref?.id })}</output>
</main>
