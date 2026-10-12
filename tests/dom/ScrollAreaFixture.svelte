<script lang="ts">
  import { ScrollArea, ScrollBar } from '$ui/scroll-area/index.js';
</script>
<ScrollArea class="h-72 w-48 rounded-md border" id="area">
  <div class="p-4">
    <h4>Tags</h4>
    <p>v1.2.0-beta.50</p>
  </div>
  <ScrollBar keepMounted class="vertical-bar" />
  <ScrollBar orientation="horizontal" keepMounted class="extra-bar" />
</ScrollArea>
