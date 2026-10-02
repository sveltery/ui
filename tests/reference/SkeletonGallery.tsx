// Paired harness executes unchanged selected functions from the actual pinned example.
import { useEffect, useState } from 'react';
import { Example, ExampleWrapper } from './example-scaffold';
import { Skeleton } from './skeleton';
import { SkeletonAvatar, SkeletonCard, SkeletonText, SkeletonForm, SkeletonTable } from './skeleton-selected-examples';
export function SkeletonGallery() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return <div data-hydrated={hydrated}>
    <ExampleWrapper data-gallery="">
      <Example title="Basic"><Skeleton className="h-4 w-40" /></Example>
      <SkeletonAvatar /><SkeletonCard /><SkeletonText /><SkeletonForm /><SkeletonTable />
      <Example title="Override"><Skeleton className="h-8 w-32 rounded-none bg-red-500 animate-none" data-slot="custom-skeleton" /></Example>
    </ExampleWrapper>
  </div>;
}
