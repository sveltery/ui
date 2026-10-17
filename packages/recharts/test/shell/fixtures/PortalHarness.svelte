<script lang="ts">
  import { setContext } from 'svelte';
  import Portal from '../../../src/util/Portal.svelte';
  import ContextReader from './ContextReader.svelte';

  let { target }: { target: Element } = $props();
  let open = $state(true);
  let label = $state('first');

  setContext('label', {
    get current() {
      return label;
    },
  });

  export function setOpen(next: boolean) {
    open = next;
  }

  export function setLabel(next: string) {
    label = next;
  }
</script>

{#if open}<Portal {target}><ContextReader /></Portal>{/if}
