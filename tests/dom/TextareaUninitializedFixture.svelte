<script lang="ts">
  import { Textarea } from '../../apps/docs/registry/bases/base/ui/textarea/index.js';
  let { defaultValue, onlyRef = false }: { defaultValue?: string; onlyRef?: boolean } = $props();
  let value = $state<string | undefined>();
  let nativeValue = $state<string | undefined>();
  let ref = $state<HTMLTextAreaElement | null>(null);
  let undefinedRef = $state<HTMLTextAreaElement>();
  let nativeRef = $state<HTMLTextAreaElement>();
  export function snapshot() { return { value, nativeValue, ref, nativeRef, undefinedRef }; }
</script>
{#if onlyRef}<Textarea id="uninitialized-ref" bind:ref={undefinedRef} />{:else}<Textarea id="uninitialized" bind:value bind:ref {defaultValue} />{/if}
<textarea id="native-uninitialized" bind:value={nativeValue} bind:this={nativeRef} {defaultValue}></textarea>
