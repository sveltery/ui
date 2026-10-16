import type { GroupProps, PanelProps, SeparatorProps } from '@sveltery/resizable';

export type ResizablePanelGroupProps = GroupProps;
export type ResizablePanelProps = PanelProps;
export type ResizableHandleProps = Omit<SeparatorProps, 'children'> & { withHandle?: boolean };
export type { Layout, LayoutChangeDetails, Orientation, PanelSize, SizeInput } from '@sveltery/resizable';
