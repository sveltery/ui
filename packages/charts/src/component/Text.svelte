<svelte:options namespace="svg" />

<script lang="ts">
  import { clsx } from 'clsx';
  import { isNumber, isNumOrStr } from '../util/DataUtils.js';
  import { reduceCSSCalc } from '../util/ReduceCSSCalc.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { isWellBehavedNumber } from '../util/isWellBehavedNumber.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import { DEFAULT_FILL, getWordsByLines, textDefaultProps, type Props, type RenderableText } from './Text.js';

  // The text is data that Text measures and wraps, so it arrives as a value, not as a snippet.
  type TextProps = Omit<SvelteProps<Props>, 'children'> & { children?: RenderableText; ref?: SVGTextElement | null };

  let { ref = $bindable(null), ...raw }: TextProps = $props();
  const resolved = rechartsProps<Props, typeof textDefaultProps>(() => raw, textDefaultProps);

  const wordsByLines = $derived(
    getWordsByLines({ breakAll: resolved.breakAll, children: resolved.children as RenderableText, maxLines: resolved.maxLines, scaleToFit: resolved.scaleToFit, style: resolved.style, width: resolved.width }),
  );

  const rendered = $derived.by(() => {
    const { x: propsX, y: propsY, lineHeight, capHeight, fill, scaleToFit, textAnchor, verticalAnchor, ...rest } = resolved;
    const { dx, dy, angle, className, breakAll, ...textProps } = rest;
    if (!isNumOrStr(propsX) || !isNumOrStr(propsY) || wordsByLines.length === 0) {
      return null;
    }
    const x = Number(propsX) + (isNumber(dx) ? dx : 0);
    const y = Number(propsY) + (isNumber(dy) ? dy : 0);
    if (!isWellBehavedNumber(x) || !isWellBehavedNumber(y)) {
      return null;
    }
    let startDy: string;
    switch (verticalAnchor) {
      case 'start':
        startDy = reduceCSSCalc(`calc(${capHeight})`);
        break;
      case 'middle':
        startDy = reduceCSSCalc(`calc(${(wordsByLines.length - 1) / 2} * -${lineHeight} + (${capHeight} / 2))`);
        break;
      default:
        startDy = reduceCSSCalc(`calc(${wordsByLines.length - 1} * -${lineHeight})`);
        break;
    }
    const transforms = [];
    const firstLine = wordsByLines[0];
    if (scaleToFit && firstLine != null) {
      const lineWidth = firstLine.width;
      const { width } = rest;
      transforms.push(`scale(${isNumber(width) && isNumber(lineWidth) ? width / lineWidth : 1})`);
    }
    if (angle) {
      transforms.push(`rotate(${angle}, ${x}, ${y})`);
    }
    const finalTextProps: Record<string, unknown> = { ...textProps };
    if (transforms.length) {
      finalTextProps.transform = transforms.join(' ');
    }
    return {
      attributes: attrs({
        ...svgPropertiesAndEvents(finalTextProps),
        x,
        y,
        className: clsx('recharts-text', className),
        textAnchor,
        fill: fill.includes('url') ? DEFAULT_FILL : fill,
      }),
      x,
      startDy,
      lineHeight,
      lines: wordsByLines.map((line) => line.words.join(breakAll ? '' : ' ')),
    };
  });
</script>

{#if rendered}
  <text {...rendered.attributes} bind:this={ref}
    >{#each rendered.lines as words, index (`${words}-${index}`)}<tspan x={rendered.x} dy={index === 0 ? rendered.startDy : rendered.lineHeight}>{words}</tspan>{/each}</text
  >
{/if}
