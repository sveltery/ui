<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Checkbox } from '@sveltery/ui/checkbox';
  import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@sveltery/ui/field';

  const NOTIFICATIONS = [
    {
      id: 'transactions',
      label: 'Transaction alerts',
      description: 'Deposits, withdrawals, and transfers.',
      defaultChecked: true
    },
    {
      id: 'security',
      label: 'Security alerts',
      description: 'Login attempts and account changes.',
      defaultChecked: true
    },
    {
      id: 'goals',
      label: 'Goal milestones',
      description: 'Updates at 25%, 50%, 75%, and 100%.',
      defaultChecked: false
    },
    {
      id: 'market',
      label: 'Market updates',
      description: 'Daily portfolio summary and price alerts.',
      defaultChecked: false
    }
  ];
  let checked = $state<Record<string, boolean>>(Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.defaultChecked])));
  const allChecked = $derived(NOTIFICATIONS.every((n) => checked[n.id]));
  const someChecked = $derived(NOTIFICATIONS.some((n) => checked[n.id]) && !allChecked);

  function handleSelectAll(value: boolean) {
    checked = Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, value]));
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>Choose what you want to be notified about.</CardDescription>
  </CardHeader>
  <CardContent>
    <FieldGroup>
      <Field orientation="horizontal">
        <Checkbox
          id="notify-all"
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={(v) => handleSelectAll(!!v)}
        />
        <FieldContent>
          <FieldLabel for="notify-all">Select all</FieldLabel>
        </FieldContent>
      </Field>
      {#each NOTIFICATIONS as n (n.id)}
        <Field orientation="horizontal">
          <Checkbox
            id={`notify-${n.id}`}
            bind:checked={checked[n.id]}
          />
          <FieldContent>
            <FieldLabel for={`notify-${n.id}`}>{n.label}</FieldLabel>
            <FieldDescription>{n.description}</FieldDescription>
          </FieldContent>
        </Field>
      {/each}
    </FieldGroup>
  </CardContent>
  <CardFooter>
    <Button class="w-full">Save Preferences</Button>
  </CardFooter>
</Card>
