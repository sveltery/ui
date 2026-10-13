import type { Attachment } from 'svelte/attachments';

/** Sorts by document position once every entry is in the document, and keeps registration order until then. */
export function inDocumentOrder<T extends { element: Element | undefined }>(entries: readonly T[]): T[] {
  if (!entries.every((entry) => entry.element)) return [...entries];
  return [...entries].sort((first, second) => {
    const position = first.element!.compareDocumentPosition(second.element!);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });
}

/**
 * The list sizer and each group's items container. Ranking sets CSS `order` on their children, which only acts on
 * flex items. `reading-flow` lets browsers that support it read and tab in that visual order.
 */
export const RANKED_CONTAINER_STYLE = 'display:flex;flex-direction:column;reading-flow:flex-flow';

export const VISUALLY_HIDDEN_STYLE =
  'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0';

/** Mirrors the sizer's height into `--cmdk-list-height` on its parent list, so the list can animate its height. */
export const trackListHeight: Attachment<HTMLElement> = (sizer) => {
  const list = sizer.parentElement;
  if (!list || typeof ResizeObserver === 'undefined') return;
  let frame = 0;
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => list.style.setProperty('--cmdk-list-height', `${sizer.offsetHeight.toFixed(1)}px`));
  });
  observer.observe(sizer);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
  };
};
