<script lang="ts">
  import { Separator } from '@sveltery/base/separator';
  import { cloneElement, isValidElement, type ReactNode, type Ref } from 'react';
  import Tree from './SeparatorConformanceTree.svelte';
  let { referenceProps }: { referenceProps: Record<string, unknown> } = $props();
  const props = $derived.by(() => {
    const { render: _render, ref: _ref, className, style, ...rest } = referenceProps;
    void [_render, _ref];
    // Base ea4e108e takes native class values only. The harness resolves a React className callback
    // with the Separator state, as Base UI does, so the original assertion still runs.
    const state = { orientation: (rest.orientation as string | undefined) ?? 'horizontal' };
    return { ...rest, class: typeof className === 'function' ? (className as (value: typeof state) => string)(state) : className, style: style && typeof style === 'object' ? Object.entries(style).map(([key, value]) => `${key}: ${value}`).join('; ') : style };
  });
  function ref(node: HTMLElement | null | undefined) {
    const original = referenceProps.ref as Ref<HTMLElement> | undefined;
    if (typeof original === 'function') original(node ?? null);
    else if (original) original.current = node ?? null;
  }
  // Base ea4e108e does not export mergeProps. This translation helper follows Base UI's rules for the
  // props these helpers pass: later plain props win, classes and styles concatenate, handlers chain right to left.
  function mergeProps(left: Record<string | symbol, unknown>, right: Record<string | symbol, unknown>) {
    const merged: Record<string | symbol, unknown> = { ...left };
    for (const key of Reflect.ownKeys(right)) {
      const value = right[key]; const previous = left[key];
      if (key === 'class' && previous && value) merged[key] = `${previous} ${value}`;
      else if (key === 'style' && previous && value) merged[key] = `${previous}; ${value}`;
      else if (typeof key === 'string' && /^on[a-z]/.test(key) && typeof previous === 'function' && typeof value === 'function') merged[key] = (...args: unknown[]) => { value(...args); previous(...args); };
      else if (value !== undefined) merged[key] = value;
    }
    return merged;
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
<!-- Base parts have no refs; the React ref receives the actual host through an attachment. -->
<Separator {...props} render={referenceProps.render ? custom : undefined} {@attach node => { ref(node); return () => ref(null); }} />
