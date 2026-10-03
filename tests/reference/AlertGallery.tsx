// One selected immutable Basic function, genuine original helpers and a supplemental hydration marker. MIT: ./LICENSE.
import { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Example, ExampleWrapper } from './example-scaffold';
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
  return <ExampleWrapper className="lg:grid-cols-1" data-alert-gallery data-hydrated={hydrated}><AlertExample1 /></ExampleWrapper>;
}
