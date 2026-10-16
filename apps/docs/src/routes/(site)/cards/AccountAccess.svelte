<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Field, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Input } from '$registry/bases/base/ui/input';
  import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';
</script>

{#snippet link(props: Pick<HTMLAttributes<HTMLElement>, 'class'>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<Card>
  <CardHeader>
    <CardTitle>Account Access</CardTitle>
    <CardDescription>Update your credentials or re-authenticate.</CardDescription>
  </CardHeader>
  <CardContent>
    <FieldGroup>
      <Field>
        <FieldLabel for="email-address">Email Address</FieldLabel>
        <Input id="email-address" type="email" placeholder="artist@studio.inc" />
      </Field>
      <Field>
        <div class="flex items-center justify-between">
          <FieldLabel for="current-password">Current Password</FieldLabel>
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#" class="text-xs font-medium tracking-wider text-muted-foreground uppercase hover:text-foreground">Forgot?</a>
        </div>
        <Input id="current-password" type="password" placeholder="••••••••••••••••••••••••" />
      </Field>
    </FieldGroup>
  </CardContent>
  <CardFooter class="flex-col gap-4">
    <Button class="w-full">
      <IconPlaceholder lucide="LockKeyholeIcon" tabler="IconLock" hugeicons="SquareLock02Icon" phosphor="LockKeyIcon" remixicon="RiLockLine" />
      Update Security
    </Button>
    <Item variant="muted" render={link}>
      <ItemMedia variant="icon">
        <IconPlaceholder lucide="AlertCircleIcon" tabler="IconAlertCircle" hugeicons="AlertCircleIcon" phosphor="WarningCircleIcon" remixicon="RiErrorWarningLine" class="text-destructive" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Danger Zone</ItemTitle>
        <ItemDescription class="line-clamp-1">Archive account and remove catalog</ItemDescription>
      </ItemContent>
      <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" class="size-4" />
    </Item>
  </CardFooter>
</Card>
