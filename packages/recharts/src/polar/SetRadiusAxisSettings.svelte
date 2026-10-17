<script lang="ts">
  import type { AxisDomainTypeInput, EvaluatedAxisDomainType } from '../util/types.js';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { useRegistration } from '../state/registration.svelte.js';
  import { addRadiusAxis, removeRadiusAxis, type RadiusAxisSettings } from '../state/polarAxisSlice.js';
  import { usePolarChartLayout } from '../context/chartLayoutContext.svelte.js';
  import { getAxisTypeBasedOnLayout } from '../util/getAxisTypeBasedOnLayout.js';

  let props: Omit<RadiusAxisSettings, 'type'> & { type: AxisDomainTypeInput } = $props();
  const dispatch = useAppDispatch();
  const layout = usePolarChartLayout();

  const settings: RadiusAxisSettings | undefined = $derived.by(() => {
    const { type: typeFromProps, ...rest } = props;
    const evaluatedType: EvaluatedAxisDomainType | undefined = getAxisTypeBasedOnLayout(layout.current, 'radiusAxis', typeFromProps);
    if (evaluatedType == null) {
      return undefined;
    }
    return { ...rest, type: evaluatedType };
  });

  // Upstream adds and removes in one effect, so a change removes the old settings and adds the new ones.
  useRegistration(() => settings, {
    add: (value) => dispatch(addRadiusAxis(value)),
    replace: (prev, next) => {
      dispatch(removeRadiusAxis(prev));
      dispatch(addRadiusAxis(next));
    },
    remove: (value) => dispatch(removeRadiusAxis(value)),
  });
</script>
