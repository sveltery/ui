# Changelog

## 0.2.0

The port now matches react-day-picker 9.8.1, the version shadcn/ui renders.

- Chevrons receive upstream's `size` and `disabled` props.
- Day buttons leave out the selection attributes that do not apply. The root no longer sets `lang` from the locale, and the dropdown root always has `data-disabled`.
- Removed what 9.8.1 lacks: `reverseYears`, `resetOnSelect`, year-first dropdowns, focusable disabled days, and the later grid, matcher and range rules.

## 0.1.0

First release.
