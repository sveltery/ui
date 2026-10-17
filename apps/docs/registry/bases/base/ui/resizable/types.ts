import type { GroupProps, PanelProps, SeparatorProps } from '@sveltery/resizable';

export type ResizablePanelGroupProps = GroupProps;
export type ResizablePanelProps = PanelProps;
export type ResizableHandleProps = Omit<SeparatorProps, 'children'> & { withHandle?: boolean };
export type { GroupImperativeHandle, Layout, Orientation, PanelImperativeHandle, PanelSize } from '@sveltery/resizable';
