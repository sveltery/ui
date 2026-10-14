<script lang="ts">
  import { tick, type Snippet } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { scaleUtc } from 'd3-scale';
  import { curveNatural } from 'd3-shape';
  import { Area, AreaChart } from 'layerchart';
  import { Badge } from '@sveltery/ui/badge';
  import { Button, buttonVariants } from '@sveltery/ui/button';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/ui/chart';
  import { Checkbox } from '@sveltery/ui/checkbox';
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@sveltery/ui/drawer';
  import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Input } from '@sveltery/ui/input';
  import { Label } from '@sveltery/ui/label';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/ui/select';
  import { Separator } from '@sveltery/ui/separator';
  import { useSidebar } from '@sveltery/ui/sidebar';
  import { toast } from 'svelte-sonner';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@sveltery/ui/table';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sveltery/ui/tabs';

  type Section = { id: number; header: string; type: string; status: string; target: string; limit: string; reviewer: string };
  type Column = { id: string; head?: string | Snippet; cell: Snippet<[Section, number]>; hideable?: boolean };

  let { data }: { data: Section[] } = $props();

  const columns: Column[] = [
    { id: 'drag', cell: dragCell },
    { id: 'select', head: selectHead, cell: selectCell },
    { id: 'header', head: 'Header', cell: headerCell },
    { id: 'type', head: 'Section Type', cell: typeCell, hideable: true },
    { id: 'status', head: 'Status', cell: statusCell, hideable: true },
    { id: 'target', head: targetHead, cell: targetCell, hideable: true },
    { id: 'limit', head: limitHead, cell: limitCell, hideable: true },
    { id: 'reviewer', head: 'Reviewer', cell: reviewerCell, hideable: true },
    { id: 'actions', cell: actionsCell },
  ];
  const views = [
    { value: 'outline', label: 'Outline' },
    { value: 'past-performance', label: 'Past Performance' },
    { value: 'key-personnel', label: 'Key Personnel' },
    { value: 'focus-documents', label: 'Focus Documents' },
  ];
  const pageSizes = [10, 20, 30, 40, 50].map((size) => ({ value: `${size}`, label: `${size}` }));

  const sidebar = useSidebar();
  // svelte-ignore state_referenced_locally
  let rows = $state(data.slice());
  const selected = new SvelteSet<number>();
  const hidden = new SvelteSet<string>();
  let view = $state('outline');
  let pageIndex = $state(0);
  let pageSize = $state(10);
  let announcement = $state('');

  const visibleColumns = $derived(columns.filter((column) => !hidden.has(column.id)));
  const pageCount = $derived(Math.ceil(rows.length / pageSize));
  const pageRows = $derived(rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
  const allPageSelected = $derived(pageRows.length > 0 && pageRows.every((row) => selected.has(row.id)));
  const somePageSelected = $derived(pageRows.some((row) => selected.has(row.id)));

  function setPageSize(size: number) {
    // Keep the first row of the current page on screen.
    pageIndex = Math.floor((pageIndex * pageSize) / size);
    pageSize = size;
  }

  function toggle(id: number, checked: boolean) {
    if (checked) selected.add(id);
    else selected.delete(id);
  }

  /** Moves a row from one place on the current page to another. */
  function move(from: number, to: number) {
    const start = pageIndex * pageSize;
    const [row] = rows.splice(start + from, 1);
    rows.splice(start + to, 0, row);
  }

  type Drag = { from: number; to: number; startY: number; dy: number; height: number; centers: number[] };
  let drag = $state<Drag | null>(null);

  function startDrag(event: PointerEvent, from: number) {
    if (event.button !== 0) return;
    const handle = event.currentTarget as HTMLElement;
    const rects = [...handle.closest('tbody')!.rows].map((row) => row.getBoundingClientRect());
    handle.setPointerCapture(event.pointerId);
    drag = { from, to: from, startY: event.clientY, dy: 0, height: rects[from].height, centers: rects.map((rect) => rect.top + rect.height / 2) };
  }

  function moveDrag(event: PointerEvent) {
    if (!drag) return;
    const { from, centers } = drag;
    drag.dy = event.clientY - drag.startY;
    const center = centers[from] + drag.dy;
    drag.to = centers.filter((other, index) => index !== from && other < center).length;
  }

  function endDrag() {
    if (!drag) return;
    move(drag.from, drag.to);
    drag = null;
  }

  /** While a row is dragged it follows the pointer, and the rows it passes shift to open its new place. */
  function dragStyle(index: number) {
    if (!drag) return undefined;
    const { from, to, dy, height } = drag;
    const offset = index === from ? dy : from < index && index <= to ? -height : to <= index && index < from ? height : 0;
    return `transform: translate3d(0, ${offset}px, 0); transition: ${index === from ? 'none' : 'transform 250ms ease'}`;
  }

  async function keyboardMove(event: KeyboardEvent, from: number) {
    const to = from + (event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0);
    if (to === from || to < 0 || to >= pageRows.length) return;
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    move(from, to);
    announcement = `${pageRows[to].header} moved to row ${to + 1} of ${pageRows.length}.`;
    // The keyed row keeps its handle, but moving it in the DOM can drop focus.
    await tick();
    handle.focus();
  }

  function save(event: SubmitEvent, item: Section) {
    event.preventDefault();
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), { loading: `Saving ${item.header}`, success: 'Done', error: 'Error' });
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

{#snippet dragCell(_item: Section, index: number)}
  <Button
    variant="ghost"
    size="icon"
    class="size-7 touch-none text-muted-foreground hover:bg-transparent"
    aria-keyshortcuts="ArrowUp ArrowDown"
    onpointerdown={(event: PointerEvent) => startDrag(event, index)}
    onpointermove={moveDrag}
    onpointerup={endDrag}
    onpointercancel={() => (drag = null)}
    onkeydown={(event: KeyboardEvent) => keyboardMove(event, index)}
  >
    <IconPlaceholder lucide="GripVerticalIcon" tabler="IconGripVertical" hugeicons="DragDropVerticalIcon" phosphor="DotsSixVerticalIcon" remixicon="RiDraggable" class="size-3 text-muted-foreground" />
    <span class="sr-only">Drag to reorder</span>
  </Button>
{/snippet}

{#snippet selectHead()}
  <div class="flex items-center justify-center">
    <Checkbox
      checked={allPageSelected}
      indeterminate={somePageSelected && !allPageSelected}
      onCheckedChange={(checked) => pageRows.forEach((row) => toggle(row.id, checked))}
      aria-label="Select all"
    />
  </div>
{/snippet}

{#snippet selectCell(item: Section)}
  <div class="flex items-center justify-center">
    <Checkbox checked={selected.has(item.id)} onCheckedChange={(checked) => toggle(item.id, checked)} aria-label="Select row" />
  </div>
{/snippet}

{#snippet headerCell(item: Section)}
  <Drawer swipeDirection={sidebar.isMobile ? 'down' : 'right'}>
    <DrawerTrigger class={buttonVariants({ variant: 'link', class: 'w-fit px-0 text-left text-foreground' })}>{item.header}</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader class="gap-1">
        <DrawerTitle>{item.header}</DrawerTitle>
        <DrawerDescription>Showing total visitors for the last 6 months</DrawerDescription>
      </DrawerHeader>
      <div class="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
        {#if !sidebar.isMobile}
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
        <DrawerClose class={buttonVariants({ variant: 'outline' })}>Done</DrawerClose>
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

{#snippet targetHead()}
  <div class="w-full text-right">Target</div>
{/snippet}

{#snippet limitHead()}
  <div class="w-full text-right">Limit</div>
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
    <DropdownMenuTrigger class={buttonVariants({ variant: 'ghost', size: 'icon', class: 'flex size-8 text-muted-foreground data-popup-open:bg-muted' })}>
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

<Tabs bind:value={view} class="w-full flex-col justify-start gap-6">
  <div class="flex items-center justify-between px-4 lg:px-6">
    <Label for="view-selector" class="sr-only">View</Label>
    <Select value={view} onValueChange={(value) => value !== null && (view = value)} items={views}>
      <SelectTrigger class="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
        <SelectValue placeholder="Select a view" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {#each views as option (option.value)}
            <SelectItem value={option.value}>{option.label}</SelectItem>
          {/each}
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
        <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>
          <IconPlaceholder lucide="Columns3Icon" tabler="IconLayoutColumns" hugeicons="LeftToRightListBulletIcon" phosphor="ColumnsIcon" remixicon="RiLayoutColumnLine" data-icon="inline-start" />
          Columns
          <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-32">
          {#each columns.filter((column) => column.hideable) as column (column.id)}
            <DropdownMenuCheckboxItem
              class="capitalize"
              checked={!hidden.has(column.id)}
              onCheckedChange={(checked) => (checked ? hidden.delete(column.id) : hidden.add(column.id))}
            >
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
      <Table>
        <TableHeader class="sticky top-0 z-10 bg-muted">
          <TableRow>
            {#each visibleColumns as column (column.id)}
              <TableHead>
                {#if typeof column.head === 'string'}
                  {column.head}
                {:else}
                  {@render column.head?.()}
                {/if}
              </TableHead>
            {/each}
          </TableRow>
        </TableHeader>
        <TableBody class="**:data-[slot=table-cell]:first:w-8">
          {#each pageRows as row, index (row.id)}
            <TableRow
              data-state={selected.has(row.id) ? 'selected' : undefined}
              data-dragging={drag?.from === index}
              class="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
              style={dragStyle(index)}
            >
              {#each visibleColumns as column (column.id)}
                <TableCell>{@render column.cell(row, index)}</TableCell>
              {/each}
            </TableRow>
          {:else}
            <TableRow>
              <TableCell colspan={visibleColumns.length} class="h-24 text-center">No results.</TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </div>
    <p class="sr-only" role="status">{announcement}</p>
    <div class="flex items-center justify-between px-4">
      <div class="hidden flex-1 text-sm text-muted-foreground lg:flex">
        {selected.size} of {rows.length} row(s) selected.
      </div>
      <div class="flex w-full items-center gap-8 lg:w-fit">
        <div class="hidden items-center gap-2 lg:flex">
          <Label for="rows-per-page" class="text-sm font-medium">Rows per page</Label>
          <Select value={`${pageSize}`} onValueChange={(value) => value !== null && setPageSize(Number(value))} items={pageSizes}>
            <SelectTrigger size="sm" class="w-20" id="rows-per-page">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {#each pageSizes as size (size.value)}
                  <SelectItem value={size.value}>{size.label}</SelectItem>
                {/each}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex w-fit items-center justify-center text-sm font-medium">
          Page {pageIndex + 1} of {pageCount}
        </div>
        <div class="ml-auto flex items-center gap-2 lg:ml-0">
          <Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" onclick={() => (pageIndex = 0)} disabled={pageIndex === 0}>
            <span class="sr-only">Go to first page</span>
            <IconPlaceholder lucide="ChevronsLeftIcon" tabler="IconChevronsLeft" hugeicons="ArrowLeftDoubleIcon" phosphor="CaretDoubleLeftIcon" remixicon="RiSkipLeftLine" />
          </Button>
          <Button variant="outline" class="size-8" size="icon" onclick={() => pageIndex--} disabled={pageIndex === 0}>
            <span class="sr-only">Go to previous page</span>
            <IconPlaceholder lucide="ChevronLeftIcon" tabler="IconChevronLeft" hugeicons="ArrowLeft01Icon" phosphor="CaretLeftIcon" remixicon="RiArrowLeftSLine" />
          </Button>
          <Button variant="outline" class="size-8" size="icon" onclick={() => pageIndex++} disabled={pageIndex >= pageCount - 1}>
            <span class="sr-only">Go to next page</span>
            <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
          </Button>
          <Button variant="outline" class="hidden size-8 lg:flex" size="icon" onclick={() => (pageIndex = pageCount - 1)} disabled={pageIndex >= pageCount - 1}>
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
