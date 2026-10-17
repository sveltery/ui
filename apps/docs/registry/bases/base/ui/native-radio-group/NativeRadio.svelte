<script lang="ts">
  import type { NativeRadioProps } from './types.js';
  import { cn } from 'cn';
  let { class: classProp, ...props }: NativeRadioProps = $props();
</script>
<input
  type="radio"
  data-slot="native-radio"
  {...props}
  class={cn(
    'peer relative aspect-square size-4 shrink-0 appearance-none rounded-full border border-input outline-none dark:bg-input/30 checked:border-primary checked:bg-primary checked:bg-[radial-gradient(circle,var(--primary-foreground)_0_0.25rem,transparent_0.25rem)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:checked:border-primary disabled:cursor-not-allowed disabled:opacity-50',
    classProp,
  )}
/>
