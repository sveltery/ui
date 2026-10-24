import type { ResizableGroupActions, ResizableGroupProps, ResizablePanelActions, ResizablePanelProps as PanelProps, ResizableSeparatorProps } from '@sveltery/base/resizable';

export type ResizablePanelGroupProps = ResizableGroupProps & { groupRef?: ResizableGroupActions | null };
export type ResizablePanelProps = PanelProps & { panelRef?: ResizablePanelActions | null };
export type ResizableHandleProps = Omit<ResizableSeparatorProps, 'children'> & { withHandle?: boolean };
