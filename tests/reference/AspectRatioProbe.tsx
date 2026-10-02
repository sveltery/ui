// Bounded source-derived probes executing the immutable wrapper, not upstream tests.
import { useEffect, useState } from 'react';
import { AspectRatio } from './aspect-ratio';
export function AspectRatioProbe() {
  const [hydrated, setHydrated] = useState(false);
  const [changed, setChanged] = useState(false);
  const [shown, setShown] = useState(true);
  const [clicks, setClicks] = useState(0);
  const [styleMode, setStyleMode] = useState(0);
  const callerStyle = styleMode === 0 ? {} : styleMode === 1 ? { style: { color: 'red' } } : { style: { '--ratio': 3 } as React.CSSProperties };
  const examples = [{ id: '16x9', ratio: 16 / 9 }, { id: '21x9', ratio: 21 / 9 }, { id: '1x1', ratio: 1 }, { id: '9x16', ratio: 9 / 16 }];
  useEffect(() => setHydrated(true), []);
  return <main data-aspect-ratio-probe data-hydrated={hydrated} className="p-8">
    <section className="grid max-w-4xl gap-4">
      {examples.map(example => <AspectRatio key={example.id} data-testid={example.id} ratio={example.ratio} className="rounded-lg bg-muted" />)}
      <AspectRatio data-testid="custom-style" ratio={2} style={{ '--ratio': 3 } as React.CSSProperties} />
      <AspectRatio data-testid="unrelated-style" ratio={2} style={{ color: 'red' }} />
      <AspectRatio data-testid="undefined-style" ratio={2} style={undefined} />
      <AspectRatio data-testid="empty-style" ratio={2} style={{}} />
      <AspectRatio data-testid="inline-ratio" ratio={2} style={{ aspectRatio: '4 / 3' }} />
      <AspectRatio data-testid="class-override" ratio={2} className="static aspect-square" />
      <AspectRatio data-testid="responsive" ratio={2} className="aspect-square sm:aspect-video" />
      <AspectRatio data-testid="dynamic-style" ratio={2} {...callerStyle} />
      {shown && <AspectRatio id="probe-ratio" data-testid="lifecycle" data-custom={changed ? 'updated' : 'initial'} data-slot={changed ? 'consumer-ratio' : 'aspect-ratio'} ratio={changed ? 1 : 16 / 9} className={changed ? 'rounded-none' : 'rounded-lg'} onClick={() => setClicks(clicks + 1)}>{changed ? 'Updated' : 'Initial'}<span>Child</span></AspectRatio>}
    </section>
    <button onClick={() => setChanged(!changed)}>Update ratio</button>
    <button onClick={() => setShown(!shown)}>{shown ? 'Remove ratio' : 'Restore ratio'}</button>
    <button onClick={() => setStyleMode((styleMode + 1) % 3)}>Cycle caller style</button>
    <output data-testid="ratio-state">{JSON.stringify({ changed, clicks })}</output>
  </main>;
}
