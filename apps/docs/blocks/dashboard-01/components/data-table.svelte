<script lang="ts" module>
  import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    tableFeatures,
  } from '@tanstack/svelte-table';

  export const features = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
  });

  export type Section = { id: number; header: string; type: string; status: string; target: string; limit: string; reviewer: string };
</script>

<script lang="ts">
  import { scaleUtc } from 'd3-scale';
  import { curveNatural } from 'd3-shape';
  import { Area, AreaChart } from 'layerchart';
  import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
  import { move } from '@dnd-kit/helpers';
  import { DragDropProvider } from '@dnd-kit/svelte';
  import { createColumnHelper, createTable, FlexRender, renderComponent, renderSnippet, type HeaderContext, type Row } from '@tanstack/svelte-table';
  import { MediaQuery } from 'svelte/reactivity';
  import { Badge } from '@sveltery/ui/badge';
  import { Button } from '@sveltery/ui/button';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/ui/chart';
  import { Checkbox } from '@sveltery/ui/checkbox';
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@sveltery/ui/drawer';
  import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Input } from '@sveltery/ui/input';
  import { Label } from '@sveltery/ui/label';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/ui/select';
  import { Separator } from '@sveltery/ui/separator';
  import { toast } from '@sveltery/ui/toast';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@sveltery/ui/table';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sveltery/ui/tabs';
  import DragHandle from './drag-handle.svelte';
  import DraggableRow from './draggable-row.svelte';

  let { data: initialData }: { data: Section[] } = $props();

  const columnHelper = createColumnHelper<typeof features, Section>();
  const columns = columnHelper.columns([
    columnHelper.display({
      id: 'drag',
      header: () => null,
      cell: () => renderComponent(DragHandle),
    }),
    columnHelper.display({
      id: 'select',
      header: (context) => renderSnippet(selectHead, context),
      cell: ({ row }) => renderSnippet(selectCell, row),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('header', {
      header: 'Header',
      cell: ({ row }) => renderSnippet(tableCellViewer, row.original),
      enableHiding: false,
    }),
    columnHelper.accessor('type', {
      header: 'Section Type',
      cell: ({ row }) => renderSnippet(typeCell, row.original),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => renderSnippet(statusCell, row.original),
    }),
    columnHelper.accessor('target', {
      header: () => renderSnippet(rightHead, 'Target'),
      cell: ({ row }) => renderSnippet(targetCell, row.original),
    }),
    columnHelper.accessor('limit', {
      header: () => renderSnippet(rightHead, 'Limit'),
      cell: ({ row }) => renderSnippet(limitCell, row.original),
    }),
    columnHelper.accessor('reviewer', {
      header: 'Reviewer',
      cell: ({ row }) => renderSnippet(reviewerCell, row.original),
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => renderSnippet(actionsCell),
    }),
  ]);

  // svelte-ignore state_referenced_locally
  let data = $state.raw(initialData);
  let snapshot: Section[] = [];
  const table = createTable({
    features,
    columns,
    get data() {
      return data;
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    // A reorder replaces `data`, which would otherwise send the table back to page 1.
    autoResetPageIndex: false,
  });

  const isMobile = new MediaQuery('max-width: 767px');

  function save(event: SubmitEvent, item: Section) {
    event.preventDefault();
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), { loading: { title: `Saving ${item.header}` }, success: { title: 'Done' }, error: { title: 'Error' } });
  }

  const chartData = [
    { month: new Date('2024-01-01'), desktop: 186, mobile: 80 },
    { month: new Date('2024-02-01'), desktop: 305, mobile: 200 },
    { month: new Date('2024-03-01'), desktop: 237, mobile: 120 },
    { month: new Date('2024-04-01'), desktop: 73, mobile: 190 },
    { month: new Date('2024-05-01'), desktop: 209, mobile: 130 },
    { month: new Date('2024-06-01'), desktop: 214, mobile: 140 },
  ];
  const chartConfig = {
    desktop: { label: 'Desktop', color: 'var(--primary)' },
    mobile: { label: 'Mobile', color: 'var(--primary)' },
  } satisfies ChartConfig;
</script>

{#snippet selectHead({ table }: HeaderContext<typeof features, Section, unknown>)}
  <div class="flex items-center justify-center">
    <Checkbox
      bind:checked={() => table.getIsAllPageRowsSelected(), (value) => table.toggleAllPageRowsSelected(value)}
      indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
      aria-label="Select all"
    />
  </div>
{/snippet}

{#snippet selectCell(row: Row<typeof features, Section>)}
  <div class="flex items-center justify-center">
    <Checkbox bind:checked={() => row.getIsSelected(), (value) => row.toggleSelected(value)} aria-label="Select row" />
  </div>
{/snippet}

{#snippet tableCellViewer(item: Section)}
  <Drawer swipeDirection={isMobile.current ? 'down' : 'right'}>
    <DrawerTrigger>
      {#snippet render(props, _state, children)}
        <Button {...props} variant="link" class={[props.class, 'w-fit px-0 text-left text-foreground']}>{@render children?.()}</Button>
      {/snippet}
      {item.header}
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader class="gap-1">
        <DrawerTitle>{item.header}</DrawerTitle>
        <DrawerDescription>Showing total visitors for the last 6 months</DrawerDescription>
      </DrawerHeader>
      <div class="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
        {#if !isMobile.current}
          <ChartContainer config={chartConfig}>
            <AreaChart
              data={chartData}
              x="month"
              xScale={scaleUtc()}
              axis={false}
              padding={{ left: 0, right: 10 }}
              series={[
                { key: 'mobile', label: 'Mobile', color: 'var(--color-mobile)' },
                { key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' },
              ]}
              seriesLayout="stack"
            >
              {#snippet marks({ context })}
                {#each context.series.visibleSeries as s (s.key)}
                  <Area seriesKey={s.key} curve={curveNatural} fillOpacity={s.key === 'mobile' ? 0.6 : 0.4} line={{ class: 'stroke-1' }} />
                {/each}
              {/snippet}
              {#snippet tooltip()}
                <ChartTooltip labelFormatter={(value: Date) => value.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })} indicator="dot" />
              {/snippet}
            </AreaChart>
          </ChartContainer>
          <Separator />
          <div class="grid gap-2">
            <div class="flex gap-2 leading-none font-medium">
              Trending up by 5.2% this month <IconPlaceholder lucide="TrendingUpIcon" tabler="IconTrendingUp" hugeicons="ChartUpIcon" phosphor="TrendUpIcon" remixicon="RiArrowUpLine" class="size-4" />
            </div>
            <div class="text-muted-foreground">
              Showing total visitors for the last 6 months. This is just some random text to test the layout. It spans multiple lines and should wrap around.
            </div>
          </div>
          <Separator />
        {/if}
        <form class="flex flex-col gap-4">
          <div class="flex flex-col gap-3">
            <Label for="header">Header</Label>
            <Input id="header" value={item.header} />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-3">
              <Label for="type">Type</Label>
              {@render formSelect('type', item.type, 'Select a type', ['Table of Contents', 'Executive Summary', 'Technical Approach', 'Design', 'Capabilities', 'Focus Documents', 'Narrative', 'Cover Page'])}
            </div>
            <div class="flex flex-col gap-3">
              <Label for="status">Status</Label>
              {@render formSelect('status', item.status, 'Select a status', ['Done', 'In Progress', 'Not Started'])}
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-3">
              <Label for="target">Target</Label>
              <Input id="target" value={item.target} />
            </div>
            <div class="flex flex-col gap-3">
              <Label for="limit">Limit</Label>
              <Input id="limit" value={item.limit} />
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <Label for="reviewer">Reviewer</Label>
            {@render formSelect('reviewer', item.reviewer, 'Select a reviewer', ['Eddie Lake', 'Jamik Tashpulatov', 'Emily Whalen'])}
          </div>
        </form>
      </div>
      <DrawerFooter>
        <Button>Submit</Button>
        <DrawerClose>
          {#snippet render(props, _state, children)}
            <Button {...props} variant="outline">{@render children?.()}</Button>
          {/snippet}
          Done
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
{/snippet}

{#snippet formSelect(id: string, value: string, placeholder: string, options: string[])}
  <Select defaultValue={value} items={options.map((option) => ({ value: option, label: option }))}>
    <SelectTrigger {id} class="w-full">
      <SelectValue {placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {#each options as option (option)}
          <SelectItem value={option}>{option}</SelectItem>
        {/each}
      </SelectGroup>
    </SelectContent>
  </Select>
{/snippet}

{#snippet typeCell(item: Section)}
  <div class="w-32">
    <Badge variant="outline" class="px-1.5 text-muted-foreground">{item.type}</Badge>
  </div>
{/snippet}

{#snippet statusCell(item: Section)}
  <Badge variant="outline" class="px-1.5 text-muted-foreground">
    {#if item.status === 'Done'}
      <IconPlaceholder lucide="CircleCheckIcon" tabler="IconCircleCheckFilled" hugeicons="CheckmarkCircle01Icon" phosphor="CheckCircleIcon" remixicon="RiCheckboxCircleFill" class="fill-green-500 dark:fill-green-400" />
    {:else}
      <IconPlaceholder lucide="LoaderIcon" tabler="IconLoader" hugeicons="Loading03Icon" phosphor="SpinnerIcon" remixicon="RiLoader4Line" />
    {/if}
    {item.status}
  </Badge>
{/snippet}

{#snippet rightHead(label: string)}
  <div class="w-full text-right">{label}</div>
{/snippet}

{#snippet numberInput(item: Section, field: 'target' | 'limit', label: string)}
  <form onsubmit={(event) => save(event, item)}>
    <Label for="{item.id}-{field}" class="sr-only">{label}</Label>
    <Input
      class="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
      value={item[field]}
      id="{item.id}-{field}"
    />
  </form>
{/snippet}

{#snippet targetCell(item: Section)}
  {@render numberInput(item, 'target', 'Target')}
{/snippet}

{#snippet limitCell(item: Section)}
  {@render numberInput(item, 'limit', 'Limit')}
{/snippet}

{#snippet reviewerCell(item: Section)}
  {#if item.reviewer !== 'Assign reviewer'}
    {item.reviewer}
  {:else}
    <Label for="{item.id}-reviewer" class="sr-only">Reviewer</Label>
    <Select items={[{ label: 'Eddie Lake', value: 'Eddie Lake' }, { label: 'Jamik Tashpulatov', value: 'Jamik Tashpulatov' }]}>
      <SelectTrigger class="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate" size="sm" id="{item.id}-reviewer">
        <SelectValue placeholder="Assign reviewer" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
          <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  {/if}
{/snippet}

{#snippet actionsCell()}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet render(props, _state, children)}
        <Button {...props} variant="ghost" class={[props.class, 'flex size-8 text-muted-foreground data-popup-open:bg-muted']} size="icon">{@render children?.()}</Button>
      {/snippet}
      <IconPlaceholder lucide="EllipsisVerticalIcon" tabler="IconDotsVertical" hugeicons="MoreVerticalCircle01Icon" phosphor="DotsThreeVerticalIcon" remixicon="RiMore2Line" />
      <span class="sr-only">Open menu</span>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-32">
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Make a copy</DropdownMenuItem>
      <DropdownMenuItem>Favorite</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/snippet}

<Tabs value="outline" class="w-full flex-col justify-start gap-6">
  <div class="flex items-center justify-between px-4 lg:px-6">
    <Label for="view-selector" class="sr-only">View</Label>
    <Select
      defaultValue="outline"
      items={[
        { label: 'Outline', value: 'outline' },
        { label: 'Past Performance', value: 'past-performance' },
        { label: 'Key Personnel', value: 'key-personnel' },
        { label: 'Focus Documents', value: 'focus-documents' },
      ]}
    >
      <SelectTrigger class="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
        <SelectValue placeholder="Select a view" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="outline">Outline</SelectItem>
          <SelectItem value="past-performance">Past Performance</SelectItem>
          <SelectItem value="key-personnel">Key Personnel</SelectItem>
          <SelectItem value="focus-documents">Focus Documents</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <TabsList class="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
      <TabsTrigger value="outline">Outline</TabsTrigger>
      <TabsTrigger value="past-performance">Past Performance <Badge variant="secondary">3</Badge></TabsTrigger>
      <TabsTrigger value="key-personnel">Key Personnel <Badge variant="secondary">2</Badge></TabsTrigger>
      <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
    </TabsList>
    <div class="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          {#snippet render(props, _state, children)}
            <Button {...props} variant="outline" size="sm">{@render children?.()}</Button>
          {/snippet}
          <IconPlaceholder lucide="Columns3Icon" tabler="IconLayoutColumns" hugeicons="LeftToRightListBulletIcon" phosphor="ColumnsIcon" remixicon="RiLayoutColumnLine" data-icon="inline-start" />
          Columns
          <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-32">
          {#each table.getAllColumns().filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()) as column (column.id)}
            <DropdownMenuCheckboxItem class="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(value)}>
              {column.id}
            </DropdownMenuCheckboxItem>
          {/each}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" size="sm">
        <IconPlaceholder lucide="PlusIcon" tabler="IconPlus" hugeicons="Add01Icon" phosphor="PlusIcon" remixicon="RiAddLine" />
        <span class="hidden lg:inline">Add Section</span>
      </Button>
    </div>
  </div>
  <TabsContent value="outline" class="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
    <div class="overflow-hidden rounded-lg border">
      <DragDropProvider
        modifiers={[RestrictToVerticalAxis]}
        onDragStart={() => (snapshot = data)}
        onDragOver={(event) => (data = move(data, event))}
        onDragEnd={(event) => {
          // Rows move on drag over, so a cancelled drag puts back the order from before it.
          if (event.canceled) data = snapshot;
        }}
      >
        <Table>
          <TableHeader class="sticky top-0 z-10 bg-muted">
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
              <TableRow>
                {#each headerGroup.headers as header (header.id)}
                  <TableHead colspan={header.colSpan}>
                    {#if !header.isPlaceholder}
                      <FlexRender {header} />
                    {/if}
                  </TableHead>
                {/each}
              </TableRow>
            {/each}
          </TableHeader>
          <TableBody class="**:data-[slot=table-cell]:first:w-8">
            {#each table.getRowModel().rows as row (row.id)}
              <DraggableRow {row} />
            {:else}
              <TableRow>
                <TableCell colspan={columns.length} class="h-24 text-center">No results.</TableCell>
              </TableRow>
            {/each}
          </TableBody>
        </Table>
      </DragDropProvider>
    </div>
    <div class="flex items-center justify-between px-4">
      <div class="hidden flex-1 text-sm text-muted-foreground lg:flex">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div class="flex w-full items-center gap-8 lg:w-fit">
        <div class="hidden items-center gap-2 lg:flex">
          <Label for="rows-per-page" class="text-sm font-medium">Rows per page</Label>
          <Select
            value={`${table.atoms.pagination.get().pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
            items={[10, 20, 30, 40, 50].map((pageSize) => ({ label: `${pageSize}`, value: `${pageSize}` }))}
          >
            <SelectTrigger size="sm" class="w-20" id="rows-per-page">
              <SelectValue placeholder={`${table.atoms.pagination.get().pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
                  <SelectItem value={`${pageSize}`}>{pageSize}</SelectItem>
                {/each}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex w-fit items-center justify-center text-sm font-medium">
          Page {table.atoms.pagination.get().pageIndex + 1} of {table.getPageCount()}
        </div>
        <div class="ml-auto flex items-center gap-2 lg:ml-0">
          <Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" onclick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <span class="sr-only">Go to first page</span>
            <IconPlaceholder lucide="ChevronsLeftIcon" tabler="IconChevronsLeft" hugeicons="ArrowLeftDoubleIcon" phosphor="CaretDoubleLeftIcon" remixicon="RiSkipLeftLine" />
          </Button>
          <Button variant="outline" class="size-8" size="icon" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <span class="sr-only">Go to previous page</span>
            <IconPlaceholder lucide="ChevronLeftIcon" tabler="IconChevronLeft" hugeicons="ArrowLeft01Icon" phosphor="CaretLeftIcon" remixicon="RiArrowLeftSLine" />
          </Button>
          <Button variant="outline" class="size-8" size="icon" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <span class="sr-only">Go to next page</span>
            <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
          </Button>
          <Button variant="outline" class="hidden size-8 lg:flex" size="icon" onclick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <span class="sr-only">Go to last page</span>
            <IconPlaceholder lucide="ChevronsRightIcon" tabler="IconChevronsRight" hugeicons="ArrowRightDoubleIcon" phosphor="CaretDoubleRightIcon" remixicon="RiSkipRightLine" />
          </Button>
        </div>
      </div>
    </div>
  </TabsContent>
  <TabsContent value="past-performance" class="flex flex-col px-4 lg:px-6">
    <div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
  </TabsContent>
  <TabsContent value="key-personnel" class="flex flex-col px-4 lg:px-6">
    <div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
  </TabsContent>
  <TabsContent value="focus-documents" class="flex flex-col px-4 lg:px-6">
    <div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
  </TabsContent>
</Tabs>
