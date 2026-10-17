<script lang="ts">
  import { clsx } from 'clsx';
  import { adaptEventsOfChild } from '../util/types.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps, type RechartsBag } from '../util/svelteProps.js';
  import RenderNode from '../util/RenderNode.svelte';
  import Surface from '../container/Surface.svelte';
  import LegendIcon from './LegendIcon.svelte';
  import { defaultLegendContentDefaultProps, SIZE, type LegendPayload, type Props } from './DefaultLegendContent.js';

  let outsideProps: RechartsBag<Props> = $props();
  const resolved = rechartsProps<Props, typeof defaultLegendContentDefaultProps>(() => outsideProps, defaultLegendContentDefaultProps);

  const finalStyle = $derived({
    padding: 0,
    margin: 0,
    textAlign: resolved.layout === 'horizontal' ? resolved.align : 'left',
  });

  const viewBox = { x: 0, y: 0, width: SIZE, height: SIZE };
  const itemStyle = $derived({
    display: resolved.layout === 'horizontal' ? 'inline-block' : 'block',
    marginRight: 10,
  });
  const svgStyle = { display: 'inline-block', verticalAlign: 'middle', marginRight: 4 };

  function item(entry: LegendPayload, i: number) {
    const finalFormatter = entry.formatter || resolved.formatter;
    const className = clsx({
      'recharts-legend-item': true,
      [`legend-item-${i}`]: true,
      inactive: entry.inactive,
    });

    const finalLabelStyle: Record<string, unknown> = typeof resolved.labelStyle === 'object' ? { ...resolved.labelStyle } : {};
    finalLabelStyle.color = entry.inactive ? resolved.inactiveColor : finalLabelStyle.color || entry.color;

    const finalValue = finalFormatter ? finalFormatter(entry.value, entry, i) : entry.value;
    return { className, finalLabelStyle, finalValue };
  }
</script>

{#if resolved.payload && resolved.payload.length}<ul {...attrs({ className: 'recharts-default-legend', style: finalStyle })}
    >{#each resolved.payload as entry, i (i)}{#if entry.type !== 'none'}{const { className, finalLabelStyle, finalValue } = $derived(item(entry, i))}<li
          {...attrs({ className, style: itemStyle, ...adaptEventsOfChild(resolved, entry, i) })}
          ><Surface width={resolved.iconSize} height={resolved.iconSize} {viewBox} style={svgStyle} aria-label={`${finalValue} legend icon`}
            ><LegendIcon data={entry} iconType={resolved.iconType} inactiveColor={resolved.inactiveColor} /></Surface
          ><span {...attrs({ className: 'recharts-legend-item-text', style: finalLabelStyle })}><RenderNode value={finalValue} /></span></li
        >{/if}{/each}</ul
  >{/if}
