<script lang="ts">
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import type { Props } from './Cell.js';
  import { registerCell } from './Cell.hooks.svelte.js';

  let raw: SvelteProps<Props> = $props();
  const resolved = rechartsProps<Props, object>(() => raw, {});
  registerCell(() => ({ ...resolved }));
</script>
