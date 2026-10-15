<script lang="ts">
  import { Checkbox } from '@sveltery/ui/checkbox';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from '@sveltery/ui/field';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@sveltery/ui/table';

  const tableData = [
    { id: '1', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Admin' },
    { id: '2', name: 'Marcus Rodriguez', email: 'marcus.rodriguez@example.com', role: 'User' },
    { id: '3', name: 'Priya Patel', email: 'priya.patel@example.com', role: 'User' },
    { id: '4', name: 'David Kim', email: 'david.kim@example.com', role: 'Editor' },
  ];

  const desktopItems = [
    { id: 'finder-pref-9k2-hard-disks-ljj', label: 'Hard disks' },
    { id: 'finder-pref-9k2-external-disks-1yg', label: 'External disks' },
    { id: 'finder-pref-9k2-cds-dvds-fzt', label: 'CDs, DVDs, and iPods' },
    { id: 'finder-pref-9k2-connected-servers-6l2', label: 'Connected servers' },
  ];

  let selectedRows = $state(['1']);

  function setAll(checked: boolean) {
    selectedRows = checked ? tableData.map((row) => row.id) : [];
  }

  function setRow(id: string, checked: boolean) {
    selectedRows = checked ? [...selectedRows, id] : selectedRows.filter((row) => row !== id);
  }
</script>

<ExampleWrapper>
  <Example title="Basic">
    <Field orientation="horizontal">
      <Checkbox id="terms" />
      <FieldLabel for="terms">Accept terms and conditions</FieldLabel>
    </Field>
  </Example>

  <Example title="With Description">
    <Field orientation="horizontal">
      <Checkbox id="terms-2" defaultChecked />
      <FieldContent>
        <FieldLabel for="terms-2">Accept terms and conditions</FieldLabel>
        <FieldDescription>By clicking this checkbox, you agree to the terms and conditions.</FieldDescription>
      </FieldContent>
    </Field>
  </Example>

  <Example title="Invalid">
    <Field orientation="horizontal" data-invalid>
      <Checkbox id="terms-3" aria-invalid />
      <FieldLabel for="terms-3">Accept terms and conditions</FieldLabel>
    </Field>
  </Example>

  <Example title="Disabled">
    <Field orientation="horizontal">
      <Checkbox id="toggle" disabled />
      <FieldLabel for="toggle">Enable notifications</FieldLabel>
    </Field>
  </Example>

  <Example title="With Title">
    <FieldGroup>
      <FieldLabel for="toggle-2">
        <Field orientation="horizontal">
          <Checkbox id="toggle-2" defaultChecked />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>You can enable or disable notifications at any time.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel for="toggle-4">
        <Field orientation="horizontal" data-disabled>
          <Checkbox id="toggle-4" disabled />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>You can enable or disable notifications at any time.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  </Example>

  <Example title="In Table">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-8">
            <Checkbox
              id="select-all"
              bind:checked={() => selectedRows.length === tableData.length, setAll}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each tableData as row (row.id)}
          <TableRow data-state={selectedRows.includes(row.id) ? 'selected' : undefined}>
            <TableCell>
              <Checkbox
                id={`row-${row.id}`}
                bind:checked={() => selectedRows.includes(row.id), (checked) => setRow(row.id, checked)}
              />
            </TableCell>
            <TableCell class="font-medium">{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </Example>

  <Example title="Group">
    <Field>
      <FieldLabel>Show these items on the desktop:</FieldLabel>
      {#each desktopItems as item (item.id)}
        <Field orientation="horizontal">
          <Checkbox id={item.id} />
          <FieldLabel for={item.id} class="font-normal">{item.label}</FieldLabel>
        </Field>
      {/each}
    </Field>
  </Example>
</ExampleWrapper>
