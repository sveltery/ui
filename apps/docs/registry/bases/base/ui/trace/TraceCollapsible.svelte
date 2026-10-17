<script lang="ts">
  import type { TraceCollapsibleProps } from './types.js';
  import { cn } from 'cn';
  import { Collapsible } from '../collapsible/index.js';
  let { open = $bindable(), class: classProp, ...props }: TraceCollapsibleProps = $props();
</script>
<Collapsible data-slot="trace-collapsible" bind:open {...props} class={cn('cn-trace-collapsible flex w-full min-w-0 flex-col', classProp)} />
