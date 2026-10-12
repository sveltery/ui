<script lang="ts">
  import { Checkbox } from '@sveltery/ui/checkbox';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Label } from '@sveltery/ui/label';
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
    <div class="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label for="terms">Accept terms and conditions</Label>
    </div>
  </Example>

  <Example title="With Description">
    <div class="flex items-start gap-2">
      <Checkbox id="terms-2" defaultChecked />
      <div class="grid gap-1">
        <Label for="terms-2">Accept terms and conditions</Label>
        <p class="text-sm text-muted-foreground">
          By clicking this checkbox, you agree to the terms and conditions.
        </p>
      </div>
    </div>
  </Example>

  <Example title="Invalid">
    <div class="flex items-center gap-2" data-invalid>
      <Checkbox id="terms-3" aria-invalid="true" />
      <Label for="terms-3">Accept terms and conditions</Label>
    </div>
  </Example>

  <Example title="Disabled">
    <div class="flex items-center gap-2">
      <Checkbox id="toggle" disabled />
      <Label for="toggle">Enable notifications</Label>
    </div>
  </Example>

  <Example title="With Title">
    <div class="grid gap-3">
      <Label for="toggle-2" class="items-start gap-2 rounded-lg border p-3">
        <Checkbox id="toggle-2" defaultChecked />
        <div class="grid gap-1">
          <span class="font-medium">Enable notifications</span>
          <span class="text-sm font-normal text-muted-foreground">
            You can enable or disable notifications at any time.
          </span>
        </div>
      </Label>
      <Label for="toggle-4" class="items-start gap-2 rounded-lg border p-3 opacity-50">
        <Checkbox id="toggle-4" disabled />
        <div class="grid gap-1">
          <span class="font-medium">Enable notifications</span>
          <span class="text-sm font-normal text-muted-foreground">
            You can enable or disable notifications at any time.
          </span>
        </div>
      </Label>
    </div>
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
    <div class="grid gap-3">
      <Label>Show these items on the desktop:</Label>
      {#each desktopItems as item (item.id)}
        <div class="flex items-center gap-2">
          <Checkbox id={item.id} />
          <Label for={item.id} class="font-normal">{item.label}</Label>
        </div>
      {/each}
    </div>
  </Example>
</ExampleWrapper>
