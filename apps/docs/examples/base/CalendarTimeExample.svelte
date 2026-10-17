<script lang="ts">
  import Clock2Icon from '@lucide/svelte/icons/clock-2';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { Card, CardContent, CardFooter } from '$registry/bases/base/ui/card';
  import { Field, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '$registry/bases/base/ui/input-group';

  let date = $state<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 12));
</script>

<Card size="sm" class="mx-auto w-fit">
  <CardContent>
    <Calendar mode="single" bind:selected={date} class="p-0" />
  </CardContent>
  <CardFooter class="border-t bg-card">
    <FieldGroup>
      <Field>
        <FieldLabel for="time-from">Start Time</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="time-from"
            type="time"
            step="1"
            defaultValue="10:30:00"
            class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <InputGroupAddon>
            <Clock2Icon class="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel for="time-to">End Time</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="time-to"
            type="time"
            step="1"
            defaultValue="12:30:00"
            class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <InputGroupAddon>
            <Clock2Icon class="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  </CardFooter>
</Card>
