<script lang="ts">
  import DisabledCloseExample from '../../../examples/base/DisabledCloseExample.svelte';
  let { data } = $props();
</script>
<DisabledCloseExample disabled={data.disabled} />
