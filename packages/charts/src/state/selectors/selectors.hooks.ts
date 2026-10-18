import { useAppSelector, type Box } from '../hooks.svelte.js';
import { selectChartName } from './rootPropsSelectors.js';

export const useChartName = (): Box<string | undefined> => useAppSelector(selectChartName);
