<!-- Port of shadcn's apps/v4/app/(app)/(typeset)/components/preview.tsx and toolbar.tsx at d2fba50. -->
<script lang="ts">
  import { untrack } from 'svelte';
  import { LinkSquare02Icon } from '@hugeicons/core-free-icons';
  import { HugeiconsIcon } from '@hugeicons/svelte';
  import { buttonVariants } from '$registry/bases/base/ui/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';
  import { cn } from 'cn';
  import { mode } from '$lib/theme.svelte';
  import { getBuilder } from './builder.svelte';
  import { CONTENT_OPTIONS } from './fixtures';
  import { receiveCommand, sendParams, type TypesetCommand } from './messages';
  import { previewHref, sameParams, type TypesetParams } from './params';

  const builder = getBuilder();
  let frame = $state<HTMLIFrameElement>();
  let sent: TypesetParams | undefined;

  // A new specimen is a new page. Other changes go by message, so the frame never reloads for them.
  const src = $derived.by(() => {
    const item = builder.previewed.item;
    return untrack(() => previewHref({ ...builder.previewed, item }));
  });

  function send() {
    if (!frame) return;
    sendParams(frame, builder.previewed);
    sent = builder.previewed;
  }

  // Each message makes the frame restyle, so a hover that lands on the shown parameters sends nothing.
  $effect(() => {
    if (!sent || !sameParams(sent, builder.previewed)) send();
  });

  const commands: Record<TypesetCommand, () => void> = {
    shuffle: () => builder.shuffle(),
    reset: () => builder.reset(),
    undo: () => builder.undo(),
    redo: () => builder.redo(),
    'toggle-theme': () => mode.toggle(),
  };

  function receive(event: MessageEvent) {
    const command = receiveCommand(event, frame);
    if (command) commands[command]();
  }

  const pill = 'h-7 min-w-7 cursor-pointer rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground';
</script>

<svelte:window onmessage={receive} />

<div class="relative isolate flex size-full min-h-0 flex-1 overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10">
  <iframe bind:this={frame} {src} title="typeset preview" class="size-full" onload={send}></iframe>
  <div class="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-1.5">
    <div class="dark flex items-center gap-1 rounded-xl bg-card/90 p-1 shadow-xl backdrop-blur-xl">
      {#each CONTENT_OPTIONS as option, index (option.value)}
        <Tooltip>
          <TooltipTrigger
            class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), pill)}
            data-active={builder.params.item === option.value}
            aria-label={option.label}
            aria-pressed={builder.params.item === option.value}
            onclick={() => builder.set({ item: option.value })}
          >
            {String(index + 1).padStart(2, '0')}
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={10}>{option.label}</TooltipContent>
        </Tooltip>
      {/each}
    </div>
    <div class="dark flex items-center gap-1 rounded-xl bg-card/90 p-1 shadow-xl backdrop-blur-xl">
      <a
        href={previewHref(builder.params)}
        target="_blank"
        rel="noreferrer"
        class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-7 cursor-pointer rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground')}
      >
        <HugeiconsIcon icon={LinkSquare02Icon} strokeWidth={2} class="size-3.5 md:hidden" />
        <span class="max-md:sr-only">Open in New Tab</span>
      </a>
    </div>
  </div>
</div>
