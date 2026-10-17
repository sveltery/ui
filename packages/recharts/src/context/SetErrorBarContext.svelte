<script lang="ts" generics="T extends BarRectangleItem | LinePointItem | ScatterPointItem">
  import type { Snippet } from 'svelte';
  import type { BarRectangleItem } from '../cartesian/Bar.js';
  import type { LinePointItem } from '../cartesian/Line.js';
  import type { ScatterPointItem } from '../cartesian/Scatter.js';
  import { setErrorBarContext, type ErrorBarContextType } from './ErrorBarContext.svelte.js';

  let { children, ...rest }: ErrorBarContextType<T> & { children: Snippet } = $props();
  setErrorBarContext({
    get current() {
      return rest;
    },
  });
</script>

{@render children()}
