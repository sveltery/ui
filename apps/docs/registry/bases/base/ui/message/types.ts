import type { HTMLAttributes } from 'svelte/elements';

type NativeDivProps = HTMLAttributes<HTMLDivElement>;

export type MessageGroupProps = NativeDivProps;
export type MessageProps = NativeDivProps & { align?: 'start' | 'end' };
export type MessageAvatarProps = NativeDivProps;
export type MessageContentProps = NativeDivProps;
export type MessageHeaderProps = NativeDivProps;
export type MessageFooterProps = NativeDivProps;
