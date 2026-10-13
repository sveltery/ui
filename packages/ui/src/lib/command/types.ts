import type { ComponentProps, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Empty, Group, Input, Item, List, Root, Separator } from '@sveltery/command';
import type { Dialog } from '../dialog/index.js';

export type CommandProps = ComponentProps<typeof Root>;
export type CommandDialogProps = Omit<ComponentProps<typeof Dialog>, 'children'> & {
  title?: string;
  description?: string;
  class?: string;
  showCloseButton?: boolean;
  children: Snippet;
};
export type CommandInputProps = ComponentProps<typeof Input>;
export type CommandListProps = ComponentProps<typeof List>;
export type CommandEmptyProps = ComponentProps<typeof Empty>;
export type CommandGroupProps = ComponentProps<typeof Group>;
export type CommandItemProps = ComponentProps<typeof Item>;
export type CommandSeparatorProps = ComponentProps<typeof Separator>;
export type CommandShortcutProps = HTMLAttributes<HTMLSpanElement>;
