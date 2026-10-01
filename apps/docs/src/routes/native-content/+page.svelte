<script lang="ts">
  import NativeContentExample from '../../../examples/base/NativeContentExample.svelte';
  let { data } = $props();
</script>
<NativeContentExample kind={data.kind} />
