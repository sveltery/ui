<script lang="ts">
  import type { HTMLTableAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLTableAttributes = $props();
</script>
<div data-slot="table-container" class="cn-table-container">
  <table data-slot="table" {...props} class={cn('cn-table', classProp)}>
    {@render children?.()}
  </table>
</div>
