<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import LiveWaveform from './live-waveform-canvas.svelte';

  let active = $state(false);
  let processing = $state(true);
  let mode = $state<'static' | 'scrolling'>('static');

  function handleToggleActive() {
    active = !active;
    if (active) processing = false;
  }

  function handleToggleProcessing() {
    processing = !processing;
    if (processing) active = false;
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>Live Audio Waveform</CardTitle>
    <CardDescription>Real-time microphone input visualization with audio reactivity</CardDescription>
  </CardHeader>
  <CardContent>
    <LiveWaveform {active} {processing} height={80} barWidth={3} barGap={2} {mode} fadeEdges={true} barColor="gray" historySize={120} />
  </CardContent>
  <CardFooter class="gap-2">
    <Button size="sm" variant={active ? 'default' : 'outline'} onclick={handleToggleActive}>
      {active ? 'Stop' : 'Start'} Listening
    </Button>
    <Button size="sm" variant={processing ? 'default' : 'outline'} onclick={handleToggleProcessing}>
      {processing ? 'Stop' : 'Start'} Processing
    </Button>
    <Button size="sm" variant="outline" onclick={() => (mode = mode === 'static' ? 'scrolling' : 'static')}>
      {mode === 'static' ? 'Static' : 'Scrolling'}
    </Button>
  </CardFooter>
</Card>
