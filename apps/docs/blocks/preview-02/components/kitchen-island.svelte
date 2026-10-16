<script lang="ts">
  import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';
  import { Slider } from '$registry/bases/base/ui/slider';
  import { Switch } from '$registry/bases/base/ui/switch';
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const SCENES = {
    cooking: { brightness: [90], colorTemp: [70], volume: [30], fade: [0] },
    dining: { brightness: [50], colorTemp: [40], volume: [20], fade: [60] },
    nightlight: { brightness: [15], colorTemp: [20], volume: [0], fade: [80] },
    focus: { brightness: [100], colorTemp: [85], volume: [0], fade: [0] }
  } as const;
  let enabled = $state(true);
  let scene = $state('cooking');
  let brightness = $state([90]);
  let colorTemp = $state([70]);
  let volume = $state([30]);
  let fade = $state([0]);

  function handleSceneChange(value: string) {
    if (!value) return;
    scene = value;
    const preset = SCENES[value as keyof typeof SCENES];
    brightness = [...preset.brightness];
    colorTemp = [...preset.colorTemp];
    volume = [...preset.volume];
    fade = [...preset.fade];
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>Kitchen Island</CardTitle>
    <CardDescription>Hue Color Ambient</CardDescription>
    <CardAction>
      <Switch bind:checked={enabled} />
    </CardAction>
  </CardHeader>
  <CardContent class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <span class="sr-only">Scenes</span>
      <ToggleGroup
        value={[scene]}
        onValueChange={(value) => handleSceneChange(value[0] ?? "cooking")}
        variant="outline"
        spacing={1}
        class="flex-wrap"
      >
        <ToggleGroupItem value="cooking" disabled={!enabled}>Cooking</ToggleGroupItem>
        <ToggleGroupItem value="dining" disabled={!enabled}>Dining</ToggleGroupItem>
        <ToggleGroupItem value="nightlight" disabled={!enabled}>Nightlight</ToggleGroupItem>
        <ToggleGroupItem value="focus" disabled={!enabled}>Focus</ToggleGroupItem>
      </ToggleGroup>
    </div>
    <ItemGroup>
      <Item size="sm" variant="outline">
        <ItemMedia variant="icon">
          <IconPlaceholder lucide="SunIcon" tabler="IconSun" hugeicons="Sun03Icon" phosphor="SunIcon" remixicon="RiSunLine" />
        </ItemMedia>
        <ItemContent class="flex-row items-center gap-3">
          <ItemTitle class="shrink-0">Brightness</ItemTitle>
        </ItemContent>
        <ItemActions class="flex-1">
          <Slider
            bind:value={brightness}
            max={100}
            disabled={!enabled}
            class="w-full"
          />
        </ItemActions>
      </Item>
      <Item size="sm" variant="outline">
        <ItemMedia variant="icon">
          <IconPlaceholder lucide="ThermometerIcon" tabler="IconThermometer" hugeicons="ThermometerWarmIcon" phosphor="ThermometerIcon" remixicon="RiThermometerLine" />
        </ItemMedia>
        <ItemContent class="flex-row items-center gap-3">
          <ItemTitle class="shrink-0">Color Temp</ItemTitle>
        </ItemContent>
        <ItemActions class="flex-1">
          <Slider
            bind:value={colorTemp}
            max={100}
            disabled={!enabled}
          />
        </ItemActions>
      </Item>
      <Item size="sm" variant="outline">
        <ItemMedia variant="icon">
          <IconPlaceholder lucide="Volume2Icon" tabler="IconVolume" hugeicons="VolumeHighIcon" phosphor="SpeakerHighIcon" remixicon="RiVolumeUpLine" />
        </ItemMedia>
        <ItemContent class="flex-row items-center gap-3">
          <ItemTitle class="shrink-0">Volume</ItemTitle>
        </ItemContent>
        <ItemActions class="flex-1">
          <Slider
            bind:value={volume}
            max={100}
            disabled={!enabled}
          />
        </ItemActions>
      </Item>
      <Item size="sm" variant="outline">
        <ItemMedia variant="icon">
          <IconPlaceholder lucide="TimerIcon" tabler="IconClock" hugeicons="Clock03Icon" phosphor="TimerIcon" remixicon="RiTimerLine" />
        </ItemMedia>
        <ItemContent class="flex-row items-center gap-3">
          <ItemTitle class="shrink-0">Fade</ItemTitle>
        </ItemContent>
        <ItemActions class="flex-1">
          <Slider
            bind:value={fade}
            max={100}
            disabled={!enabled}
          />
        </ItemActions>
      </Item>
    </ItemGroup>
  </CardContent>
</Card>
