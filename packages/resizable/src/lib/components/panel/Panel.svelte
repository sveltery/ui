<script lang="ts">
  import { untrack } from 'svelte';
  import { getImperativePanelMethods } from '../../global/utils/getImperativePanelMethods.js';
  import { useGroupContext } from '../group/useGroupContext.js';
  import { ImperativePanelHandle } from './ImperativePanelHandle.js';
  import type { PanelProps, PanelSize } from './types.js';

  const dynamicId = $props.id();
  let {
    children,
    class: className,
    collapsedSize = '0%',
    collapsible = false,
    defaultSize,
    elementRef = $bindable(),
    id: idProp,
    maxSize = '100%',
    minSize = '0%',
    onResize: onResizeUnstable,
    panelRef = $bindable(),
    style,
    ...rest
  }: PanelProps = $props();

  const idIsStable = $derived(!!idProp);

  const id = $derived(`${idProp ?? dynamicId}`);

  let updateSigil = $state(0);
  const forceUpdate = () => untrack(() => updateSigil++);

  const context = useGroupContext();

  const hasOnResize = $derived(onResizeUnstable !== null);
  const onResizeStable = (panelSize: PanelSize, _: string | number | undefined, prevPanelSize: PanelSize | undefined) => {
    onResizeUnstable?.(panelSize, idProp, prevPanelSize);
  };

  $effect(() => {
    const element = elementRef;
    const panel = {
      id,
      idIsStable,
      mutableValues: {
        expandToSize: undefined,
        prevSize: undefined
      },
      onResize: hasOnResize ? onResizeStable : undefined,
      panelConstraints: {
        collapsedSize,
        collapsible,
        defaultSize,
        maxSize,
        minSize
      },
      scheduleUpdate: forceUpdate
    };
    const registerPanel = context.registerPanel;
    if (element) {
      return untrack(() => registerPanel({ element, ...panel }));
    }
  });

  const imperativePanelHandle = new ImperativePanelHandle();

  $effect(() => {
    if (panelRef !== imperativePanelHandle) panelRef = imperativePanelHandle;
  });

  $effect(() => {
    imperativePanelHandle.delegateTo(getImperativePanelMethods({ groupId: context.id, panelId: id }));
  });

  const panelStyles = $derived.by(() => {
    void updateSigil;
    return context.getPanelStyles(context.id, id);
  });
</script>

<div
  {...rest}
  data-panel="true"
  data-testid={id}
  {id}
  bind:this={elementRef}
  style="min-height:0;max-height:100%;height:auto;min-width:0;max-width:100%;width:auto;border:none;border-width:0;padding:0;margin:0;display:flex;flex-basis:0;flex-shrink:1;overflow:hidden;flex-grow:{panelStyles.flexGrow}{panelStyles.pointerEvents ? `;pointer-events:${panelStyles.pointerEvents}` : ''}"
>
  <div class={className} style="max-height:100%;max-width:100%;flex-grow:1;{style ?? ''}">
    {@render children?.()}
  </div>
</div>
