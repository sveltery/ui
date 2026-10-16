<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '$registry/bases/base/ui/resizable';

  let layout = $state<Record<string, number>>({ sidebar: 25, content: 75 });
</script>

{#snippet ResizableHorizontal()}
  <Example title="Horizontal">
    <ResizablePanelGroup orientation="horizontal" class="min-h-[200px] max-w-sm rounded-lg border">
      <ResizablePanel defaultSize="50%">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="50%">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Example>
{/snippet}

{#snippet ResizableVertical()}
  <Example title="Vertical">
    <ResizablePanelGroup orientation="vertical" class="min-h-[200px] max-w-sm rounded-lg border">
      <ResizablePanel defaultSize="25%">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="75%">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Example>
{/snippet}

{#snippet ResizableWithHandle()}
  <Example title="With Handle">
    <ResizablePanelGroup orientation="horizontal" class="min-h-[200px] max-w-sm rounded-lg border">
      <ResizablePanel defaultSize="25%">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="75%">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Example>
{/snippet}

{#snippet ResizableNested()}
  <Example title="Nested">
    <ResizablePanelGroup orientation="horizontal" class="min-h-[200px] max-w-sm rounded-lg border">
      <ResizablePanel defaultSize="50%">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="50%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="25%">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="75%">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Example>
{/snippet}

{#snippet ResizableControlled()}
  <Example title="Controlled">
    <div class="flex w-full max-w-sm flex-col gap-3">
      <ResizablePanelGroup bind:layout orientation="horizontal" class="min-h-[200px] rounded-lg border">
        <ResizablePanel id="sidebar" defaultSize="25%" minSize="15%">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="content" defaultSize="75%">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <div class="flex items-center justify-between gap-2">
        <span class="text-sm text-muted-foreground">Sidebar {Math.round(layout.sidebar ?? 0)}%, content {Math.round(layout.content ?? 0)}%</span>
        <Button variant="outline" size="sm" onclick={() => (layout = { sidebar: 25, content: 75 })}>Reset</Button>
      </div>
    </div>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render ResizableHorizontal()}
  {@render ResizableVertical()}
  {@render ResizableWithHandle()}
  {@render ResizableNested()}
  {@render ResizableControlled()}
</ExampleWrapper>
