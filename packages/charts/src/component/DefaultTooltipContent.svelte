<script lang="ts">
  import { clsx } from 'clsx';
  import type { CSSProperties, ReactNode } from '../react.js';
  import { isNullish, isNumOrStr } from '../util/DataUtils.js';
  import { attrs } from '../util/attrs.js';
  import RenderNode from '../util/RenderNode.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import type { TooltipPayload, TooltipPayloadEntry } from '../state/tooltipSlice.js';
  import { defaultDefaultTooltipContentProps, defaultFormatter, lodashLikeSortBy, type Formatter, type Props } from './DefaultTooltipContent.js';

  let props: Props = $props();
  const {
    separator = defaultDefaultTooltipContentProps.separator,
    contentStyle,
    itemStyle,
    labelStyle = defaultDefaultTooltipContentProps.labelStyle,
    payload,
    formatter,
    itemSorter,
    wrapperClassName,
    labelClassName,
    label,
    labelFormatter,
    accessibilityLayer = defaultDefaultTooltipContentProps.accessibilityLayer,
  } = $derived(props);

  type Item = { key: string; style: CSSProperties; finalName: ReactNode; finalValue: ReactNode; unit: ReactNode };

  const items = $derived.by((): ReadonlyArray<Item | null> | null => {
    if (payload && payload.length) {
      const sortedPayload: TooltipPayload = lodashLikeSortBy(payload, itemSorter);
      return sortedPayload.map((entry: TooltipPayloadEntry, i: number): Item | null => {
        if (entry.type === 'none') {
          return null;
        }

        const finalFormatter: Formatter = entry.formatter || formatter || defaultFormatter;
        const { value, name } = entry;
        let finalValue: ReactNode = value;
        let finalName: ReactNode = name;
        if (finalFormatter) {
          const formatted = finalFormatter(value, name, entry, i, payload);
          if (Array.isArray(formatted)) {
            [finalValue, finalName] = formatted;
          } else if (formatted != null) {
            finalValue = formatted;
          } else {
            return null;
          }
        }

        const finalItemStyle = {
          ...defaultDefaultTooltipContentProps.itemStyle,
          color: entry.color || defaultDefaultTooltipContentProps.itemStyle.color,
          ...itemStyle,
        };

        return { key: `tooltip-item-${i}`, style: finalItemStyle, finalName, finalValue, unit: entry.unit };
      });
    }

    return null;
  });

  const finalStyle: CSSProperties = $derived({
    ...defaultDefaultTooltipContentProps.contentStyle,
    ...contentStyle,
  });
  const finalLabelStyle = $derived({
    margin: 0,
    ...labelStyle,
  });
  const hasLabel = $derived(!isNullish(label));
  const finalLabel: ReactNode = $derived(hasLabel && labelFormatter && payload !== undefined && payload !== null ? labelFormatter(label, payload) : hasLabel ? label : '');
  const wrapperCN = $derived(clsx('recharts-default-tooltip', wrapperClassName));
  const labelCN = $derived(clsx('recharts-tooltip-label', labelClassName));

  const accessibilityAttributes = $derived(
    accessibilityLayer
      ? {
          role: 'status',
          'aria-live': 'assertive',
        }
      : {},
  );
</script>

<div {...attrs({ className: wrapperCN, style: finalStyle, ...accessibilityAttributes })}
  ><p {...attrs({ className: labelCN, style: finalLabelStyle })}
    >{#if typeof finalLabel === 'function'}<RenderProp of={finalLabel as never} props={{}} />{:else}{`${finalLabel}`}{/if}</p
  >{#if items}<ul {...attrs({ className: 'recharts-tooltip-item-list', style: { padding: 0, margin: 0 } })}
      >{#each items as item, index (index)}{#if item}<li {...attrs({ className: 'recharts-tooltip-item', style: item.style })}
            >{#if isNumOrStr(item.finalName)}<span class="recharts-tooltip-item-name">{item.finalName}</span>{/if}{#if isNumOrStr(item.finalName)}<span
                class="recharts-tooltip-item-separator">{separator}</span
              >{/if}<span class="recharts-tooltip-item-value"><RenderNode value={item.finalValue} /></span><span class="recharts-tooltip-item-unit"
              ><RenderNode value={item.unit || ''} /></span
            ></li
          >{/if}{/each}</ul
    >{/if}</div
>
