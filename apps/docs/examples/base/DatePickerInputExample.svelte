<script lang="ts">
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '$registry/bases/base/ui/input-group';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';

  function formatDate(date: Date | undefined) {
    if (!date) {
      return '';
    }

    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  function isValidDate(date: Date | undefined) {
    if (!date) {
      return false;
    }
    return !isNaN(date.getTime());
  }

  let open = $state(false);
  let date = $state<Date | undefined>(new Date('2025-06-01'));
  let month = $state<Date | undefined>(date);
  let value = $state(formatDate(date));
</script>

<Field class="mx-auto w-48">
  <FieldLabel for="date-required">Subscription Date</FieldLabel>
  <InputGroup>
    <InputGroupInput
      id="date-required"
      bind:value
      placeholder="June 01, 2025"
      oninput={(e) => {
        const parsed = new Date(e.currentTarget.value);
        if (isValidDate(parsed)) {
          date = parsed;
          month = parsed;
        }
      }}
      onkeydown={(e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          open = true;
        }
      }}
    />
    <InputGroupAddon align="inline-end">
      <Popover bind:open>
        <PopoverTrigger id="date-picker" aria-label="Select date">
          {#snippet render(props, _state, content)}
            <InputGroupButton variant="ghost" size="icon-xs" {...props}>{@render content?.()}</InputGroupButton>
          {/snippet}
          <CalendarIcon />
          <span class="sr-only">Select date</span>
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
          <Calendar
            mode="single"
            bind:selected={date}
            bind:month
            onSelect={(selected) => {
              value = formatDate(selected);
              open = false;
            }}
          />
        </PopoverContent>
      </Popover>
    </InputGroupAddon>
  </InputGroup>
</Field>
