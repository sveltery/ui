<script lang="ts">
  import DocPage from '../[...slug]/+page.svelte';
  let { data } = $props();
</script>

<DocPage {data} />
