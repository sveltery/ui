export const SIDEBAR_SCROLL_KEY = 'docs-sidebar-scroll';

/** Restores the docs sidebar's scroll position for this page, or centers the active link when it is out of view. */
export function restoreSidebarScroll(container: HTMLElement) {
  let stored: { pathname: string; scrollTop: number } | null;
  try {
    stored = JSON.parse(sessionStorage.getItem(SIDEBAR_SCROLL_KEY) ?? '');
  } catch {
    stored = null;
  }
  if (stored?.pathname === location.pathname) {
    container.scrollTop = stored.scrollTop;
    return;
  }
  // Prefer the longest route, because section links also match by prefix.
  let active: HTMLElement | undefined;
  for (const item of container.querySelectorAll<HTMLElement>('[data-active="true"]')) {
    if (!active || (item.getAttribute('href') ?? '').length > (active.getAttribute('href') ?? '').length) active = item;
  }
  if (!active) return;
  const box = container.getBoundingClientRect();
  const rect = active.getBoundingClientRect();
  if (rect.top < box.top || rect.bottom > box.bottom) container.scrollTop += rect.top - box.top - (container.clientHeight - rect.height) / 2;
}

/**
 * `restoreSidebarScroll` as an inline script, so a full page load restores the position before
 * hydration, like upstream's DOCS_SIDEBAR_SCROLL_RESTORE_SCRIPT. It is a literal because the server
 * and client builds print a function's source differently, which would break hydration.
 */
export const restoreSidebarScrollScript = `<script>(function () {
  var container = document.querySelector('[data-docs-sidebar-content]');
  if (!container) return;
  var stored = null;
  try { stored = JSON.parse(sessionStorage.getItem('${SIDEBAR_SCROLL_KEY}')); } catch (e) {}
  if (stored && stored.pathname === location.pathname) { container.scrollTop = stored.scrollTop; return; }
  var active = null;
  var items = container.querySelectorAll('[data-active="true"]');
  for (var i = 0; i < items.length; i++) {
    if (!active || (items[i].getAttribute('href') || '').length > (active.getAttribute('href') || '').length) active = items[i];
  }
  if (!active) return;
  var box = container.getBoundingClientRect();
  var rect = active.getBoundingClientRect();
  if (rect.top < box.top || rect.bottom > box.bottom) container.scrollTop += rect.top - box.top - (container.clientHeight - rect.height) / 2;
})()</` + 'script>';
