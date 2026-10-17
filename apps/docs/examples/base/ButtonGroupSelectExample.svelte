<script lang="ts">
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup } from '$registry/bases/base/ui/button-group';
  import { Input } from '$registry/bases/base/ui/input';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '$registry/bases/base/ui/select';

  const CURRENCIES = [
    { label: 'US Dollar', value: '$' },
    { label: 'Euro', value: '€' },
    { label: 'British Pound', value: '£' }
  ];

  let currency = $state('$');
</script>

<ButtonGroup>
  <ButtonGroup>
    <Select items={CURRENCIES} bind:value={currency}>
      <SelectTrigger class="font-mono">{currency}</SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        <SelectGroup>
          {#each CURRENCIES as item (item.value)}
            <SelectItem value={item.value}>
              {item.value}
              <span class="text-muted-foreground">{item.label}</span>
            </SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>
    <Input placeholder="10.00" pattern="[0-9]*" />
  </ButtonGroup>
  <ButtonGroup>
    <Button aria-label="Send" size="icon" variant="outline">
      <ArrowRightIcon />
    </Button>
  </ButtonGroup>
</ButtonGroup>
