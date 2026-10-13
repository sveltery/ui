<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  import { Separator } from '../separator/index.js';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="field-separator" data-content={!!children} {...props} class={cn('cn-field-separator relative', classProp)}>
  <Separator class="absolute inset-0 top-1/2" />
  {#if children}
    <span class="cn-field-separator-content relative mx-auto block w-fit bg-background" data-slot="field-separator-content">{@render children()}</span>
  {/if}
</div>
