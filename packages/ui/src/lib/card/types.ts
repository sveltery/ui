import type { HTMLAttributes } from 'svelte/elements';

type NativeCardProps = HTMLAttributes<HTMLDivElement>;

export type CardProps = NativeCardProps & { size?: 'default' | 'sm' };
export type CardHeaderProps = NativeCardProps;
export type CardTitleProps = NativeCardProps;
export type CardDescriptionProps = NativeCardProps;
export type CardActionProps = NativeCardProps;
export type CardContentProps = NativeCardProps;
export type CardFooterProps = NativeCardProps;
