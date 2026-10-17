<script lang="ts">
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { RadioGroup, RadioGroupItem } from '$registry/bases/base/ui/radio-group';
  import { Slider } from '$registry/bases/base/ui/slider';
  import { Switch } from '$registry/bases/base/ui/switch';
</script>
<div class="flex flex-col gap-6 p-6">
  <div class="flex gap-4">
    <RadioGroup defaultValue="email" aria-label="Enabled contact" class="w-auto">
      <RadioGroupItem value="email" aria-label="Email" />
    </RadioGroup>
    <RadioGroup defaultValue="phone" aria-label="Disabled contact" class="w-auto">
      <RadioGroupItem value="phone" aria-label="Phone" disabled />
    </RadioGroup>
  </div>
  <div class="flex gap-4">
    <Checkbox aria-label="Enabled checkbox" defaultChecked />
    <Checkbox aria-label="Disabled checkbox" defaultChecked disabled />
  </div>
  <div class="flex gap-4">
    <Switch aria-label="Enabled switch" defaultChecked />
    <Switch aria-label="Disabled switch" defaultChecked disabled />
  </div>
  <div data-testid="enabled-slider"><Slider defaultValue={50} aria-label="Enabled slider" /></div>
  <div data-testid="disabled-slider"><Slider defaultValue={50} aria-label="Disabled slider" disabled /></div>
</div>
