<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent } from '$registry/bases/base/ui/card';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '$registry/bases/base/ui/empty';
</script>

<Card>
  <CardContent>
    <Empty class="h-48">
      <EmptyHeader>
        <EmptyTitle>Get alerted for anomalies</EmptyTitle>
        <EmptyDescription>Automatically monitor your projects for anomalies and get notified.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Upgrade to Observability Plus</Button>
      </EmptyContent>
    </Empty>
  </CardContent>
</Card>
