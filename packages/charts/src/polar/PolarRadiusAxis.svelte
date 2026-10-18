<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { BaseTickContentProps } from '../util/types.js';
  import type { ImplicitLabelType } from '../component/Label.hooks.svelte.js';
  import type { Props as UpstreamProps } from './PolarRadiusAxis.js';

  /** PolarRadiusAxis's public props: `tick` takes a snippet, and children render inside the axis's polar label context. */
  export type PolarRadiusAxisProps = Omit<SvelteProps<WithSnippets<UpstreamProps, { tick: BaseTickContentProps }>>, 'label'> & { label?: ImplicitLabelType };
</script>

<script lang="ts">
  import { rechartsProps } from '../util/svelteProps.js';
  import { defaultPolarRadiusAxisProps } from './defaultPolarRadiusAxisProps.js';
  import type { RadiusAxisSettings } from '../state/polarAxisSlice.js';
  import SetRadiusAxisSettings from './SetRadiusAxisSettings.svelte';
  import PolarRadiusAxisWrapper from './PolarRadiusAxisWrapper.svelte';

  let raw: PolarRadiusAxisProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultPolarRadiusAxisProps>(() => raw as UpstreamProps, defaultPolarRadiusAxisProps);
</script>

<SetRadiusAxisSettings
  domain={resolved.domain}
  id={resolved.radiusAxisId}
  scale={resolved.scale}
  type={resolved.type}
  dataKey={resolved.dataKey}
  unit={undefined}
  name={resolved.name}
  allowDuplicatedCategory={resolved.allowDuplicatedCategory}
  allowDataOverflow={resolved.allowDataOverflow}
  reversed={resolved.reversed}
  includeHidden={resolved.includeHidden}
  allowDecimals={resolved.allowDecimals}
  niceTicks={resolved.niceTicks ?? 'auto'}
  ticks={resolved.ticks as RadiusAxisSettings['ticks']}
  tickCount={resolved.tickCount}
  tick={resolved.tick}
/>
<PolarRadiusAxisWrapper {...resolved} />
