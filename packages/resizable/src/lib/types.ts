import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Layout } from './layout.js';
import type { SizeInput } from './units.js';

export type Orientation = 'horizontal' | 'vertical';

export interface ResizeTargetMinimumSize {
  coarse: number;
  fine: number;
}

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
  /** Defaults to a generated id. Also set as `data-testid`. */
  id?: string;
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
  /** Stops the group from setting the resize cursor on the page while a pointer hovers or drags a separator. */
  disableCursor?: boolean;
  /** The smallest width or height, in pixels, of the area a pointer can grab to resize. Defaults to 20 for coarse pointers and 10 for fine ones. */
  resizeTargetMinimumSize?: ResizeTargetMinimumSize;
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
  /** How far past `minSize` the panel must be dragged to collapse, or past `collapsedSize` to expand. Defaults to half the distance between them. */
  collapsedThreshold?: SizeInput;
  onResize?: (size: PanelSize, id: string, previous: PanelSize | undefined) => void;
  /** Styles the element inside the panel that holds its content, which also takes `class`. */
  style?: string | null;
  children?: Snippet;
}

export interface SeparatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  /** Defaults to a generated id. Also set as `data-testid`. */
  id?: string;
  disabled?: boolean;
  /** Stops a double click from resetting the panels beside the separator to their default size. */
  disableDoubleClick?: boolean;
  style?: string | null;
  children?: Snippet;
}
