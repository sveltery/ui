<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Label } from '$registry/bases/base/ui/label';
  import { NativeSlider } from '$registry/bases/base/ui/native-slider';

  let temperature = $state(0.3);
</script>

{#snippet NativeSliderBasic()}
  <Example title="Basic">
    <NativeSlider aria-label="Volume" defaultValue={50} max={100} step={1} />
  </Example>
{/snippet}

{#snippet NativeSliderControlled()}
  <Example title="Controlled">
    <div class="grid w-full gap-3">
      <div class="flex items-center justify-between gap-2">
        <Label for="native-slider-temperature">Temperature</Label>
        <output for="native-slider-temperature" class="text-sm text-muted-foreground">{temperature}</output>
      </div>
      <NativeSlider id="native-slider-temperature" value={temperature} oninput={(event) => (temperature = event.currentTarget.valueAsNumber)} min={0} max={1} step={0.1} />
    </div>
  </Example>
{/snippet}

{#snippet NativeSliderDisabled()}
  <Example title="Disabled">
    <NativeSlider aria-label="Volume" defaultValue={50} max={100} step={1} disabled />
  </Example>
{/snippet}

<ExampleWrapper>
  {@render NativeSliderBasic()}
  {@render NativeSliderControlled()}
  {@render NativeSliderDisabled()}
</ExampleWrapper>
