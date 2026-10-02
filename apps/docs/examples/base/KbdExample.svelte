<script lang="ts">
  import { Kbd, KbdGroup } from '@sveltery/ui/kbd';
</script>
<!-- Supported pinned example bodies; native section/headings replace Example/ExampleWrapper. -->
<section data-gallery class="grid gap-6">
  <section data-example><h2>Basic</h2><div class="flex items-center gap-2"><Kbd>Ctrl</Kbd><Kbd>⌘K</Kbd><Kbd>Ctrl + B</Kbd></div></section>
  <section data-example><h2>Modifier Keys</h2><div class="flex items-center gap-2"><Kbd>⌘</Kbd><Kbd>C</Kbd></div></section>
  <section data-example><h2>KbdGroup</h2><KbdGroup><Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd></KbdGroup></section>
  <section data-example><h2>Arrow Keys</h2><div class="flex items-center gap-2"><Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>←</Kbd><Kbd>→</Kbd></div></section>
  <section data-example><h2>With samp</h2><Kbd><samp>File</samp></Kbd></section>
  <Kbd data-testid="override" class="h-8 min-w-8 rounded-none px-3 text-sm">Alt</Kbd>
</section>
