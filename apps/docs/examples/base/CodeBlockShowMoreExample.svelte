<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockFooter, CodeBlockHeader, CodeBlockLine, CodeBlockTitle, useHighlightedCode } from '$registry/bases/base/ui/code-block';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const code = `"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Chat() {
  const [input, setInput] = React.useState("")
  const { messages, sendMessage, status } = useChat()

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts.map((part, index) =>
            part.type === "text" ? <p key={index}>{part.text}</p> : null
          )}
        </div>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <Input value={input} onChange={(event) => setInput(event.target.value)} />
        <Button disabled={status !== "ready"}>Send</Button>
      </form>
    </div>
  )
}`;

  let expanded = $state(false);
  const highlighted = useHighlightedCode(() => code, () => 'tsx');
  const id = $props.id();
</script>

<div class="w-full max-w-md">
  <CodeBlock>
    <CodeBlockHeader>
      <CodeBlockTitle>components/chat.tsx</CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton value={code} />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent {id} lineNumbers class={expanded ? undefined : 'max-h-64 scroll-fade-y overflow-y-hidden'}>
      {#each highlighted.lines as line, index (index)}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
        <CodeBlockLine>{@html line}</CodeBlockLine>
      {/each}
    </CodeBlockContent>
    <CodeBlockFooter class="justify-center">
      <Button variant="ghost" size="xs" aria-expanded={expanded} aria-controls={id} onclick={() => (expanded = !expanded)}>
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconChevronDown"
          hugeicons="ArrowDown01Icon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
          class="transition-transform in-aria-expanded:rotate-180"
        />
        {expanded ? 'Show less' : 'Show more'}
      </Button>
    </CodeBlockFooter>
  </CodeBlock>
</div>
