<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<FieldGroup>
  <Field>
    <FieldLabel for="fieldgroup-name">Name</FieldLabel>
    <Input id="fieldgroup-name" placeholder="Jordan Lee" />
  </Field>
  <Field>
    <FieldLabel for="fieldgroup-email">Email</FieldLabel>
    <Input id="fieldgroup-email" type="email" placeholder="name@example.com" />
    <FieldDescription>We&apos;ll send updates to this address.</FieldDescription>
  </Field>
  <Field orientation="horizontal">
    <Button type="reset" variant="outline">Reset</Button>
    <Button type="submit">Submit</Button>
  </Field>
</FieldGroup>
