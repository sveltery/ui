<script lang="ts">
  import Anchor from './Anchor.svelte';
  import GroupItems from './GroupItems.svelte';
  import { GroupModel } from './item-state.svelte.js';
  import { usePart } from './parts.svelte.js';
  import { getCommand } from './root-state.svelte.js';
  import type { CommandGroupProps } from './types.js';

  let { heading, value, forceMount = false, children, ...rest }: CommandGroupProps = $props();

  const anchor = $props.id();
  const headingId = `${anchor}-heading`;
  const root = getCommand();
  const group = new GroupModel(root, {
    anchor,
    view,
    get forceMount() { return forceMount; }
  });
  const container = usePart(root, group, () => root.registerGroup(group));
</script>

{#snippet view()}
  <div
    {...rest}
    cmdk-group=""
    role="presentation"
    data-value={value?.trim() ?? (typeof heading === 'string' ? heading.trim() : group.headingElement?.textContent?.trim())}
    hidden={group.hidden}
  >
    {#if heading}
      <div cmdk-group-heading="" aria-hidden="true" id={headingId} {@attach group.attachHeading}>
        {#if typeof heading === 'string'}{heading}{:else}{@render heading()}{/if}
      </div>
    {/if}<GroupItems {group} labelledby={heading ? headingId : undefined} {children} />
  </div>
{/snippet}

<Anchor part={group} />{#if !container}{@render view()}{/if}
