<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { AxisDomainTypeInput, EvaluatedAxisDomainType } from '../util/types.js';
  import { useAppDispatch, useAppSelector } from '../state/hooks.svelte.js';
  import { useRegistration } from '../state/registration.svelte.js';
  import { addAngleAxis, removeAngleAxis, type AngleAxisSettings } from '../state/polarAxisSlice.js';
  import { selectAngleAxis } from '../state/selectors/polarAxisSelectors.js';
  import { usePolarChartLayout } from '../context/chartLayoutContext.svelte.js';
  import { getAxisTypeBasedOnLayout } from '../util/getAxisTypeBasedOnLayout.js';

  let { children, ...props }: Omit<AngleAxisSettings, 'type'> & { type: AxisDomainTypeInput; children?: Snippet } = $props();
  const dispatch = useAppDispatch();
  const layout = usePolarChartLayout();

  const settings: AngleAxisSettings | undefined = $derived.by(() => {
    const { type: typeFromProps, ...rest } = props;
    const evaluatedType: EvaluatedAxisDomainType | undefined = getAxisTypeBasedOnLayout(layout.current, 'angleAxis', typeFromProps);
    if (evaluatedType == null) {
      return undefined;
    }
    return { ...rest, type: evaluatedType };
  });

  // Upstream adds and removes in one effect, so a change removes the old settings and adds the new ones.
  const registered = useRegistration(() => settings, {
    add: (value) => dispatch(addAngleAxis(value)),
    replace: (prev, next) => {
      dispatch(removeAngleAxis(prev));
      dispatch(addAngleAxis(next));
    },
    remove: (value) => dispatch(removeAngleAxis(value)),
  });
  const synchronizedSettings = useAppSelector((state) => selectAngleAxis(state, settings?.id));
  const settingsAreSynchronized = $derived(registered.current != null && registered.current === synchronizedSettings.current);
</script>

{#if settingsAreSynchronized}{@render children?.()}{/if}
