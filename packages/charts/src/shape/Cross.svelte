<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { clsx } from 'clsx';
  import { isNumber } from '../util/DataUtils.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import { getPath, type Props } from './Cross.js';

  let raw: SvelteProps<Props> = $props();
  const resolved = rechartsProps<Props, { x: 0; y: 0; top: 0; left: 0; width: 0; height: 0 }>(() => raw, { x: 0, y: 0, top: 0, left: 0, width: 0, height: 0 });

  const crossProps = $derived.by(() => {
    const { x, y, top, left, width, height } = resolved;
    return { x, y, top, left, width, height, ...omit(resolved, ['x', 'y', 'top', 'left', 'width', 'height', 'className']) };
  });
</script>

{#if isNumber(crossProps.x) && isNumber(crossProps.y) && isNumber(crossProps.width) && isNumber(crossProps.height) && isNumber(crossProps.top) && isNumber(crossProps.left)}
  <path
    {...attrs({
      ...svgPropertiesAndEvents(crossProps),
      className: clsx('recharts-cross', resolved.className),
      d: getPath(crossProps.x, crossProps.y, crossProps.width, crossProps.height, crossProps.top, crossProps.left),
    })}
  />
{/if}
