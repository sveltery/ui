<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@sveltery/ui/field';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/ui/select';
  import { Switch } from '@sveltery/ui/switch';
  import { IconPlaceholder } from '@sveltery/ui/icons';

  const CURRENCIES = [
    { label: 'USD — United States Dollar', value: 'usd' },
    { label: 'EUR — Euro', value: 'eur' },
    { label: 'GBP — British Pound', value: 'gbp' },
    { label: 'JPY — Japanese Yen', value: 'jpy' }
  ];
</script>

<Card>
  <CardHeader>
    <CardTitle>Preferences</CardTitle>
    <CardDescription>Manage your account settings and notifications.</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon-sm" class="bg-muted">
        <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" />
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <FieldGroup>
      <Field>
        <FieldLabel for="default-currency">Default Currency</FieldLabel>
        <Select items={CURRENCIES} defaultValue="usd">
          <SelectTrigger id="default-currency" class="w-full">
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
      <FieldSeparator class="-my-4 style-sera:hidden" />
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel for="public-statistics">Public Statistics</FieldLabel>
          <FieldDescription>Allow others to see your total stream count and listening activity</FieldDescription>
        </FieldContent>
        <Switch id="public-statistics" checked />
      </Field>
      <FieldSeparator class="-my-4 style-sera:hidden" />
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel for="email-notifications">Email Notifications</FieldLabel>
          <FieldDescription>Monthly royalty reports and distribution updates</FieldDescription>
        </FieldContent>
        <Switch id="email-notifications" checked />
      </Field>
    </FieldGroup>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Reset</Button>
    <Button class="ml-auto">Save Preferences</Button>
  </CardFooter>
</Card>
