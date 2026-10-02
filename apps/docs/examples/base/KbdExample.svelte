<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Kbd, KbdGroup } from '@sveltery/ui/kbd';
</script>
<!-- Actual pinned scaffold; four dependency-blocked example functions remain omitted. -->
<ExampleWrapper data-gallery="">
  <Example title="Basic"><div class="flex items-center gap-2"><Kbd>Ctrl</Kbd><Kbd>⌘K</Kbd><Kbd>Ctrl + B</Kbd></div></Example>
  <Example title="Modifier Keys"><div class="flex items-center gap-2"><Kbd>⌘</Kbd><Kbd>C</Kbd></div></Example>
  <Example title="KbdGroup"><KbdGroup><Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd></KbdGroup></Example>
  <Example title="Arrow Keys"><div class="flex items-center gap-2"><Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>←</Kbd><Kbd>→</Kbd></div></Example>
  <Example title="With samp"><Kbd><samp>File</samp></Kbd></Example>
  <Kbd data-testid="override" class="h-8 min-w-8 rounded-none px-3 text-sm">Alt</Kbd>
</ExampleWrapper>
