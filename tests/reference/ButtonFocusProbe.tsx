// Supplemental browser diagnostic using the immutable pinned wrapper; not an upstream test port.
import { useEffect, useState } from 'react';
import { Button } from './button';
export function ButtonFocusProbe({ custom = false }: { custom?: boolean }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return <main data-hydrated={hydrated}><Button id="tested-button" disabled focusableWhenDisabled nativeButton={!custom} render={custom ? <span /> : undefined}>Save</Button></main>;
}
