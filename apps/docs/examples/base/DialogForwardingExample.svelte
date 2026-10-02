<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import * as Base from '@sveltery/base/dialog';
  import * as UI from '@sveltery/ui/dialog';

  const components = [
    ['trigger', Base.Trigger, UI.DialogTrigger],
    ['close', Base.Close, UI.DialogClose],
    ['title', Base.Title, UI.DialogTitle],
    ['description', Base.Description, UI.DialogDescription],
    ['overlay', Base.Backdrop, UI.DialogOverlay],
  ] as const;
  let show = $state(true);
  let hydrated = $state(false);
  let header = $state<HTMLDivElement | null>();
  let footer = $state<HTMLDivElement | null>();
  onMount(() => { hydrated = true; });
  export function refs() { return { header, footer }; }
</script>

{#snippet replacement(props: Record<string | symbol, unknown>, _state: unknown, children: Snippet | undefined)}
  <div {...(props as HTMLAttributes<HTMLDivElement>)}>{#if children}{@render children()}{:else}Fallback label{/if}</div>
{/snippet}
{#snippet empty()}{/snippet}
<main data-hydrated={hydrated}>
  {#if show}
    <Base.Root>
      {#each components as [name, BasePart, UIPart] (name)}
        {#each [{ kind: 'base', Part: BasePart }, { kind: 'ui', Part: UIPart }] as { kind, Part } (kind)}
          <Part data-testid={`${kind}-${name}-omitted`} render={replacement} />
          <Part data-testid={`${kind}-${name}-present`} render={replacement}>Explicit label</Part>
          <Part data-testid={`${kind}-${name}-empty`} render={replacement} children={empty} />
        {/each}
      {/each}
      <UI.DialogHeader bind:ref={header} data-testid="header">Header</UI.DialogHeader>
      <UI.DialogFooter bind:ref={footer} data-testid="footer">Footer</UI.DialogFooter>
    </Base.Root>
  {/if}
  <button type="button" data-testid="remove-wrappers" onclick={() => show = false}>Unmount wrappers</button>
  <output data-testid="refs">{JSON.stringify({ header: !!header, footer: !!footer, cleared: header === null && footer === null })}</output>
</main>
