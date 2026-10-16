<script lang="ts">
  import type { ItemSeparatorProps } from './types.js';
  import { cn } from 'cn';
  import { Separator } from '../separator/index.js';
  let { class: classProp, ...props }: ItemSeparatorProps = $props();
</script>
<Separator data-slot="item-separator" orientation="horizontal" class={cn('cn-item-separator', classProp)} {...props} />
