import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
export type ExampleWrapperProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { children?: Snippet; ref?: HTMLDivElement | null };
export type ExampleProps = ExampleWrapperProps & { containerClassName?: string };
