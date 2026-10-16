<script lang="ts">
  import { Checkbox } from '@sveltery/components/checkbox';
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { Field } from '@sveltery/components/field';
  import { Input } from '@sveltery/components/input';
  import { Label } from '@sveltery/components/label';
  import { Textarea } from '@sveltery/components/textarea';
</script>

<ExampleWrapper>
  <Example title="With Checkbox">
    <Field orientation="horizontal">
      <Checkbox id="label-demo-terms" />
      <Label for="label-demo-terms">Accept terms and conditions</Label>
    </Field>
  </Example>
  <Example title="With Input">
    <Field>
      <Label for="label-demo-username">Username</Label>
      <Input id="label-demo-username" placeholder="Username" />
    </Field>
  </Example>
  <Example title="Disabled">
    <Field data-disabled={true}>
      <Label for="label-demo-disabled">Disabled</Label>
      <Input id="label-demo-disabled" placeholder="Disabled" disabled />
    </Field>
  </Example>
  <Example title="With Textarea">
    <Field>
      <Label for="label-demo-message">Message</Label>
      <Textarea id="label-demo-message" placeholder="Message" />
    </Field>
  </Example>
</ExampleWrapper>
