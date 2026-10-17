<script lang="ts">
  import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
  import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    filterFn_includesString,
    FlexRender,
    renderSnippet,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_text,
    tableFeatures,
    type Column,
    type HeaderContext,
    type Row
  } from '@tanstack/svelte-table';
  import { Button } from '$registry/bases/base/ui/button';
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';
  import { Input } from '$registry/bases/base/ui/input';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$registry/bases/base/ui/table';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        filterEmails: 'Filter emails...',
        columns: 'Columns',
        status: 'Status',
        email: 'Email',
        amount: 'Amount',
        actions: 'Actions',
        copyPaymentId: 'Copy payment ID',
        viewCustomer: 'View customer',
        viewPaymentDetails: 'View payment details',
        selectAll: 'Select all',
        selectRow: 'Select row',
        openMenu: 'Open menu',
        noResults: 'No results.',
        rowsSelected: 'of',
        rowsSelectedSuffix: 'row(s) selected.',
        previous: 'Previous',
        next: 'Next',
        success: 'Success',
        processing: 'Processing',
        failed: 'Failed',
        pending: 'Pending'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        filterEmails: 'تصفية البريد الإلكتروني...',
        columns: 'الأعمدة',
        status: 'الحالة',
        email: 'البريد الإلكتروني',
        amount: 'المبلغ',
        actions: 'الإجراءات',
        copyPaymentId: 'نسخ معرف الدفع',
        viewCustomer: 'عرض العميل',
        viewPaymentDetails: 'عرض تفاصيل الدفع',
        selectAll: 'تحديد الكل',
        selectRow: 'تحديد الصف',
        openMenu: 'فتح القائمة',
        noResults: 'لا توجد نتائج.',
        rowsSelected: 'من',
        rowsSelectedSuffix: 'صف(وف) محدد.',
        previous: 'السابق',
        next: 'التالي',
        success: 'ناجح',
        processing: 'قيد المعالجة',
        failed: 'فشل',
        pending: 'قيد الانتظار'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        filterEmails: 'סנן אימיילים...',
        columns: 'עמודות',
        status: 'סטטוס',
        email: 'אימייל',
        amount: 'סכום',
        actions: 'פעולות',
        copyPaymentId: 'העתק מזהה תשלום',
        viewCustomer: 'צפה בלקוח',
        viewPaymentDetails: 'צפה בפרטי תשלום',
        selectAll: 'בחר הכל',
        selectRow: 'בחר שורה',
        openMenu: 'פתח תפריט',
        noResults: 'אין תוצאות.',
        rowsSelected: 'מתוך',
        rowsSelectedSuffix: 'שורות נבחרו.',
        previous: 'הקודם',
        next: 'הבא',
        success: 'הצליח',
        processing: 'מעבד',
        failed: 'נכשל',
        pending: 'ממתין'
      }
    }
  } as const;

  // New in v9: declare the features this table uses. Anything you don't
  // register is tree-shaken out of the bundle.
  const features = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: { includesString: filterFn_includesString },
    sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text }
  });

  type Payment = {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
  };

  const columnHelper = createColumnHelper<typeof features, Payment>();

  const data: Payment[] = [
    {
      id: 'm5gr84i9',
      amount: 316,
      status: 'success',
      email: 'ken99@example.com'
    },
    {
      id: '3u1reuv4',
      amount: 242,
      status: 'success',
      email: 'Abe45@example.com'
    },
    {
      id: 'derv1ws0',
      amount: 837,
      status: 'processing',
      email: 'Monserrat44@example.com'
    },
    {
      id: '5kma53ae',
      amount: 874,
      status: 'success',
      email: 'Silas22@example.com'
    },
    {
      id: 'bhqecj4p',
      amount: 721,
      status: 'failed',
      email: 'carmella@example.com'
    }
  ];

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);
  const align = $derived(dir === 'rtl' ? 'start' : 'end');
  const lang = $derived(dir === 'rtl' ? language.current : undefined);

  const columns = $derived(
    columnHelper.columns([
      columnHelper.display({
        id: 'select',
        header: (context) => renderSnippet(selectHead, context),
        cell: ({ row }) => renderSnippet(selectCell, row),
        enableSorting: false,
        enableHiding: false
      }),
      columnHelper.accessor('status', {
        header: t.status,
        cell: ({ row }) => renderSnippet(statusCell, row.getValue('status'))
      }),
      columnHelper.accessor('email', {
        header: ({ column }) => renderSnippet(emailHead, column),
        cell: ({ row }) => renderSnippet(emailCell, row.getValue('email'))
      }),
      columnHelper.accessor('amount', {
        header: () => renderSnippet(amountHead),
        cell: ({ row }) => renderSnippet(amountCell, parseFloat(row.getValue('amount')))
      }),
      columnHelper.display({
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => renderSnippet(actionsCell, row.original)
      })
    ])
  );

  const table = createTable({
    features,
    get columns() {
      return columns;
    },
    data
  });
</script>

{#snippet selectHead({ table }: HeaderContext<typeof features, Payment, unknown>)}
  <Checkbox
    bind:checked={() => table.getIsAllPageRowsSelected(), (value) => table.toggleAllPageRowsSelected(value)}
    indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
    aria-label={t.selectAll}
  />
{/snippet}

{#snippet selectCell(row: Row<typeof features, Payment>)}
  <Checkbox bind:checked={() => row.getIsSelected(), (value) => row.toggleSelected(value)} aria-label={t.selectRow} />
{/snippet}

{#snippet statusCell(status: Payment['status'])}
  <div class="capitalize">{t[status]}</div>
{/snippet}

{#snippet emailHead(column: Column<typeof features, Payment, string>)}
  <Button variant="ghost" onclick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    {t.email}
    <ArrowUpDownIcon />
  </Button>
{/snippet}

{#snippet emailCell(email: string)}
  <div class="lowercase">{email}</div>
{/snippet}

{#snippet amountHead()}
  <div class="text-start">{t.amount}</div>
{/snippet}

{#snippet amountCell(amount: number)}
  {const formatted = $derived(new Intl.NumberFormat(dir === 'rtl' ? 'ar-SA' : 'en-US', { style: 'currency', currency: 'USD' }).format(amount))}
  <div class="text-start font-medium">{formatted}</div>
{/snippet}

{#snippet actionsCell(payment: Payment)}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet render(props, _state, children)}
        <Button {...props} variant="ghost" size="icon-xs">{@render children?.()}</Button>
      {/snippet}
      <span class="sr-only">{t.openMenu}</span>
      <EllipsisIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent {dir} {align} data-lang={lang} class="w-40">
      <DropdownMenuGroup>
        <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
        <DropdownMenuItem onclick={() => navigator.clipboard.writeText(payment.id)}>{t.copyPaymentId}</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>{t.viewCustomer}</DropdownMenuItem>
        <DropdownMenuItem>{t.viewPaymentDetails}</DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
{/snippet}

<div class="flex w-full flex-col gap-4">
  <div class="w-full" {dir}>
    <div class="flex items-center gap-2 py-4">
      <Input
        placeholder={t.filterEmails}
        value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
        oninput={(event) => table.getColumn('email')?.setFilterValue(event.currentTarget.value)}
        class="max-w-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          {#snippet render(props, _state, children)}
            <Button {...props} variant="outline" class={[props.class, 'ms-auto']}>{@render children?.()}</Button>
          {/snippet}
          {t.columns} <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent {dir} {align} data-lang={lang}>
          <DropdownMenuGroup>
            {#each table.getAllColumns().filter((column) => column.getCanHide()) as column (column.id)}
              <DropdownMenuCheckboxItem class="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(value)}>
                {column.id}
              </DropdownMenuCheckboxItem>
            {/each}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
            <TableRow>
              {#each headerGroup.headers as header (header.id)}
                <TableHead>
                  {#if !header.isPlaceholder}
                    <FlexRender {header} />
                  {/if}
                </TableHead>
              {/each}
            </TableRow>
          {/each}
        </TableHeader>
        <TableBody>
          {#each table.getRowModel().rows as row (row.id)}
            <TableRow data-state={row.getIsSelected() ? 'selected' : undefined}>
              {#each row.getVisibleCells() as cell (cell.id)}
                <TableCell>
                  <FlexRender {cell} />
                </TableCell>
              {/each}
            </TableRow>
          {:else}
            <TableRow>
              <TableCell colspan={columns.length} class="h-24 text-center">{t.noResults}</TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </div>
    <div class="flex items-center justify-end gap-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length}
        {t.rowsSelected}
        {table.getFilteredRowModel().rows.length}
        {t.rowsSelectedSuffix}
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{t.previous}</Button>
        <Button variant="outline" size="sm" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{t.next}</Button>
      </div>
    </div>
  </div>
</div>
