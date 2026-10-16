<script lang="ts">
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '$registry/bases/base/ui/select';

  const items = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes' },
    { label: 'Pineapple', value: 'pineapple' }
  ];
</script>

<Select {items}>
  <SelectTrigger class="w-full max-w-48">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      {#each items as item (item.value)}
        <SelectItem value={item.value}>{item.label}</SelectItem>
      {/each}
    </SelectGroup>
  </SelectContent>
</Select>
