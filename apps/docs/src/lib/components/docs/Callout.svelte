<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Alert, AlertDescription, AlertTitle } from '@sveltery/components/alert';
  let { title, children }: { title?: string; children: Snippet } = $props();
</script>

<Alert class="mt-6 w-auto border-none bg-surface text-surface-foreground md:-mx-1" data-not-typeset>
  {#if title}<AlertTitle>{title}</AlertTitle>{/if}
  <AlertDescription class="[&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em]">{@render children()}</AlertDescription>
</Alert>
