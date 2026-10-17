<script lang="ts">
  import CheckIcon from '@lucide/svelte/icons/check';
  import CreditCardIcon from '@lucide/svelte/icons/credit-card';
  import InfoIcon from '@lucide/svelte/icons/info';
  import MailIcon from '@lucide/svelte/icons/mail';
  import SearchIcon from '@lucide/svelte/icons/search';
  import StarIcon from '@lucide/svelte/icons/star';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '$registry/bases/base/ui/input-group';
</script>

<div class="grid w-full max-w-sm gap-6">
  <InputGroup>
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>
  </InputGroup>
  <InputGroup>
    <InputGroupInput type="email" placeholder="Enter your email" />
    <InputGroupAddon>
      <MailIcon />
    </InputGroupAddon>
  </InputGroup>
  <InputGroup>
    <InputGroupInput placeholder="Card number" />
    <InputGroupAddon>
      <CreditCardIcon />
    </InputGroupAddon>
    <InputGroupAddon align="inline-end">
      <CheckIcon />
    </InputGroupAddon>
  </InputGroup>
  <InputGroup>
    <InputGroupInput placeholder="Card number" />
    <InputGroupAddon align="inline-end">
      <StarIcon />
      <InfoIcon />
    </InputGroupAddon>
  </InputGroup>
</div>
