<script lang="ts">
  import { getGroup, SeparatorEntry } from './group-state.svelte.js';
  import type { SeparatorProps } from './types.js';

  const generatedId = $props.id();
  let { id = generatedId, disabled = false, disableDoubleClick = false, children, style, ...rest }: SeparatorProps = $props();

  const group = getGroup();
  const separator = new SeparatorEntry(group, () => ({ disabled, disableDoubleClick }));
</script>

<!-- A window splitter is interactive: it takes focus and the arrow keys. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  {...rest}
  aria-controls={separator.controls}
  aria-orientation={group.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
  aria-valuemax={separator.range?.max}
  aria-valuemin={separator.range?.min}
  aria-valuenow={separator.range?.now}
  aria-disabled={separator.disabled || undefined}
  data-separator={separator.state}
  data-testid={id}
  {id}
  role="separator"
  style="flex-basis:auto;{style ?? ''};flex-grow:0;flex-shrink:0"
  tabindex={separator.disabled ? undefined : 0}
  onkeydown={(event) => group.keydown(separator, event)}
  {@attach separator.attach}
>
  {@render children?.()}
</div>
