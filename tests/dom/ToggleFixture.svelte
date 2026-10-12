<script lang="ts">
  import { Toggle } from '$ui/toggle/index.js';
  let pressed = $state(false);
  let changes = $state<boolean[]>([]);
  export function isPressed() { return pressed; }
  export function setPressed(next: boolean) { pressed = next; }
  export function changeLog() { return changes; }
</script>
<Toggle aria-label="Bold" bind:pressed onPressedChange={(next) => changes.push(next)}>Bold</Toggle>
<Toggle aria-label="Italic" variant="outline" size="lg" class="extra" pressed>Italic</Toggle>
<Toggle aria-label="Underline" disabled>Underline</Toggle>
<Toggle aria-label="Cancelled" onclick={(event) => event.preventDefault()}>Cancelled</Toggle>
