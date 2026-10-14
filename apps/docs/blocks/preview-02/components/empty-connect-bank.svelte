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
