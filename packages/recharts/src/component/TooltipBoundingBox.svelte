<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { getTooltipTranslate } from '../util/tooltip/translate.js';
  import { usePrefersReducedMotion } from '../util/usePrefersReducedMotion.js';
  import { attrs } from '../util/attrs.js';
  import type { CSSProperties } from '../react.js';
  import { resolveTransitionProperty, type TooltipBoundingBoxProps } from './TooltipBoundingBox.js';

  let props: Omit<TooltipBoundingBoxProps, 'children' | 'innerRef'> & { children?: Snippet; innerRef: Attachment<HTMLElement> } = $props();

  const prefersReducedMotion = usePrefersReducedMotion();
  let state = $state({
    dismissed: false,
    dismissedAtCoordinate: { x: 0, y: 0 },
  });

  $effect(() => {
    const x = props.coordinate?.x ?? 0;
    const y = props.coordinate?.y ?? 0;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        state = {
          dismissed: true,
          dismissedAtCoordinate: { x, y },
        };
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  // Upstream resets the dismissed state during render once the coordinate moves away from where Escape was pressed.
  $effect.pre(() => {
    if (state.dismissed && ((props.coordinate?.x ?? 0) !== state.dismissedAtCoordinate.x || (props.coordinate?.y ?? 0) !== state.dismissedAtCoordinate.y)) {
      state = { ...state, dismissed: false };
    }
  });

  const outerStyle: CSSProperties = $derived.by(() => {
    const { cssProperties } = translate;
    const positionStyle: CSSProperties = props.hasPortalFromProps
      ? {}
      : {
          transition: resolveTransitionProperty({
            prefersReducedMotion: prefersReducedMotion.current,
            isAnimationActive: props.isAnimationActive,
            active: props.active,
            animationDuration: props.animationDuration,
            animationEasing: props.animationEasing,
          }),
          ...cssProperties,
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
        };
    return {
      ...positionStyle,
      visibility: !state.dismissed && props.active && props.hasPayload ? 'visible' : 'hidden',
      ...props.wrapperStyle,
    };
  });

  const translate = $derived(
    getTooltipTranslate({
      allowEscapeViewBox: props.allowEscapeViewBox,
      coordinate: props.coordinate,
      offsetLeft: typeof props.offset === 'number' ? props.offset : props.offset.x,
      offsetTop: typeof props.offset === 'number' ? props.offset : props.offset.y,
      position: props.position,
      reverseDirection: props.reverseDirection,
      tooltipBox: {
        height: props.lastBoundingBox.height,
        width: props.lastBoundingBox.width,
      },
      useTranslate3d: props.useTranslate3d,
      viewBox: props.viewBox,
    }),
  );
</script>

<div {...attrs({ xmlns: 'http://www.w3.org/1999/xhtml', tabIndex: -1, className: translate.cssClasses, style: outerStyle })} {@attach props.innerRef}>
  {@render props.children?.()}
</div>
