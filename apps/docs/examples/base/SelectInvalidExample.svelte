<script lang="ts">
  import { Field, FieldError, FieldLabel } from '@sveltery/ui/field';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/ui/select';

  const items = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' }
  ];
</script>

<Field data-invalid class="w-full max-w-48">
  <FieldLabel>Fruit</FieldLabel>
  <Select {items}>
    <SelectTrigger aria-invalid>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {#each items as item (item.value)}
          <SelectItem value={item.value}>{item.label}</SelectItem>
        {/each}
      </SelectGroup>
    </SelectContent>
  </Select>
  <FieldError>Please select a fruit.</FieldError>
</Field>
