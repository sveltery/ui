<script lang="ts">
  import { useDirection } from '$ui/direction/index.js';
  const reading = useDirection();
</script>
<p data-testid="reader">{reading.direction}</p>
