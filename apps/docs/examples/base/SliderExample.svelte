<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Label } from '$registry/bases/base/ui/label';
  import { Slider } from '$registry/bases/base/ui/slider';

  let temperature = $state([0.3, 0.7]);
</script>

{#snippet SliderBasic()}
  <Example title="Basic">
    <Slider defaultValue={50} max={100} step={1} />
  </Example>
{/snippet}

{#snippet SliderRange()}
  <Example title="Range">
    <Slider defaultValue={[25, 50]} max={100} step={5} />
  </Example>
{/snippet}

{#snippet SliderMultiple()}
  <Example title="Multiple Thumbs">
    <Slider defaultValue={[10, 20, 70]} max={100} step={10} />
  </Example>
{/snippet}

{#snippet SliderVertical()}
  <Example title="Vertical">
    <div class="flex items-center gap-6">
      <Slider defaultValue={[50]} max={100} step={1} orientation="vertical" class="h-40" />
      <Slider defaultValue={[25]} max={100} step={1} orientation="vertical" class="h-40" />
    </div>
  </Example>
{/snippet}

{#snippet SliderControlled()}
  <Example title="Controlled">
    <div class="grid w-full gap-3">
      <div class="flex items-center justify-between gap-2">
        <Label for="slider-demo-temperature">Temperature</Label>
        <span class="text-sm text-muted-foreground">{temperature.join(', ')}</span>
      </div>
      <Slider id="slider-demo-temperature" bind:value={temperature} min={0} max={1} step={0.1} />
    </div>
  </Example>
{/snippet}

{#snippet SliderDisabled()}
  <Example title="Disabled">
    <Slider defaultValue={[50]} max={100} step={1} disabled />
  </Example>
{/snippet}

<ExampleWrapper>
  {@render SliderBasic()}
  {@render SliderRange()}
  {@render SliderMultiple()}
  {@render SliderVertical()}
  {@render SliderControlled()}
  {@render SliderDisabled()}
</ExampleWrapper>
