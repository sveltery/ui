<script lang="ts">
  import { getContext } from 'svelte';

  const label = getContext<{ current: string }>('label');
</script>

<span class="portalled">{label.current}</span>
