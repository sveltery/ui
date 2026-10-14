<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardFooter } from '@sveltery/ui/card';
  import { Item } from '@sveltery/ui/item';
  import { Label } from '@sveltery/ui/label';
  import { IconPlaceholder } from '@sveltery/ui/icons';
</script>

<Card>
  <CardContent class="flex flex-col gap-3">
    <Label
      for="cover-art"
      class="text-center text-xs font-normal tracking-wider text-muted-foreground uppercase"
    >
      Cover Art
    </Label>
    <Item class="aspect-square" variant="outline">
      <label for="cover-art" class="flex size-full cursor-pointer items-center justify-center">
        <IconPlaceholder lucide="ImageIcon" tabler="IconPhoto" hugeicons="Image01Icon" phosphor="ImageIcon" remixicon="RiImageLine" class="size-10 text-muted-foreground/50" />
      </label>
    </Item>
    <input id="cover-art" type="file" accept="image/jpeg,image/png" class="sr-only" />
  </CardContent>
  <CardFooter class="flex-col gap-2">
    <Button variant="secondary" class="w-full" nativeButton={false}>
      {#snippet render(props, _state, content)}
        <label {...props} for="cover-art" class={[props.class, 'cursor-pointer']}>{@render content?.()}</label>
      {/snippet}
      Upload Artwork
    </Button>
    <CardDescription class="text-center text-xs">
      Minimum 3000 × 3000px
      <br />
      JPEG or PNG only
    </CardDescription>
  </CardFooter>
</Card>
