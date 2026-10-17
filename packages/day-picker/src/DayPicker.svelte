<!--
  A date picker grid. Ports react-day-picker v9.14.0 DayPicker.tsx with the markup of v9.8.1, the version shadcn/ui renders; MIT, see THIRD_PARTY_NOTICES.md.
-->
<script lang="ts">
  import { untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { DayPickerState } from './day-picker.svelte.js';
  import { keyToMove } from './focus.js';
  import { defaultFormatters, defaultLabels } from './format.js';
  import { getMonthOptions, getWeekdays, getYearOptions } from './grid.js';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { ChevronSnippetProps, DayButtonSnippetProps, DayPickerProps, WeekNumberSnippetProps } from './props.js';
  import type { CalendarDay, CalendarMonth, ClassNames, Modifiers } from './types.js';
  import { defaultClassNames } from './class-names.js';

  let { month = $bindable(), selected = $bindable(), class: classProp, ...props }: DayPickerProps = $props();

  const state = new DayPickerState({
    get props() {
      return props as DayPickerProps;
    },
    get month() {
      return month;
    },
    set month(value) {
      month = value;
    },
    get selected() {
      return selected;
    },
    set selected(value) {
      selected = value as typeof selected;
    },
  });

  if (untrack(() => props.autofocus)) state.focused = untrack(() => state.focusTarget);

  const focusKey = createAttachmentKey();

  const classNames: ClassNames = $derived({ ...defaultClassNames, ...props.classNames });
  const formatters = $derived({ ...defaultFormatters, ...props.formatters });
  const labels = $derived({ ...defaultLabels, ...props.labels });
  const lib = $derived(state.lib);
  const interactive = $derived(props.mode !== undefined || props.onDayClick !== undefined);
  const numberOfMonths = $derived(props.numberOfMonths ?? 1);
  const weekdays = $derived(getWeekdays(lib, props.ISOWeek, state.today));
  const yearFirst = $derived(lib.getMonthYearOrder() === 'year-first');

  const dataAttributes = $derived(Object.fromEntries(Object.entries(props).filter(([key]) => key.startsWith('data-'))));

  function dayClass(modifiers: Modifiers) {
    const names = [classNames.day];
    for (const [name, active] of Object.entries(modifiers)) {
      if (!active) continue;
      const custom = props.modifiersClassNames?.[name];
      if (custom) names.push(custom);
      else if (name in classNames && name !== 'day') names.push(classNames[name as keyof ClassNames]);
    }
    return names.join(' ');
  }

  function dayButtonProps(day: CalendarDay, modifiers: Modifiers) {
    return {
      type: 'button' as const,
      class: classNames.day_button,
      disabled: (!modifiers.focused && modifiers.disabled) || undefined,
      'aria-disabled': (modifiers.focused && modifiers.disabled) || undefined,
      tabindex: state.isFocusTarget(day) ? 0 : -1,
      'aria-label': labels.labelDayButton(day.date, modifiers, lib),
      onclick: (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        state.focus(day);
        if (modifiers.disabled) return;
        state.select(day, modifiers, event);
        props.onDayClick?.(day.date, modifiers, event);
      },
      onfocus: (event: FocusEvent) => {
        state.focus(day);
        props.onDayFocus?.(day.date, modifiers, event);
      },
      onblur: (event: FocusEvent) => {
        state.blur();
        props.onDayBlur?.(day.date, modifiers, event);
      },
      onkeydown: (event: KeyboardEvent) => {
        const move = keyToMove(event.key, event.shiftKey, props.dir);
        if (move) {
          event.preventDefault();
          event.stopPropagation();
          state.moveFocus(...move);
        }
        props.onDayKeyDown?.(day.date, modifiers, event);
      },
      onmouseenter: (event: MouseEvent) => props.onDayMouseEnter?.(day.date, modifiers, event),
      onmouseleave: (event: MouseEvent) => props.onDayMouseLeave?.(day.date, modifiers, event),
      [focusKey]: (node: HTMLElement) => {
        if (modifiers.focused) node.focus();
      },
    };
  }

  const rootProps: HTMLAttributes<HTMLDivElement> = $derived({
    class: [classNames.root, classProp],
    style: props.style,
    dir: props.dir,
    id: props.id,
    lang: props.lang,
    nonce: props.nonce,
    title: props.title,
    role: props.role,
    'aria-label': props['aria-label'],
    'data-mode': props.mode,
    'data-required': 'required' in props ? props.required : undefined,
    'data-multiple-months': numberOfMonths > 1 || undefined,
    'data-week-numbers': props.showWeekNumber || undefined,
    'data-nav-layout': props.navLayout || undefined,
    ...dataAttributes,
  });

  const visuallyHidden =
    'border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;word-wrap:normal';
</script>

{#snippet defaultChevron({ orientation, class: className, size = 24 }: ChevronSnippetProps)}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    {#if orientation === 'up'}
      <polygon points="6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" />
    {:else if orientation === 'down'}
      <polygon points="6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" />
    {:else if orientation === 'left'}
      <polygon points="16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" />
    {:else}
      <polygon points="8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" />
    {/if}
  </svg>
{/snippet}

{#snippet chevron(chevronProps: ChevronSnippetProps)}
  {@render (props.chevron ?? defaultChevron)(chevronProps)}
{/snippet}

{#snippet previousButton()}
  <button
    type="button"
    class={classNames.button_previous}
    tabindex={state.previousMonth ? undefined : -1}
    aria-disabled={state.previousMonth ? undefined : true}
    aria-label={labels.labelPrevious(state.previousMonth)}
    onclick={state.goToPrevious}
  >
    {@render chevron({ orientation: props.dir === 'rtl' && props.navLayout === 'around' ? 'right' : 'left', class: classNames.chevron, disabled: state.previousMonth ? undefined : true })}
  </button>
{/snippet}

{#snippet nextButton()}
  <button
    type="button"
    class={classNames.button_next}
    tabindex={state.nextMonth ? undefined : -1}
    aria-disabled={state.nextMonth ? undefined : true}
    aria-label={labels.labelNext(state.nextMonth)}
    onclick={state.goToNext}
  >
    {@render chevron({ orientation: props.dir === 'rtl' && props.navLayout === 'around' ? 'left' : 'right', class: classNames.chevron, disabled: state.nextMonth ? undefined : true })}
  </button>
{/snippet}

{#snippet nav()}
  <nav class={classNames.nav} aria-label={labels.labelNav()}>
    {@render previousButton()}
    {@render nextButton()}
  </nav>
{/snippet}

{#snippet dropdown(kind: 'months' | 'years', calendarMonth: CalendarMonth)}
  {const options =
    $derived(kind === 'months'
      ? getMonthOptions(calendarMonth.date, state.navStart, state.navEnd, (m) => formatters.formatMonthDropdown(m, lib), lib)
      : (getYearOptions(state.navStart, state.navEnd, (y) => formatters.formatYearDropdown(y, lib), lib, props.reverseYears) ?? []))}
  {const value = $derived(kind === 'months' ? lib.getMonth(calendarMonth.date) : lib.getYear(calendarMonth.date))}
  <span class={classNames.dropdown_root} data-disabled={Boolean(props.disableNavigation)}>
    <select
      class={[classNames.dropdown, kind === 'months' ? classNames.months_dropdown : classNames.years_dropdown]}
      aria-label={kind === 'months' ? labels.labelMonthDropdown() : labels.labelYearDropdown()}
      disabled={props.disableNavigation}
      {value}
      onchange={(event) => {
        const next = Number(event.currentTarget.value);
        const start = lib.startOfMonth(calendarMonth.date);
        state.goToMonth(kind === 'months' ? lib.setMonth(start, next) : lib.setYear(start, next));
      }}
    >
      {#each options as option (option.value)}
        <option value={option.value} disabled={option.disabled}>{option.label}</option>
      {/each}
    </select>
    <span class={classNames.caption_label} aria-hidden="true">
      {options.find((option) => option.value === value)?.label}
      {@render chevron({ orientation: 'down', class: classNames.chevron, size: 18 })}
    </span>
  </span>
{/snippet}

{#snippet caption(calendarMonth: CalendarMonth)}
  {const layout = $derived(props.captionLayout ?? 'label')}
  {#if layout === 'label'}
    <span class={classNames.caption_label} role="status" aria-live="polite">{formatters.formatCaption(calendarMonth.date, lib)}</span>
  {:else}
    {const showMonths = $derived(layout === 'dropdown' || layout === 'dropdown-months')}
    {const showYears = $derived(layout === 'dropdown' || layout === 'dropdown-years')}
    <div class={classNames.dropdowns}>
      {#snippet monthControl()}
        {#if showMonths}{@render dropdown('months', calendarMonth)}{:else}<span>{formatters.formatMonthDropdown(calendarMonth.date, lib)}</span>{/if}
      {/snippet}
      {#snippet yearControl()}
        {#if showYears}{@render dropdown('years', calendarMonth)}{:else}<span>{formatters.formatYearDropdown(calendarMonth.date, lib)}</span>{/if}
      {/snippet}
      {#if yearFirst}
        {@render yearControl()}{@render monthControl()}
      {:else}
        {@render monthControl()}{@render yearControl()}
      {/if}
      <span role="status" aria-live="polite" style={visuallyHidden}>{formatters.formatCaption(calendarMonth.date, lib)}</span>
    </div>
  {/if}
{/snippet}

{#snippet defaultDayButton({ props, text }: DayButtonSnippetProps)}
  <button {...props}>{text}</button>
{/snippet}

{#snippet defaultWeekNumber({ props, text }: WeekNumberSnippetProps)}
  <th {...props}>{text}</th>
{/snippet}

{#snippet months()}
  <div class={classNames.months}>
    {#if !props.hideNavigation && !props.navLayout}
      {@render nav()}
    {/if}
    {#each state.months as calendarMonth, displayIndex (calendarMonth.date.getTime())}
      <div class={classNames.month}>
        {#if props.navLayout === 'around' && !props.hideNavigation && displayIndex === 0}
          {@render previousButton()}
        {/if}
        <div class={classNames.month_caption}>
          {@render caption(calendarMonth)}
        </div>
        {#if props.navLayout === 'around' && !props.hideNavigation && displayIndex === numberOfMonths - 1}
          {@render nextButton()}
        {/if}
        {#if props.navLayout === 'after' && !props.hideNavigation && displayIndex === numberOfMonths - 1}
          {@render nav()}
        {/if}
        <table
          role="grid"
          class={classNames.month_grid}
          aria-multiselectable={props.mode === 'multiple' || props.mode === 'range'}
          aria-label={labels.labelGrid(calendarMonth.date, lib) || undefined}
        >
          {#if !props.hideWeekdays}
            <thead aria-hidden="true">
              <tr class={classNames.weekdays}>
                {#if props.showWeekNumber}
                  <th class={classNames.week_number_header} aria-label={labels.labelWeekNumberHeader()} scope="col">{formatters.formatWeekNumberHeader()}</th>
                {/if}
                {#each weekdays as weekday (weekday.getTime())}
                  <th class={classNames.weekday} aria-label={labels.labelWeekday(weekday, lib)} scope="col">{formatters.formatWeekdayName(weekday, lib)}</th>
                {/each}
              </tr>
            </thead>
          {/if}
          <tbody class={classNames.weeks}>
            {#each calendarMonth.weeks as week (week.days[0].isoDate)}
              <tr class={classNames.week}>
                {#if props.showWeekNumber}
                  {@render (props.weekNumber ?? defaultWeekNumber)({
                    week,
                    props: {
                      class: classNames.week_number,
                      scope: 'row',
                      role: 'rowheader',
                      'aria-label': labels.labelWeekNumber(week.weekNumber),
                    },
                    text: formatters.formatWeekNumber(week.weekNumber, lib),
                  })}
                {/if}
                {#each week.days as day (day.isoDate)}
                  {const modifiers = $derived(state.modifiers(day))}
                  <td
                    class={dayClass(modifiers)}
                    role="gridcell"
                    aria-selected={modifiers.selected || undefined}
                    aria-label={!interactive && !modifiers.hidden ? labels.labelGridcell(day.date, modifiers, lib) : undefined}
                    data-day={day.isoDate}
                    data-month={day.outside ? day.dateMonthId : undefined}
                    data-selected={modifiers.selected || undefined}
                    data-disabled={modifiers.disabled || undefined}
                    data-hidden={modifiers.hidden || undefined}
                    data-outside={day.outside || undefined}
                    data-focused={modifiers.focused || undefined}
                    data-today={modifiers.today || undefined}
                  >
                    {#if !modifiers.hidden && interactive}
                      {@render (props.dayButton ?? defaultDayButton)({ day, modifiers, props: dayButtonProps(day, modifiers), text: formatters.formatDay(day.date, lib) })}
                    {:else if !modifiers.hidden}
                      {formatters.formatDay(day.date, lib)}
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/each}
  </div>
  {#if props.footer}
    <div class={classNames.footer} role="status" aria-live="polite">{@render props.footer()}</div>
  {/if}
{/snippet}

{#if props.root}
  {@render props.root({ props: { ...rootProps, children: months } })}
{:else}
  <div {...rootProps}>{@render months()}</div>
{/if}
