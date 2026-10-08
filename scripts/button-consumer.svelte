<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { ButtonHostProps, ButtonState } from '@sveltery/base/button';
  import { Button } from '@sveltery/ui/button';
  let hydrated = $state(false);
  let clicks = $state(0);
  let submits = $state(0);
  let ref = $state<HTMLElement | null>(null);
  // Base parts have no refs; an attachment records the actual host.
  function capture(node: HTMLElement) { ref = node; return () => { ref = null; }; }
  onMount(() => { hydrated = true; });
</script>
<!-- Base 2984bb24 calls Button render snippets with (props, state) only; the fallback label covers absent children. -->
{#snippet replacement(props: ButtonHostProps, _state: ButtonState, children?: Snippet)}
  <span {...props} class={[props.class, 'consumer-render']}>{#if children}{@render children()}{:else}Fallback label{/if}</span>
{/snippet}
<main data-hydrated={hydrated} class="p-8">
  <form onsubmit={event => { event.preventDefault(); submits += 1; }}>
    <Button id="default" onclick={() => clicks += 1}>Action</Button>
    <Button id="submit" type="submit" variant="secondary" size="lg">Submit</Button>
    <Button id="disabled" type="submit" disabled>Disabled</Button>
    <Button id="focusable" type="submit" disabled focusableWhenDisabled>Focusable disabled</Button>
    <Button id="custom" nativeButton={false} render={replacement} variant="outline" class="px-6" {@attach capture} onclick={() => clicks += 1}>Custom</Button>
    <Button id="fallback" nativeButton={false} render={replacement} />
  </form>
  <output data-testid="state">{JSON.stringify({ clicks, submits, ref: ref?.id })}</output>
</main>
