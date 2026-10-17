<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
</script>

<div class="w-full max-w-lg">
  <form onsubmit={(event) => event.preventDefault()}>
    <FieldSet>
      <FieldLegend>Profile</FieldLegend>
      <FieldDescription>Fill in your profile information.</FieldDescription>
      <FieldGroup>
        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel for="name">Name</FieldLabel>
            <FieldDescription>Provide your full name for identification</FieldDescription>
          </FieldContent>
          <Input id="name" placeholder="Evil Rabbit" required />
        </Field>
        <Field orientation="responsive">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline">Cancel</Button>
        </Field>
      </FieldGroup>
    </FieldSet>
  </form>
</div>
