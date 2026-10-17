<svelte:options namespace="svg" />

<script lang="ts">
  import { clsx } from 'clsx';
  import { symbol as shapeSymbol } from 'victory-vendor/d3-shape';
  import { isNumber } from '../util/DataUtils.js';
  import type { SymbolType } from '../util/types.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import { calculateAreaSize, getSymbolFactory, type SymbolsProps } from './Symbols.js';

  let raw: SvelteProps<SymbolsProps> = $props();
  const resolved = rechartsProps<SymbolsProps, { type: 'circle'; size: 64; sizeType: 'area' }>(() => raw, { type: 'circle', size: 64, sizeType: 'area' });

  const path = $derived.by((): string | undefined => {
    const realType: SymbolType = typeof resolved.type === 'string' ? resolved.type : 'circle';
    const symbol = shapeSymbol()
      .type(getSymbolFactory(realType))
      .size(calculateAreaSize(resolved.size, resolved.sizeType, realType));
    return symbol() ?? undefined;
  });
</script>

{#if isNumber(resolved.cx) && isNumber(resolved.cy) && isNumber(resolved.size)}
  <path {...attrs({ ...svgPropertiesAndEvents(resolved), className: clsx('recharts-symbols', resolved.className), transform: `translate(${resolved.cx}, ${resolved.cy})`, d: path })} />
{/if}
