<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Slider } from '@sveltery/ui/slider';
  import { ToggleGroup, ToggleGroupItem } from '@sveltery/ui/toggle-group';

  let position = $state([50]);
  const preset = $derived(position[0] <= 10 ? 'open' : position[0] >= 90 ? 'closed' : 'half');
</script>

<Card>
  <CardHeader>
    <CardTitle>Living Room</CardTitle>
    <CardDescription>Roller Shades</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-4">
    <div class="flex h-32 flex-col overflow-hidden rounded-lg border bg-muted">
      <div class="bg-muted-foreground transition-all duration-300" style:height={`${position[0]}%`}></div>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Open</span>
      <Slider
        bind:value={position}
        max={100}
        class="flex-1"
      />
      <span class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Close</span>
    </div>
  </CardContent>
  <CardFooter>
    <ToggleGroup
      value={[preset]}
      onValueChange={(value) => {
        const v = value[0];
        if (v === 'open') position = [0];
        if (v === 'half') position = [50];
        if (v === 'closed') position = [100];
      }}
      variant="outline"
      spacing={1}
      class="w-full"
    >
      <ToggleGroupItem value="open" class="flex-1">Open</ToggleGroupItem>
      <ToggleGroupItem value="half" class="flex-1">Half</ToggleGroupItem>
      <ToggleGroupItem value="closed" class="flex-1">Closed</ToggleGroupItem>
    </ToggleGroup>
  </CardFooter>
</Card>
