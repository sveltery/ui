import type { ClassValue, HTMLAttributes } from 'svelte/elements';
export type ExampleWrapperProps = HTMLAttributes<HTMLDivElement>;
export type ExampleProps = ExampleWrapperProps & { containerClass?: ClassValue };
