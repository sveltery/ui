<script lang="ts" generics="P extends object">
  import type { Snippet } from 'svelte';
  import { svelteProps, type SvelteArgs } from './svelteProps.js';

  let { of, props }: { of: Snippet<[SvelteArgs<P>]>; props: P } = $props();
</script>

{@render of(svelteProps(props))}
