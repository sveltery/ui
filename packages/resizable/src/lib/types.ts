import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Layout } from './layout.js';
import type { SizeInput } from './units.js';

export type Orientation = 'horizontal' | 'vertical';

export interface PanelSize {
  /** Percent of the space the panels share. */
  asPercentage: number;
  inPixels: number;
}

export interface LayoutChangeDetails {
  /** True when a pointer drag or a key press caused the change. */
  isUserInteraction: boolean;
}

export interface GroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  orientation?: Orientation;
  /** Sizes to start from, keyed by panel id. Panels the layout does not name use their `defaultSize`. */
  defaultLayout?: Layout;
  /** The current sizes keyed by panel id. Bind it to read and set the layout. */
  layout?: Layout;
  /** Called for every change, including each step of a drag. */
  onLayoutChange?: (layout: Layout) => void;
  /** Called once a change settles, which is when a drag ends. */
  onLayoutChanged?: (layout: Layout, details: LayoutChangeDetails) => void;
  disabled?: boolean;
  style?: string | null;
  children?: Snippet;
}

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  /** Names the panel in the layout. Defaults to a generated id. */
  id?: string;
  defaultSize?: SizeInput;
  minSize?: SizeInput;
  maxSize?: SizeInput;
  collapsible?: boolean;
  collapsedSize?: SizeInput;
  onResize?: (size: PanelSize, id: string, previous: PanelSize | undefined) => void;
  style?: string | null;
  children?: Snippet;
}

export interface SeparatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  disabled?: boolean;
  style?: string | null;
  children?: Snippet;
}
