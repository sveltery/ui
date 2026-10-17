<script lang="ts">
  import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
  import { Button } from '$registry/bases/base/ui/button';
</script>

<div class="flex gap-2">
  <Button class="rounded-full">Get Started</Button>
  <Button variant="outline" size="icon" class="rounded-full">
    <ArrowUpIcon />
  </Button>
</div>
