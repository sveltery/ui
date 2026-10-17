<script lang="ts">
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import { parseDate } from 'chrono-node';
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

  let open = $state(false);
  let value = $state('In 2 days');
  let date = $state<Date | undefined>(parseDate(value) || undefined);
</script>

<Field class="mx-auto max-w-xs">
  <FieldLabel for="date-optional">Schedule Date</FieldLabel>
  <InputGroup>
    <InputGroupInput
      id="date-optional"
      bind:value
      placeholder="Tomorrow or next week"
      oninput={(e) => {
        const parsed = parseDate(e.currentTarget.value);
        if (parsed) {
          date = parsed;
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
        <PopoverContent class="w-auto overflow-hidden p-0" align="end" sideOffset={8}>
          <Calendar
            mode="single"
            bind:selected={date}
            captionLayout="dropdown"
            defaultMonth={date}
            onSelect={(selected) => {
              value = formatDate(selected);
              open = false;
            }}
          />
        </PopoverContent>
      </Popover>
    </InputGroupAddon>
  </InputGroup>
  <div class="px-1 text-sm text-muted-foreground">
    Your post will be published on <span class="font-medium">{formatDate(date)}</span>.
  </div>
</Field>
