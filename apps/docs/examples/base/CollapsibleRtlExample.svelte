<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
  import { Button } from '$registry/bases/base/ui/button';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$registry/bases/base/ui/collapsible';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      orderNumber: 'Order #4189',
      status: 'Status',
      shipped: 'Shipped',
      shippingAddress: 'Shipping address',
      address: '100 Market St, San Francisco',
      items: 'Items',
      itemsDescription: '2x Studio Headphones',
    },
    ar: {
      dir: 'rtl',
      orderNumber: 'الطلب #4189',
      status: 'الحالة',
      shipped: 'تم الشحن',
      shippingAddress: 'عنوان الشحن',
      address: '100 Market St, San Francisco',
      items: 'العناصر',
      itemsDescription: '2x سماعات الاستوديو',
    },
    he: {
      dir: 'rtl',
      orderNumber: 'הזמנה #4189',
      status: 'סטטוס',
      shipped: 'נשלח',
      shippingAddress: 'כתובת משלוח',
      address: '100 Market St, San Francisco',
      items: 'פריטים',
      itemsDescription: '2x אוזניות סטודיו',
    },
  } as const;

  const language = useLanguage();
  let isOpen = $state(false);
  const t = $derived(translations[language.current]);
</script>

{#snippet toggle(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <Button {...props} variant="ghost" size="icon" class="size-8">
    {@render children?.()}
  </Button>
{/snippet}

<div class="flex flex-col gap-4">
  <Collapsible bind:open={isOpen} class="flex w-[350px] flex-col gap-2" dir={t.dir}>
    <div class="flex items-center justify-between gap-4 px-4">
      <h4 class="text-sm font-semibold">{t.orderNumber}</h4>
      <CollapsibleTrigger render={toggle}>
        <ChevronsUpDownIcon />
        <span class="sr-only">Toggle details</span>
      </CollapsibleTrigger>
    </div>
    <div class="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
      <span class="text-muted-foreground">{t.status}</span>
      <span class="font-medium">{t.shipped}</span>
    </div>
    <CollapsibleContent class="flex flex-col gap-2">
      <div class="rounded-md border px-4 py-2 text-sm">
        <p class="font-medium">{t.shippingAddress}</p>
        <p class="text-muted-foreground">{t.address}</p>
      </div>
      <div class="rounded-md border px-4 py-2 text-sm">
        <p class="font-medium">{t.items}</p>
        <p class="text-muted-foreground">{t.itemsDescription}</p>
      </div>
    </CollapsibleContent>
  </Collapsible>
</div>
