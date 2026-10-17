<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';
</script>

<div class="flex gap-6">
  <Popover>
    <PopoverTrigger>
      {#snippet render(props, _state, content)}<Button variant="outline" size="sm" {...props}>{@render content?.()}</Button>{/snippet}
      Start
    </PopoverTrigger>
    <PopoverContent align="start" class="w-40">Aligned to start</PopoverContent>
  </Popover>
  <Popover>
    <PopoverTrigger>
      {#snippet render(props, _state, content)}<Button variant="outline" size="sm" {...props}>{@render content?.()}</Button>{/snippet}
      Center
    </PopoverTrigger>
    <PopoverContent align="center" class="w-40">Aligned to center</PopoverContent>
  </Popover>
  <Popover>
    <PopoverTrigger>
      {#snippet render(props, _state, content)}<Button variant="outline" size="sm" {...props}>{@render content?.()}</Button>{/snippet}
      End
    </PopoverTrigger>
    <PopoverContent align="end" class="w-40">Aligned to end</PopoverContent>
  </Popover>
</div>
