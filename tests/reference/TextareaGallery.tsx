// Supplemental harness uses the byte-exact pinned wrapper; it is not an upstream test port.
import { useEffect, useState } from 'react';
import { Textarea } from './textarea';
export function TextareaGallery() {
  const [hydrated, setHydrated] = useState(false);
  const [value, setValue] = useState('Initial');
  const [submitted, setSubmitted] = useState('');
  useEffect(() => { setHydrated(true); }, []);
  return <div data-hydrated={hydrated}>
    <section data-gallery className="grid gap-6">
      <section><h2>Basic</h2><Textarea data-testid="basic" placeholder="Type your message here." /></section>
      <section><h2>Invalid</h2><Textarea data-testid="invalid" placeholder="Type your message here." aria-invalid="true" /></section>
      <section><h2>With Label</h2><label htmlFor="textarea-demo-message">Message</label><Textarea data-testid="labelled" id="textarea-demo-message" placeholder="Type your message here." rows={6} /></section>
      <section><h2>With Description</h2><label htmlFor="textarea-demo-message-2">Message</label><Textarea data-testid="described" id="textarea-demo-message-2" placeholder="Type your message here." rows={6} /><p>Type your message and press enter to send.</p></section>
      <section><h2>Disabled</h2><label htmlFor="textarea-demo-disabled">Message</label><Textarea data-testid="disabled" id="textarea-demo-disabled" placeholder="Type your message here." disabled /></section>
      <Textarea data-testid="override" aria-label="Override" className="min-h-32 w-64 rounded-none px-6" style={{ resize: 'none' }} />
    </section>
    <form id="message-form" onSubmit={event => { event.preventDefault(); setSubmitted(JSON.stringify([...new FormData(event.currentTarget)])); }}>
      <label htmlFor="message">Message form</label><Textarea id="message" name="message" value={value} onChange={event => setValue(event.currentTarget.value)} aria-describedby="message-description" required minLength={2} maxLength={40} />
      <p id="message-description">Form description</p>
      <Textarea id="draft" name="draft" aria-label="Draft" defaultValue="Draft" />
      <Textarea name="ignored" aria-label="Ignored" value="Ignored" disabled />
      <button type="submit">Submit</button><button type="reset">Reset</button>
    </form>
    <Textarea id="external" form="message-form" name="external" aria-label="External" defaultValue="Outside" />
    <Textarea id="readonly" aria-label="Readonly" readOnly value="Read only" />
    <button onClick={() => setValue('Updated')}>Update value</button>
    <output data-testid="submitted">{submitted}</output>
  </div>;
}
