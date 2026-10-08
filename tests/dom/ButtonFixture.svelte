<script lang="ts">
  // Adapted from Sveltery Base 4dd04e49 test fixture, MIT (c) 2026 Sveltery contributors; derived Base UI assertions: tests/reference/BASE_BUTTON_LICENSE.
  // UI integration probes; no additional upstream parity credit.
  import { onMount, untrack } from 'svelte';
  import type { ButtonHostProps, ButtonState } from '@sveltery/base/button';
  import { Button, type ButtonProps } from '../../apps/docs/registry/bases/base/ui/button/index.js';
  let { scenario = 'custom' }: { scenario?: string } = $props();
  let hydrated = $state(false);
  let becameDisabled = $state(false);
  let ref = $state<HTMLElement | null>(null);
  let calls = $state<Record<string, number>>({ click: 0, mouse: 0, pointer: 0, keydown: 0, keyup: 0, hover: 0, focus: 0, blur: 0, render: 0, capture: 0, ancestor: 0, submit: 0, reset: 0, attached: 0, detached: 0 });
  let clicks = $state<{ shiftKey: boolean; ctrlKey: boolean; altKey: boolean; metaKey: boolean; detail: number; type: string }[]>([]);
  const custom = $derived(['link', 'custom', 'modifier', 'custom-disabled', 'custom-focusable', 'cancel-base', 'cancel-enter', 'cancel-space', 'space-order', 'enter-order', 'focus-blur', 'descendant', 'render-cancel', 'click-cancel', 'attachment'].includes(scenario));
  const disabled = $derived((scenario.endsWith('-disabled') && scenario !== 'becomes-disabled') || scenario.endsWith('-focusable') || ['native-disabled', 'custom-disabled'].includes(scenario) || ['native-focusable', 'custom-focusable', 'hover', 'focus-blur'].includes(scenario) || becameDisabled);
  const focusable = $derived(scenario.includes('focusable') || ['hover', 'becomes-disabled', 'focus-blur'].includes(scenario));
  const typeProps: Pick<ButtonProps, 'type'> = $derived(scenario.startsWith('submit') || scenario.startsWith('reset') ? { type: scenario.startsWith('submit') ? 'submit' : 'reset' } : scenario === 'undefined-type' ? { type: undefined } : scenario === 'null-type' ? { type: null } : {});
  export function snapshot() { return { calls: { ...calls }, ref }; }
  function count(channel: string) { calls = { ...calls, [channel]: calls[channel] + 1 }; }
  function clicked(event: MouseEvent) {
    count('click');
    clicks = [...clicks, { shiftKey: event.shiftKey, ctrlKey: event.ctrlKey, altKey: event.altKey, metaKey: event.metaKey, detail: event.detail, type: event.type }];
    if (scenario === 'becomes-disabled') becameDisabled = true;
    if (scenario === 'click-cancel') event.preventDefault();
  }
  function attached(node: HTMLElement) {
    untrack(() => count('attached')); node.dataset.consumerAttached = '';
    return () => untrack(() => count('detached'));
  }
  // Base parts have no refs; an attachment records the actual host and clears it on removal.
  function capture(node: HTMLElement) { ref = node; return () => { ref = null; }; }
  onMount(() => { hydrated = true; });
</script>
<!-- Base cbe46682 passes Button render snippets (props, state) only, so the label comes from this scope. -->
{#snippet replacement(props: ButtonHostProps, state: ButtonState)}
  {#if scenario === 'link'}
    <a {...props} href="#target">Go</a>
  {:else}
    <!-- The replacement handler runs first; skipping the Base handler replaces preventBaseUIHandler(). -->
    <span {...props} onclick={event => { count('render'); if (scenario !== 'render-cancel') props.onclick?.(event); }} onclickcapture={() => count('capture')} data-state-disabled={state.disabled}>
      Save
      {#if scenario === 'descendant'}<input aria-label="Inner input" />{/if}
    </span>
  {/if}
{/snippet}
<main data-hydrated={hydrated}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div onclick={() => count('ancestor')}>
    <form onsubmit={event => { event.preventDefault(); count('submit'); }} onreset={() => count('reset')}>
      {#if scenario.startsWith('reset')}<input aria-label="Reset field" value="initial" />{/if}
      <Button id="tested-button" {disabled} focusableWhenDisabled={focusable} nativeButton={!custom} render={custom ? replacement : undefined} {...typeProps} {@attach capture}
        {@attach scenario === 'attachment' ? attached : () => {}}
        class={disabled ? 'disabled-class px-6' : 'enabled-class px-4'} style={`opacity:${disabled ? 0.5 : 1}`}
        onclick={clicked} onmousedown={() => count('mouse')} onpointerdown={() => count('pointer')}
        onkeydown={event => { count('keydown'); if (scenario === 'cancel-base' || scenario === 'cancel-enter') event.preventDefault(); }}
        onkeyup={event => { count('keyup'); if (scenario === 'cancel-base' || scenario === 'cancel-space') event.preventDefault(); }}
        onmousemove={() => count('hover')} onfocus={() => count('focus')} onblur={() => count('blur')}>
        {scenario === 'link' ? 'Go' : 'Save'}
      </Button>
    </form>
  </div>
  <output data-testid="calls">{JSON.stringify(calls)}</output>
  <output data-testid="clicks">{JSON.stringify(clicks)}</output>
  <output data-testid="ref">{ref?.id ?? ''}</output>
  {#if ['native-focusable', 'custom-focusable'].includes(scenario)}
    <button id="following-button" type="button">Following button</button>
  {/if}
  <div id="target">Link target</div>
</main>
