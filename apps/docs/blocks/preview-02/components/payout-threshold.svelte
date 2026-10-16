<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { Field, FieldDescription, FieldGroup, FieldLabel } from '@sveltery/components/field';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/components/select';
  import { Slider } from '@sveltery/components/slider';
  import { Textarea } from '@sveltery/components/textarea';
  import { IconPlaceholder } from '@sveltery/components/icons';

  const CURRENCIES = [
    { label: 'USD — United States Dollar', value: 'usd' },
    { label: 'EUR — Euro', value: 'eur' },
    { label: 'GBP — British Pound', value: 'gbp' },
    { label: 'JPY — Japanese Yen', value: 'jpy' }
  ];
  let amount = $state([2500]);
</script>

<Card>
  <CardHeader>
    <CardTitle>Payout Threshold</CardTitle>
    <CardDescription>Set the minimum balance required before a payout is triggered.</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon-sm" class="bg-muted">
        <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" />
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <FieldGroup>
      <Field>
        <FieldLabel for="preferred-currency">Preferred Currency</FieldLabel>
        <Select items={CURRENCIES} defaultValue="usd">
          <SelectTrigger id="preferred-currency" class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each CURRENCIES as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <div class="flex items-baseline justify-between">
          <FieldLabel for="min-payout">Minimum Payout Amount</FieldLabel>
          <span class="text-2xl font-semibold tabular-nums">${amount[0].toFixed(2)}</span>
        </div>
        <Slider
          id="min-payout"
          bind:value={amount}
          min={50}
          max={10000}
          step={50}
        />
        <div class="flex items-center justify-between">
          <FieldDescription>$50 (MIN)</FieldDescription>
          <FieldDescription>$10,000 (MAX)</FieldDescription>
        </div>
      </Field>
      <Field>
        <FieldLabel for="payout-notes">Notes</FieldLabel>
        <Textarea
          id="payout-notes"
          placeholder="Add any notes for this payout configuration..."
          class="min-h-[100px]"
        />
      </Field>
    </FieldGroup>
  </CardContent>
  <CardFooter>
    <Button class="w-full">Save Threshold</Button>
  </CardFooter>
</Card>
