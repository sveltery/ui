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
        <IconPlaceholder lucide="AudioLinesIcon" tabler="IconPlayerRecordFilled" hugeicons="AudioWave01Icon" phosphor="RecordIcon" remixicon="RiRecordCircleLine" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Explore Catalog</EmptyTitle>
        <EmptyDescription>Check your ISRC codes, metadata, and visual assets before going live.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>View Catalog</Button>
      </EmptyContent>
    </Empty>
  </CardContent>
</Card>
