<script lang="ts">
  import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
  import { Button } from '$registry/bases/base/ui/button';

  let { onclick }: { onclick: () => void } = $props();
</script>

<Button variant="ghost" {onclick}>
  Email
  <ArrowUpDownIcon class="ml-2 h-4 w-4" />
</Button>
