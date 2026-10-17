<script lang="ts">
  import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
  import { Badge } from '$registry/bases/base/ui/badge';
</script>

<Badge>
  {#snippet render(props, _state, content)}
    <a href="#link" {...props}>{@render content?.()}</a>
  {/snippet}
  Open Link <ArrowUpRightIcon data-icon="inline-end" />
</Badge>
