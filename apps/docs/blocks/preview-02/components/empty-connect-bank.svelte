<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent } from '$registry/bases/base/ui/card';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$registry/bases/base/ui/empty';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
</script>

<Card>
  <CardContent>
    <Empty class="p-4">
      <EmptyMedia variant="icon">
        <IconPlaceholder lucide="CreditCardIcon" tabler="IconCreditCard" hugeicons="CreditCardIcon" phosphor="CreditCardIcon" remixicon="RiBankCardLine" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Connect Bank</EmptyTitle>
        <EmptyDescription>Link your payout method to receive monthly royalty distributions automatically.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Set Up Payouts</Button>
      </EmptyContent>
    </Empty>
  </CardContent>
</Card>
