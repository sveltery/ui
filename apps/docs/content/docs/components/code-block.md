---
title: Code Block
description: Displays code, terminal output and diffs with an optional header, line numbers and a copy button.
style: rhea
---

<ComponentPreview name="base/CodeBlockDemoExample" />

`CodeBlock` displays code, terminal output, logs and diffs. It has a header with a title and actions, line numbers, wrapping, diff and highlighted lines, and a small size for tool output in a [Trace](/docs/components/trace).

Syntax highlighting is optional and lives in a separate function, so a block that only shows plain output stays small.

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add code-block
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install shiki
```

### Install the required Sveltery UI dependencies

```bash
npx @sveltery/ui@latest add button
```

### Copy the component

Copy the following files into `src/lib/components/ui/code-block`.

<ComponentSource name="code-block" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

`code-block` also installs `useHighlightedCode` for [syntax highlighting](#syntax-highlighting).

## Usage

```svelte
<script lang="ts">
  import {
    CodeBlock,
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockFooter,
    CodeBlockHeader,
    CodeBlockLine,
    CodeBlockTitle,
  } from '#lib/components/ui/code-block';
</script>
```

```svelte
<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>Terminal</CodeBlockTitle>
    <CodeBlockActions>
      <CodeBlockCopyButton value={output} />
    </CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent code={output} />
</CodeBlock>
```

## Composition

```text
CodeBlock
├── CodeBlockHeader
│   ├── CodeBlockTitle
│   └── CodeBlockActions
│       └── CodeBlockCopyButton
├── CodeBlockActions (floating, when there is no header)
├── CodeBlockContent
│   └── CodeBlockLine
└── CodeBlockFooter
```

`CodeBlockContent` takes a string in `code`, or a list of `CodeBlockLine` as children. Use lines when you need line variants or highlighted tokens.

## Features

- **It streams cheaply.** A `code` string renders as one text node, and the highlighter tokenizes only the new lines as code arrives.
- **It copies cleanly.** Line numbers and diff markers are left out of a selection, and blank lines survive the copy.
- **It reads left to right.** The content is always `dir="ltr"`. The header follows the page direction.
- **It highlights without WASM.** `useHighlightedCode` uses Shiki's JavaScript engine, loads each language on first use and renders ANSI colors in terminal output. On the server, `highlightCode` keeps Shiki out of the client bundle.
- **It fits where code shows up.** Use it in a message, a Trace line, Tabs or a Dialog.
- **It scrolls by keyboard.** The content is focusable, and floating actions show on focus as well as on hover.

## Basic

Pass a string to `code` on `CodeBlockContent`. It renders as one text node, so it stays cheap while output streams.

<ComponentPreview name="base/CodeBlockBasicExample" />

## Header

`CodeBlockHeader` holds a `CodeBlockTitle` and `CodeBlockActions`. `CodeBlockCopyButton` copies its `value`.

<ComponentPreview name="base/CodeBlockHeaderExample" />

A long title truncates. To link the title to a file, wrap `CodeBlockTitle` in an anchor.

```svelte showLineNumbers
<CodeBlockHeader>
  <a href="/files/route.ts">
    <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
  </a>
</CodeBlockHeader>
```

## Actions

`CodeBlockActions` holds any number of buttons. For a wrap toggle, keep the state yourself and pass it to `wrap`.

<ComponentPreview name="base/CodeBlockActionsExample" />

```svelte showLineNumbers
<script lang="ts">
  let wrap = $state(false);
</script>

<CodeBlockActions>
  <Button variant="ghost" size="icon-xs" aria-label="Wrap lines" aria-pressed={wrap} onclick={() => (wrap = !wrap)}>
    <WrapTextIcon />
  </Button>
  <CodeBlockCopyButton value={output} />
</CodeBlockActions>
<CodeBlockContent {wrap} code={output} />
```

## Floating Actions

Without a header, put `CodeBlockActions` directly inside `CodeBlock`. The actions float at the top end and stay hidden until the block is hovered or focused. They always show on touch screens.

<ComponentPreview name="base/CodeBlockFloatingActionsExample" />

## Line Numbers

Add `lineNumbers` to `CodeBlockContent`. A `code` string is split into lines, and the numbers are not copied with a selection.

<ComponentPreview name="base/CodeBlockLineNumbersExample" />

## Start Line

Set `startLine` to number lines from a given line, for a snippet from the middle of a file. The gutter grows to fit the widest number.

<ComponentPreview name="base/CodeBlockStartLineExample" />

## Wrap

Long lines scroll by default. Add `wrap` to wrap them, which suits tool output and error messages. To let the reader toggle it, see [Actions](#actions).

<ComponentPreview name="base/CodeBlockWrapExample" />

## Highlighted Lines

Render each line as a `CodeBlockLine` and set `variant="highlighted"` on the lines to call out.

<ComponentPreview name="base/CodeBlockHighlightedLinesExample" />

## Diff

Set `variant="added"` or `variant="removed"` on a `CodeBlockLine`. Each one adds a `+` or `−` marker.

<ComponentPreview name="base/CodeBlockDiffExample" />

## Height

Cap the height with a `max-h-*` class on `CodeBlockContent`. The content scrolls inside the block.

<ComponentPreview name="base/CodeBlockHeightExample" />

`CodeBlockContent` fades its edges with `scroll-fade` as it scrolls: left and right by default, top and bottom when it wraps. Add `scroll-fade-y` to a capped block that does not wrap.

## Show More

`CodeBlockFooter` is a slot below the content. For Show More, cap the content while it is collapsed and put a ghost `xs` `Button` in the footer.

<ComponentPreview name="base/CodeBlockShowMoreExample" />

```svelte showLineNumbers
<script lang="ts">
  let expanded = $state(false);
  const id = $props.id();
</script>

<CodeBlockContent {id} class={expanded ? undefined : 'max-h-64 overflow-y-hidden scroll-fade-y'} {code} />
<CodeBlockFooter class="justify-center">
  <Button variant="ghost" size="xs" aria-expanded={expanded} aria-controls={id} onclick={() => (expanded = !expanded)}>
    {expanded ? 'Show less' : 'Show more'}
  </Button>
</CodeBlockFooter>
```

### Max Height

To keep a long block from taking over the page, raise the cap instead of removing it. The expanded content scrolls, and the edges fade as you scroll.

<ComponentPreview name="base/CodeBlockShowMoreScrollExample" />

## Size

Use `size="sm"` for tool and [Trace](#trace) output. It has tighter padding and `text-xs` text.

<ComponentPreview name="base/CodeBlockSizeExample" />

## Destructive

Use `variant="destructive"` for errors and failed output.

<ComponentPreview name="base/CodeBlockDestructiveExample" />

## Trace

Put a `CodeBlock` with `size="sm"` in `TraceCollapsibleContent` for tool and terminal output. Add `wrap` and a `max-h-64` class to `CodeBlockContent` so long output wraps and scrolls inside the trace. The block sets its own text color, so `TraceCollapsibleContent` does not mute it.

<ComponentPreview name="base/CodeBlockTraceExample" />

## Tabs

Show several files with [Tabs](/docs/components/tabs), one `CodeBlock` in each `TabsContent`.

<ComponentPreview name="base/CodeBlockTabsExample" />

## Message

Put a `CodeBlock` between paragraphs inside a [Message](/docs/components/message).

<ComponentPreview name="base/CodeBlockChatExample" />

## Typeset

A `CodeBlock` inside a [`typeset`](/docs/typeset) container keeps its own styles and gets the same space above as a paragraph.

<ComponentPreview name="base/CodeBlockTypesetExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the content in a [DirectionProvider](/docs/components/direction) to lay it out right to left. Code always reads left to right. The header follows the page direction. Use the language selector to switch the language.

<ComponentPreview name="base/CodeBlockRtlExample" direction="rtl" />

## Syntax Highlighting

`useHighlightedCode` highlights with [Shiki](https://shiki.style) and returns one HTML string per line for `CodeBlockLine`.

<ComponentPreview name="base/CodeBlockHighlightingExample" />

```svelte showLineNumbers
<script lang="ts">
  const highlighted = useHighlightedCode(() => code, () => 'json');
</script>

<CodeBlock>
  <CodeBlockContent>
    {#each highlighted.lines as line, index (index)}
      <CodeBlockLine>{@html line}</CodeBlockLine>
    {/each}
  </CodeBlockContent>
</CodeBlock>
```

Shiki uses its JavaScript regex engine, so there is no WASM to load. The highlighter escapes the code, so `{@html}` renders the tokens and never markup from the code.

### Languages

Each language loads the first time it is used. Edit the list in `highlighter.ts`. A language that is not in the list renders as plain text.

<ComponentPreview name="base/CodeBlockLanguagesExample" />

The list ships with `bash`, `css`, `diff`, `html`, `javascript`, `json`, `jsx`, `markdown`, `python`, `sql`, `tsx`, `typescript` and `yaml`, plus aliases such as `ts`, `js`, `sh` and `yml`.

### Terminal Output

Pass `"ansi"` as the language to render the colors in terminal output. Without it, escape codes show as text.

<ComponentPreview name="base/CodeBlockAnsiExample" />

ANSI colors do not carry from one line to the next.

### Server Rendering

`highlightCode` is async, so it can run in a `load` function on the server and Shiki stays out of the client bundle.

```ts showLineNumbers title="src/routes/+page.server.ts"
import { highlightCode } from '#lib/components/ui/code-block';

export async function load() {
  const code = 'export const answer = 42;';
  return { code, lines: await highlightCode(code, 'tsx') };
}
```

```svelte showLineNumbers title="src/routes/+page.svelte"
<script lang="ts">
  import { CodeBlock, CodeBlockContent, CodeBlockLine } from '#lib/components/ui/code-block';

  let { data } = $props();
</script>

<CodeBlock>
  <CodeBlockContent lineNumbers>
    {#each data.lines as line, index (index)}
      <CodeBlockLine>{@html line}</CodeBlockLine>
    {/each}
  </CodeBlockContent>
</CodeBlock>
```

### Streaming

While the code streams, `useHighlightedCode` tokenizes only the new lines, starting where the last line left off. Lines that did not change keep the same strings, so Svelte leaves their DOM alone.

<ComponentPreview name="base/CodeBlockStreamingExample" />

### Markdown

Render the message with [svelte-streamdown](https://github.com/beynar/svelte-streamdown) and route fenced code to a `CodeBlock` with its `code` snippet. Inline code goes to the `codespan` snippet, so it stays inline.

<ComponentPreview name="base/CodeBlockMarkdownExample" />

The `code` snippet's `incomplete` is `true` for the last block until its closing fence arrives. Use it to disable the copy button while the code is incomplete. Combine it with your own streaming flag, so a finished message whose fence never closed is not treated as incomplete.

```svelte showLineNumbers
<Streamdown content={text}>
  {#snippet code({ token, incomplete })}
    <MarkdownCodeBlock code={token.text} language={token.lang ?? ''} incomplete={incomplete && isStreaming} />
  {/snippet}
</Streamdown>
```

## Accessibility

- `CodeBlockContent` is a `pre` with a `code` element and always sets `dir="ltr"`, so code reads left to right on an RTL page.
- `CodeBlockContent` has `tabindex="0"`, so keyboard users can focus it and scroll it. Pass `tabindex={-1}` to remove the tab stop.
- Floating actions show when focus is inside the block, not only on hover, so keyboard users can reach them.
- Line numbers are hidden from screen readers.
- Diff lines carry a `+` or `−` marker as well as a tint, so the change does not rely on color.
- `CodeBlockCopyButton` is labelled "Copy", and a polite live region announces "Copied" after a successful copy.
- Give a wrap toggle `aria-pressed` so its state is announced.
- Give a Show More button `aria-expanded` and point `aria-controls` at the `id` of `CodeBlockContent`.

## API reference

### CodeBlock

The surface that holds the header, the content and the footer.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default" \| "destructive"` | `"default"` | The tone of the block. |
| `size` | `"default" \| "sm"` | `"default"` | `"sm"` has tighter padding and `text-xs` code, for tool output. |
| `class` | `string` | - | Additional classes to apply to the block. |

### CodeBlockHeader

A row above the content for a title and actions.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | - | Additional classes to apply to the header. |

### CodeBlockTitle

A filename or a label, with an optional icon. It truncates.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | - | Additional classes to apply to the title. |

### CodeBlockActions

Holds buttons at the end of the header. As a direct child of `CodeBlock`, it floats.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | - | Additional classes to apply to the actions. |

### CodeBlockCopyButton

A ghost icon button that copies `value` to the clipboard. It accepts the props of [`Button`](/docs/components/button).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Required. The text to copy. |
| `class` | `string` | - | Additional classes to apply to the button. |

### CodeBlockContent

The `pre` that scrolls or wraps.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | - | Plain text to show. Leave it out and pass `CodeBlockLine` children instead. |
| `wrap` | `boolean` | `false` | Wrap long lines instead of scrolling. |
| `lineNumbers` | `boolean` | `false` | Number each line. A `code` string is split into lines. |
| `startLine` | `number` | `1` | The number of the first line, when `lineNumbers` is set. |
| `tabindex` | `number` | `0` | Makes the content focusable so it can be scrolled by keyboard. |
| `class` | `string` | - | Additional classes to apply to the content, such as `max-h-72`. |

### CodeBlockLine

One line of code.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default" \| "added" \| "removed" \| "highlighted"` | `"default"` | The state of the line. |
| `class` | `string` | - | Additional classes to apply to the line. |

### CodeBlockFooter

A row below the content, such as for a Show More button.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | - | Additional classes to apply to the footer. |

### useHighlightedCode

```ts
const highlighted = useHighlightedCode(() => code, () => language);
```

Returns an object whose `lines` holds one HTML string per line. It holds escaped plain lines until the first pass finishes, and for a language that is not in the list. Call it while a component initializes, because it loads the language in an effect.

| Argument | Type | Description |
| --- | --- | --- |
| `code` | `() => string` | Returns the code to highlight. A trailing newline is ignored. |
| `language` | `() => string` | Returns a language or alias from `highlighter.ts`, or `"ansi"`. |
