<script lang="ts">
  import { clsx } from 'clsx';
  import { omit } from 'es-toolkit';
  import type { SVGProps } from '../react.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import type { Props } from './Surface.js';

  let { ref = $bindable(null), ...raw }: SvelteProps<Props> & { ref?: SVGSVGElement | null } = $props();
  const resolved = rechartsProps<Props, object>(() => raw, {});

  const svgAttributes = $derived.by(() => {
    const { width, height, viewBox, className, style } = resolved;
    const others = omit(resolved, ['children', 'width', 'height', 'viewBox', 'className', 'style', 'title', 'desc']);
    const svgView = viewBox || { width, height, x: 0, y: 0 };
    return attrs({
      ...svgPropertiesAndEvents(others as SVGProps<SVGSVGElement>),
      className: clsx('recharts-surface', className),
      width,
      height,
      style,
      viewBox: `${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`,
    });
  });
</script>

<svg {...svgAttributes} bind:this={ref}>
  <title>{resolved.title}</title>
  <desc>{resolved.desc}</desc>
  {@render raw.children?.()}
</svg>
