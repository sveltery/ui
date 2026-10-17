<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
  import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '$registry/bases/base/ui/popover';
</script>

<Popover>
  <PopoverTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Open Popover
  </PopoverTrigger>
  <PopoverContent class="w-64" align="start">
    <PopoverHeader>
      <PopoverTitle>Dimensions</PopoverTitle>
      <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
    </PopoverHeader>
    <FieldGroup class="gap-4">
      <Field orientation="horizontal">
        <FieldLabel for="width" class="w-1/2">Width</FieldLabel>
        <Input id="width" value="100%" />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel for="height" class="w-1/2">Height</FieldLabel>
        <Input id="height" value="25px" />
      </Field>
    </FieldGroup>
  </PopoverContent>
</Popover>
