// Diagnostic probe for the genuine pinned IconPlaceholder, with a resolved configuration provider.
import * as React from 'react';
import { IconPlaceholder } from './icon';
import { IconLibraryProvider } from './icons/search-params';
import type { IconLibraryName } from './icons/config';
const original = { lucide: 'ArrowLeftIcon', tabler: 'IconArrowLeft', hugeicons: 'ArrowLeft01Icon', phosphor: 'ArrowLeftIcon', remixicon: 'RiArrowLeftLine' };
export function IconsProbe() {
  const [library, select] = React.useState<IconLibraryName>('lucide');
  const [names, setNames] = React.useState(original);
  return <div data-icons-hydrated="true"><IconLibraryProvider library={library}><IconPlaceholder {...names} data-testid="selected-icon" strokeWidth={7} /></IconLibraryProvider><div>
    {(['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const).map(next => <button key={next} onClick={() => select(next)}>{next}</button>)}
    <button onClick={() => setNames(Object.fromEntries(Object.keys(original).map(key => [key, 'UnknownExport'])) as typeof names)}>Unknown</button>
    <button onClick={() => setNames(Object.fromEntries(Object.keys(original).map(key => [key, ''])) as typeof names)}>Absent</button>
    <button onClick={() => setNames(original)}>Restore</button>
    <button onClick={() => setNames(previous => ({ ...previous, lucide: 'ArrowRightIcon' }))}>Change name</button>
  </div></div>;
}
