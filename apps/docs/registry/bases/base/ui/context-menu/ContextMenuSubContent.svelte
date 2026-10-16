<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import ContextMenuContent from './ContextMenuContent.svelte';
  let props: ComponentProps<typeof ContextMenuContent> = $props();
</script>
<ContextMenuContent data-slot="context-menu-sub-content" class="cn-context-menu-subcontent cn-menu-target cn-menu-translucent" side="right" {...props} />
