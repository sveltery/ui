import { backOut, cubicOut } from 'svelte/easing';
import type { FlyParams } from 'svelte/transition';

export const animations = {
  fade: { id: 'fade', name: 'Fade', fly: { y: 0, duration: 200 } },
  rise: { id: 'rise', name: 'Rise', fly: { y: 24, duration: 300, easing: cubicOut } },
  pop: { id: 'pop', name: 'Pop', fly: { x: 16, y: 16, duration: 350, easing: backOut } },
} satisfies Record<string, { id: string; name: string; fly: FlyParams }>;

export type AnimationId = keyof typeof animations;
