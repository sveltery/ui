<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from '$registry/bases/base/ui/card';
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel
  } from '$registry/bases/base/ui/field';

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
</script>

<Card>
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>Choose which email and push alerts you want to receive.</CardDescription>
  </CardHeader>
  <CardContent>
    <FieldGroup>
      {#each NOTIFICATIONS as n (n.id)}
        <Field orientation="horizontal">
          <Checkbox id="notify-{n.id}" defaultChecked={n.defaultChecked} />
          <FieldContent>
            <FieldLabel for="notify-{n.id}">{n.label}</FieldLabel>
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
