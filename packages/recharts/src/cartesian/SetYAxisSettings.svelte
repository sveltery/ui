<script lang="ts">
  import type { AxisDomainTypeInput, EvaluatedAxisDomainType } from '../util/types.js';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { useRegistration } from '../state/registration.svelte.js';
  import { addYAxis, removeYAxis, replaceYAxis, type YAxisSettings } from '../state/cartesianAxisSlice.js';
  import { useCartesianChartLayout } from '../context/chartLayoutContext.svelte.js';
  import { getAxisTypeBasedOnLayout } from '../util/getAxisTypeBasedOnLayout.js';

  let props: Omit<YAxisSettings, 'type'> & { type: AxisDomainTypeInput } = $props();
  const dispatch = useAppDispatch();
  const layout = useCartesianChartLayout();

  const settings: YAxisSettings | undefined = $derived.by(() => {
    const { type: typeFromProps, ...restProps } = props;
    const evaluatedType: EvaluatedAxisDomainType | undefined = getAxisTypeBasedOnLayout(layout.current, 'yAxis', typeFromProps);
    if (evaluatedType == null) {
      return undefined;
    }
    return { ...restProps, type: evaluatedType };
  });

  useRegistration(() => settings, {
    add: (value) => dispatch(addYAxis(value)),
    replace: (prev, next) => dispatch(replaceYAxis({ prev, next })),
    remove: (value) => dispatch(removeYAxis(value)),
  });
</script>
