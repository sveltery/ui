// Supplemental source-derived witnesses executing pinned wrappers; SVG/buttons are not ports of missing compositions.
import { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription, AlertAction } from './alert';
export function AlertProbe() {
  const [hydrated, setHydrated] = useState(false);
  const [changed, setChanged] = useState(false);
  const [show, setShow] = useState(true);
  const [clicks, setClicks] = useState(0);
  useEffect(() => setHydrated(true), []);
  return <main data-alert-probe data-hydrated={hydrated} className="p-8">
    <h1>Native Alert acceptance probe</h1>
    <button type="button">Before alert</button>
    <section data-testid="composition">
      {show && <Alert id="probe-alert" variant={changed ? 'destructive' : 'default'} role={changed ? 'status' : 'alert'} className={changed ? 'rounded-none text-lg' : undefined} title={changed ? 'Updated & <alert>' : 'Initial & <alert>'} data-custom={changed ? 'updated' : 'initial'}>
        <AlertTitle id="probe-title">{changed ? 'Updated title' : 'Initial title'} <a href="#details">Details</a></AlertTitle>
        <AlertDescription id="probe-description"><p>First description paragraph.</p><p>{changed ? 'Updated message' : 'Initial message'} <a href="#help">Help</a></p></AlertDescription>
        <AlertAction id="probe-action" onClick={() => setClicks(clicks + 1)}><button type="button">Undo</button></AlertAction>
      </Alert>}
    </section>
    <button type="button">After alert</button>
    <section data-testid="selectors" className="grid gap-4">
      <Alert data-testid="plain"><AlertTitle>Plain title</AlertTitle><AlertDescription>Plain description</AlertDescription></Alert>
      <Alert data-testid="direct-svg"><svg aria-hidden="true" viewBox="0 0 16 16"><path d="M2 8h12" /></svg><AlertTitle>Direct SVG title</AlertTitle><AlertDescription>Direct SVG description</AlertDescription></Alert>
      <Alert data-testid="sized-svg"><svg className="size-6" aria-hidden="true" viewBox="0 0 16 16"><path d="M2 8h12" /></svg><AlertTitle>Sized SVG title</AlertTitle></Alert>
      <Alert data-testid="nested-svg"><span><svg aria-hidden="true" viewBox="0 0 16 16"><path d="M2 8h12" /></svg></span><AlertTitle>Nested SVG title</AlertTitle></Alert>
      <Alert variant="destructive" data-testid="destructive"><AlertTitle>Destructive title</AlertTitle><AlertDescription>Destructive description</AlertDescription></Alert>
      <Alert variant={null} data-testid="null-variant"><AlertTitle>Null variant</AlertTitle><AlertDescription>Null description</AlertDescription></Alert>
      <Alert data-testid="nested-action"><div><AlertAction>Nested action</AlertAction></div><AlertTitle>Nested action title</AlertTitle></Alert>
      <Alert data-testid="overridden-slots"><AlertTitle data-slot="consumer-title">Overridden title</AlertTitle><AlertDescription data-slot="consumer-description">Overridden description</AlertDescription><AlertAction data-slot="consumer-action">Overridden action</AlertAction></Alert>
      <Alert variant="destructive" data-testid="destructive-nested"><div><AlertDescription>Nested destructive description</AlertDescription></div><AlertDescription data-slot="consumer-description">Overridden destructive description</AlertDescription></Alert>
      <Alert data-testid="long-text"><AlertTitle>This is a long supplemental native title that wraps across multiple lines while preserving the pinned classes and width.</AlertTitle><AlertDescription>This is a long supplemental native description for comparing wrapping and spacing at desktop and mobile viewport widths.</AlertDescription></Alert>
    </section>
    <button type="button" onClick={() => setChanged(!changed)}>Update alert</button>
    <button type="button" onClick={() => setShow(!show)}>{show ? 'Remove alert' : 'Restore alert'}</button>
    <output data-testid="probe-state">{JSON.stringify({ changed, clicks })}</output>
  </main>;
}
