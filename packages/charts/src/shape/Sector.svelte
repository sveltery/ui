<svelte:options namespace="svg" />

<script lang="ts">
  import { clsx } from 'clsx';
  import { getPercentValue } from '../util/DataUtils.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import { defaultSectorProps, getSectorPath, getSectorWithCorner, type Props } from './Sector.js';

  let raw: SvelteProps<Props> = $props();
  const resolved = rechartsProps<Props, typeof defaultSectorProps>(() => raw, defaultSectorProps);

  const path = $derived.by(() => {
    const { cx, cy, innerRadius, outerRadius, cornerRadius, forceCornerRadius, cornerIsExternal, startAngle, endAngle } = resolved;
    const deltaRadius = outerRadius - innerRadius;
    const cr = getPercentValue(cornerRadius, deltaRadius, 0, true);
    if (cr > 0 && Math.abs(startAngle - endAngle) < 360) {
      return getSectorWithCorner({
        cx,
        cy,
        innerRadius,
        outerRadius,
        cornerRadius: Math.min(cr, deltaRadius / 2),
        forceCornerRadius,
        cornerIsExternal,
        startAngle,
        endAngle,
      });
    }
    return getSectorPath({ cx, cy, innerRadius, outerRadius, startAngle, endAngle });
  });
</script>

{#if !(resolved.outerRadius < resolved.innerRadius || resolved.startAngle === resolved.endAngle)}
  <path {...attrs({ ...svgPropertiesAndEvents(resolved), className: clsx('recharts-sector', resolved.className), d: path })} />
{/if}
