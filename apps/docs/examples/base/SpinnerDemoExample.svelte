<script lang="ts">
  import { Item, ItemContent, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';
  import { Spinner } from '$registry/bases/base/ui/spinner';
</script>

<div class="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
  <Item variant="muted">
    <ItemMedia>
      <Spinner />
    </ItemMedia>
    <ItemContent>
      <ItemTitle class="line-clamp-1">Processing payment...</ItemTitle>
    </ItemContent>
    <ItemContent class="flex-none justify-end">
      <span class="text-sm tabular-nums">$100.00</span>
    </ItemContent>
  </Item>
</div>
