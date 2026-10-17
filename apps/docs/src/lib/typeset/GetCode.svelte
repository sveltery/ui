<!-- Port of shadcn's apps/v4/app/(app)/(typeset)/components/get-code-drawer.tsx at d2fba50. -->
<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { Button } from '$registry/bases/base/ui/button';
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '$registry/bases/base/ui/drawer';
  import Docs from './Docs.svelte';

  let { class: className }: { class?: string } = $props();

  const phone = new MediaQuery('max-width: 767px', false);
</script>

<Drawer swipeDirection={phone.current ? 'down' : 'right'}>
  <DrawerTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" class={className} {...props}>{@render content?.()}</Button>{/snippet}
    Get Code
  </DrawerTrigger>
  <DrawerContent data-mobile={phone.current} class="data-[mobile=true]:max-h-[85svh]">
    <DrawerHeader>
      <DrawerTitle>Get Code</DrawerTitle>
      <DrawerDescription>Install typeset with the values you picked.</DrawerDescription>
    </DrawerHeader>
    <Docs />
    <DrawerFooter>
      <DrawerClose>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Done
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
