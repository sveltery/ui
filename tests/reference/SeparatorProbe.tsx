// Supplemental source-derived witnesses execute the actual immutable wrapper.
import { useEffect, useState } from 'react';
import { Separator } from './separator';
export function SeparatorProbe() {
 const [hydrated, setHydrated] = useState(false);
 const [vertical, setVertical] = useState(false);
 const [show, setShow] = useState(true);
 const [clicks, setClicks] = useState(0);
 useEffect(() => setHydrated(true), []);
 return <main data-separator-probe data-hydrated={hydrated} className="p-8">
  <section className="flex flex-col gap-4 w-60 h-12" data-testid="horizontal-container"><Separator data-testid="default-horizontal" /><Separator data-testid="explicit-horizontal" data-vertical="" /></section>
  <section className="flex items-center gap-4 w-60 h-12" data-testid="vertical-container"><Separator data-testid="default-vertical" orientation="vertical" /><Separator data-testid="explicit-vertical" orientation="vertical" data-horizontal="" /></section>
  <Separator data-testid="callback" className={() => 'ignored-class'} />
  <Separator data-testid="custom" render={(props, state) => <div data-testid="replacement-wrap"><span {...props} data-state-orientation={state.orientation} /></div>} orientation="vertical">Replacement &amp; child</Separator>
  {show && <Separator data-testid="reactive" orientation={vertical ? 'vertical' : 'horizontal'} className={vertical ? 'w-6 bg-red-500' : undefined} style={state => state.orientation === 'vertical' ? { height: '32px', color: 'rgb(60, 70, 80)' } : { height: '32px', color: 'rgb(30, 40, 50)' }} data-slot={vertical ? 'caller-slot' : 'separator'} onClick={() => setClicks(value => value + 1)}>Reactive child</Separator>}
  <button onClick={() => setVertical(value => !value)}>Change orientation</button>
  <button onClick={() => setShow(value => !value)}>{show ? 'Remove separator' : 'Restore separator'}</button>
  <output data-testid="reference-clicks">{clicks}</output>
 </main>;
}
