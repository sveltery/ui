// Imports/exports adapted; both complete declarations are otherwise immutable original source.
import { Example } from './example-scaffold';
import { Textarea } from './textarea';

function TextareaBasic() {
  return (
    <Example title="Basic">
      <Textarea placeholder="Type your message here." />
    </Example>
  )
}

function TextareaInvalid() {
  return (
    <Example title="Invalid">
      <Textarea placeholder="Type your message here." aria-invalid="true" />
    </Example>
  )
}

export { TextareaBasic, TextareaInvalid };
