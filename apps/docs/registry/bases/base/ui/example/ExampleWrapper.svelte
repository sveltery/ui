<script lang="ts">
  // Pinned native scaffold; source and MIT notice: tests/reference/example-sources.json.
  import { classes } from '../shared/classes.js';
  import type { ExampleWrapperProps } from './types.js';
  let { children, class: classProp, ref = $bindable(), ...props }: ExampleWrapperProps = $props();
</script>
<div class="w-full bg-muted dark:bg-background">
  <div data-slot="example-wrapper" {...props} class={classes('mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl', classProp)} bind:this={ref}>
    {@render children?.()}
  </div>
</div>
