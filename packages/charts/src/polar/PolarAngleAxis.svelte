<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { BaseTickContentProps } from '../util/types.js';
  import type { Props as UpstreamProps } from './PolarAngleAxis.js';

  /** PolarAngleAxis's public props: `tick` takes a snippet where upstream takes an element or a render function. */
  export type PolarAngleAxisProps = SvelteProps<WithSnippets<UpstreamProps, { tick: BaseTickContentProps }>>;
</script>

<script lang="ts">
  import { rechartsProps } from '../util/svelteProps.js';
  import { defaultPolarAngleAxisProps } from './defaultPolarAngleAxisProps.js';
  import type { AngleAxisSettings } from '../state/polarAxisSlice.js';
  import SetAngleAxisSettings from './SetAngleAxisSettings.svelte';
  import PolarAngleAxisWrapper from './PolarAngleAxisWrapper.svelte';

  let raw: PolarAngleAxisProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultPolarAngleAxisProps>(() => raw as UpstreamProps, defaultPolarAngleAxisProps);
</script>

<!-- allowDuplicatedCategory is false on purpose: axis calculation behaves as if it were, and Tooltip needs the prop to stay true. -->
<SetAngleAxisSettings
  id={resolved.angleAxisId}
  scale={resolved.scale}
  type={resolved.type}
  dataKey={resolved.dataKey}
  unit={undefined}
  name={resolved.name}
  allowDuplicatedCategory={false}
  allowDataOverflow={false}
  reversed={resolved.reversed}
  includeHidden={false}
  allowDecimals={resolved.allowDecimals}
  tickCount={resolved.tickCount}
  niceTicks={resolved.niceTicks ?? 'auto'}
  ticks={resolved.ticks as AngleAxisSettings['ticks']}
  tick={resolved.tick}
  domain={resolved.domain}
>
  <PolarAngleAxisWrapper {...resolved} />
</SetAngleAxisSettings>
