<script lang="ts">
  import { getAllContexts, mount, unmount, type Snippet } from 'svelte';
  import PortalRoot from './PortalRoot.svelte';

  let { target, children }: { target: Element; children: Snippet } = $props();

  // Svelte cannot move nodes it owns, so the content is created in the target as a child root that sees this component's contexts.
  const context = getAllContexts();
  $effect(() => {
    const root = mount(PortalRoot, {
      target,
      context,
      props: {
        get children() {
          return children;
        },
      },
    });
    return () => {
      void unmount(root);
    };
  });
</script>
