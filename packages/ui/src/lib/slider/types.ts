import type { SliderRootProps } from '@sveltery/base/slider';
export type SliderProps = Omit<SliderRootProps, 'children'>;
export type { SliderRootState as SliderState, SliderValue, SliderChangeEventDetails, SliderCommitEventDetails } from '@sveltery/base/slider';
