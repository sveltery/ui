import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { AvatarRootProps, AvatarImageProps as PrimitiveImageProps, AvatarFallbackProps as PrimitiveFallbackProps } from '@sveltery/base/avatar';

export type { AvatarRootState, AvatarImageState, AvatarFallbackState, ImageLoadingStatus } from '@sveltery/base/avatar';
export type AvatarProps = AvatarRootProps & { size?: 'default' | 'sm' | 'lg' };
// keepMounted is a Base 1.8 extension, absent from the genuine original 1.6 API.
export type AvatarImageProps = Omit<PrimitiveImageProps, 'keepMounted'>;
export type AvatarFallbackProps = PrimitiveFallbackProps;
type NativeProps<T extends HTMLElement> = Omit<HTMLAttributes<T>, 'children'> & { children?: Snippet; ref?: T | null };
export type AvatarBadgeProps = NativeProps<HTMLSpanElement>;
export type AvatarGroupProps = NativeProps<HTMLDivElement>;
export type AvatarGroupCountProps = NativeProps<HTMLDivElement>;
