<script lang="ts">
  let { text }: { text: string } = $props();
  const paragraphs = $derived(text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean));
</script>

{#each paragraphs as paragraph, index (index)}
  <p class="whitespace-pre-wrap">{paragraph}</p>
{/each}
