<script lang="ts">
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';

  const items = [
    { id: 'finder-pref-9k2-hard-disks-ljj-checkbox', label: 'Hard disks', checked: true },
    { id: 'finder-pref-9k2-external-disks-1yg-checkbox', label: 'External disks', checked: true },
    { id: 'finder-pref-9k2-cds-dvds-fzt-checkbox', label: 'CDs, DVDs, and iPods', checked: false },
    { id: 'finder-pref-9k2-connected-servers-6l2-checkbox', label: 'Connected servers', checked: false }
  ];
</script>

<FieldSet>
  <FieldLegend variant="label">Show these items on the desktop:</FieldLegend>
  <FieldDescription>Select the items you want to show on the desktop.</FieldDescription>
  <FieldGroup class="gap-3">
    {#each items as item (item.id)}
      <Field orientation="horizontal">
        <Checkbox id={item.id} name={item.id} defaultChecked={item.checked} />
        <FieldLabel for={item.id} class="font-normal">{item.label}</FieldLabel>
      </Field>
    {/each}
  </FieldGroup>
</FieldSet>
