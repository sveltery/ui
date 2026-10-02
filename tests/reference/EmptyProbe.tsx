// Supplemental native primitive witnesses; no upstream Empty example compositions are ported.
import { useEffect, useState } from 'react';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from './empty';
const parts = [Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia];
export function EmptyProbe() {
  const [hydrated, setHydrated] = useState(false);
  const [changed, setChanged] = useState(false);
  const [shown, setShown] = useState(true);
  const [clicks, setClicks] = useState(0);
  useEffect(() => setHydrated(true), []);
  return <main data-empty-probe data-hydrated={hydrated} className="p-8">
    <h1>Supplemental Empty primitive probe</h1>
    <section data-testid="hosts" className="flex flex-col gap-4">
      {shown && parts.map((Part, index) => <Part key={index} id={`probe-empty-${index}`} data-empty-host="" data-slot={changed ? `override-${index}` : undefined} data-custom={changed ? 'updated' : 'initial'} title={changed ? 'Updated & <Empty>' : 'Initial & <Empty>'} className={changed ? 'gap-4 text-lg' : undefined} style={{ color: changed ? 'rgb(60, 70, 80)' : 'rgb(30, 40, 50)' }} {...index === 5 ? { variant: changed ? 'icon' as const : 'default' as const } : {}} onClick={() => setClicks(clicks + 1)}>{changed ? 'Updated' : 'Initial'} {index}{index === 3 && <><a href="#probe-target" data-testid="direct-link">Direct link</a><span><a href="#probe-target" data-testid="nested-link">Nested link</a></span></>}{index === 5 && <svg aria-hidden="true" viewBox="0 0 16 16" data-testid="reactive-svg"><path d="M1 1h14v14H1z" /></svg>}</Part>)}
    </section>
    <section data-testid="media-selectors" className="flex items-start gap-4">
      <EmptyMedia data-testid="media-default"><svg aria-hidden="true" viewBox="0 0 16 16" width="24" height="24"><path d="M1 1h14v14H1z" /></svg></EmptyMedia>
      <EmptyMedia variant="icon" data-testid="media-icon"><svg aria-hidden="true" viewBox="0 0 16 16"><path d="M1 1h14v14H1z" /></svg></EmptyMedia>
      <EmptyMedia variant="icon" data-testid="media-sized"><svg className="size-6" aria-hidden="true" viewBox="0 0 16 16"><path d="M1 1h14v14H1z" /></svg></EmptyMedia>
      <EmptyMedia variant="icon" data-testid="media-size-substring"><svg className="custom-size-witness" width="28" height="28" aria-hidden="true" viewBox="0 0 16 16"><path d="M1 1h14v14H1z" /></svg></EmptyMedia>
      <EmptyMedia variant={null} data-testid="media-null"><svg aria-hidden="true" viewBox="0 0 16 16" width="24" height="24"><path d="M1 1h14v14H1z" /></svg></EmptyMedia>
    </section>
    <button type="button" onClick={() => setChanged(!changed)}>Update Empty</button>
    <button type="button" onClick={() => setShown(!shown)}>{shown ? 'Remove Empty' : 'Restore Empty'}</button>
    <output data-testid="probe-state">{JSON.stringify({ changed, clicks })}</output>
    <span id="probe-target">Link target</span>
  </main>;
}
