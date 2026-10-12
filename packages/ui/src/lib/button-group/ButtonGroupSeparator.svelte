<script lang="ts">
  import type { ButtonGroupSeparatorProps } from './types.js';
  import { cn } from 'cn';
  import { Separator } from '../separator/index.js';
  let { class: classProp, orientation = 'vertical', ...props }: ButtonGroupSeparatorProps = $props();
</script>
<Separator
  data-slot="button-group-separator"
  {orientation}
  class={cn('cn-button-group-separator relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto', classProp)}
  {...props}
/>
