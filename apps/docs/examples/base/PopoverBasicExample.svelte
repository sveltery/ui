<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '$registry/bases/base/ui/popover';
</script>

<Popover>
  <PopoverTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" class="w-fit" {...props}>{@render content?.()}</Button>{/snippet}
    Open Popover
  </PopoverTrigger>
  <PopoverContent align="start">
    <PopoverHeader>
      <PopoverTitle>Dimensions</PopoverTitle>
      <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>
