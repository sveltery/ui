<script lang="ts">
  import type { LegendPayload } from '../component/DefaultLegendContent.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import { useAppDispatch } from './hooks.svelte.js';
  import { useRegistration } from './registration.svelte.js';
  import { addLegendPayload, removeLegendPayload, replaceLegendPayload } from './legendSlice.js';

  let { legendPayload }: { legendPayload: ReadonlyArray<LegendPayload> } = $props();
  const dispatch = useAppDispatch();
  const isPanorama = useIsPanorama();
  useRegistration(() => (isPanorama ? undefined : legendPayload), {
    add: (payload) => dispatch(addLegendPayload(payload)),
    replace: (prev, next) => dispatch(replaceLegendPayload({ prev, next })),
    remove: (payload) => dispatch(removeLegendPayload(payload)),
  });
</script>
