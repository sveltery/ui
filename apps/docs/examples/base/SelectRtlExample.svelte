<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { DirectionProvider } from '@sveltery/ui/direction';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@sveltery/ui/select';

  const translations = {
    en: {
      dir: 'ltr',
      selectFruit: 'Select a fruit',
      fruits: 'Fruits',
      apple: 'Apple',
      banana: 'Banana',
      blueberry: 'Blueberry',
      grapes: 'Grapes',
      pineapple: 'Pineapple',
      vegetables: 'Vegetables',
      carrot: 'Carrot',
      broccoli: 'Broccoli',
      spinach: 'Spinach'
    },
    ar: {
      dir: 'rtl',
      selectFruit: 'اختر فاكهة',
      fruits: 'الفواكه',
      apple: 'تفاح',
      banana: 'موز',
      blueberry: 'توت أزرق',
      grapes: 'عنب',
      pineapple: 'أناناس',
      vegetables: 'الخضروات',
      carrot: 'جزر',
      broccoli: 'بروكلي',
      spinach: 'سبانخ'
    },
    he: {
      dir: 'rtl',
      selectFruit: 'בחר פרי',
      fruits: 'פירות',
      apple: 'תפוח',
      banana: 'בננה',
      blueberry: 'אוכמניה',
      grapes: 'ענבים',
      pineapple: 'אננס',
      vegetables: 'ירקות',
      carrot: 'גזר',
      broccoli: 'ברוקולי',
      spinach: 'תרד'
    }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  let selected = $state<string | null>(null);
  const t = $derived(translations[language]);
  const fruits = $derived([
    { label: t.apple, value: 'apple' },
    { label: t.banana, value: 'banana' },
    { label: t.blueberry, value: 'blueberry' },
    { label: t.grapes, value: 'grapes' },
    { label: t.pineapple, value: 'pineapple' }
  ]);
  const vegetables = $derived([
    { label: t.carrot, value: 'carrot' },
    { label: t.broccoli, value: 'broccoli' },
    { label: t.spinach, value: 'spinach' }
  ]);
  const items = $derived([{ label: t.selectFruit, value: null }, ...fruits, ...vegetables]);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={t.dir}>
    <Select {items} bind:value={selected}>
      <SelectTrigger class="w-32" dir={t.dir}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent dir={t.dir}>
        <SelectGroup>
          <SelectLabel>{t.fruits}</SelectLabel>
          {#each fruits as item (item.value)}
            <SelectItem value={item.value}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>{t.vegetables}</SelectLabel>
          {#each vegetables as item (item.value)}
            <SelectItem value={item.value}>{item.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>
  </DirectionProvider>
</div>
