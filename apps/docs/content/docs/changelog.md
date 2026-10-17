---
title: Changelog
description: Releases of the Sveltery UI CLI and its packages.
order: 10
---

New releases of the `@sveltery/ui` CLI and the Svelte packages that the components use. The newest release is first. The components themselves have no version: `add` and `update` always copy the current source from the registry.

## October 2026: Typeset

Added on 2026-10-17.

[Typeset](/docs/typeset) is a styling system for HTML and rendered markdown, in one CSS file. It is [shadcn/typeset](https://ui.shadcn.com/docs/typeset), and it replaces the Typography page.

Your app renders the same HTML elements everywhere: headings, paragraphs, lists, tables, and code. You style them for your blog, then your docs, and now chat. Typeset lets you style them once, then tune the rhythm for each context.

```svelte
<div class="typeset">{@html content}</div>
```

Add one class and everything inside gets styled. Typeset follows the size of its container, uses your theme, and gives you three controls: size, leading, and flow.

You can create as many typesets as you need. Use a tighter rhythm for chat and a roomier one for docs:

```css
.typeset-chat {
  --typeset-leading: 1.6;
  --typeset-flow: 1em;
}

.typeset-docs {
  --typeset-size: 15px;
  --typeset-leading: 1.75;
  --typeset-flow: 1.5em;
}
```

```svelte
<div class="typeset typeset-chat">{@html message}</div>
<article class="typeset typeset-docs">{@html page}</article>
```

It's also designed for streaming, so new blocks don't restyle earlier ones. The file lives in your project. There's no package or config layer to work around.

## October 2026: @sveltery/ui 0.1.1

Released on 2026-10-17.

- `init`, `add` and `update` now stop with `No terminal to confirm in. Re-run with --yes.` when they need an answer and run without a terminal, such as in CI. They stop before they write anything. Before, they waited for an answer that never came, and Node exited with `Detected unsettled top-level await`.

## October 2026: @sveltery/ui 0.1.0

Released on 2026-10-17. The first release of the CLI.

- `init` sets up `components.json`, the theme and the base packages in a SvelteKit or Vite app. `init --preset` starts from a preset name, a preset code from the [Create page](/create) or the URL of a preset item.
- `add` copies components into your project, with the components they build on and the packages they need. It also adds items by URL.
- `diff` shows how your installed components differ from the registry, and `update` applies the changes after it asks.
- `list` shows every item in the registry and marks the installed ones.

See [CLI](/docs/cli) for every command and option.

## October 2026: Svelte packages 0.1.0

Released on 2026-10-16 and 2026-10-17. Some components need these packages, and `add` installs them for you.

| Package | What it is |
| --- | --- |
| `@sveltery/command` | A headless command menu, ported from cmdk |
| `@sveltery/day-picker` | A date picker and calendar, ported from react-day-picker |
| `@sveltery/input-otp` | A one-time password input, ported from input-otp |
| `@sveltery/resizable` | Resizable panel groups, ported from react-resizable-panels |
| `@sveltery/svelte` | Unstyled helpers for the Message Scroller and Questionnaire components |
