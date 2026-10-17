<svelte:options namespace="svg" />

<script lang="ts">
  import isPlainObject from 'es-toolkit/compat/isPlainObject';
  import Layer from '../container/Layer.svelte';
  import Rectangle from '../shape/Rectangle.svelte';
  import Symbols from '../shape/Symbols.svelte';
  import Curve from '../shape/Curve.svelte';
  import RenderProp from './RenderProp.svelte';
  import { defaultPropTransformer, type ShapeType } from './ActiveShapeUtils.js';

  type Props = {
    shapeType: ShapeType;
    option: unknown;
    isActive?: boolean;
    index?: string | number;
    activeClassName?: string;
    inActiveClassName?: string;
    [key: string]: unknown;
  };

  let { option, shapeType, activeClassName = 'recharts-active-shape', inActiveClassName = 'recharts-shape', ...props }: Props = $props();

  // A snippet stands for upstream's render function and element forms, an object for extra props on the default shape.
  const elementProps = $derived(isPlainObject(option) && typeof option !== 'boolean' ? defaultPropTransformer<unknown, typeof props, Record<string, unknown>>(option, props) : props);
</script>

{#snippet ShapeSelector(elementProps: Record<string, unknown>)}
  {#if shapeType === 'rectangle'}
    <Rectangle {...elementProps} />
  {:else if shapeType === 'symbols'}
    <Symbols {...elementProps} />
  {:else if shapeType === 'curve'}
    <Curve {...elementProps} />
  {/if}
{/snippet}

<Layer class={props.isActive ? activeClassName : inActiveClassName}>
  {#if typeof option === 'function'}
    <RenderProp of={option as never} props={props} />
  {:else}
    {@render ShapeSelector(elementProps)}
  {/if}
</Layer>
