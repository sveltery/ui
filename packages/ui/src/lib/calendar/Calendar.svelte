<script lang="ts">
  import { DayPicker, defaultClassNames } from '@sveltery/day-picker';
  import type { ChevronSnippetProps, DayButtonSnippetProps, RootSnippetProps, WeekNumberSnippetProps } from '@sveltery/day-picker';
  import { cn } from 'cn';
  import { buttonVariants } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  import type { CalendarProps } from './types.js';
  import CalendarDayButton from './CalendarDayButton.svelte';

  let {
    month = $bindable(),
    selected = $bindable(),
    class: classProp,
    classNames,
    showOutsideDays = true,
    captionLayout = 'label',
    buttonVariant = 'ghost',
    locale,
    formatters,
    root = calendarRoot,
    chevron = calendarChevron,
    dayButton = calendarDayButton,
    weekNumber = calendarWeekNumber,
    ...props
  }: CalendarProps = $props();
</script>

{#snippet calendarRoot({ props: { children, class: className, ...rootProps } }: RootSnippetProps)}
  <div data-slot="calendar" {...rootProps} class={cn(className)}>{@render children()}</div>
{/snippet}

{#snippet calendarChevron({ orientation, class: className }: ChevronSnippetProps)}
  {#if orientation === 'left'}
    <IconPlaceholder lucide="ChevronLeftIcon" tabler="IconChevronLeft" hugeicons="ArrowLeftIcon" phosphor="CaretLeftIcon" remixicon="RiArrowLeftSLine" class={cn('cn-rtl-flip size-4', className)} />
  {:else if orientation === 'right'}
    <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRightIcon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" class={cn('cn-rtl-flip size-4', className)} />
  {:else}
    <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDownIcon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" class={cn('size-4', className)} />
  {/if}
{/snippet}

{#snippet calendarDayButton({ day, modifiers, props: buttonProps, text }: DayButtonSnippetProps)}
  <CalendarDayButton {day} {modifiers} {locale} {...buttonProps}>{text}</CalendarDayButton>
{/snippet}

{#snippet calendarWeekNumber({ props: cellProps, text }: WeekNumberSnippetProps)}
  <td {...cellProps as Record<string, unknown>}>
    <div class="flex size-(--cell-size) items-center justify-center text-center">{text}</div>
  </td>
{/snippet}

<DayPicker
  bind:month
  bind:selected={selected as never}
  {showOutsideDays}
  class={cn(
    'cn-calendar group/calendar bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
    String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
    String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
    classProp,
  )}
  {captionLayout}
  {locale}
  formatters={{
    formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: 'short' }),
    ...formatters,
  }}
  classNames={{
    root: cn('w-fit', defaultClassNames.root),
    months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
    month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
    nav: cn('absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1', defaultClassNames.nav),
    button_previous: cn(buttonVariants({ variant: buttonVariant }), 'size-(--cell-size) p-0 select-none aria-disabled:opacity-50', defaultClassNames.button_previous),
    button_next: cn(buttonVariants({ variant: buttonVariant }), 'size-(--cell-size) p-0 select-none aria-disabled:opacity-50', defaultClassNames.button_next),
    month_caption: cn('flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)', defaultClassNames.month_caption),
    dropdowns: cn('flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium', defaultClassNames.dropdowns),
    dropdown_root: cn('cn-calendar-dropdown-root relative rounded-(--cell-radius)', defaultClassNames.dropdown_root),
    dropdown: cn('absolute inset-0 bg-popover opacity-0', defaultClassNames.dropdown),
    caption_label: cn(
      'font-medium select-none',
      captionLayout === 'label'
        ? 'cn-calendar-caption text-sm'
        : 'cn-calendar-caption-label flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground',
      defaultClassNames.caption_label,
    ),
    month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
    weekdays: cn('flex', defaultClassNames.weekdays),
    weekday: cn('flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none', defaultClassNames.weekday),
    week: cn('mt-2 flex w-full', defaultClassNames.week),
    week_number_header: cn('w-(--cell-size) select-none', defaultClassNames.week_number_header),
    week_number: cn('text-[0.8rem] text-muted-foreground select-none', defaultClassNames.week_number),
    day: cn(
      'group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)',
      props.showWeekNumber ? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)' : '[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)',
      defaultClassNames.day,
    ),
    range_start: cn('relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted', defaultClassNames.range_start),
    range_middle: cn('rounded-none', defaultClassNames.range_middle),
    range_end: cn('relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted', defaultClassNames.range_end),
    today: cn('rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none', defaultClassNames.today),
    outside: cn('text-muted-foreground aria-selected:text-muted-foreground', defaultClassNames.outside),
    disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
    hidden: cn('invisible', defaultClassNames.hidden),
    ...classNames,
  }}
  {root}
  {chevron}
  {dayButton}
  {weekNumber}
  {...props}
/>
