<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { format } from 'date-fns';
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';

  let date = $state<Date | undefined>();
</script>

<Popover>
  <PopoverTrigger data-empty={!date}>
    {#snippet render(props, _state, content)}
      <Button variant="outline" class="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground" {...props}>{@render content?.()}</Button>
    {/snippet}
    {#if date}{format(date, 'PPP')}{:else}<span>Pick a date</span>{/if}
    <ChevronDownIcon data-icon="inline-end" />
  </PopoverTrigger>
  <PopoverContent class="w-auto p-0" align="start">
    <Calendar mode="single" bind:selected={date} defaultMonth={date} />
  </PopoverContent>
</Popover>
