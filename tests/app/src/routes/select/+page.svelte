<script lang="ts">
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  import { Field, FieldError, FieldLabel } from '@sveltery/ui/field';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@sveltery/ui/select';

  const fruits = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes', disabled: true },
    { label: 'Pineapple', value: 'pineapple' }
  ];
  const fruitsOnly = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' }
  ];
  const vegetables = [
    { label: 'Carrot', value: 'carrot' },
    { label: 'Broccoli', value: 'broccoli' }
  ];
  const plans = [
    { name: 'Starter', description: 'For individuals.' },
    { name: 'Professional', description: 'For teams.' }
  ];
  type Plan = (typeof plans)[number];

  let fruit = $state<string | null>(null);
  let open = $state(false);
  let multiple = $state<string[]>([]);
  let submitted = $state('');
  let disabled = $state(false);
  const buttonClass = 'cn-button cn-button-variant-outline cn-button-size-default inline-flex items-center justify-center';
</script>

<div class="flex flex-col gap-6 p-8">
  <form
    class="flex flex-col items-start gap-4"
    onsubmit={(event) => {
      event.preventDefault();
      submitted = new URLSearchParams(new FormData(event.currentTarget) as unknown as Record<string, string>).toString();
    }}
  >
    <Select name="fruit" items={fruits} bind:value={fruit} bind:open>
      <SelectTrigger class="w-48" data-testid="fruit" aria-label="Fruit">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {#each fruits as item (item.value)}
            <SelectItem value={item.value} disabled={item.disabled}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>

    <Select name="fruits" items={fruitsOnly} multiple bind:value={multiple}>
      <SelectTrigger class="w-72" data-testid="multiple" aria-label="Fruits">
        <SelectValue>
          {#snippet children(value)}
            {const selected = $derived(value as string[])}
            {#if selected.length === 0}Select fruits{:else if selected.length === 1}{fruitsOnly.find((item) => item.value === selected[0])?.label}{:else}{selected.length} fruits selected{/if}
          {/snippet}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {#each fruitsOnly as item (item.value)}
            <SelectItem value={item.value}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>

    <Select name="plan" defaultValue={plans[0]} itemToStringValue={(plan: Plan) => plan.name}>
      <SelectTrigger class="w-72" data-testid="plan" aria-label="Plan">
        <SelectValue>
          {#snippet children(value)}{(value as Plan).name}{/snippet}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {#each plans as plan (plan.name)}
            <SelectItem value={plan}>{plan.name}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>

    <button type="submit" class={buttonClass}>Submit</button>
    <button type="reset" class={buttonClass}>Reset</button>
  </form>

  <Select items={[{ label: 'Choose a food', value: null }, ...fruitsOnly, ...vegetables]}>
    <SelectTrigger class="w-48" data-testid="groups" aria-label="Food">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        {#each fruitsOnly as item (item.value)}
          <SelectItem value={item.value}>{item.label}</SelectItem>
        {/each}
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Vegetables</SelectLabel>
        {#each vegetables as item (item.value)}
          <SelectItem value={item.value}>{item.label}</SelectItem>
        {/each}
      </SelectGroup>
    </SelectContent>
  </Select>

  <Select items={fruitsOnly} defaultValue="banana">
    <SelectTrigger class="w-48" data-testid="below" aria-label="Below">
      <SelectValue />
    </SelectTrigger>
    <SelectContent alignItemWithTrigger={false}>
      <SelectGroup>
        {#each fruitsOnly as item (item.value)}
          <SelectItem value={item.value}>{item.label}</SelectItem>
        {/each}
      </SelectGroup>
    </SelectContent>
  </Select>

  <Select items={fruits} {disabled}>
    <SelectTrigger class="w-48" data-testid="disabled" aria-label="Maybe disabled" size="sm">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {#each fruits as item (item.value)}
          <SelectItem value={item.value}>{item.label}</SelectItem>
        {/each}
      </SelectGroup>
    </SelectContent>
  </Select>
  <button type="button" class={buttonClass} onclick={() => (disabled = !disabled)}>Toggle disabled</button>

  <Field invalid class="w-48">
    <FieldLabel>Invalid fruit</FieldLabel>
    <Select items={fruitsOnly}>
      <SelectTrigger data-testid="invalid">
        <SelectValue placeholder="Pick one" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {#each fruitsOnly as item (item.value)}
            <SelectItem value={item.value}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>
    <FieldError match>Please pick a fruit.</FieldError>
  </Field>

  <Dialog>
    <DialogTrigger class={buttonClass}>Open Dialog</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Select Example</DialogTitle>
        <DialogDescription>Use the select below to choose a fruit.</DialogDescription>
      </DialogHeader>
      <Select items={fruits}>
        <SelectTrigger data-testid="dialog-select" aria-label="Dialog fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {#each fruits as item (item.value)}
              <SelectItem value={item.value} disabled={item.disabled}>{item.label}</SelectItem>
            {/each}
          </SelectGroup>
        </SelectContent>
      </Select>
    </DialogContent>
  </Dialog>

  <output data-testid="fruit-value">{JSON.stringify(fruit)}</output>
  <output data-testid="open">{String(open)}</output>
  <output data-testid="multiple-value">{multiple.join(',')}</output>
  <output data-testid="submitted">{submitted}</output>
</div>
