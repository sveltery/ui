<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { Field, FieldGroup, FieldLabel } from '@sveltery/components/field';
  import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@sveltery/components/input-group';
  import { Item, ItemContent } from '@sveltery/components/item';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/components/select';
  import { Separator } from '@sveltery/components/separator';
  import { IconPlaceholder } from '@sveltery/components/icons';

  const FROM_ACCOUNTS = [
    { label: 'Main Checking (··8402) — $12,450.00', value: 'checking' },
    { label: 'Business (··7731) — $8,920.00', value: 'business' }
  ];
  const TO_ACCOUNTS = [
    { label: 'High Yield Savings (··1192) — $42,100.00', value: 'savings' },
    { label: 'Investment (··3349) — $18,200.00', value: 'investment' }
  ];
</script>

<Card>
  <CardHeader>
    <CardTitle>Transfer Funds</CardTitle>
    <CardDescription>Move money between your connected accounts.</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon-sm" class="bg-muted">
        <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" />
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <FieldGroup>
      <Field>
        <FieldLabel for="transfer-amount">Amount to Transfer</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="transfer-amount" defaultValue="1,200.00" />
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel for="from-account">From Account</FieldLabel>
        <Select items={FROM_ACCOUNTS} defaultValue="checking">
          <SelectTrigger id="from-account" class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each FROM_ACCOUNTS as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel for="to-account">To Account</FieldLabel>
        <Select items={TO_ACCOUNTS} defaultValue="savings">
          <SelectTrigger id="to-account" class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each TO_ACCOUNTS as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Item variant="muted" class="flex-col items-stretch">
        <ItemContent class="gap-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Estimated arrival</span>
            <span class="text-sm font-medium">Today, Apr 14</span>
          </div>
          <Separator />
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Transaction fee</span>
            <span class="text-sm font-medium tabular-nums">$0.00</span>
          </div>
          <Separator />
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Total amount</span>
            <span class="text-sm font-semibold tabular-nums">$1,200.00</span>
          </div>
        </ItemContent>
      </Item>
    </FieldGroup>
  </CardContent>
  <CardFooter>
    <Button class="w-full">Confirm Transfer</Button>
  </CardFooter>
</Card>
