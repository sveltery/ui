<script lang="ts">
  import Anchor from './Anchor.svelte';
  import { getGroup, hasGroup, ItemModel } from './item-state.svelte.js';
  import { usePart } from './parts.svelte.js';
  import { getCommand } from './root-state.svelte.js';
  import type { CommandItemProps } from './types.js';

  let { value, keywords, disabled = false, forceMount, onSelect, onclick, onpointermove, children, ...rest }: CommandItemProps = $props();

  const generated = $props.id();
  const root = getCommand();
  const item = new ItemModel(root, hasGroup() ? getGroup() : undefined, {
    anchor: generated,
    view,
    id: generated,
    get value() { return value; },
    get keywords() { return keywords; },
    get disabled() { return disabled; },
    get forceMount() { return forceMount; },
    get onSelect() { return onSelect; }
  });
  const container = usePart(root, item, () => root.register(item));
</script>

{#snippet view()}
  <div
    {...rest}
    id={item.id}
    cmdk-item=""
    role="option"
    aria-disabled={disabled}
    aria-selected={item.selected}
    data-disabled={disabled}
    data-selected={item.selected}
    data-value={item.value}
    onpointermove={(event) => {
      onpointermove?.(event);
      item.hover();
    }}
    onclick={(event) => {
      onclick?.(event);
      item.activate();
    }}
    {@attach item.attach}
  >{@render children?.()}</div>
{/snippet}

<Anchor part={item} />{#if !container && (!root.view || root.view.visibleItems.has(item))}{@render view()}{/if}
