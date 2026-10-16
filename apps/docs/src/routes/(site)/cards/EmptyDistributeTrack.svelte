<script lang="ts">
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
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
</script>

<Card>
  <CardContent>
    <Empty class="p-4">
      <EmptyMedia variant="icon">
        <IconPlaceholder lucide="PlusIcon" tabler="IconPlus" hugeicons="Add01Icon" phosphor="PlusIcon" remixicon="RiAddLine" />
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
