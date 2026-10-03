import { useEffect, useState } from 'react';
import OriginalGallery from './avatar-selected-examples';
import { IconLibraryProvider } from './icons/search-params';
import type { IconLibraryName } from './icons/config';
export function AvatarGallery({ library = 'lucide' }: { library?: IconLibraryName }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return <div data-hydrated={hydrated}><IconLibraryProvider library={library}><OriginalGallery /></IconLibraryProvider></div>;
}
