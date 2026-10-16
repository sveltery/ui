<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Card, CardContent } from '@sveltery/components/card';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/components/empty';
  import { Spinner } from '@sveltery/components/spinner';
</script>

<Card>
  <CardContent class="p-0">
    <Empty class="p-4">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Syncing your accounts</EmptyTitle>
        <EmptyDescription>We&apos;re pulling in your latest transactions. This usually takes a few seconds.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Cancel</Button>
      </EmptyContent>
    </Empty>
  </CardContent>
</Card>
