<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '$registry/bases/base/ui/select';

  const countries = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' }
  ];
</script>

<form class="w-full max-w-sm">
  <FieldGroup>
    <Field>
      <FieldLabel for="form-name">Name</FieldLabel>
      <Input id="form-name" type="text" placeholder="Evil Rabbit" required />
    </Field>
    <Field>
      <FieldLabel for="form-email">Email</FieldLabel>
      <Input id="form-email" type="email" placeholder="john@example.com" />
      <FieldDescription>We&apos;ll never share your email with anyone.</FieldDescription>
    </Field>
    <div class="grid grid-cols-2 gap-4">
      <Field>
        <FieldLabel for="form-phone">Phone</FieldLabel>
        <Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
      </Field>
      <Field>
        <FieldLabel for="form-country">Country</FieldLabel>
        <Select items={countries} defaultValue="us">
          <SelectTrigger id="form-country">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each countries as country (country.value)}
                <SelectItem value={country.value}>{country.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
    <Field>
      <FieldLabel for="form-address">Address</FieldLabel>
      <Input id="form-address" type="text" placeholder="123 Main St" />
    </Field>
    <Field orientation="horizontal">
      <Button type="button" variant="outline">Cancel</Button>
      <Button type="submit">Submit</Button>
    </Field>
  </FieldGroup>
</form>
