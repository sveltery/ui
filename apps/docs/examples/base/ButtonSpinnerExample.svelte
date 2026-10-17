<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Spinner } from '$registry/bases/base/ui/spinner';
</script>

<div class="flex gap-2">
  <Button variant="outline" disabled>
    <Spinner data-icon="inline-start" />
    Generating
  </Button>
  <Button variant="secondary" disabled>
    Downloading
    <Spinner data-icon="inline-start" />
  </Button>
</div>
