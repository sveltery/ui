import type { ComponentProps } from 'svelte';
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount, type AvatarProps, type AvatarImageProps, type AvatarFallbackProps } from '../apps/docs/registry/bases/base/ui/avatar/index.js';
const root: AvatarProps = { size: 'sm', ref: null, class: ['size-12'], style: 'color: red' };
const image: AvatarImageProps = { src: '/image.png', alt: 'Portrait', srcset: '/image.png 1x', ref: undefined, onLoadingStatusChange: status => { const valid: 'idle' | 'loading' | 'loaded' | 'error' = status; void valid; } };
// The genuine original zero-delay API stays exposed; its SSR contract is blocked, not omitted.
const zeroDelay: AvatarFallbackProps = { delay: 0 };
const fallback: AvatarFallbackProps = { delay: 100, class: () => 'ignored-original-class' };
const props: [ComponentProps<typeof Avatar>, ComponentProps<typeof AvatarImage>, ComponentProps<typeof AvatarFallback>, ComponentProps<typeof AvatarBadge>, ComponentProps<typeof AvatarGroup>, ComponentProps<typeof AvatarGroupCount>] = [root, image, fallback, { ref: null }, { ref: undefined }, { class: ['size-10'] }];
// @ts-expect-error original Avatar sizes are default/sm/lg.
const badSize: AvatarProps = { size: 'xl' };
// @ts-expect-error keepMounted does not exist in the pinned React 1.6 original.
const extension: AvatarImageProps = { keepMounted: true };
// @ts-expect-error native Badge has no synthetic render API.
const badgeRender: ComponentProps<typeof AvatarBadge> = { render: () => {} };
// @ts-expect-error Svelte styles are native CSS strings.
const objectStyle: AvatarProps = { style: { color: 'red' } };
void [zeroDelay, props, badSize, extension, badgeRender, objectStyle];
