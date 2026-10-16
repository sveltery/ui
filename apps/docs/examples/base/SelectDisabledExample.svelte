<script lang="ts">
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '$registry/bases/base/ui/select';

  const items = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes', disabled: true },
    { label: 'Pineapple', value: 'pineapple' }
  ];
</script>

<Select {items} disabled>
  <SelectTrigger class="w-full max-w-48">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {#each items as item (item.value)}
        <SelectItem value={item.value} disabled={item.disabled}>{item.label}</SelectItem>
      {/each}
    </SelectGroup>
  </SelectContent>
</Select>
