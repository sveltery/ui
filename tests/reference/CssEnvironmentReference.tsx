// Supplemental original-CSS diagnostic; unchanged genuine React Separator body.
import { useEffect, useState } from 'react';
import { Separator } from './shadcn-css-upstream/separator';
import { stateClasses, stateWitnesses } from './css-state-witnesses';
export function CssEnvironmentReference() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return <main data-css-environment data-hydrated={hydrated}>
    <h1>Genuine shadcn support CSS environment</h1>
    <div style={{ display: 'flex', flexDirection: 'column', width: 240, height: 60 }}><Separator data-testid="css-horizontal" /></div>
    <div style={{ display: 'flex', flexDirection: 'row', width: 240, height: 60 }}><Separator orientation="vertical" data-testid="css-vertical" /></div>
    {stateWitnesses.map(witness => <span key={witness.id} className={stateClasses} data-testid={witness.id} {...witness.attrs} />)}
  </main>;
}
