<script lang="ts">
  import { CommandModel, setCommand } from './root-state.svelte.js';
  import type { CommandRootProps } from './types.js';
  import { VISUALLY_HIDDEN_STYLE } from './utils.js';

  let {
    label,
    shouldFilter = true,
    filter,
    value = $bindable(''),
    onValueChange,
    loop = false,
    disablePointerSelection = false,
    vimBindings = true,
    onkeydown,
    children,
    ...rest
  }: CommandRootProps = $props();

  const id = $props.id();
  const root = new CommandModel({
    id,
    get shouldFilter() { return shouldFilter; },
    get filter() { return filter; },
    get loop() { return loop; },
    get disablePointerSelection() { return disablePointerSelection; },
    get vimBindings() { return vimBindings; },
    get value() { return value; },
    set value(next) { value = next; },
    get onValueChange() { return onValueChange; }
  });
  setCommand(root);

  $effect(() => root.reconcile());
  $effect(() => root.followSelection());
</script>

<div
  tabindex="-1"
  {...rest}
  cmdk-root=""
  onkeydown={(event) => {
    onkeydown?.(event);
    root.keydown(event);
  }}
  {@attach root.attach}
>
  <label cmdk-label="" for={root.ids.input} id={root.ids.label} style={VISUALLY_HIDDEN_STYLE}>{label ?? rest['aria-label']}</label>
  {@render children?.()}
</div>
