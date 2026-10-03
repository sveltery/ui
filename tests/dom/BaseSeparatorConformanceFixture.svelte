<script lang="ts">
  import { Separator } from '@sveltery/base/separator';
  import { mergeProps } from '@sveltery/base/merge-props';
  import { cloneElement, isValidElement, type ReactNode, type Ref } from 'react';
  import Tree from './SeparatorConformanceTree.svelte';
  let { referenceProps }: { referenceProps: Record<string, unknown> } = $props();
  let current = $state<HTMLElement | null | undefined>();
  const props = $derived.by(() => {
    const { render: _render, ref: _ref, className, style, ...rest } = referenceProps;
    void [_render, _ref];
    return { ...rest, class: className, style: style && typeof style === 'object' ? Object.entries(style).map(([key, value]) => `${key}: ${value}`).join('; ') : style };
  });
  function ref(node: HTMLElement | null | undefined) {
    current = node;
    const original = referenceProps.ref as Ref<HTMLElement> | undefined;
    if (typeof original === 'function') original(node ?? null);
    else if (original) original.current = node ?? null;
  }
  function customTree(native: Record<string | symbol, unknown>) {
    const { class: className, ...rest } = native;
    const incoming = { ...rest, className };
    if (typeof referenceProps.render === 'function') return (referenceProps.render as (props: Record<string | symbol, unknown>) => ReactNode)(incoming);
    if (!isValidElement<Record<string | symbol, unknown>>(referenceProps.render)) return null;
    const { className: renderClass, style: renderStyle, ...renderRest } = referenceProps.render.props;
    // The Svelte render snippet owns JSX-equivalent prop/style/class composition.
    const composed = mergeProps(native, { ...renderRest, class: renderClass, style: renderStyle });
    const { class: composedClass, ...composedRest } = composed;
    const tree = cloneElement(referenceProps.render, { ...composedRest, className: composedClass });
    // React cloneElement intentionally copies string props only. Svelte snippets
    // spread enumerable symbols too; retain real primitive attachments in the descriptor.
    return { ...tree, props: { ...tree.props, ...Object.fromEntries(Object.getOwnPropertySymbols(native).map(key => [key, native[key]])) } };
  }
</script>
{#snippet custom(native: Record<string | symbol, unknown>)}
  <Tree element={customTree(native)} />
{/snippet}
<Separator {...props} render={referenceProps.render ? custom : undefined} bind:ref={() => current, ref} />
