<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { XAxisTickContentProps } from '../util/types.js';
  import type { ImplicitLabelType } from '../component/Label.hooks.svelte.js';
  import type { Props as UpstreamProps } from './XAxis.js';

  export type XAxisProps = Omit<SvelteProps<WithSnippets<UpstreamProps, { tick: XAxisTickContentProps }>>, 'label'> & { label?: ImplicitLabelType };
</script>

<script lang="ts">
  import { rechartsProps } from '../util/svelteProps.js';
  import { xAxisDefaultProps } from './XAxis.js';
  import SetXAxisSettings from './SetXAxisSettings.svelte';
  import XAxisImpl from './XAxisImpl.svelte';

  let raw: XAxisProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof xAxisDefaultProps>(() => raw as UpstreamProps, xAxisDefaultProps);
</script>

<SetXAxisSettings
  allowDataOverflow={resolved.allowDataOverflow}
  allowDecimals={resolved.allowDecimals}
  allowDuplicatedCategory={resolved.allowDuplicatedCategory}
  angle={resolved.angle}
  dataKey={resolved.dataKey}
  domain={resolved.domain}
  height={resolved.height}
  hide={resolved.hide}
  id={resolved.xAxisId}
  includeHidden={resolved.includeHidden}
  interval={resolved.interval}
  minTickGap={resolved.minTickGap}
  mirror={resolved.mirror}
  name={resolved.name}
  orientation={resolved.orientation}
  padding={resolved.padding}
  reversed={resolved.reversed}
  scale={resolved.scale}
  tick={resolved.tick}
  tickCount={resolved.tickCount}
  tickFormatter={resolved.tickFormatter}
  ticks={resolved.ticks}
  type={resolved.type}
  unit={resolved.unit}
  niceTicks={resolved.niceTicks}
/>
<XAxisImpl {...resolved} />
