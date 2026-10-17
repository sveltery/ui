<script lang="ts">
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import { useAppDispatch } from './hooks.svelte.js';
  import { useRegistration } from './registration.svelte.js';
  import { addTooltipEntrySettings, removeTooltipEntrySettings, replaceTooltipEntrySettings, type TooltipPayloadConfiguration } from './tooltipSlice.js';

  let { tooltipEntrySettings }: { tooltipEntrySettings: TooltipPayloadConfiguration } = $props();
  const dispatch = useAppDispatch();
  // Panorama graphical items never contribute to the Tooltip payload.
  const isPanorama = useIsPanorama();
  useRegistration(() => (isPanorama ? undefined : tooltipEntrySettings), {
    add: (settings) => dispatch(addTooltipEntrySettings(settings)),
    replace: (prev, next) => dispatch(replaceTooltipEntrySettings({ prev, next })),
    remove: (settings) => dispatch(removeTooltipEntrySettings(settings)),
  });
</script>
