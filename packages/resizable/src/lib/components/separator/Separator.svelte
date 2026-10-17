<script lang="ts">
  import { untrack } from 'svelte';
  import { eventEmitter } from '../../global/mutableState.js';
  import type { InteractionState } from '../../global/types.js';
  import { calculateSeparatorAriaValues } from '../../global/utils/calculateSeparatorAriaValues.js';
  import { useGroupContext } from '../group/useGroupContext.js';
  import type { RegisteredSeparator, SeparatorProps } from './types.js';

  const dynamicId = $props.id();
  let { children, class: className, elementRef = $bindable(), id: idProp, style, ...rest }: SeparatorProps = $props();

  const id = $derived(`${idProp ?? dynamicId}`);

  let aria = $state.raw<{
    valueControls?: string | undefined;
    valueMin?: number | undefined;
    valueMax?: number | undefined;
    valueNow?: number | undefined;
  }>({});

  let dragState = $state<InteractionState['state']>('inactive');

  const context = useGroupContext();

  const orientation = $derived(context.orientation === 'horizontal' ? 'vertical' : 'horizontal');

  $effect(() => {
    const element = elementRef;
    const groupId = context.id;
    const separatorId = id;
    const registerSeparator = context.registerSeparator;
    if (element) {
      return untrack(() => {
        const separator: RegisteredSeparator = {
          element,
          id: separatorId
        };

        const unregisterSeparator = registerSeparator(separator);

        const removeInteractionStateChangeListener = eventEmitter.addListener('interactionStateChange', (interactionState) => {
          dragState =
            interactionState.state !== 'inactive' && interactionState.hitRegions.some((hitRegion) => hitRegion.separator === separator)
              ? interactionState.state
              : 'inactive';
        });

        const removeMountedGroupsChangeListener = eventEmitter.addListener('mountedGroupsChange', (mountedGroups) => {
          mountedGroups.forEach(({ derivedPanelConstraints, layout, separatorToPanels }, mountedGroup) => {
            if (mountedGroup.id === groupId) {
              const panels = separatorToPanels.get(separator);
              if (panels) {
                const primaryPanel = panels[0];
                const panelIndex = mountedGroup.panels.indexOf(primaryPanel);

                aria = calculateSeparatorAriaValues({
                  layout,
                  panelConstraints: derivedPanelConstraints,
                  panelId: primaryPanel.id,
                  panelIndex
                });
              }
            }
          });
        });

        return () => {
          removeInteractionStateChangeListener();
          removeMountedGroupsChangeListener();
          unregisterSeparator();
        };
      });
    }
  });
</script>

<!-- A window splitter is interactive: it takes focus and the arrow keys. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  {...rest}
  aria-controls={aria.valueControls}
  aria-orientation={orientation}
  aria-valuemax={aria.valueMax}
  aria-valuemin={aria.valueMin}
  aria-valuenow={aria.valueNow}
  class={className}
  data-separator={dragState}
  data-testid={id}
  {id}
  bind:this={elementRef}
  role="separator"
  style="flex-basis:auto;{style ?? ''};flex-grow:0;flex-shrink:0"
  tabindex={0}
>
  {@render children?.()}
</div>
