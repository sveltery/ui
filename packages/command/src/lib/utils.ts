import type { Attachment } from 'svelte/attachments';

/** The registered entries, sorted by their element's position in the document. */
export function inDocumentOrder<T>(registry: ReadonlyMap<T, Element>): T[] {
  return [...registry]
    .sort(([, first], [, second]) => {
      const position = first.compareDocumentPosition(second);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    })
    .map(([entry]) => entry);
}

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
