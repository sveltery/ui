// Truthfully selected four-body composition; the complete six-body original remains empty-example.tsx.
import { ExampleWrapper } from './example-scaffold';
import { IconLibraryProvider } from './icons/search-params';
import type { IconLibraryName } from './icons/config';
import { EmptyBasic, EmptyWithMutedBackground, EmptyWithIcon, EmptyInCard } from './empty-selected-examples';
export function SelectedEmptyGallery({ library = 'lucide' }: { library?: IconLibraryName }) {
  return <IconLibraryProvider library={library}><ExampleWrapper><EmptyBasic /><EmptyWithMutedBackground /><EmptyWithIcon /><EmptyInCard /></ExampleWrapper></IconLibraryProvider>;
}
