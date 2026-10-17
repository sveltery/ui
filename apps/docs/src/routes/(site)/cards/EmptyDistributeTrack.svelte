<script lang="ts">
  import { Add01Icon } from '@hugeicons/core-free-icons';
  import { HugeiconsIcon } from '@hugeicons/svelte';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent } from '$registry/bases/base/ui/card';
  import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
  } from '$registry/bases/base/ui/empty';
</script>

<Card>
  <CardContent>
    <Empty class="p-4">
      <EmptyMedia variant="icon">
        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Distribute Track</EmptyTitle>
        <EmptyDescription>
          Upload your first master to start reaching listeners on every major streaming service.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create Release</Button>
      </EmptyContent>
    </Empty>
  </CardContent>
</Card>
