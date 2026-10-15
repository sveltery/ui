<script lang="ts">
  import { getCommand } from './root-state.svelte.js';
  import type { CommandListProps } from './types.js';
  import { trackListHeight } from './utils.js';

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
  <div cmdk-list-sizer="" {@attach trackListHeight}>
    {@render children?.()}
  </div>
</div>

<style>
  /*
   * Ranking sets CSS `order` on the children of the list sizer and of each group's items, and `order` only acts on
   * flex and grid items. `:where` keeps this at zero specificity so any author rule replaces it, a grid included.
   * `reading-flow` lets browsers that support it read and tab in the visual order.
   */
  :global(:where([cmdk-list-sizer], [cmdk-group-items])) {
    display: flex;
    flex-direction: column;
    reading-flow: flex-flow;
  }
</style>
