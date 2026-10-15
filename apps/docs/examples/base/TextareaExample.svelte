<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Field, FieldDescription, FieldLabel } from '@sveltery/ui/field';
  import { Textarea } from '@sveltery/ui/textarea';
</script>

<ExampleWrapper>
  <Example title="Basic">
    <Textarea placeholder="Type your message here." />
  </Example>
  <Example title="Invalid">
    <Textarea placeholder="Type your message here." aria-invalid="true" />
  </Example>
  <Example title="With Label">
    <Field>
      <FieldLabel for="textarea-demo-message">Message</FieldLabel>
      <Textarea id="textarea-demo-message" placeholder="Type your message here." rows={6} />
    </Field>
  </Example>
  <Example title="With Description">
    <Field>
      <FieldLabel for="textarea-demo-message-2">Message</FieldLabel>
      <Textarea id="textarea-demo-message-2" placeholder="Type your message here." rows={6} />
      <FieldDescription>Type your message and press enter to send.</FieldDescription>
    </Field>
  </Example>
  <Example title="Disabled">
    <Field>
      <FieldLabel for="textarea-demo-disabled">Message</FieldLabel>
      <Textarea id="textarea-demo-disabled" placeholder="Type your message here." disabled />
    </Field>
  </Example>
</ExampleWrapper>
