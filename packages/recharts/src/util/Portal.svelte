<script lang="ts">
  import { getAllContexts, mount, unmount, type Snippet } from 'svelte';
  import PortalRoot from './PortalRoot.svelte';

  let { target, anchor, children }: { target: Element; anchor?: Node | null; children: Snippet } = $props();

  // Svelte cannot move nodes it owns, so the content is created in the target as a child root that sees this component's contexts.
  const context = getAllContexts();
  $effect(() => {
    const root = mount(PortalRoot, {
      target,
      anchor: anchor ?? undefined,
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
