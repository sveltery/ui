<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import MaximizeIcon from '@lucide/svelte/icons/maximize';
  import MinimizeIcon from '@lucide/svelte/icons/minimize';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$registry/bases/base/ui/collapsible';
  import { Field, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';

  let isOpen = $state(false);
</script>

{#snippet trigger(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <Button {...props} variant="outline" size="icon">
    {@render children?.()}
  </Button>
{/snippet}

<Card class="mx-auto w-full max-w-xs" size="sm">
  <CardHeader>
    <CardTitle>Radius</CardTitle>
    <CardDescription>Set the corner radius of the element.</CardDescription>
  </CardHeader>
  <CardContent>
    <Collapsible bind:open={isOpen} class="flex items-start gap-2">
      <FieldGroup class="grid w-full grid-cols-2 gap-2">
        <Field>
          <FieldLabel for="radius-x" class="sr-only">Radius X</FieldLabel>
          <Input id="radius-x" placeholder="0" value="0" />
        </Field>
        <Field>
          <FieldLabel for="radius-y" class="sr-only">Radius Y</FieldLabel>
          <Input id="radius-y" placeholder="0" value="0" />
        </Field>
        <CollapsibleContent class="col-span-full grid grid-cols-subgrid gap-2">
          <Field>
            <FieldLabel for="radius-x-2" class="sr-only">Radius X</FieldLabel>
            <Input id="radius-x-2" placeholder="0" value="0" />
          </Field>
          <Field>
            <FieldLabel for="radius-y-2" class="sr-only">Radius Y</FieldLabel>
            <Input id="radius-y-2" placeholder="0" value="0" />
          </Field>
        </CollapsibleContent>
      </FieldGroup>
      <CollapsibleTrigger render={trigger}>
        {#if isOpen}
          <MinimizeIcon />
        {:else}
          <MaximizeIcon />
        {/if}
      </CollapsibleTrigger>
    </Collapsible>
  </CardContent>
</Card>
