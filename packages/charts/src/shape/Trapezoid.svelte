<svelte:options namespace="svg" />

<script lang="ts">
  import { untrack } from 'svelte';
  import { clsx } from 'clsx';
  import { interpolate } from '../util/DataUtils.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { attrs } from '../util/attrs.js';
  import { useAnimationId } from '../util/useAnimationId.svelte.js';
  import { getTransitionVal } from '../animation/util.js';
  import JavascriptAnimate from '../animation/JavascriptAnimate.svelte';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import { defaultTrapezoidProps, getTrapezoidPath, type Props } from './Trapezoid.js';

  let raw: SvelteProps<Props> = $props();
  const resolved = rechartsProps<Props, typeof defaultTrapezoidProps>(() => raw, defaultTrapezoidProps);

  let pathRef: SVGPathElement | null = null;
  let totalLength = $state(-1);

  $effect(() => {
    untrack(() => {
      if (pathRef && pathRef.getTotalLength) {
        try {
          const pathTotalLength = pathRef.getTotalLength();
          if (pathTotalLength) {
            totalLength = pathTotalLength;
          }
        } catch {
          // calculate total length error
        }
      }
    });
  });

  // Upstream keeps the last animated geometry in refs, written during render, so an update animates from where the last frame stopped.
  let prevUpperWidth = untrack(() => resolved.upperWidth);
  let prevLowerWidth = untrack(() => resolved.lowerWidth);
  let prevHeight = untrack(() => resolved.height);
  let prevX = untrack(() => resolved.x);
  let prevY = untrack(() => resolved.y);
  const animationId = useAnimationId(() => ({ ...raw }), 'trapezoid-');

  const layerClass = $derived(clsx('recharts-trapezoid', resolved.className));

  function frame(t: number) {
    const { x, y, upperWidth, lowerWidth, height, animationDuration, animationEasing } = resolved;
    const currUpperWidth = interpolate(prevUpperWidth, upperWidth, t);
    const currLowerWidth = interpolate(prevLowerWidth, lowerWidth, t);
    const currHeight = interpolate(prevHeight, height, t);
    const currX = interpolate(prevX, x, t);
    const currY = interpolate(prevY, y, t);
    if (pathRef) {
      prevUpperWidth = currUpperWidth;
      prevLowerWidth = currLowerWidth;
      prevHeight = currHeight;
      prevX = currX;
      prevY = currY;
    }
    const from = `0px ${totalLength === -1 ? 1 : totalLength}px`;
    const to = `${totalLength}px ${totalLength}px`;
    const transition = getTransitionVal(['strokeDasharray'], animationDuration, animationEasing);
    const animationStyle = t > 0 ? { transition, strokeDasharray: to } : { strokeDasharray: from };
    return attrs({
      ...svgPropertiesAndEvents(resolved),
      className: layerClass,
      d: getTrapezoidPath(currX, currY, currUpperWidth, currLowerWidth, currHeight),
      style: { ...animationStyle, ...resolved.style },
    });
  }

  const ref = (node: SVGPathElement) => {
    pathRef = node;
    return () => {
      pathRef = null;
    };
  };
</script>

{#if !(resolved.x !== +resolved.x || resolved.y !== +resolved.y || resolved.upperWidth !== +resolved.upperWidth || resolved.lowerWidth !== +resolved.lowerWidth || resolved.height !== +resolved.height || (resolved.upperWidth === 0 && resolved.lowerWidth === 0) || resolved.height === 0)}
  {#if !resolved.isUpdateAnimationActive}
    <g>
      <path
        {...attrs({
          ...svgPropertiesAndEvents(resolved),
          className: layerClass,
          d: getTrapezoidPath(resolved.x, resolved.y, resolved.upperWidth, resolved.lowerWidth, resolved.height),
        })}
      />
    </g>
  {:else}
    {#key animationId.current}
      <JavascriptAnimate
        animationId={animationId.current}
        canBegin={totalLength > 0}
        duration={resolved.animationDuration}
        easing={resolved.animationEasing}
        isActive={resolved.isUpdateAnimationActive}
        begin={resolved.animationBegin}
      >
        {#snippet children(t)}
          <path {...frame(t)} {@attach ref} />
        {/snippet}
      </JavascriptAnimate>
    {/key}
  {/if}
{/if}
