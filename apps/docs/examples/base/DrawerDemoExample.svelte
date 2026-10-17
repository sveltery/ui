<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { Badge } from '$registry/bases/base/ui/badge';
  import { Button } from '$registry/bases/base/ui/button';
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '$registry/bases/base/ui/drawer';
  import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from '$registry/bases/base/ui/field';
  import { RadioGroup, RadioGroupItem } from '$registry/bases/base/ui/radio-group';
  import { Toaster, toast } from '$registry/bases/base/ui/toast';

  const deliveryTimes = [
    {
      value: 'asap',
      id: 'delivery-asap',
      label: 'Standard delivery',
      description: '25–35 min · Driver assigned now',
      badge: 'Fastest',
    },
    {
      value: '5-00',
      id: 'delivery-5-00',
      label: '5:00 PM – 5:15 PM',
      description: 'Prep starts at 4:45 PM',
    },
    {
      value: '5-30',
      id: 'delivery-5-30',
      label: '5:30 PM – 5:45 PM',
      description: "Good if you're heading home",
    },
    {
      value: '6-00',
      id: 'delivery-6-00',
      label: '6:00 PM – 6:15 PM',
      description: 'Most popular · High demand',
    },
    {
      value: '6-30',
      id: 'delivery-6-30',
      label: '6:30 PM – 6:45 PM',
      description: 'Last slot before kitchen closes',
    },
  ];

  let open = $state(false);
  let deliveryTime = $state('asap');
  const isMobile = new MediaQuery('max-width: 767px');

  function handleConfirm() {
    const selected = deliveryTimes.find((time) => time.value === deliveryTime);

    if (!selected) {
      return;
    }

    open = false;
    toast.add({ title: 'Delivery time confirmed', description: selected.label });
  }
</script>

<Drawer bind:open showSwipeHandle={isMobile.current} swipeDirection={isMobile.current ? 'down' : 'right'}>
  <DrawerTrigger>
    {#snippet render(props, _state, content)}<Button variant="secondary" {...props}>{@render content?.()}</Button>{/snippet}
    Open Drawer
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Pick a delivery time</DrawerTitle>
      <DrawerDescription>We&apos;ll prepare your order as soon as possible.</DrawerDescription>
    </DrawerHeader>
    <div class="flex-1 scroll-fade overflow-y-auto p-4">
      <RadioGroup bind:value={deliveryTime} class="gap-2">
        {#each deliveryTimes as time (time.value)}
          <FieldLabel for={time.id}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle class="flex items-center gap-2">
                  {time.label}
                  {#if time.badge}
                    <Badge variant="secondary">{time.badge}</Badge>
                  {/if}
                </FieldTitle>
                <FieldDescription>{time.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={time.value} id={time.id} />
            </Field>
          </FieldLabel>
        {/each}
      </RadioGroup>
    </div>
    <DrawerFooter>
      <Button onclick={handleConfirm} class="h-[34px]">Confirm Delivery Time</Button>
      <DrawerClose>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Cancel
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

<Toaster />
