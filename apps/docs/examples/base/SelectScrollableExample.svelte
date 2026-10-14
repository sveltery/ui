<script lang="ts">
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@sveltery/ui/select';

  const regions = [
    {
      label: 'North America',
      items: [
        { label: 'Eastern Standard Time', value: 'est' },
        { label: 'Central Standard Time', value: 'cst' },
        { label: 'Mountain Standard Time', value: 'mst' },
        { label: 'Pacific Standard Time', value: 'pst' },
        { label: 'Alaska Standard Time', value: 'akst' },
        { label: 'Hawaii Standard Time', value: 'hst' }
      ]
    },
    {
      label: 'Europe & Africa',
      items: [
        { label: 'Greenwich Mean Time', value: 'gmt' },
        { label: 'Central European Time', value: 'cet' },
        { label: 'Eastern European Time', value: 'eet' },
        { label: 'Western European Summer Time', value: 'west' },
        { label: 'Central Africa Time', value: 'cat' },
        { label: 'East Africa Time', value: 'eat' }
      ]
    },
    {
      label: 'Asia',
      items: [
        { label: 'Moscow Time', value: 'msk' },
        { label: 'India Standard Time', value: 'ist' },
        { label: 'China Standard Time', value: 'cst_china' },
        { label: 'Japan Standard Time', value: 'jst' },
        { label: 'Korea Standard Time', value: 'kst' },
        { label: 'Indonesia Central Standard Time', value: 'ist_indonesia' }
      ]
    },
    {
      label: 'Australia & Pacific',
      items: [
        { label: 'Australian Western Standard Time', value: 'awst' },
        { label: 'Australian Central Standard Time', value: 'acst' },
        { label: 'Australian Eastern Standard Time', value: 'aest' },
        { label: 'New Zealand Standard Time', value: 'nzst' },
        { label: 'Fiji Time', value: 'fjt' }
      ]
    },
    {
      label: 'South America',
      items: [
        { label: 'Argentina Time', value: 'art' },
        { label: 'Bolivia Time', value: 'bot' },
        { label: 'Brasilia Time', value: 'brt' },
        { label: 'Chile Standard Time', value: 'clt' }
      ]
    }
  ];
  const items = [{ label: 'Select a timezone', value: null }, ...regions.flatMap((region) => region.items)];
</script>

<Select {items}>
  <SelectTrigger class="w-full max-w-64">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {#each regions as region (region.label)}
      <SelectGroup>
        <SelectLabel>{region.label}</SelectLabel>
        {#each region.items as item (item.value)}
          <SelectItem value={item.value}>{item.label}</SelectItem>
        {/each}
      </SelectGroup>
    {/each}
  </SelectContent>
</Select>
