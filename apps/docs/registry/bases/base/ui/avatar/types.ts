import type { HTMLAttributes } from 'svelte/elements';
import type { AvatarRootProps } from '@sveltery/base/avatar';

export type { AvatarImageProps, AvatarFallbackProps, AvatarRootState, AvatarImageState, AvatarFallbackState, ImageLoadingStatus } from '@sveltery/base/avatar';
export type AvatarProps = AvatarRootProps & { size?: 'default' | 'sm' | 'lg' };
export type AvatarBadgeProps = HTMLAttributes<HTMLSpanElement>;
export type AvatarGroupProps = HTMLAttributes<HTMLDivElement>;
export type AvatarGroupCountProps = HTMLAttributes<HTMLDivElement>;
