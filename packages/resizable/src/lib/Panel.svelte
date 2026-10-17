<script lang="ts">
  import { untrack } from 'svelte';
  import { getGroup, PanelEntry } from './group-state.svelte.js';
  import { round } from './layout.js';
  import type { PanelProps, PanelSize } from './types.js';
  import type { SizeInput } from './units.js';

  const generatedId = $props.id();
  let { id = generatedId, defaultSize, minSize, maxSize, collapsible, collapsedSize, collapsedThreshold, onResize, children, class: className, style, ...rest }: PanelProps = $props();

  const group = getGroup();
  const panel = new PanelEntry(group, () => ({ id, defaultSize, minSize, maxSize, collapsible, collapsedSize, collapsedThreshold }));
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

<div
  {...rest}
  data-panel="true"
  data-testid={id}
  {id}
  data-collapsed={panel.collapsed ? '' : undefined}
  style="min-height:0;max-height:100%;height:auto;min-width:0;max-width:100%;width:auto;border:none;border-width:0;padding:0;margin:0;display:flex;flex-basis:0;flex-shrink:1;overflow:hidden;flex-grow:{panel.size}{group.dragging ? ';pointer-events:none' : ''}"
  {@attach panel.attach}
>
  <div class={className} style="max-height:100%;max-width:100%;flex-grow:1;{style ?? ''}">
    {@render children?.()}
  </div>
</div>
