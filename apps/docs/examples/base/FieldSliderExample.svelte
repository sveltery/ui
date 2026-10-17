<script lang="ts">
  import { Field, FieldDescription, FieldTitle } from '$registry/bases/base/ui/field';
  import { Slider } from '$registry/bases/base/ui/slider';

  let value = $state([200, 800]);
</script>

<Field class="w-full max-w-xs">
  <FieldTitle>Price Range</FieldTitle>
  <FieldDescription>
    Set your budget range ($<span class="font-medium tabular-nums">{value[0]}</span> -
    <span class="font-medium tabular-nums">{value[1]}</span>).
  </FieldDescription>
  <Slider bind:value max={1000} min={0} step={10} class="mt-2 w-full" aria-label="Price Range" />
</Field>
