<script lang="ts">
  // Radix shows the chosen item's text; every gallery select starts on the item its placeholder names.
  let { placeholder }: { placeholder?: string } = $props();
</script>

<span data-slot="select-value" style="pointer-events: none;">{placeholder}</span>
