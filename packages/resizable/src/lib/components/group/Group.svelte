<script lang="ts">
  import { untrack } from 'svelte';
  import { mountGroup } from '../../global/mountGroup.js';
  import { eventEmitter, read } from '../../global/mutableState.js';
  import { getImperativeGroupMethods } from '../../global/utils/getImperativeGroupMethods.js';
  import { layoutsEqual } from '../../global/utils/layoutsEqual.js';
  import type { RegisteredPanel } from '../panel/types.js';
  import type { RegisteredSeparator } from '../separator/types.js';
  import { setGroupContext } from './GroupContext.js';
  import { ImperativeGroupHandle } from './ImperativeGroupHandle.js';
  import { sortByElementOffset } from './sortByElementOffset.js';
  import type { GroupProps, Layout, PanelStyles, RegisteredGroup, ResizeTargetMinimumSize } from './types.js';

  const dynamicId = $props.id();
  let {
    children,
    class: className,
    defaultLayout,
    disableCursor,
    disabled,
    elementRef = $bindable(),
    groupRef = $bindable(),
    id: idProp,
    onLayoutChange: onLayoutChangeUnstable,
    onLayoutChanged: onLayoutChangedUnstable,
    orientation = 'horizontal',
    resizeTargetMinimumSize = {
      coarse: 20,
      fine: 10
    },
    style,
    ...rest
  }: GroupProps = $props();

  const prevLayout: { onLayoutChange: Layout; onLayoutChanged: Layout } = {
    onLayoutChange: {},
    onLayoutChanged: {}
  };

  const onLayoutChangeStable = (layout: Layout) => {
    if (layoutsEqual(prevLayout.onLayoutChange, layout)) return;

    prevLayout.onLayoutChange = layout;
    onLayoutChangeUnstable?.(layout);
  };

  const onLayoutChangedStable = (layout: Layout) => {
    if (layoutsEqual(prevLayout.onLayoutChanged, layout)) return;

    prevLayout.onLayoutChanged = layout;
    onLayoutChangedUnstable?.(layout);
  };

  const id = $derived(`${idProp ?? dynamicId}`);

  let panelOrSeparatorChangeSigil = $state(0);
  const forceUpdate = () => untrack(() => panelOrSeparatorChangeSigil++);

  const inMemoryValues: {
    lastExpandedPanelSizes: { [panelIds: string]: number };
    layouts: { [panelIds: string]: Layout };
    panels: RegisteredPanel[];
    resizeTargetMinimumSize: ResizeTargetMinimumSize;
    separators: RegisteredSeparator[];
  } = {
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: untrack(() => resizeTargetMinimumSize),
    separators: []
  };

  const imperativeGroupHandle = new ImperativeGroupHandle();

  $effect(() => {
    if (groupRef !== imperativeGroupHandle) groupRef = imperativeGroupHandle;
  });

  $effect(() => {
    imperativeGroupHandle.delegateTo(getImperativeGroupMethods({ groupId: id }));
  });

  const getPanelStyles = (groupId: string, panelId: string): PanelStyles => {
    const { interactionState, mountedGroups } = read();

    for (const group of mountedGroups.keys()) {
      if (group.id === groupId) {
        const match = mountedGroups.get(group);
        if (match) {
          let dragActive = false;
          switch (interactionState.state) {
            case 'active': {
              dragActive = interactionState.hitRegions.some((current) => current.group === group);
              break;
            }
          }

          return {
            flexGrow: match.layout[panelId] ?? 1,
            pointerEvents: dragActive ? 'none' : undefined
          };
        }
      }
    }

    return {
      flexGrow: defaultLayout?.[panelId] ?? 1
    };
  };

  const registerPanel = $derived.by(() => {
    const currentOrientation = orientation;
    return (panel: RegisteredPanel) => {
      inMemoryValues.panels = sortByElementOffset(currentOrientation, [...inMemoryValues.panels, panel]);

      forceUpdate();

      return () => {
        inMemoryValues.panels = inMemoryValues.panels.filter((current) => current !== panel);

        forceUpdate();
      };
    };
  });

  const registerSeparator = $derived.by(() => {
    const currentOrientation = orientation;
    return (separator: RegisteredSeparator) => {
      inMemoryValues.separators = sortByElementOffset(currentOrientation, [...inMemoryValues.separators, separator]);

      forceUpdate();

      return () => {
        inMemoryValues.separators = inMemoryValues.separators.filter((current) => current !== separator);

        forceUpdate();
      };
    };
  });

  setGroupContext({
    getPanelStyles,
    get id() {
      return id;
    },
    get orientation() {
      return orientation;
    },
    get registerPanel() {
      return registerPanel;
    },
    get registerSeparator() {
      return registerSeparator;
    }
  });

  let registeredGroup: RegisteredGroup | null = null;

  $effect(() => {
    const element = elementRef;
    const groupDisabled = !!disabled;
    const groupId = id;
    const groupOrientation = orientation;
    void panelOrSeparatorChangeSigil;
    if (!element) return;

    return untrack(() => {
      const group: RegisteredGroup = {
        defaultLayout,
        disableCursor: !!disableCursor,
        disabled: groupDisabled,
        element,
        id: groupId,
        inMemoryLastExpandedPanelSizes: inMemoryValues.lastExpandedPanelSizes,
        inMemoryLayouts: inMemoryValues.layouts,
        orientation: groupOrientation,
        panels: inMemoryValues.panels,
        resizeTargetMinimumSize: inMemoryValues.resizeTargetMinimumSize,
        separators: inMemoryValues.separators
      };

      registeredGroup = group;

      const unmountGroup = mountGroup(group);

      const globalState = read();
      const match = globalState.mountedGroups.get(group);
      if (match) {
        const { defaultLayoutDeferred, derivedPanelConstraints, layout } = match;

        if (!defaultLayoutDeferred && derivedPanelConstraints.length > 0) {
          onLayoutChangeStable(layout);
          onLayoutChangedStable(layout);

          inMemoryValues.panels.forEach((panel) => {
            panel.scheduleUpdate();
          });
        }
      }

      let prevInteractionStateActive = false;

      const removeInteractionStateChangeListener = eventEmitter.addListener('interactionStateChange', (interactionState) => {
        const nextInteractionStateActive = interactionState.state === 'active';
        if (prevInteractionStateActive !== nextInteractionStateActive) {
          prevInteractionStateActive = nextInteractionStateActive;

          inMemoryValues.panels.forEach((panel) => {
            panel.scheduleUpdate();
          });
        }
      });

      const removeMountedGroupsChangeEventListener = eventEmitter.addListener('mountedGroupsChange', (mountedGroups) => {
        const match = mountedGroups.get(group);
        if (match) {
          const { defaultLayoutDeferred, derivedPanelConstraints, layout } = match;

          if (defaultLayoutDeferred || derivedPanelConstraints.length === 0) return;

          const { interactionState } = read();
          const isCompleted = interactionState.state !== 'active';

          onLayoutChangeStable(layout);
          if (isCompleted) {
            onLayoutChangedStable(layout);
          }

          inMemoryValues.panels.forEach((panel) => {
            panel.scheduleUpdate();
          });
        }
      });

      return () => {
        registeredGroup = null;

        unmountGroup();
        removeInteractionStateChangeListener();
        removeMountedGroupsChangeEventListener();
      };
    });
  });

  $effect(() => {
    const nextDefaultLayout = defaultLayout;
    const nextDisableCursor = !!disableCursor;
    if (registeredGroup) {
      registeredGroup.defaultLayout = nextDefaultLayout;
      registeredGroup.disableCursor = nextDisableCursor;
    }
  });
</script>

<div
  {...rest}
  class={className}
  data-group="true"
  data-testid={id}
  {id}
  bind:this={elementRef}
  style="height:100%;width:100%;overflow:hidden;{style ?? ''};display:flex;flex-direction:{orientation === 'horizontal' ? 'row' : 'column'};flex-wrap:nowrap"
>
  {@render children?.()}
</div>
