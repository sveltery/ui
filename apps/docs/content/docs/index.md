---
title: Introduction
description: Sveltery UI is a Svelte port of shadcn/ui. You copy accessible, styled components into your app and own the code.
order: 0
---

**This is not a component library. It is how you build your component library.**

Most component libraries ship as a package. You install it, import the components, and live with their styles and their API. When a component does not fit your design, you wrap it or override it.

Sveltery UI gives you the component source instead. You copy a component into your project, and from then on it is your code. Change the classes, the markup or the props directly.

## Built on Sveltery Base

Each styled component sits on a headless primitive from [Sveltery Base](https://github.com/sveltery/base), the Svelte port of [Base UI](https://base-ui.com). Base owns the hard parts: focus management, keyboard support, ARIA wiring and form integration. Sveltery UI adds the [shadcn/ui](https://ui.shadcn.com) styles on top.

Because the behavior lives in Base, you can restyle a component without touching its accessibility. Base fixes reach your app through a dependency update, while the code you copied stays yours.

## Svelte first, not React translated

This is a port, not a transliteration. Where React and the platform disagree, the components follow HTML and Svelte:

- Props are HTML attributes: `class`, `for` and `onclick`, not `className`, `htmlFor` and `onClick`.
- Two-way state uses `bind:`, for example `bind:open` on a dialog and `bind:value` on a textarea.
- Forms reset the way the browser resets them. Nothing emulates React's controlled inputs.
- Composition uses the `render` prop, as in Base UI. It takes a snippet that receives the props to spread on your element.

## Status

Sveltery UI is experimental. The [components](/docs/components) list shows what exists today, and the [installation guide](/docs/installation) shows how to add them to your app.
