<script lang="ts">
  import { Container, setContainer } from './parts.svelte.js';
  import { getCommand } from './root-state.svelte.js';
  import type { CommandListProps } from './types.js';
  import { trackListHeight } from './utils.js';

  let { label = 'Suggestions', children, ...rest }: CommandListProps = $props();

  const root = getCommand();
  const container = new Container(root);
  setContainer(container);
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
  <div cmdk-list-sizer="" {@attach trackListHeight}>{@render children?.()}{#each container.parts as part (part)}{@render part.view()}{/each}</div>
</div>
