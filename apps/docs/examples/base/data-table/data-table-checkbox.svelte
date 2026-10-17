<script lang="ts">
  import { Checkbox } from '$registry/bases/base/ui/checkbox';

  let {
    checked,
    indeterminate = false,
    onCheckedChange,
    'aria-label': ariaLabel
  }: {
    checked: boolean;
    indeterminate?: boolean;
    onCheckedChange: (value: boolean) => void;
    'aria-label': string;
  } = $props();
</script>

<Checkbox bind:checked={() => checked, onCheckedChange} {indeterminate} aria-label={ariaLabel} />
