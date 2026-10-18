<script lang="ts">
  import type { AxisDomainTypeInput, EvaluatedAxisDomainType } from '../util/types.js';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { useRegistration } from '../state/registration.svelte.js';
  import { addXAxis, removeXAxis, replaceXAxis, type XAxisSettings } from '../state/cartesianAxisSlice.js';
  import { useCartesianChartLayout } from '../context/chartLayoutContext.svelte.js';
  import { getAxisTypeBasedOnLayout } from '../util/getAxisTypeBasedOnLayout.js';

  let props: Omit<XAxisSettings, 'type'> & { type: AxisDomainTypeInput } = $props();
  const dispatch = useAppDispatch();
  const layout = useCartesianChartLayout();

  const settings: XAxisSettings | undefined = $derived.by(() => {
    const { type: typeFromProps, ...restProps } = props;
    const evaluatedType: EvaluatedAxisDomainType | undefined = getAxisTypeBasedOnLayout(layout.current, 'xAxis', typeFromProps);
    if (evaluatedType == null) {
      return undefined;
    }
    return { ...restProps, type: evaluatedType };
  });

  useRegistration(() => settings, {
    add: (value) => dispatch(addXAxis(value)),
    replace: (prev, next) => dispatch(replaceXAxis({ prev, next })),
    remove: (value) => dispatch(removeXAxis(value)),
  });
</script>
