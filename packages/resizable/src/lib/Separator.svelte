<script lang="ts">
  import { getGroup, SeparatorEntry } from './group.svelte.js';
  import type { SeparatorProps } from './types.js';

  let { disabled = false, children, style, ...rest }: SeparatorProps = $props();

  const group = getGroup();
  const separator = new SeparatorEntry(group, () => ({ disabled }));
  const horizontal = $derived(group.orientation === 'horizontal');
</script>

<!-- A window splitter is interactive: it takes focus, the arrow keys and the pointer. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  {...rest}
  role="separator"
  tabindex={separator.disabled ? undefined : 0}
  aria-orientation={horizontal ? 'vertical' : 'horizontal'}
  aria-controls={separator.controls}
  aria-valuenow={separator.range ? Math.round(separator.range.now) : undefined}
  aria-valuemin={separator.range?.min === undefined ? undefined : Math.round(separator.range.min)}
  aria-valuemax={separator.range?.max === undefined ? undefined : Math.round(separator.range.max)}
  aria-disabled={separator.disabled || undefined}
  data-separator={separator.state}
  style="touch-action:none;flex:none;cursor:{horizontal ? 'col-resize' : 'row-resize'};{style ?? ''}"
  onpointerdown={(event) => {
    if (event.button !== 0 || separator.disabled) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    group.beginDrag(separator, event);
  }}
  onpointermove={(event) => group.moveDrag(event)}
  onpointerup={(event) => group.endDrag(event)}
  onpointercancel={(event) => group.endDrag(event)}
  onlostpointercapture={(event) => group.endDrag(event)}
  onpointerenter={() => (separator.hovered = true)}
  onpointerleave={() => (separator.hovered = false)}
  onkeydown={(event) => group.keydown(separator, event)}
  {@attach separator.attach}
>
  {@render children?.()}
</div>
