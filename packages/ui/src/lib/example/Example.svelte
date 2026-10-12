<script lang="ts">
  // Pinned native scaffold; class belongs to content, containerClassName/props/ref to outer div.
  import { classes } from '../shared/classes.js';
  import type { ExampleProps } from './types.js';
  let { title, children, class: classProp, containerClassName, ref = $bindable(), ...props }: ExampleProps = $props();
</script>
<div data-slot="example" {...props} class={classes('mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none', containerClassName)} bind:this={ref}>
  {#if title}<div class="px-1.5 py-2 text-xs font-medium text-muted-foreground">{title}</div>{/if}<div data-slot="example-content" class={classes("flex min-w-0 flex-1 flex-col items-start gap-6 rounded-xl bg-card p-12 text-foreground style-lyra:rounded-none style-sera:rounded-none *:[div:not([class*='w-'])]:w-full", classProp)}>
    {@render children?.()}
  </div>
</div>
