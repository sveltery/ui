<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { Button } from '@sveltery/components/button';
  import { Field, FieldGroup, FieldLabel } from '@sveltery/components/field';
  import { Input } from '@sveltery/components/input';
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '@sveltery/components/sheet';

  const sides = ['top', 'right', 'bottom', 'left'] as const;
</script>

{#snippet SheetWithForm()}
  <Example title="With Form">
    <Sheet>
      <SheetTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Open
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <div class="style-vega:px-4 style-nova:px-4 style-lyra:px-4 style-maia:px-6 style-mira:px-6 style-luma:px-6 style-rhea:px-6">
          <FieldGroup>
            <Field>
              <FieldLabel for="sheet-demo-name">Name</FieldLabel>
              <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <FieldLabel for="sheet-demo-username">Username</FieldLabel>
              <Input id="sheet-demo-username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose>
            {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
            Close
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </Example>
{/snippet}

{#snippet SheetNoCloseButton()}
  <Example title="No Close Button">
    <Sheet>
      <SheetTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        No Close Button
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>No Close Button</SheetTitle>
          <SheetDescription>
            This sheet doesn&apos;t have a close button in the top-right corner. You can only close it using the button
            below.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  </Example>
{/snippet}

{#snippet SheetWithSides()}
  <Example title="Sides">
    <div class="flex flex-wrap gap-2">
      {#each sides as side (side)}
        <Sheet>
          <SheetTrigger>
            {#snippet render(props, _state, content)}<Button variant="outline" class="capitalize" {...props}>{@render content?.()}</Button>{/snippet}
            {side}
          </SheetTrigger>
          <SheetContent {side} class="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]">
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
            </SheetHeader>
            <div class="no-scrollbar overflow-y-auto style-vega:px-4 style-nova:px-4 style-lyra:px-4 style-maia:px-6 style-mira:px-6 style-luma:px-6 style-rhea:px-6">
              {#each { length: 10 } as _, index (index)}
                <p class="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </p>
              {/each}
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose>
                {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
                Cancel
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      {/each}
    </div>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render SheetWithForm()}
  {@render SheetNoCloseButton()}
  {@render SheetWithSides()}
</ExampleWrapper>
