<script lang="ts">
  import Building2Icon from '@lucide/svelte/icons/building-2';
  import CreditCardIcon from '@lucide/svelte/icons/credit-card';
  import WalletIcon from '@lucide/svelte/icons/wallet';
  import { Button } from '$registry/bases/base/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';

  let paymentMethod = $state('card');
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Payment Method
  </DropdownMenuTrigger>
  <DropdownMenuContent class="min-w-56">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
      <DropdownMenuRadioGroup bind:value={paymentMethod}>
        <DropdownMenuRadioItem value="card">
          <CreditCardIcon />
          Credit Card
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="paypal">
          <WalletIcon />
          PayPal
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="bank">
          <Building2Icon />
          Bank Transfer
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
