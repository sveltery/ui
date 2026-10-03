<script lang="ts">
  // Translate helper JSX hosts and ref infrastructure into native Svelte hosts.
  import { createAttachmentKey } from 'svelte/attachments';
  import { isValidElement, Fragment, type ReactElement, type ReactNode, type Ref } from 'react';
  import Tree from './SeparatorConformanceTree.svelte';
  let { element }: { element: ReactNode } = $props();
  function resolve(node: ReactNode): ReactElement<Record<string | symbol, unknown>> | null {
    if (!isValidElement<Record<string | symbol, unknown>>(node)) return null;
    if (typeof node.type === 'function') return resolve((node.type as (props: Record<string | symbol, unknown>) => ReactNode)(node.props));
    if (typeof node.type === 'object' && 'render' in node.type) {
      return resolve((node.type.render as (props: Record<string | symbol, unknown>, ref: unknown) => ReactNode)(node.props, node.props.ref));
    }
    return node;
  }
  const resolved = $derived(resolve(element));
  const attachmentKey = createAttachmentKey();
  function assign(ref: Ref<HTMLElement> | undefined, node: HTMLElement | null) {
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }
  const attributes = $derived.by(() => {
    const { ref, children: _children, className, style, ...rest } = resolved?.props ?? {};
    void _children;
    return { ...rest, class: className, style: typeof style === 'object' && style ? Object.entries(style).map(([key, value]) => `${key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}: ${value}`).join('; ') : style, [attachmentKey]: (node: HTMLElement) => { assign(ref as Ref<HTMLElement> | undefined, node); return () => assign(ref as Ref<HTMLElement> | undefined, null); } };
  });
</script>
{#if resolved?.type === Fragment}
  <Tree element={resolved.props.children as ReactNode} />
{:else if resolved && typeof resolved.type === 'string'}
  {#if ['input', 'img', 'br', 'hr'].includes(resolved.type)}
    <svelte:element this={resolved.type} {...attributes} />
  {:else}
    <svelte:element this={resolved.type} {...attributes}><Tree element={resolved.props.children as ReactNode} /></svelte:element>
  {/if}
{:else if typeof element === 'string' || typeof element === 'number'}
  {element}
{/if}
