import type { OTPInputProps } from './types.js';

const BADGE_MARGIN_RIGHT = 18;
const BADGE_SPACE_WIDTH_PX = 40;
export const BADGE_SPACE_WIDTH = `${BADGE_SPACE_WIDTH_PX}px`;

const PASSWORD_MANAGER_SELECTORS = [
  '[data-lastpass-icon-root]',
  'com-1password-button',
  '[data-dashlanecreated]',
  '[style$="2147483647 !important;"]',
].join(',');

interface BadgeOptions {
  container: () => HTMLDivElement | null;
  input: () => HTMLInputElement | null;
  strategy: () => NonNullable<OTPInputProps['pushPasswordManagerStrategy']>;
  isFocused: () => boolean;
}

/** Detects a password manager badge over the input's right edge, so the input can widen past it. */
export function passwordManagerBadge({ container, input, strategy, isFocused }: BadgeOptions) {
  let hasBadge = $state(false);
  let hasBadgeSpace = $state(false);
  let done = false;

  function track() {
    const root = container();
    if (!root || !input() || done || strategy() === 'none') return;
    const rect = root.getBoundingClientRect();
    const x = rect.left + root.offsetWidth - BADGE_MARGIN_RIGHT;
    const y = rect.top + root.offsetHeight / 2;
    // Without a known password manager element, anything other than the container at the badge's spot counts as a badge.
    if (document.querySelectorAll(PASSWORD_MANAGER_SELECTORS).length === 0 && document.elementFromPoint(x, y) === root) return;
    hasBadge = true;
    done = true;
  }

  $effect(() => {
    const root = container();
    if (!root || strategy() === 'none') return;
    const checkHasSpace = () => {
      hasBadgeSpace = window.innerWidth - root.getBoundingClientRect().right >= BADGE_SPACE_WIDTH_PX;
    };
    checkHasSpace();
    const interval = setInterval(checkHasSpace, 1000);
    return () => clearInterval(interval);
  });

  $effect(() => {
    const focused = isFocused() || document.activeElement === input();
    if (strategy() === 'none' || !focused) return;
    const timeouts = [setTimeout(track, 0), setTimeout(track, 2000), setTimeout(track, 5000), setTimeout(() => (done = true), 6000)];
    return () => timeouts.forEach(clearTimeout);
  });

  return {
    get willPush() {
      return strategy() === 'increase-width' && hasBadge && hasBadgeSpace;
    },
  };
}
