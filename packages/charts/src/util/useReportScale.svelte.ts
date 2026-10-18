import { useAppDispatch, useAppSelector } from '../state/hooks.svelte.js';
import { selectContainerScale } from '../state/selectors/containerSelectors.js';
import { setScale } from '../state/layoutSlice.js';
import { isWellBehavedNumber } from './isWellBehavedNumber.js';

/** Must be called during component initialisation. Returns the setter to call with the wrapper element. */
export function useReportScale(): (node: HTMLElement | null) => void {
  const dispatch = useAppDispatch();
  let ref = $state<HTMLElement | null>(null);
  const scale = useAppSelector(selectContainerScale);
  $effect(() => {
    if (ref == null) return;
    const rect = ref.getBoundingClientRect();
    const newScale = rect.width / ref.offsetWidth;
    if (isWellBehavedNumber(newScale) && newScale !== scale.current) {
      dispatch(setScale(newScale));
    }
  });
  return (node) => {
    ref = node;
  };
}
