<script lang="ts">
  import type { ResizableLayout } from '@sveltery/base/resizable';
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '$registry/bases/base/ui/resizable';

  let layout = $state<ResizableLayout>({});
</script>

{#snippet ResizableHorizontal()}
  <Example title="Horizontal">
    <ResizablePanelGroup orientation="horizontal" class="min-h-[200px] rounded-lg border">
      <ResizablePanel defaultSize="25%">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Sidebar</span>
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

{#snippet ResizableVertical()}
  <Example title="Vertical">
    <ResizablePanelGroup orientation="vertical" class="min-h-[200px] rounded-lg border">
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
    <ResizablePanelGroup orientation="horizontal" class="min-h-[200px] rounded-lg border">
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
    <ResizablePanelGroup orientation="horizontal" class="rounded-lg border">
      <ResizablePanel defaultSize="50%">
        <div class="flex h-[200px] items-center justify-center p-6">
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
    <ResizablePanelGroup orientation="horizontal" class="min-h-[200px] rounded-lg border" onLayoutChange={(next) => (layout = next)}>
      <ResizablePanel defaultSize="30%" id="left" minSize="20%">
        <div class="flex h-full flex-col items-center justify-center gap-2 p-6">
          <span class="font-semibold">{Math.round(layout.left ?? 30)}%</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="70%" id="right" minSize="30%">
        <div class="flex h-full flex-col items-center justify-center gap-2 p-6">
          <span class="font-semibold">{Math.round(layout.right ?? 70)}%</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render ResizableHorizontal()}
  {@render ResizableVertical()}
  {@render ResizableWithHandle()}
  {@render ResizableNested()}
  {@render ResizableControlled()}
</ExampleWrapper>
