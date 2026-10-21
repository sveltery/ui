# Component Composition

Every component page lists its parts under **Composition**. Fetch `https://ui.sveltery.dev/docs/components/<name>.md` before composing a component you have not used. The docs win over this page.

## Contents

- Custom triggers use a render snippet
- Items always inside their Group component
- Bind open state and values
- Callouts use Alert
- Empty states use Empty component
- Toasts use the toast component
- Choosing between overlay components
- Dialog, Sheet and Drawer always need a Title
- Card structure
- Button has no loading prop
- TabsTrigger must be inside TabsList
- Avatar always needs AvatarFallback
- Use Separator, Skeleton and Badge instead of custom markup

---

## Custom triggers use a render snippet

There is no `asChild`. A Base part that renders an element takes a `render` snippet with three arguments: the props to spread, the part's state, and the part's own children. Spread the props onto your element and render the children inside it.

**Incorrect:**

```svelte
<DialogTrigger asChild>
  <Button variant="outline">Edit profile</Button>
</DialogTrigger>

<!-- A Button nested in a trigger renders a button inside a button. -->
<DialogTrigger>
  <Button variant="outline">Edit profile</Button>
</DialogTrigger>
```

**Correct:**

```svelte
<DialogTrigger>
  {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
  Edit profile
</DialogTrigger>
```

A snippet declared once can be passed as a prop to several parts:

```svelte
{#snippet outlineButton(props, _state, children)}
  <Button variant="outline" {...props}>{@render children?.()}</Button>
{/snippet}

<DropdownMenuTrigger render={outlineButton}>Open</DropdownMenuTrigger>
```

When `render` puts a non-button element in a `Button`, pass `nativeButton={false}`. For a link that looks like a button, use `buttonVariants` on a plain `<a>` instead, so it keeps the link role:

```svelte
<script lang="ts">
  import { buttonVariants } from '#lib/components/ui/button';
</script>

<a href="/login" class={buttonVariants({ variant: 'outline' })}>Login</a>
```

---

## Items always inside their Group component

Never render items directly inside the content container.

**Incorrect:**

```svelte
<SelectContent>
  <SelectItem value="apple">Apple</SelectItem>
  <SelectItem value="banana">Banana</SelectItem>
</SelectContent>
```

**Correct:**

```svelte
<SelectContent>
  <SelectGroup>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectGroup>
</SelectContent>
```

| Item | Group |
| --- | --- |
| `SelectItem`, `SelectLabel` | `SelectGroup` |
| `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSub` | `DropdownMenuGroup` |
| `MenubarItem`, `MenubarLabel` | `MenubarGroup` |
| `ContextMenuItem`, `ContextMenuLabel` | `ContextMenuGroup` |
| `ComboboxItem`, `ComboboxLabel` | `ComboboxGroup` |
| `CommandItem` | `CommandGroup` |
| `MessageScrollerItem` | `MessageScrollerContent` |
| `Message` (consecutive, same sender) | `MessageGroup` |
| `Bubble` (stacked) | `BubbleGroup` |
| `Attachment` (in a row) | `AttachmentGroup` |

Give `Select` its `items` so `SelectValue` shows the label of the selected value:

```svelte
<script lang="ts">
  const items = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ];
</script>

<Select {items} name="fruit">
  <SelectTrigger class="w-48">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {#each items as item (item.value)}
        <SelectItem value={item.value}>{item.label}</SelectItem>
      {/each}
    </SelectGroup>
  </SelectContent>
</Select>
```

---

## Bind open state and values

Components take `bind:open` and `bind:value`. Don't keep a copy in `$state` and sync it in an `$effect`, and don't emulate React's controlled props.

**Incorrect:**

```svelte
<script lang="ts">
  let open = $state(false);
</script>

<Dialog open={open} onOpenChange={(next) => (open = next)}>...</Dialog>
```

**Correct:**

```svelte
<script lang="ts">
  let open = $state(false);
</script>

<Dialog bind:open>...</Dialog>
```

Use `onOpenChange` or `onValueChange` only to react to a change, such as saving it.

---

## Callouts use Alert

```svelte
<Alert>
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>Something needs attention.</AlertDescription>
</Alert>
```

---

## Empty states use Empty component

```svelte
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><FolderIcon /></EmptyMedia>
    <EmptyTitle>No projects yet</EmptyTitle>
    <EmptyDescription>Get started by creating a new project.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Create Project</Button>
  </EmptyContent>
</Empty>
```

---

## Toasts use the toast component

There is no Sonner. Mount `<Toaster />` once in the root layout, then call `toast.add()`:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { Toaster } from '#lib/components/ui/toast';

  let { children } = $props();
</script>

{@render children()}
<Toaster />
```

```ts
import { toast } from '#lib/components/ui/toast';

toast.add({ title: 'Changes saved.' });

const id = toast.add({
  title: 'File deleted.',
  actionProps: { children: 'Undo', onclick: () => toast.close(id) },
});
```

Where shadcn/ui code calls `toast()` or `toast.success()` from `sonner`, call `toast.add()`. Fetch [toast.md](https://ui.sveltery.dev/docs/components/toast.md) for types and promises.

---

## Choosing between overlay components

| Use case | Component |
| --- | --- |
| Focused task that needs input | `Dialog` |
| Destructive action confirmation | `AlertDialog` |
| Side panel with details or filters | `Sheet` |
| Mobile-first bottom panel | `Drawer` |
| Quick info on hover | `HoverCard` |
| Small contextual content on click | `Popover` |

---

## Dialog, Sheet and Drawer always need a Title

`DialogTitle`, `SheetTitle` and `DrawerTitle` name the popup for screen readers. Use `class="sr-only"` to hide one visually.

```svelte
<DialogContent>
  <DialogHeader>
    <DialogTitle>Edit profile</DialogTitle>
    <DialogDescription>Update your profile.</DialogDescription>
  </DialogHeader>
  ...
</DialogContent>
```

---

## Card structure

Use the full composition. Don't put everything in `CardContent`:

```svelte
<Card>
  <CardHeader>
    <CardTitle>Team Members</CardTitle>
    <CardDescription>Manage your team.</CardDescription>
    <CardAction>
      <Button variant="outline" size="sm">Invite</Button>
    </CardAction>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

---

## Button has no loading prop

There is no `loading`, `isLoading` or `isPending`. Compose `Spinner` with `data-icon` and `disabled`:

```svelte
<Button disabled>
  <Spinner data-icon="inline-start" />
  Saving...
</Button>
```

---

## TabsTrigger must be inside TabsList

```svelte
<Tabs value="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">...</TabsContent>
  <TabsContent value="password">...</TabsContent>
</Tabs>
```

---

## Avatar always needs AvatarFallback

```svelte
<Avatar>
  <AvatarImage src="/avatar.png" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Use Separator, Skeleton and Badge instead of custom markup

| Instead of | Use |
| --- | --- |
| `<hr>` or `<div class="border-t">` | `<Separator />` |
| `<div class="animate-pulse">` with styled divs | `<Skeleton class="h-4 w-3/4" />` |
| `<span class="rounded-full bg-green-100 ...">` | `<Badge variant="secondary">` |
