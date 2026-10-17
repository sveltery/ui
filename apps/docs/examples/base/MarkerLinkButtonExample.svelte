<script lang="ts">
  import GitBranchIcon from '@lucide/svelte/icons/git-branch';
  import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
  import { Marker, MarkerContent, MarkerIcon } from '$registry/bases/base/ui/marker';
  import { toast } from '$registry/bases/base/ui/toast';
</script>

<div class="flex w-full max-w-sm flex-col gap-8 py-12">
  <Marker>
    {#snippet render(props, _state, children)}
      <a {...props} href="#links-and-buttons">{@render children?.()}</a>
    {/snippet}
    <MarkerIcon>
      <GitBranchIcon />
    </MarkerIcon>
    <MarkerContent>View the pull request</MarkerContent>
  </Marker>
  <Marker>
    {#snippet render(props, _state, children)}
      <button {...props} type="button" class={[props.class, 'transition-colors hover:text-foreground']} onclick={() => toast.add({ title: 'You clicked the revert button' })}>
        {@render children?.()}
      </button>
    {/snippet}
    <MarkerIcon>
      <RotateCcwIcon />
    </MarkerIcon>
    <MarkerContent>Revert this change</MarkerContent>
  </Marker>
</div>
