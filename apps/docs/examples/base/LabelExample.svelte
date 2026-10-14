<script lang="ts">
  import { Checkbox } from '@sveltery/ui/checkbox';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Field } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';
  import { Label } from '@sveltery/ui/label';
  import { Textarea } from '@sveltery/ui/textarea';
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
