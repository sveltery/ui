<script lang="ts">
  import { Toggle as Primitive } from '@sveltery/base/toggle';
  import { cn } from 'cn';
  import { toggleVariants } from '../toggle/index.js';
  import { getToggleGroupContext } from './context.js';
  import type { ToggleGroupItemProps } from './types.js';
  let { class: classProp, variant = 'default', size = 'default', ...props }: ToggleGroupItemProps = $props();
  const group = getToggleGroupContext();
  const resolvedVariant = $derived(group.variant || variant);
  const resolvedSize = $derived(group.size || size);
</script>
<Primitive
  data-slot="toggle-group-item"
  data-variant={resolvedVariant}
  data-size={resolvedSize}
  data-spacing={group.spacing}
  {...props}
  class={cn('cn-toggle-group-item shrink-0 focus:z-10 focus-visible:z-10 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t', toggleVariants({ variant: resolvedVariant, size: resolvedSize }), classProp)}
/>
