<script lang="ts">
  import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '$registry/bases/base/ui/table';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      caption: 'A list of your recent invoices.',
      invoice: 'Invoice',
      status: 'Status',
      method: 'Method',
      amount: 'Amount',
      paid: 'Paid',
      pending: 'Pending',
      unpaid: 'Unpaid',
      creditCard: 'Credit Card',
      paypal: 'PayPal',
      bankTransfer: 'Bank Transfer',
      total: 'Total'
    },
    ar: {
      dir: 'rtl',
      caption: 'قائمة بفواتيرك الأخيرة.',
      invoice: 'الفاتورة',
      status: 'الحالة',
      method: 'الطريقة',
      amount: 'المبلغ',
      paid: 'مدفوع',
      pending: 'قيد الانتظار',
      unpaid: 'غير مدفوع',
      creditCard: 'بطاقة ائتمانية',
      paypal: 'PayPal',
      bankTransfer: 'تحويل بنكي',
      total: 'المجموع'
    },
    he: {
      dir: 'rtl',
      caption: 'רשימת החשבוניות האחרונות שלך.',
      invoice: 'חשבונית',
      status: 'סטטוס',
      method: 'שיטה',
      amount: 'סכום',
      paid: 'שולם',
      pending: 'ממתין',
      unpaid: 'לא שולם',
      creditCard: 'כרטיס אשראי',
      paypal: 'PayPal',
      bankTransfer: 'העברה בנקאית',
      total: 'סה"כ'
    }
  } as const;

  const invoices = [
    { invoice: 'INV001', paymentStatus: 'paid', totalAmount: '$250.00', paymentMethod: 'creditCard' },
    { invoice: 'INV002', paymentStatus: 'pending', totalAmount: '$150.00', paymentMethod: 'paypal' },
    { invoice: 'INV003', paymentStatus: 'unpaid', totalAmount: '$350.00', paymentMethod: 'bankTransfer' },
    { invoice: 'INV004', paymentStatus: 'paid', totalAmount: '$450.00', paymentMethod: 'creditCard' },
    { invoice: 'INV005', paymentStatus: 'paid', totalAmount: '$550.00', paymentMethod: 'paypal' },
    { invoice: 'INV006', paymentStatus: 'pending', totalAmount: '$200.00', paymentMethod: 'bankTransfer' },
    { invoice: 'INV007', paymentStatus: 'unpaid', totalAmount: '$300.00', paymentMethod: 'creditCard' }
  ] as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex w-full flex-col gap-4">
  <Table dir={t.dir}>
    <TableCaption>{t.caption}</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[100px]">{t.invoice}</TableHead>
        <TableHead>{t.status}</TableHead>
        <TableHead>{t.method}</TableHead>
        <TableHead class="text-right">{t.amount}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each invoices as invoice (invoice.invoice)}
        <TableRow>
          <TableCell class="font-medium">{invoice.invoice}</TableCell>
          <TableCell>{t[invoice.paymentStatus]}</TableCell>
          <TableCell>{t[invoice.paymentMethod]}</TableCell>
          <TableCell class="text-right">{invoice.totalAmount}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colspan={3}>{t.total}</TableCell>
        <TableCell class="text-right">$2,500.00</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</div>
