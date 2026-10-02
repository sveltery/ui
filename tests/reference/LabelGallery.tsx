// Bounded source-derived scaffold; actual pinned Label/Textarea wrappers. MIT: ./LICENSE.
import { useEffect, useState, type ReactNode } from 'react';
import { Label } from './label';
import { Textarea } from './textarea';

function Example({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2>{title}</h2>{children}</section>;
}
function Field({ children }: { children: ReactNode }) { return <div>{children}</div>; }

function LabelWithTextarea() {
  return (
    <Example title="With Textarea">
      <Field>
        <Label htmlFor="label-demo-message">Message</Label>
        <Textarea id="label-demo-message" placeholder="Message" />
      </Field>
    </Example>
  )
}

export function LabelGallery() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return <section data-label-gallery data-hydrated={hydrated} className="grid gap-6"><LabelWithTextarea /></section>;
}
