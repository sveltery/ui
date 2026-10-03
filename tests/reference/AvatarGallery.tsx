import { useEffect, useState } from 'react';
import OriginalGallery from './avatar-selected-examples';
export function AvatarGallery() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return <div data-hydrated={hydrated}><OriginalGallery /></div>;
}
