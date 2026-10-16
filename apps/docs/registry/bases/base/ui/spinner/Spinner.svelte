<script lang="ts">
  import type { SpinnerProps } from './types.js';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { class: classProp, ...props }: SpinnerProps = $props();
</script>
<IconPlaceholder
  lucide="Loader2Icon"
  tabler="IconLoader"
  hugeicons="Loading03Icon"
  phosphor="SpinnerIcon"
  remixicon="RiLoaderLine"
  data-slot="spinner"
  role="status"
  aria-label="Loading"
  class={cn('size-4 animate-spin', classProp)}
  {...props}
/>
