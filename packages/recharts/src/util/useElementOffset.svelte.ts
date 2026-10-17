import type { Attachment } from 'svelte/attachments';
import type { Box, Getter } from '../state/hooks.svelte.js';
import type { ElementOffset } from './useElementOffset.js';

const EPS = 1;

/**
 * Listens to layout changes of an element. Attach the returned attachment to the element; it measures again
 * whenever the values read by `extraDependencies` change, like payload and label that change a parent's box.
 */
export function useElementOffset(extraDependencies: Getter<ReadonlyArray<unknown>> = () => []): [Box<ElementOffset>, Attachment<HTMLElement>] {
  let lastBoundingBox = $state<ElementOffset>({ height: 0, left: 0, top: 0, width: 0 });
  const updateBoundingBox: Attachment<HTMLElement> = (node) => {
    extraDependencies();
    const rect = node.getBoundingClientRect();
    const box: ElementOffset = { height: rect.height, left: rect.left, top: rect.top, width: rect.width };
    if (
      Math.abs(box.height - lastBoundingBox.height) > EPS ||
      Math.abs(box.left - lastBoundingBox.left) > EPS ||
      Math.abs(box.top - lastBoundingBox.top) > EPS ||
      Math.abs(box.width - lastBoundingBox.width) > EPS
    ) {
      lastBoundingBox = box;
    }
  };
  return [
    {
      get current() {
        return lastBoundingBox;
      },
    },
    updateBoundingBox,
  ];
}
