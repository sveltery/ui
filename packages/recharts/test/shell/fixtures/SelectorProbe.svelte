<script lang="ts" module>
  import type { Box } from '../../../src/state/hooks.svelte.js';
  import type { AppDispatch } from '../../../src/state/store.js';

  export type ProbeApi<T> = { box: Box<T | undefined>; dispatch: AppDispatch; runs: () => number };
</script>

<script lang="ts" generics="T">
  import { useAppDispatch, useAppSelector } from '../../../src/state/hooks.svelte.js';
  import type { RechartsRootState } from '../../../src/state/store.js';

  let { selector, onready }: { selector: (state: RechartsRootState) => T; onready: (api: ProbeApi<T>) => void } = $props();

  const box = useAppSelector((state) => selector(state));
  const dispatch = useAppDispatch();
  let runs = 0;
  $effect(() => {
    void box.current;
    runs++;
  });
  $effect.pre(() => onready({ box, dispatch, runs: () => runs }));
</script>
