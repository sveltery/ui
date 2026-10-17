<script lang="ts">
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$registry/bases/base/ui/table';

  const tableData = [
    { id: '1', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Admin' },
    { id: '2', name: 'Marcus Rodriguez', email: 'marcus.rodriguez@example.com', role: 'User' },
    { id: '3', name: 'Priya Patel', email: 'priya.patel@example.com', role: 'User' },
    { id: '4', name: 'David Kim', email: 'david.kim@example.com', role: 'Editor' }
  ];

  let selectedRows = $state(['1']);

  const selectAll = $derived(selectedRows.length === tableData.length);

  function handleSelectAll(checked: boolean) {
    selectedRows = checked ? tableData.map((row) => row.id) : [];
  }

  function handleSelectRow(id: string, checked: boolean) {
    selectedRows = checked ? [...selectedRows, id] : selectedRows.filter((row) => row !== id);
  }
</script>

<Table>
  <TableHeader>
    <TableRow>
      <TableHead class="w-8">
        <Checkbox id="select-all-checkbox" name="select-all-checkbox" bind:checked={() => selectAll, handleSelectAll} />
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
            id={`row-${row.id}-checkbox`}
            name={`row-${row.id}-checkbox`}
            bind:checked={() => selectedRows.includes(row.id), (checked) => handleSelectRow(row.id, checked)}
          />
        </TableCell>
        <TableCell class="font-medium">{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.role}</TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
