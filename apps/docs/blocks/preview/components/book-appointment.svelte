<script lang="ts">
  import { Alert, AlertDescription, AlertTitle } from '@sveltery/ui/alert';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Field, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { ToggleGroup, ToggleGroupItem } from '@sveltery/ui/toggle-group';
</script>

<Card>
  <CardHeader>
    <CardTitle>Book Appointment</CardTitle>
    <CardDescription>Dr. Sarah Chen · Cardiology</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-4">
    <FieldGroup>
      <Field>
        <FieldLabel>Available on March 18, 2026</FieldLabel>
        <ToggleGroup spacing={2} value={["slot-0"]}>
          {#each ["9:00 AM", "10:30 AM", "11:00 AM", "1:30 PM"] as time, index (time)}
            <ToggleGroupItem value={`slot-${index}`}>{time}</ToggleGroupItem>
          {/each}
        </ToggleGroup>
      </Field>
    </FieldGroup>
    <Alert>
      <AlertTitle>New patient?</AlertTitle>
      <AlertDescription>Please arrive 15 minutes early.</AlertDescription>
    </Alert>
  </CardContent>
  <CardFooter>
    <Button class="w-full">Book Appointment</Button>
  </CardFooter>
</Card>
