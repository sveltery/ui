<script lang="ts">
  import { GroupModel, setGroup } from './item.svelte.js';
  import { getCommand } from './root.svelte.js';
  import type { CommandGroupProps } from './types.js';
  import { RANKED_CONTAINER_STYLE } from './utils.js';

  let { heading, value, forceMount = false, children, ...rest }: CommandGroupProps = $props();

  const headingId = $props.id();
  const root = getCommand();
  const group = new GroupModel(root, {
    get forceMount() { return forceMount; }
  });
  setGroup(group);
  root.registerGroup(group);
  $effect(() => () => root.unregisterGroup(group));
</script>

<div
  {...rest}
  cmdk-group=""
  role="presentation"
  data-value={value ?? (typeof heading === 'string' ? heading.trim() : undefined)}
  hidden={group.hidden}
  style:display={group.hidden ? 'none' : undefined}
  style:order={group.slot}
  {@attach group.attach}
>
  {#if heading}
    <div cmdk-group-heading="" aria-hidden="true" id={headingId} {@attach group.attachHeading}>
      {#if typeof heading === 'string'}{heading}{:else}{@render heading()}{/if}
    </div>
  {/if}
  <div cmdk-group-items="" role="group" aria-labelledby={heading ? headingId : undefined} style={RANKED_CONTAINER_STYLE}>
    {@render children?.()}
  </div>
</div>
