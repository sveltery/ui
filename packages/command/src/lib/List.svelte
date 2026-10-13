<script lang="ts">
  import { getCommand } from './root.svelte.js';
  import type { CommandListProps } from './types.js';
  import { RANKED_CONTAINER_STYLE, trackListHeight } from './utils.js';

  let { label = 'Suggestions', children, ...rest }: CommandListProps = $props();

  const root = getCommand();
</script>

<div
  {...rest}
  cmdk-list=""
  role="listbox"
  tabindex="-1"
  aria-activedescendant={root.selectedItem?.id}
  aria-label={label}
  id={root.ids.list}
>
  <div cmdk-list-sizer="" style={RANKED_CONTAINER_STYLE} {@attach trackListHeight}>
    {@render children?.()}
  </div>
</div>
