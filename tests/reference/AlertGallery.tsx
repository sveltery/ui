// Bounded source-derived scaffold; actual pinned Alert wrappers. MIT: ./LICENSE.
import { useEffect, useState, type ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from './alert';
function Example({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2>{title}</h2>{children}</section>;
}
function AlertExample1() {
  return (
    <Example title="Basic">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <AlertTitle>Success! Your changes have been saved.</AlertTitle>
        </Alert>
        <Alert>
          <AlertTitle>Success! Your changes have been saved.</AlertTitle>
          <AlertDescription>
            This is an alert with title and description.
          </AlertDescription>
        </Alert>
        <Alert>
          <AlertDescription>
            This one has a description only. No title. No icon.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}
export function AlertGallery() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return <section data-alert-gallery data-hydrated={hydrated} className="grid gap-6"><AlertExample1 /></section>;
}
