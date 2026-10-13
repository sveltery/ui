<script lang="ts">
  import type { CommandLoadingProps } from './types.js';

  let { progress, label = 'Loading...', children, ...rest }: CommandLoadingProps = $props();
</script>

<div {...rest} cmdk-loading="" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
  <div aria-hidden="true">{@render children?.()}</div>
</div>
