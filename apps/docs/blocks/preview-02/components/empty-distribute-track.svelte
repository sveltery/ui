<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent } from '@sveltery/ui/card';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/ui/empty';
  import { IconPlaceholder } from '@sveltery/ui/icons';
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
          Upload your first master to start reaching listeners on Spotify, Apple Music, and more.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create Release</Button>
      </EmptyContent>
    </Empty>
  </CardContent>
</Card>
