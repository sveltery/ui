<script lang="ts">
  import { cn } from 'cn';
  import type { ExampleWrapperProps } from './types.js';
  let { children, class: classProp, ...props }: ExampleWrapperProps = $props();
</script>
<div class="w-full bg-muted dark:bg-background">
  <div data-slot="example-wrapper" {...props} class={cn('mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl', classProp)}>
    {@render children?.()}
  </div>
</div>
