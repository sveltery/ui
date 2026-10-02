// Source-derived native witnesses executing the byte-exact pinned Label; not an upstream test port.
import { useEffect, useState } from 'react';
import { Label } from './label';
export function LabelProbe() {
  const [hydrated, setHydrated] = useState(false);
  const [changed, setChanged] = useState(false);
  const [show, setShow] = useState(true);
  const [clicks, setClicks] = useState(0);
  useEffect(() => setHydrated(true), []);
  return <main data-label-probe data-hydrated={hydrated} className="p-8">
    <h1>Native Label acceptance probe</h1>
    <section data-testid="association">
      {show && <Label id="probe-label" htmlFor={changed ? 'probe-second' : 'probe-first'} data-slot={changed ? 'label-override' : 'label'} data-custom={changed ? 'updated' : 'initial'} aria-disabled={changed ? 'true' : undefined} className={changed ? 'gap-4 text-lg' : undefined} style={{ color: changed ? 'rgb(60, 70, 80)' : 'rgb(30, 40, 50)' }} onClick={() => setClicks(clicks + 1)}>{changed ? 'Updated name' : 'Account name'}<span data-testid="label-child">optional</span></Label>}
      <input id="probe-first" type="text" />
      <input id="probe-second" type="text" />
    </section>
    <section data-testid="selectors">
      <div className="group" data-disabled="true"><Label data-testid="group-true">Group true</Label></div>
      <div className="group" data-disabled="false"><Label data-testid="group-false">Group false</Label></div>
      <div className="group" data-disabled=""><Label data-testid="group-empty">Group empty</Label></div>
      <div className="group"><Label data-testid="group-missing">Group missing</Label></div>
      <div data-disabled="true"><Label data-testid="no-group">No group class</Label></div>
      <div><input type="text" className="peer" disabled aria-label="Disabled peer" /><Label data-testid="peer-disabled">Disabled peer</Label></div>
      <div><input type="text" className="peer" aria-label="Enabled peer" /><Label data-testid="peer-enabled">Enabled peer</Label></div>
      <div><input type="text" disabled aria-label="No peer class" /><Label data-testid="no-peer">No peer class</Label></div>
      <div><Label data-testid="peer-after">Peer follows label</Label><input type="text" className="peer" disabled aria-label="Following peer" /></div>
      <div><input type="text" className="peer" data-disabled="" aria-label="Data disabled peer" /><Label className="cn-label-aria" data-testid="aria-data-empty">Data disabled aria label</Label><Label data-testid="plain-data-empty">Data disabled plain label</Label></div>
      <div><input type="text" className="peer" data-disabled="false" aria-label="False data disabled peer" /><Label className="cn-label-aria" data-testid="aria-data-false">False data disabled aria label</Label></div>
      <div><input type="text" className="peer" aria-disabled="true" aria-label="Aria disabled peer" /><Label className="cn-label-aria" data-testid="aria-only">Aria attribute only</Label></div>
      <div><input type="text" className="peer" aria-label="Missing data disabled peer" /><Label className="cn-label-aria" data-testid="aria-missing">Missing data disabled</Label></div>
    </section>
    <button type="button" onClick={() => setChanged(!changed)}>Update label</button>
    <button type="button" onClick={() => setShow(!show)}>{show ? 'Remove label' : 'Restore label'}</button>
    <output data-testid="probe-state">{JSON.stringify({ changed, clicks })}</output>
  </main>;
}
