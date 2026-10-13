<script lang="ts">
  import { untrack } from 'svelte';
  import { getGroup, PanelEntry } from './group.svelte.js';
  import { round } from './layout.js';
  import type { PanelProps, PanelSize } from './types.js';
  import type { SizeInput } from './units.js';

  const generatedId = $props.id();
  let { id = generatedId, defaultSize, minSize, maxSize, collapsible, collapsedSize, onResize, children, style, ...rest }: PanelProps = $props();

  const group = getGroup();
  const panel = new PanelEntry(group, () => ({ id, defaultSize, minSize, maxSize, collapsible, collapsedSize }));
  group.register(panel);
  $effect(() => () => group.unregister(panel));

  let previous: PanelSize | undefined;
  $effect(() => {
    if (!group.ready) return;
    const asPercentage = panel.size;
    const inPixels = (asPercentage / 100) * group.groupSize;
    untrack(() => {
      if (previous && round(previous.asPercentage) === round(asPercentage) && round(previous.inPixels) === round(inPixels)) return;
      const before = previous;
      previous = { asPercentage, inPixels };
      onResize?.(previous, id, before);
    });
  });

  export function collapse(): void { group.collapse(panel); }
  export function expand(): void { group.expand(panel); }
  export function resize(size: SizeInput): void { group.resize(panel, size); }
  export function getSize(): PanelSize { return group.sizeOf(panel); }
  export function isCollapsed(): boolean { return group.collapsedAt(panel.index); }
</script>

<div {...rest} {id} data-panel="" data-collapsed={panel.collapsed ? '' : undefined} style="flex: {panel.size} 1 0px;overflow:hidden;{style ?? ''}" {@attach panel.attach}>
  {@render children?.()}
</div>
