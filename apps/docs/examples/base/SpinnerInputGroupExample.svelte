<script lang="ts">
  import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupTextarea
  } from '$registry/bases/base/ui/input-group';
  import { Spinner } from '$registry/bases/base/ui/spinner';
</script>

<div class="flex w-full max-w-md flex-col gap-4">
  <InputGroup>
    <InputGroupInput placeholder="Send a message..." disabled />
    <InputGroupAddon align="inline-end">
      <Spinner />
    </InputGroupAddon>
  </InputGroup>
  <InputGroup>
    <InputGroupTextarea placeholder="Send a message..." disabled />
    <InputGroupAddon align="block-end">
      <Spinner /> Validating...
      <InputGroupButton class="ml-auto" variant="default">
        <ArrowUpIcon />
        <span class="sr-only">Send</span>
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</div>
