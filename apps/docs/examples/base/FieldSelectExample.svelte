<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '$registry/bases/base/ui/select';

  const items = [
    { label: 'Choose department', value: null },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Design', value: 'design' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Sales', value: 'sales' },
    { label: 'Customer Support', value: 'support' },
    { label: 'Human Resources', value: 'hr' },
    { label: 'Finance', value: 'finance' },
    { label: 'Operations', value: 'operations' }
  ];
</script>

<Field class="w-full max-w-xs">
  <FieldLabel>Department</FieldLabel>
  <Select {items}>
    <SelectTrigger>
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
  <FieldDescription>Select your department or area of work.</FieldDescription>
</Field>
