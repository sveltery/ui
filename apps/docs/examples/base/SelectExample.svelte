<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Button, buttonVariants } from '@sveltery/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  import { Field, FieldDescription, FieldError, FieldLabel } from '@sveltery/ui/field';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Input } from '@sveltery/ui/input';
  import { Item, ItemContent, ItemDescription, ItemTitle } from '@sveltery/ui/item';
  import { NativeSelect, NativeSelectOption } from '@sveltery/ui/native-select';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@sveltery/ui/select';

  const sides = ['inline-start', 'left', 'top', 'bottom', 'right', 'inline-end'] as const;

  const fruitItems = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes' },
    { label: 'Pineapple', value: 'pineapple' }
  ];
  const sideItems = [
    { label: 'Select', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' }
  ];
  const chartTypes = [
    { label: 'Chart Type', value: null, icon: 'chart' },
    { label: 'Line', value: 'line', icon: 'line' },
    { label: 'Bar', value: 'bar', icon: 'bar' },
    { label: 'Pie', value: 'pie', icon: 'pie' }
  ] as const;
  const fruits = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' }
  ];
  const vegetables = [
    { label: 'Carrot', value: 'carrot' },
    { label: 'Broccoli', value: 'broccoli' },
    { label: 'Spinach', value: 'spinach' }
  ];
  const groupedItems = [{ label: 'Select a fruit', value: null }, ...fruits, ...vegetables];
  const largeItems = [{ label: 'Select an item', value: null }, ...Array.from({ length: 100 }, (_, i) => ({ label: `Item ${i}`, value: `item-${i}` }))];
  const sizeItems = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' }
  ];
  const disabledItems = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes', disabled: true },
    { label: 'Pineapple', value: 'pineapple' }
  ];
  const filterItems = [
    { label: 'Filter', value: null },
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ];
  const plans = [
    { name: 'Starter', description: 'Perfect for individuals getting started.' },
    { name: 'Professional', description: 'Ideal for growing teams and businesses.' },
    { name: 'Enterprise', description: 'Advanced features for large organizations.' }
  ];
  type Plan = (typeof plans)[number];
  const multipleItems = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes' },
    { label: 'Pineapple', value: 'pineapple' },
    { label: 'Strawberry', value: 'strawberry' },
    { label: 'Watermelon', value: 'watermelon' }
  ];
</script>

{#snippet chartLabel(chart: (typeof chartTypes)[number])}
  {#if chart.icon === 'bar'}
    <IconPlaceholder lucide="ChartBarIcon" tabler="IconChartBar" hugeicons="Chart03Icon" phosphor="ChartBarIcon" remixicon="RiBarChartLine" />
  {:else if chart.icon === 'pie'}
    <IconPlaceholder lucide="ChartPieIcon" tabler="IconChartPie" hugeicons="Chart03Icon" phosphor="ChartPieIcon" remixicon="RiPieChartLine" />
  {:else}
    <IconPlaceholder lucide="ChartLineIcon" tabler="IconChartLine" hugeicons="Chart03Icon" phosphor="ChartLineIcon" remixicon="RiLineChartLine" />
  {/if}
  {chart.label}
{/snippet}

{#snippet planItem(plan: Plan)}
  <Item size="xs" class="w-full p-0">
    <ItemContent class="gap-0 normal-case">
      <ItemTitle class="font-sans">{plan.name}</ItemTitle>
      <ItemDescription class="text-xs font-normal tracking-normal">{plan.description}</ItemDescription>
    </ItemContent>
  </Item>
{/snippet}

{#snippet SelectBasic()}
  <Example title="Basic">
    <Select items={fruitItems}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {#each fruitItems as item (item.value)}
            <SelectItem value={item.value}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>
  </Example>
{/snippet}

{#snippet SelectSides()}
  <Example title="Sides" containerClass="col-span-2">
    <div class="flex flex-wrap justify-center gap-2">
      {#each sides as side (side)}
        <Select items={sideItems}>
          <SelectTrigger class="w-28 capitalize">
            <SelectValue placeholder={side.replace('-', ' ')} />
          </SelectTrigger>
          <SelectContent {side} alignItemWithTrigger={false}>
            <SelectGroup>
              {#each sideItems as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet SelectWithIcons()}
  <Example title="With Icons">
    <div class="flex flex-col gap-4">
      {#each ['sm', 'default'] as const as size (size)}
        <Select items={chartTypes}>
          <SelectTrigger {size}>
            <SelectValue>
              {#snippet children(value)}
                {@render chartLabel(chartTypes.find((chart) => chart.value === value) ?? chartTypes[0])}
              {/snippet}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each chartTypes as chart (chart.value)}
                <SelectItem value={chart.value}>{@render chartLabel(chart)}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet SelectWithGroups()}
  <Example title="With Groups & Labels">
    <Select items={groupedItems}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {#each fruits as item (item.value)}
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
  </Example>
{/snippet}

{#snippet SelectLargeList()}
  <Example title="Large List">
    <Select items={largeItems}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {#each largeItems as item (item.value)}
            <SelectItem value={item.value}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>
  </Example>
{/snippet}

{#snippet SelectSizes()}
  <Example title="Sizes">
    <div class="flex flex-col gap-4">
      {#each ['sm', 'default'] as const as size (size)}
        <Select items={sizeItems}>
          <SelectTrigger {size}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each sizeItems as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet SelectWithButton()}
  <Example title="With Button">
    <div class="flex flex-col gap-4">
      {#each ['sm', 'default'] as const as size (size)}
        <div class="flex items-center gap-2">
          <Select items={sizeItems}>
            <SelectTrigger {size}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {#each sizeItems as item (item.value)}
                  <SelectItem value={item.value}>{item.label}</SelectItem>
                {/each}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" {size}>Submit</Button>
        </div>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet SelectItemAligned()}
  <Example title="Item Aligned">
    <Select items={disabledItems}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={true}>
        <SelectGroup>
          {#each disabledItems as item (item.value)}
            <SelectItem value={item.value} disabled={item.disabled}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>
  </Example>
{/snippet}

{#snippet SelectWithField()}
  <Example title="With Field">
    <Field>
      <FieldLabel>Favorite Fruit</FieldLabel>
      <Select items={fruitItems}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {#each fruitItems as item (item.value)}
              <SelectItem value={item.value}>{item.label}</SelectItem>
            {/each}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldDescription>Choose your favorite fruit from the list.</FieldDescription>
    </Field>
  </Example>
{/snippet}

{#snippet SelectInvalid()}
  <Example title="Invalid">
    <div class="flex flex-col gap-4">
      <Select items={fruitItems}>
        <SelectTrigger aria-invalid="true">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {#each fruitItems as item (item.value)}
              <SelectItem value={item.value}>{item.label}</SelectItem>
            {/each}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Field invalid>
        <FieldLabel>Favorite Fruit</FieldLabel>
        <Select items={fruitItems}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each fruitItems as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldError match>Please select a valid fruit.</FieldError>
      </Field>
    </div>
  </Example>
{/snippet}

{#snippet SelectInline()}
  <Example title="Inline with Input & NativeSelect">
    <div class="flex items-center gap-2">
      <Input placeholder="Search..." class="flex-1" />
      <Select items={filterItems}>
        <SelectTrigger class="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {#each filterItems as item (item.value)}
              <SelectItem value={item.value}>{item.label}</SelectItem>
            {/each}
          </SelectGroup>
        </SelectContent>
      </Select>
      <NativeSelect class="w-[140px]">
        <NativeSelectOption value="">Sort by</NativeSelectOption>
        <NativeSelectOption value="name">Name</NativeSelectOption>
        <NativeSelectOption value="date">Date</NativeSelectOption>
        <NativeSelectOption value="status">Status</NativeSelectOption>
      </NativeSelect>
    </div>
  </Example>
{/snippet}

{#snippet SelectDisabled()}
  <Example title="Disabled">
    <Select items={disabledItems} disabled>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {#each disabledItems as item (item.value)}
            <SelectItem value={item.value} disabled={item.disabled}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>
  </Example>
{/snippet}

{#snippet SelectPlan()}
  <Example title="Subscription Plan">
    <Select defaultValue={plans[0]} itemToStringValue={(plan: Plan) => plan.name}>
      <SelectTrigger class="h-auto! w-72">
        <SelectValue>
          {#snippet children(value)}
            {@render planItem(value as Plan)}
          {/snippet}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {#each plans as plan (plan.name)}
            <SelectItem value={plan}>{@render planItem(plan)}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>
  </Example>
{/snippet}

{#snippet SelectMultiple()}
  <Example title="Multiple Selection">
    <Select items={multipleItems} multiple defaultValue={[]}>
      <SelectTrigger class="w-72">
        <SelectValue>
          {#snippet children(value)}
            {const selected = $derived(value as string[])}
            {#if selected.length === 0}
              Select fruits
            {:else if selected.length === 1}
              {multipleItems.find((item) => item.value === selected[0])?.label}
            {:else}
              {selected.length} fruits selected
            {/if}
          {/snippet}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {#each multipleItems as item (item.value)}
            <SelectItem value={item.value}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>
  </Example>
{/snippet}

{#snippet SelectInDialog()}
  <Example title="In Dialog">
    <Dialog>
      <DialogTrigger class={buttonVariants({ variant: 'outline' })}>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Example</DialogTitle>
          <DialogDescription>Use the select below to choose a fruit.</DialogDescription>
        </DialogHeader>
        <Select items={fruitItems}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each fruitItems as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render SelectBasic()}
  {@render SelectSides()}
  {@render SelectWithIcons()}
  {@render SelectWithGroups()}
  {@render SelectLargeList()}
  {@render SelectMultiple()}
  {@render SelectSizes()}
  {@render SelectPlan()}
  {@render SelectWithButton()}
  {@render SelectItemAligned()}
  {@render SelectWithField()}
  {@render SelectInvalid()}
  {@render SelectInline()}
  {@render SelectDisabled()}
  {@render SelectInDialog()}
</ExampleWrapper>
