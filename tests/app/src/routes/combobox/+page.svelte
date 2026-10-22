<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxValue } from '$registry/bases/base/ui/combobox';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '$registry/bases/base/ui/dialog';
  import { Field, FieldError, FieldLabel } from '$registry/bases/base/ui/field';

  type Timezones = { value: string; items: string[] };
  type Plan = { name: string; seats: number };

  const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
  const timezones: Timezones[] = [
    { value: 'Americas', items: ['(GMT-5) New York', '(GMT-8) Los Angeles', '(GMT-6) Chicago'] },
    { value: 'Europe', items: ['(GMT+0) London', '(GMT+1) Paris', '(GMT+1) Berlin'] }
  ];
  const plans: Plan[] = [
    { name: 'Starter', seats: 1 },
    { name: 'Team', seats: 10 }
  ];
  const disabledFrameworks = ['Nuxt.js', 'Remix'];
  const buttonClass = 'cn-button cn-button-variant-outline cn-button-size-default inline-flex items-center justify-center';

  let framework = $state<string | null>(null);
  let query = $state('');
  let open = $state(false);
  let chips = $state<string[]>(['Next.js']);
  let anchor = $state<HTMLElement | null>(null);
  let disabled = $state(false);
  let submitted = $state('');
  let plan = $state<Plan | null>(null);
</script>

{#snippet FrameworkItems(isDisabled?: (item: string) => boolean)}
  <ComboboxCollection>
    {#snippet children(item: string)}
      <ComboboxItem value={item} disabled={isDisabled?.(item)}>{item}</ComboboxItem>
    {/snippet}
  </ComboboxCollection>
{/snippet}

<div class="flex flex-col gap-6 p-8">
  <form
    class="flex w-72 flex-col items-start gap-4"
    onsubmit={(event) => {
      event.preventDefault();
      submitted = new URLSearchParams(new FormData(event.currentTarget) as unknown as Record<string, string>).toString();
    }}
  >
    <Combobox name="framework" items={frameworks} bind:value={framework} bind:inputValue={query} bind:open required>
      <ComboboxInput data-testid="framework" aria-label="Framework" placeholder="Select a framework" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {@render FrameworkItems()}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>

    <Combobox name="stack" items={frameworks} multiple defaultValue={['Next.js']} bind:value={chips} autoHighlight>
      <ComboboxChips {@attach (node) => { anchor = node; }} class="w-72" data-testid="chips">
        <ComboboxValue>
          {#snippet children(values)}
            {const selected = $derived(values as string[])}
            {#each selected as value (value)}
              <ComboboxChip data-testid={`chip-${value}`}>{value}</ComboboxChip>
            {/each}
            <ComboboxChipsInput data-testid="stack" aria-label="Stack" placeholder="Add framework" />
          {/snippet}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent {anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {@render FrameworkItems()}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>

    <button type="submit" class={buttonClass}>Submit</button>
    <button type="reset" class={buttonClass}>Reset</button>
  </form>

  <Combobox items={frameworks} defaultValue="SvelteKit">
    <ComboboxInput data-testid="clearable" aria-label="Clearable" showClear />
    <ComboboxContent>
      <ComboboxEmpty>No items found.</ComboboxEmpty>
      <ComboboxList>
        {@render FrameworkItems()}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>

  <Combobox items={timezones}>
    <ComboboxInput data-testid="groups" aria-label="Timezone" placeholder="Select a timezone" />
    <ComboboxContent>
      <ComboboxEmpty>No timezones found.</ComboboxEmpty>
      <ComboboxList>
        <ComboboxCollection>
          {#snippet children(group: Timezones, index: number)}
            <ComboboxGroup items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {#snippet children(item: string)}
                  <ComboboxItem value={item}>{item}</ComboboxItem>
                {/snippet}
              </ComboboxCollection>
              {#if index < timezones.length - 1}
                <ComboboxSeparator />
              {/if}
            </ComboboxGroup>
          {/snippet}
        </ComboboxCollection>
      </ComboboxList>
    </ComboboxContent>
  </Combobox>

  <Combobox items={frameworks} {disabled}>
    <ComboboxInput data-testid="disabled" aria-label="Maybe disabled" placeholder="Select a framework" {disabled} />
    <ComboboxContent>
      <ComboboxEmpty>No items found.</ComboboxEmpty>
      <ComboboxList>
        {@render FrameworkItems()}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <button type="button" class={buttonClass} onclick={() => (disabled = !disabled)}>Toggle disabled</button>

  <Combobox items={frameworks}>
    <ComboboxInput data-testid="disabled-items" aria-label="Disabled items" placeholder="Pick one" />
    <ComboboxContent>
      <ComboboxEmpty>No items found.</ComboboxEmpty>
      <ComboboxList>
        {@render FrameworkItems((item) => disabledFrameworks.includes(item))}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>

  <Combobox items={plans} bind:value={plan} itemToStringValue={(item: Plan) => item.name} itemToStringLabel={(item: Plan) => item.name}>
    <ComboboxInput data-testid="plan" aria-label="Plan" placeholder="Select a plan" />
    <ComboboxContent>
      <ComboboxEmpty>No plans found.</ComboboxEmpty>
      <ComboboxList>
        <ComboboxCollection>
          {#snippet children(item: Plan)}
            <ComboboxItem value={item}>{item.name} ({item.seats})</ComboboxItem>
          {/snippet}
        </ComboboxCollection>
      </ComboboxList>
    </ComboboxContent>
  </Combobox>

  <Combobox items={frameworks} defaultValue="Astro">
    <ComboboxTrigger data-testid="popup-trigger">
      {#snippet render(props, _state, content)}
        <Button {...(props as Record<string, unknown>)} variant="outline" class={[props.class, 'w-64 justify-between font-normal']}>
          {@render content?.()}
        </Button>
      {/snippet}
      <ComboboxValue />
    </ComboboxTrigger>
    <ComboboxContent>
      <ComboboxInput data-testid="popup-input" aria-label="Search" showTrigger={false} placeholder="Search" />
      <ComboboxEmpty>No items found.</ComboboxEmpty>
      <ComboboxList>
        {@render FrameworkItems()}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>

  <Field invalid class="w-72">
    <FieldLabel for="invalid-framework">Invalid framework</FieldLabel>
    <Combobox items={frameworks}>
      <ComboboxInput id="invalid-framework" aria-invalid data-testid="invalid" placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {@render FrameworkItems()}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <FieldError match>Please select a framework.</FieldError>
  </Field>

  <Dialog>
    <DialogTrigger class={buttonClass}>Open Dialog</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Select Framework</DialogTitle>
        <DialogDescription>Choose your preferred framework from the list below.</DialogDescription>
      </DialogHeader>
      <Combobox items={frameworks}>
        <ComboboxInput data-testid="dialog-combobox" aria-label="Dialog framework" placeholder="Select a framework" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {@render FrameworkItems()}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </DialogContent>
  </Dialog>

  <output data-testid="framework-value">{JSON.stringify(framework)}</output>
  <output data-testid="query">{JSON.stringify(query)}</output>
  <output data-testid="open">{String(open)}</output>
  <output data-testid="chips-value">{chips.join(',')}</output>
  <output data-testid="plan-value">{JSON.stringify(plan)}</output>
  <output data-testid="submitted">{submitted}</output>
</div>
