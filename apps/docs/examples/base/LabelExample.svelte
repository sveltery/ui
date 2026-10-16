<script lang="ts">
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Field } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
  import { Label } from '$registry/bases/base/ui/label';
  import { Textarea } from '$registry/bases/base/ui/textarea';
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
