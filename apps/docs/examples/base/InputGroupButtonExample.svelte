<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import IconCheck from '@tabler/icons-svelte-runes/icons/check';
  import IconCopy from '@tabler/icons-svelte-runes/icons/copy';
  import IconInfoCircle from '@tabler/icons-svelte-runes/icons/info-circle';
  import IconStar from '@tabler/icons-svelte-runes/icons/star';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '$registry/bases/base/ui/input-group';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';

  let isCopied = $state(false);
  let isFavorite = $state(false);

  function copyToClipboard(text: string) {
    void navigator.clipboard.writeText(text);
    isCopied = true;
    setTimeout(() => (isCopied = false), 2000);
  }
</script>

{#snippet popoverAddon(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <InputGroupAddon {...props}>{@render children?.()}</InputGroupAddon>
{/snippet}

<div class="grid w-full max-w-sm gap-6">
  <InputGroup>
    <InputGroupInput placeholder="https://x.com/shadcn" readonly />
    <InputGroupAddon align="inline-end">
      <InputGroupButton aria-label="Copy" title="Copy" size="icon-xs" onclick={() => copyToClipboard('https://x.com/shadcn')}>
        {#if isCopied}
          <IconCheck />
        {:else}
          <IconCopy />
        {/if}
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
  <InputGroup class="[--radius:9999px]">
    <Popover>
      <PopoverTrigger render={popoverAddon} nativeButton={false}>
        <InputGroupButton variant="secondary" size="icon-xs">
          <IconInfoCircle />
        </InputGroupButton>
      </PopoverTrigger>
      <PopoverContent align="start" class="flex flex-col gap-1 rounded-xl text-sm">
        <p class="font-medium">Your connection is not secure.</p>
        <p>You should not enter any sensitive information on this site.</p>
      </PopoverContent>
    </Popover>
    <InputGroupAddon class="pl-1.5 text-muted-foreground">https://</InputGroupAddon>
    <InputGroupInput id="input-secure-19" />
    <InputGroupAddon align="inline-end">
      <InputGroupButton onclick={() => (isFavorite = !isFavorite)} size="icon-xs">
        <IconStar data-favorite={isFavorite} class="data-[favorite=true]:fill-blue-600 data-[favorite=true]:stroke-blue-600" />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
  <InputGroup>
    <InputGroupInput placeholder="Type to search..." />
    <InputGroupAddon align="inline-end">
      <InputGroupButton variant="secondary">Search</InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</div>
