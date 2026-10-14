<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import { Label } from '../label/index.js';
  let { class: classProp, ...props }: ComponentProps<typeof Label> = $props();
</script>
<Label data-slot="field-label" {...props} class={cn('cn-field-label group/field-label peer/field-label flex w-fit', 'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col', classProp)} />
