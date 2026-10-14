<script lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/ui/collapsible';
</script>
<Collapsible>
  <CollapsibleTrigger class="panel-trigger bg-white transition-none data-panel-open:bg-black">Details</CollapsibleTrigger>
  <CollapsibleContent>Panel body</CollapsibleContent>
</Collapsible>
