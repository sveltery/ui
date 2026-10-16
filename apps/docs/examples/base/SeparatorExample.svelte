<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Separator } from '$registry/bases/base/ui/separator';
</script>

{#snippet SeparatorHorizontal()}
  <Example title="Horizontal">
    <div class="flex flex-col gap-4 text-sm style-lyra:text-xs/relaxed">
      <div class="flex flex-col gap-1">
        <div class="leading-none font-medium">shadcn/ui</div>
        <div class="text-muted-foreground">The Foundation for your Design System</div>
      </div>
      <Separator />
      <div>
        A set of beautifully designed components that you can customize, extend, and build on.
      </div>
    </div>
  </Example>
{/snippet}

{#snippet SeparatorVertical()}
  <Example title="Vertical">
    <div class="flex h-5 items-center gap-4 text-sm style-lyra:text-xs/relaxed">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  </Example>
{/snippet}

{#snippet SeparatorVerticalMenu()}
  <Example title="Vertical Menu">
    <div class="flex items-center gap-2 text-sm md:gap-4 style-lyra:text-xs/relaxed">
      <div class="flex flex-col gap-1">
        <span class="font-medium">Settings</span>
        <span class="text-xs text-muted-foreground">Manage preferences</span>
      </div>
      <Separator orientation="vertical" />
      <div class="flex flex-col gap-1">
        <span class="font-medium">Account</span>
        <span class="text-xs text-muted-foreground">Profile & security</span>
      </div>
      <Separator orientation="vertical" />
      <div class="flex flex-col gap-1">
        <span class="font-medium">Help</span>
        <span class="text-xs text-muted-foreground">Support & docs</span>
      </div>
    </div>
  </Example>
{/snippet}

{#snippet SeparatorInList()}
  <Example title="In List">
    <div class="flex flex-col gap-2 text-sm style-lyra:text-xs/relaxed">
      <dl class="flex items-center justify-between">
        <dt>Item 1</dt>
        <dd class="text-muted-foreground">Value 1</dd>
      </dl>
      <Separator />
      <dl class="flex items-center justify-between">
        <dt>Item 2</dt>
        <dd class="text-muted-foreground">Value 2</dd>
      </dl>
      <Separator />
      <dl class="flex items-center justify-between">
        <dt>Item 3</dt>
        <dd class="text-muted-foreground">Value 3</dd>
      </dl>
    </div>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render SeparatorHorizontal()}
  {@render SeparatorVertical()}
  {@render SeparatorVerticalMenu()}
  {@render SeparatorInList()}
</ExampleWrapper>
