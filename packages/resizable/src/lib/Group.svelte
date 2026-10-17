<script lang="ts">
  import { untrack } from 'svelte';
  import { GroupState, setGroup } from './group-state.svelte.js';
  import { near } from './layout.js';
  import type { GroupProps } from './types.js';

  const generatedId = $props.id();
  let {
    id = generatedId,
    orientation = 'horizontal',
    defaultLayout,
    layout = $bindable(),
    onLayoutChange,
    onLayoutChanged,
    disabled = false,
    disableCursor = false,
    resizeTargetMinimumSize = { coarse: 20, fine: 10 },
    children,
    style,
    ...rest
  }: GroupProps = $props();

  const group = new GroupState({
    get orientation() { return orientation; },
    get disabled() { return disabled; },
    get disableCursor() { return disableCursor; },
    get resizeTargetMinimumSize() { return resizeTargetMinimumSize; },
    get initial() { return untrack(() => layout) ?? defaultLayout; },
    get onLayoutChange() { return onLayoutChange; },
    get onLayoutChanged() { return onLayoutChanged; }
  });
  setGroup(group);

  $effect(() => group.observe());
  $effect(() => group.emit());
  $effect(() => {
    if (!group.ready) return;
    const next = group.layoutMap;
    const current = untrack(() => layout);
    if (!current || !group.ids.every((id) => near(current[id] ?? Number.NaN, next[id]))) layout = next;
  });
  $effect(() => {
    const incoming = layout;
    if (incoming) untrack(() => group.request(incoming));
  });
</script>

<div
  {...rest}
  data-group="true"
  data-testid={id}
  {id}
  style="height:100%;width:100%;overflow:hidden;{style ?? ''};display:flex;flex-direction:{orientation === 'horizontal' ? 'row' : 'column'};flex-wrap:nowrap"
  {@attach group.attach}
>
  {@render children?.()}
</div>
