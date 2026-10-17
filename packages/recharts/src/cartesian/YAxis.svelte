<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { YAxisTickContentProps } from '../util/types.js';
  import type { ImplicitLabelType } from '../component/Label.hooks.svelte.js';
  import type { Props as UpstreamProps } from './YAxis.js';

  export type YAxisProps = Omit<SvelteProps<WithSnippets<UpstreamProps, { tick: YAxisTickContentProps }>>, 'label'> & { label?: ImplicitLabelType };
</script>

<script lang="ts">
  import { rechartsProps } from '../util/svelteProps.js';
  import { yAxisDefaultProps } from './YAxis.js';
  import SetYAxisSettings from './SetYAxisSettings.svelte';
  import YAxisImpl from './YAxisImpl.svelte';

  let raw: YAxisProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof yAxisDefaultProps>(() => raw as UpstreamProps, yAxisDefaultProps);
</script>

<SetYAxisSettings
  interval={resolved.interval}
  id={resolved.yAxisId}
  scale={resolved.scale}
  type={resolved.type}
  domain={resolved.domain}
  allowDataOverflow={resolved.allowDataOverflow}
  dataKey={resolved.dataKey}
  allowDuplicatedCategory={resolved.allowDuplicatedCategory}
  allowDecimals={resolved.allowDecimals}
  tickCount={resolved.tickCount}
  padding={resolved.padding}
  includeHidden={resolved.includeHidden}
  reversed={resolved.reversed}
  ticks={resolved.ticks}
  width={resolved.width}
  orientation={resolved.orientation}
  mirror={resolved.mirror}
  hide={resolved.hide}
  unit={resolved.unit}
  name={resolved.name}
  angle={resolved.angle}
  minTickGap={resolved.minTickGap}
  tick={resolved.tick}
  tickFormatter={resolved.tickFormatter}
  niceTicks={resolved.niceTicks}
/>
<YAxisImpl {...resolved} />
