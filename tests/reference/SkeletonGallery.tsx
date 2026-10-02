// Paired harness executes unchanged selected functions from the actual pinned example.
import { useEffect, useState } from 'react';
import { Skeleton } from './skeleton';
import { SkeletonAvatar, SkeletonCard, SkeletonText, SkeletonForm, SkeletonTable } from './skeleton-selected-examples';
export function SkeletonGallery() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return <div data-hydrated={hydrated}>
    <section data-gallery="" className="grid gap-6">
      <section><h2>Basic</h2><Skeleton className="h-4 w-40" /></section>
      <SkeletonAvatar /><SkeletonCard /><SkeletonText /><SkeletonForm /><SkeletonTable />
      <section><h2>Override</h2><Skeleton className="h-8 w-32 rounded-none bg-red-500 animate-none" data-slot="custom-skeleton" /></section>
    </section>
  </div>;
}
