<script lang="ts">
  import type { LegendPayload } from '../component/DefaultLegendContent.js';
  import { selectChartLayout } from '../context/chartLayoutContext.js';
  import { useAppDispatch, useAppSelector } from './hooks.svelte.js';
  import { useRegistration } from './registration.svelte.js';
  import { addLegendPayload, removeLegendPayload, replaceLegendPayload } from './legendSlice.js';

  let { legendPayload }: { legendPayload: ReadonlyArray<LegendPayload> } = $props();
  const dispatch = useAppDispatch();
  const layout = useAppSelector(selectChartLayout);
  useRegistration(() => (layout.current === 'centric' || layout.current === 'radial' ? legendPayload : undefined), {
    add: (payload) => dispatch(addLegendPayload(payload)),
    replace: (prev, next) => dispatch(replaceLegendPayload({ prev, next })),
    remove: (payload) => dispatch(removeLegendPayload(payload)),
  });
</script>
