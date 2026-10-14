<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Field, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';
</script>

<Card>
  <CardHeader>
    <CardTitle>Set a new milestone</CardTitle>
    <CardDescription>Define your financial target and we&apos;ll help you pace your savings.</CardDescription>
  </CardHeader>
  <CardContent>
    <FieldGroup>
      <Field>
        <FieldLabel for="goal-name">Goal Name</FieldLabel>
        <Input id="goal-name" placeholder="e.g. New Car, Home Downpayment" />
      </Field>
      <div class="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel for="target-amount">Target Amount</FieldLabel>
          <Input id="target-amount" defaultValue="$15,000" />
        </Field>
        <Field>
          <FieldLabel for="target-date">Target Date</FieldLabel>
          <Input id="target-date" defaultValue="Dec 2025" />
        </Field>
      </div>
    </FieldGroup>
  </CardContent>
  <CardFooter class="flex-col gap-2">
    <Button class="w-full">Create Goal</Button>
    <Button variant="outline" class="w-full">Cancel</Button>
  </CardFooter>
</Card>
