<script lang="ts">
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '$registry/bases/base/ui/resizable';
</script>

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
