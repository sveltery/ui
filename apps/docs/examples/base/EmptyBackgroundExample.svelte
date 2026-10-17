<script lang="ts">
  import IconBell from '@tabler/icons-svelte-runes/icons/bell';
  import RefreshCcwIcon from '@lucide/svelte/icons/refresh-ccw';
  import { Button } from '$registry/bases/base/ui/button';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$registry/bases/base/ui/empty';
</script>

<Empty class="h-full bg-muted/30">
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <IconBell />
    </EmptyMedia>
    <EmptyTitle>No Notifications</EmptyTitle>
    <EmptyDescription class="max-w-xs text-pretty">You're all caught up. New notifications will appear here.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="outline">
      <RefreshCcwIcon data-icon="inline-start" />
      Refresh
    </Button>
  </EmptyContent>
</Empty>
