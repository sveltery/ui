# @sveltery/day-picker

A date picker and calendar for Svelte 5, ported from [react-day-picker](https://github.com/gpbl/react-day-picker) v9. It selects a single day, several days or a range, supports disabled days and other matchers, time zones through `@date-fns/tz`, locales through `date-fns`, and full keyboard navigation. It renders plain elements and ships no styles.

The styled [Calendar](https://ui.sveltery.dev/docs/components/calendar) component in Sveltery UI is built on it.

## Install

```sh
npm install @sveltery/day-picker date-fns @date-fns/tz
```

## Usage

```svelte
<script lang="ts">
  import { DayPicker } from '@sveltery/day-picker';

  let selected = $state<Date>();
</script>

<DayPicker mode="single" bind:selected disabled={{ dayOfWeek: [0, 6] }} />
```

Use `mode="multiple"` or `mode="range"` for the other selection modes. `classNames` replaces the class on each part, starting from `defaultClassNames`.

Add the styled version to your app with `npx @sveltery/ui@latest add calendar`.

## License

MIT. See `THIRD_PARTY_NOTICES.md` for the upstream license.
