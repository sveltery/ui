<script lang="ts">
  import * as Command from '@sveltery/command';

  let { shouldFilter }: { shouldFilter?: boolean } = $props();

  let items = $state(['one', 'two', 'three']);
  let text = $state('Draft');
  let value = $state('');
  let search = $state('');

  export function setItems(next: string[]) {
    items = next;
  }
  export function setText(next: string) {
    text = next;
  }
  export function bound() {
    return { value, search };
  }
</script>

<Command.Root bind:value {shouldFilter}>
  <Command.Input data-testid="input" bind:value={search} />
  <Command.List>
    <Command.Empty data-testid="empty">Nothing</Command.Empty>
    {#each items as item (item)}
      <Command.Item data-testid={item} value={item}>{item}</Command.Item>
    {/each}
    <Command.Item data-testid="text">{text}</Command.Item>
  </Command.List>
</Command.Root>
