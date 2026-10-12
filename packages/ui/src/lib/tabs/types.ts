import type { ComponentProps } from 'svelte';
import type { Tabs as Primitive } from '@sveltery/base/tabs';
import type { TabsListVariants } from './variants.js';
export type TabsListProps = ComponentProps<typeof Primitive.List> & TabsListVariants;
