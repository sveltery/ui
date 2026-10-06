// Paired selected-source harness; complete original bodies/helpers remain genuine.
import { useEffect, useState } from 'react';
import { ExampleWrapper } from './example-scaffold';
import { CardWithImage, CardWithImageSmall } from './card-image-selected-examples';
import { IconLibraryProvider } from './icons/search-params';
import type { IconLibraryName } from './icons/config';
export function CardImageGallery({ library = 'lucide' }: { library?: IconLibraryName }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return <div data-hydrated={hydrated}><IconLibraryProvider library={library}><ExampleWrapper><CardWithImage /><CardWithImageSmall /></ExampleWrapper></IconLibraryProvider></div>;
}
