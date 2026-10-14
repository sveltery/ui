<script lang="ts">
  import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/ui/select';
  import { Switch } from '@sveltery/ui/switch';

  const items = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes' },
    { label: 'Pineapple', value: 'pineapple' }
  ];

  let alignItemWithTrigger = $state(true);
</script>

<FieldGroup class="w-full max-w-xs">
  <Field orientation="horizontal">
    <FieldContent>
      <FieldLabel for="align-item">Align Item</FieldLabel>
      <FieldDescription>Toggle to align the item with the trigger.</FieldDescription>
    </FieldContent>
    <Switch id="align-item" bind:checked={alignItemWithTrigger} />
  </Field>
  <Field>
    <Select {items} defaultValue="banana">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent {alignItemWithTrigger}>
        <SelectGroup>
          {#each items as item (item.value)}
            <SelectItem value={item.value}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>
  </Field>
</FieldGroup>
