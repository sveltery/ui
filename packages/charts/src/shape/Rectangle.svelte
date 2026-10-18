<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { untrack } from 'svelte';
  import { clsx } from 'clsx';
  import { interpolate } from '../util/DataUtils.js';
  import { round } from '../util/round.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { attrs } from '../util/attrs.js';
  import { useAnimationId } from '../util/useAnimationId.svelte.js';
  import { getTransitionVal } from '../animation/util.js';
  import JavascriptAnimate from '../animation/JavascriptAnimate.svelte';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import { defaultRectangleProps, getRectanglePath, type Props } from './Rectangle.js';

  let raw: SvelteProps<Props> = $props();
  const resolved = rechartsProps<Props, typeof defaultRectangleProps>(() => raw, defaultRectangleProps);

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
  let prevWidth = untrack(() => resolved.width);
  let prevHeight = untrack(() => resolved.height);
  let prevX = untrack(() => resolved.x);
  let prevY = untrack(() => resolved.y);
  const animationId = useAnimationId(() => ({ x: resolved.x, y: resolved.y, width: resolved.width, height: resolved.height, radius: resolved.radius }), 'rectangle-');

  const layerClass = $derived(clsx('recharts-rectangle', resolved.className));
  const otherPathProps = $derived(omit(svgPropertiesAndEvents(resolved), ['radius']));

  function frame(t: number) {
    const { x, y, width, height, radius, isAnimationActive, animationDuration, animationEasing } = resolved;
    const currWidth = interpolate(prevWidth, width, t);
    const currHeight = interpolate(prevHeight, height, t);
    const currX = interpolate(prevX, x, t);
    const currY = interpolate(prevY, y, t);
    if (pathRef) {
      prevWidth = currWidth;
      prevHeight = currHeight;
      prevX = currX;
      prevY = currY;
    }
    const from = `0px ${totalLength === -1 ? 1 : totalLength}px`;
    const to = `${totalLength}px ${totalLength}px`;
    const transition = getTransitionVal(['strokeDasharray'], animationDuration, typeof animationEasing === 'string' ? animationEasing : defaultRectangleProps.animationEasing);
    let animationStyle: { transition: string; strokeDasharray: string } | { strokeDasharray: string };
    if (!isAnimationActive) {
      animationStyle = { strokeDasharray: to };
    } else if (t > 0) {
      animationStyle = { transition, strokeDasharray: to };
    } else {
      animationStyle = { strokeDasharray: from };
    }
    return attrs({
      ...otherPathProps,
      radius: typeof radius === 'number' ? radius : undefined,
      className: layerClass,
      d: getRectanglePath(currX, currY, currWidth, currHeight, radius),
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

{#if !(resolved.x !== +resolved.x || resolved.y !== +resolved.y || resolved.width !== +resolved.width || resolved.height !== +resolved.height || resolved.width === 0 || resolved.height === 0)}
  {#if !resolved.isUpdateAnimationActive}
    <path
      {...attrs({
        ...otherPathProps,
        x: round(resolved.x),
        y: round(resolved.y),
        width: round(resolved.width),
        height: round(resolved.height),
        radius: typeof resolved.radius === 'number' ? resolved.radius : undefined,
        className: layerClass,
        d: getRectanglePath(resolved.x, resolved.y, resolved.width, resolved.height, resolved.radius),
      })}
    />
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
