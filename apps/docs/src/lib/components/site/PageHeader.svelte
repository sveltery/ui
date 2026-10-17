<script lang="ts">
  import { cn } from 'cn';
  import type { Snippet } from 'svelte';

  let {
    title,
    description,
    class: className,
    headingClass,
    announcement,
    children,
  }: { title: string; description: string; class?: string; headingClass?: string; announcement?: Snippet; children?: Snippet } = $props();
</script>

<section class={cn('border-grid', className)}>
  <div class="container-wrapper">
    <div class="container flex flex-col items-center gap-2 px-6 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
      {@render announcement?.()}
      <h1 class={cn('leading-tighter max-w-3xl text-3xl font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter', headingClass)}>{title}</h1>
      <p class="max-w-4xl text-base text-balance text-foreground sm:text-lg">{description}</p>
      {#if children}
        <div class="flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none">{@render children()}</div>
      {/if}
    </div>
  </div>
</section>
