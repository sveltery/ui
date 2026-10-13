<script lang="ts">
  import { getGroup, hasGroup, ItemModel } from './item.svelte.js';
  import { getCommand } from './root.svelte.js';
  import type { CommandItemProps } from './types.js';

  let { id, value, keywords, disabled = false, forceMount, onSelect, onclick, onpointermove, children, ...rest }: CommandItemProps = $props();

  const generated = $props.id();
  const root = getCommand();
  const item = new ItemModel(root, hasGroup() ? getGroup() : undefined, {
    get id() { return id ?? generated; },
    get value() { return value; },
    get keywords() { return keywords; },
    get disabled() { return disabled; },
    get forceMount() { return forceMount; },
    get onSelect() { return onSelect; }
  });
  root.register(item);
  $effect(() => () => root.unregister(item));
</script>

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
  hidden={item.hidden}
  style:display={item.hidden ? 'none' : undefined}
  style:order={item.slot}
  onpointermove={(event) => {
    onpointermove?.(event);
    if (!event.defaultPrevented) item.hover();
  }}
  onclick={(event) => {
    onclick?.(event);
    if (!event.defaultPrevented) item.activate();
  }}
  {@attach item.attach}
>
  {@render children?.()}
</div>
