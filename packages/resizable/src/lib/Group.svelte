<script lang="ts">
  import { untrack } from 'svelte';
  import { GroupState, setGroup } from './group.svelte.js';
  import { near } from './layout.js';
  import type { GroupProps } from './types.js';

  let { orientation = 'horizontal', defaultLayout, layout = $bindable(), onLayoutChange, onLayoutChanged, disabled = false, children, style, ...rest }: GroupProps = $props();

  const group = new GroupState({
    get orientation() { return orientation; },
    get disabled() { return disabled; },
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
  data-group
  style="display:flex;flex-direction:{orientation === 'horizontal' ? 'row' : 'column'};flex-wrap:nowrap;overflow:hidden;height:100%;width:100%;{style ?? ''}"
  {@attach group.attach}
>
  {@render children?.()}
</div>
